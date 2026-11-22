import csv
import json
import os
from pathlib import Path
import tempfile
import unittest

from engine import scan_log
from engine.service import Service
from engine.shared_read import _open_windows_file
from engine.store import Store


class ScanDiagnosticsTests(unittest.TestCase):
    def setUp(self):
        work = tempfile.TemporaryDirectory()
        self.addCleanup(work.cleanup)
        self.base = Path(work.name)
        self.store = Store(self.base / 'Data')
        self.api = Service(self.store)
        self.root = self.add_root('待监控')

    def add_root(self, name):
        folder = self.base / name
        folder.mkdir()
        return self.store.configure(folder)

    def run_record(self, **values):
        row = dict(root_id=self.root, source='手动扫描', started='2024-02-29T12:00:00+08:00',
                   ended='2024-02-29T12:00:01+08:00', status='完成', elapsed_ms=1000,
                   candidates=0, captured=0, read_bytes=0, reused=0, waiting=0, skipped=0,
                   skip_reasons='{}', problem='')
        row.update(values)
        with self.store.db() as db:
            columns = ','.join(row)
            params = ','.join(':' + key for key in row)
            return db.execute(f'INSERT INTO scan_runs({columns}) VALUES({params})', row).lastrowid

    def journal(self, **args):
        return self.api.dispatch('scan_log', {'root': self.root, **args})

    @staticmethod
    def ids(result):
        return [row['id'] for row in result['items']]

    def test_inclusive_recorded_dates_without_utc_conversion(self):
        previous = self.run_record(started='2024-02-28T23:59:59-12:00')
        early = self.run_record(started='2024-02-29T00:00:00+14:00')
        late = self.run_record(started='2024-02-29T23:59:59-12:00')
        following = self.run_record(started='2024-03-01T00:00:00+14:00')
        self.assertEqual(self.ids(self.journal(start='2024-02-29', end='2024-02-29')), [late, early])
        self.assertEqual(self.ids(self.journal(start='2024-02-29')), [following, late, early])
        self.assertEqual(self.ids(self.journal(end='2024-02-29')), [late, early, previous])

    def test_invalid_filters_reject_without_changing_history_or_creating_csv(self):
        first = self.run_record()
        invalid = (
            {'start': '2025-02-29'}, {'start': '20240229'}, {'end': '2024-W09-4'},
            {'start': '2024-2-9'}, {'start': '2024-02-29T12:00'}, {'end': None},
            {'start': '2024-03-01', 'end': '2024-02-29'}, {'state': '错误'},
            {'waiting': 'false'}, {'skips': 1}, {'detail': 1}, {'problem': True},
            {'skip_reason': []}, {'source': 123}, {'sort': 'unknown'}, {'sort': []},
            {'page': 1.2}, {'size': 25}, {'root': True}, {'root': 2**63},
        )
        for args in invalid:
            with self.subTest(args=args), self.assertRaises(ValueError):
                self.journal(**args)
        destination = self.base / '无效查询.csv'
        with self.assertRaises(ValueError):
            self.api.dispatch('scan_log_export', dict(root=self.root, path=str(destination), waiting='false'))
        self.assertFalse(destination.exists())
        self.assertEqual(self.ids(self.journal()), [first])

    def test_intersecting_filters_and_unfiltered_root_facets(self):
        target = self.run_record(source='周期校对', status='有异常', waiting=2, skipped=5,
                                 problem='文件读取异常', skip_reasons='{"临时文件":3,"规则排除文件":2}')
        self.run_record(source='周期校对', status='有异常', waiting=0, skipped=1,
                        problem='文件读取异常', skip_reasons='{"规则排除文件":1}')
        self.run_record(source='文件监听', status='中断', problem='上次引擎退出',
                        skipped=1, skip_reasons='{"链接目录":1}')
        self.run_record(root_id=self.add_root('其他目录'), source='其他目录来源', problem='其他目录异常',
                        skipped=1, skip_reasons='{"其他目录跳过":1}')
        result = self.journal(state='有异常', source='周期校对', waiting=True, skips=True,
                              skip_reason='规则排除文件', problem='文件读取异常')
        self.assertEqual(self.ids(result), [target])
        self.assertEqual(result['sources'], ['周期校对', '文件监听'])
        self.assertEqual(result['facets']['problems'], ['上次引擎退出', '文件读取异常'])
        self.assertEqual(result['facets']['skip_reasons'], ['临时文件', '规则排除文件', '链接目录'])
        self.assertEqual(result['summary']['problems'], {'文件读取异常': 1})
        self.assertEqual(result['summary']['states'], {'有异常': 1})
        self.assertEqual(result['summary']['skip_reasons'], {'临时文件': 3, '规则排除文件': 2})
        self.assertEqual(self.journal(problem='文件读取')['total'], 0)
        self.assertEqual(self.journal(skip_reason='规则排除')['total'], 0)

    def test_counts_percentiles_and_page_sizes_cover_all_matches(self):
        for duration in range(1, 41):
            self.run_record(elapsed_ms=duration, candidates=3, captured=2, read_bytes=8, reused=1)
        for _ in range(10):
            self.run_record(ended='', status='进行中', elapsed_ms=10000, waiting=1, skipped=2,
                            skip_reasons='{"临时文件":2}')
        result = self.journal(root=str(self.root), page='2')
        self.assertEqual((result['total'], result['page'], result['pages'], result['size']), (50, 2, 3, 20))
        self.assertEqual(len(result['items']), 20)
        self.assertEqual((result['average'], result['longest']), (20, 40))
        self.assertEqual(result['summary'], dict(finished=40, p50=20, p95=38, candidates=120,
                                               captured=80, read_bytes=320, reused=40, waiting=10, skipped=20,
                                               states={'完成': 40, '进行中': 10}, problems={}, skip_reasons={'临时文件': 20}))
        for size in (50, 100):
            result = self.journal(size=size, page=999)
            self.assertEqual((result['pages'], result['page'], result['size'], len(result['items'])), (1, 1, size, 50))

    def test_stable_sorts_and_missing_elapsed_times(self):
        older = self.run_record(elapsed_ms=100, waiting=1)
        slow_a = self.run_record(elapsed_ms=120, waiting=0)
        slow_b = self.run_record(elapsed_ms=120, waiting=1)
        unfinished = self.run_record(elapsed_ms=999, waiting=4, ended='', status='进行中')
        self.assertEqual(self.ids(self.journal()), [unfinished, slow_b, slow_a, older])
        self.assertEqual(self.ids(self.journal(sort='oldest', page=-20)), [older, slow_a, slow_b, unfinished])
        self.assertEqual(self.ids(self.journal(sort='slowest')), [slow_b, slow_a, older, unfinished])
        self.assertEqual(self.ids(self.journal(sort='waiting')), [unfinished, slow_b, older, slow_a])

    def test_invalid_or_legacy_skip_data_and_empty_timing(self):
        for raw in ('', '{', 'null', '[1]', '[' * 1100, '{"零":0,"布尔":true,"字符串":"3","负数":-1}'):
            self.run_record(ended='', status='中断', skip_reasons=raw)
        result = self.journal()
        self.assertEqual(result['total'], 6)
        self.assertTrue(all(row['skip_reasons'] == {} for row in result['items']))
        self.assertEqual(result['facets']['skip_reasons'], [])
        self.assertEqual((result['average'], result['longest']), (0, 0))
        self.assertEqual({key: result['summary'][key] for key in ('finished', 'p50', 'p95')},
                         {'finished': 0, 'p50': 0, 'p95': 0})
        empty = self.journal(waiting=True, page=100)
        self.assertEqual((empty['items'], empty['total'], empty['page'], empty['pages']), ([], 0, 1, 1))
        self.assertEqual(empty['summary']['states'], {})
        self.assertEqual(empty['summary']['skip_reasons'], {})

    def test_csv_all_matching_runs_keeps_order_and_optional_detail(self):
        expected = [self.run_record(source='=自定义来源', waiting=1, started='2024-02-29',
                                    skipped=3, skip_reasons='{"z":2,"a":1}') for _ in range(24)]
        self.run_record(waiting=0, started='2024-02-29')
        self.run_record(waiting=1, started='2024-03-01')
        filters = dict(root=self.root, end='2024-02-29', waiting=True, sort='oldest', page=2)
        csv_outputs = []
        for detail in (False, True):
            path = self.base / f'runs-{detail}.csv'
            self.assertEqual(self.api.dispatch('scan_log_export', dict(filters, detail=detail, path=str(path))), str(path.resolve()))
            with path.open(encoding='utf-8-sig', newline='') as stream:
                header, *entries = list(csv.reader(stream))
            self.assertEqual(len(entries), 24)
            self.assertEqual(entries[0][3], "'=自定义来源")
            self.assertEqual(header, [*scan_log.COLUMNS.values(), *(scan_log.DETAIL_COLUMNS.values() if detail else ())])
            csv_outputs.append(entries)
        self.assertEqual([int(row[-2]) for row in csv_outputs[1]], expected)
        self.assertEqual(csv_outputs[1][0][-1], '{"a": 1, "z": 2}')
        self.assertEqual([row[:-2] for row in csv_outputs[1]], csv_outputs[0])
        with self.assertRaises(ValueError):
            self.api.dispatch('scan_log_export', dict(filters, path=str(self.store.home / '扫描.csv')))
        self.assertEqual(json.loads(csv_outputs[1][0][-1]), {'a': 1, 'z': 2})

    def test_live_queue_counts_before_reason_and_recent_tie_break(self):
        other = self.add_root('另一目录')
        with self.store.db() as db:
            db.executemany('INSERT INTO waiting_files VALUES (?,?,?,?,?,?)', [
                (self.root, 'batch/A.txt', '等待保存稳定', '01', '05', 3),
                (self.root, 'batch/z.txt', '等待保存稳定', '00', '05', 2),
                (self.root, 'batch/B.docx', '等待文件可读', '03', '04', 4),
                (self.root, 'other.xlsx', '等待路径替换完成', '01', '08', 2),
                (other, 'batch/A.txt', '等待文件解除占用', '01', '08', 6),
            ])
        base = dict(root=self.root, q='  BATCH\\  ')
        waiting = self.api.dispatch('waiting_files', dict(base, sort='recent'))
        self.assertEqual([row['rel'] for row in waiting['items']], ['batch/A.txt', 'batch/z.txt', 'batch/B.docx'])
        filtered = self.api.dispatch('waiting_files', dict(base, reason='等待文件可读'))
        self.assertEqual(filtered['total'], 1)
        self.assertEqual(filtered['counts'], {'等待文件可读': 1, '等待保存稳定': 2})
        self.assertIn('等待路径替换完成', filtered['reasons'])
        self.assertNotIn('等待文件解除占用', filtered['reasons'])
        self.assertEqual(self.api.dispatch('waiting_files', dict(base, q='%'))['counts'], {})

    @unittest.skipUnless(os.name == 'nt', '需要 Windows 独占句柄')
    def test_exclusive_open_is_reported_and_retried(self):
        path = self.base / '待监控' / '报告.txt'
        path.write_text('初版', encoding='utf-8')
        kernel, handle = _open_windows_file(path, 0x80000000, 0, 0x80)
        try:
            self.store.scan(self.root)
            waiting = self.api.dispatch('waiting_files', {'root': self.root})
            self.assertEqual(waiting['counts'], {'等待文件解除占用': 1})
            self.assertEqual(waiting['items'][0]['rel'], path.name)
            self.assertEqual(self.journal()['items'][0]['status'], '等待保存')
        finally:
            kernel.CloseHandle(handle)

        self.store.scan(self.root, '保存复查')
        self.assertEqual(self.api.dispatch('waiting_files', {'root': self.root})['total'], 0)
        current, = self.api.dispatch('files', {'root': self.root})['items']
        self.assertEqual((current['rel'], current['version']), (path.name, 1))
        self.assertEqual(self.journal()['items'][0]['status'], '完成')


if __name__ == '__main__':
    unittest.main()
