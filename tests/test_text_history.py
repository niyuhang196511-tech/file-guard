import codecs
import csv
import hashlib
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from engine import text_history
from engine.service import Service
from engine.store import Store


class TextHistoryTests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.base = Path(temp.name)
        self.root = self.base / '监控'
        self.root.mkdir()
        self.store = Store(self.base / 'Data')
        self.api = Service(self.store)
        self.rid = self.store.configure(self.root)

    def save(self, name, data):
        path = self.root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data if isinstance(data, bytes) else data.encode())
        self.store.scan(self.rid)
        return path

    def search(self, q='needle', **args):
        return self.api.dispatch('text_search', dict(q=q, **args))

    def test_baseline_older_saved_content_and_deleted_file(self):
        path = self.save('日志.txt', '版本一 needle\n原文')
        self.assertEqual(self.search()['items'][0]['num'], 1)
        self.save('日志.txt', '版本二')
        path.write_text('仅现场 needle', encoding='utf-8')
        self.assertFalse(self.search()['items'])
        previous = self.search(latest=False)['items'][0]
        self.assertEqual((previous['num'], previous['parent_id']), (1, None))
        path.unlink()
        self.store.scan(self.rid)
        self.assertFalse(self.search(latest=False, scope='live')['items'])
        self.assertEqual(self.search(latest=False, scope='history')['items'][0]['state'], '已删除')
        self.assertEqual(self.search(latest=False, scope='deleted')['items'][0]['num'], 1)
        self.assertFalse(self.search(latest=False, skip_initial=True)['items'])
        with self.store.db() as db:
            self.assertEqual(db.execute('SELECT count(*) FROM versions').fetchone()[0], 2)
            self.assertEqual(db.execute('SELECT count(*) FROM version_reviews').fetchone()[0], 0)

    def test_scope_root_extension_latest_dates_and_star(self):
        self.save('Reports/台账.CSV', 'needle')
        self.save('other.log', 'needle')
        self.save('ignore.bin', 'needle')
        with self.store.db() as db:
            fid = db.execute("SELECT id FROM files WHERE ext='.csv'").fetchone()[0]
            db.execute("UPDATE versions SET stamp='2025-12-31T23:59:59+08:00' WHERE file_id=?", (fid,))
        self.api.dispatch('star_file', dict(id=fid, starred=True))
        item = self.search(ext='CSV， log;csv', filename='REPORTS\\', root=self.rid, file=fid,
                           start='2025-12-31', end='2025-12-31', starred=True)['items'][0]
        self.assertEqual((item['file_id'], item['rel'], item['ext']), (fid, 'Reports/台账.CSV', '.csv'))
        self.assertFalse(self.search(start='2026-01-01', file=fid)['items'])
        self.assertFalse(self.search(root=self.rid+1)['items'])
        self.assertEqual(len(self.search()['items']), 2)

    def test_paused_excluded_and_removed_roots_preserve_snapshots(self):
        self.save('log.txt', 'needle')
        self.store.root_action(self.rid, '暂停')
        self.assertEqual(self.search(scope='live')['items'][0]['state'], '目录已暂停')
        self.store.root_action(self.rid, '继续')
        self.store.configure(self.root, patterns='*.txt', root_id=self.rid)
        self.store.scan(self.rid)
        self.assertEqual(self.search(scope='excluded')['items'][0]['state'], '规则已排除')
        self.assertFalse(self.search(scope='live')['items'])
        self.store.root_action(self.rid, '移除')
        self.assertEqual(self.search(scope='removed')['items'][0]['state'], '目录已移除')
        self.assertFalse(self.search(scope='excluded')['items'])
        self.assertEqual(self.search(scope='history')['items'][0]['num'], 1)

    def test_mixed_line_endings_and_unicode_fold_original_column(self):
        self.save('notes.md', '上文\r\n😀Straße!\r尾行\n')
        item = self.search('STRASSE', context=2)['items'][0]
        self.assertEqual((item['matches'], item['encoding']), (1, 'UTF-8'))
        rows = item['previews'][0]['rows']
        self.assertEqual([r['line'] for r in rows], [1, 2, 3])
        self.assertEqual((rows[1]['column'], rows[1]['prefix'], rows[1]['match'], rows[1]['suffix']),
                         (2, '😀', 'Straße', '!'))
        self.assertFalse(self.search('STRASSE', sensitive=True)['items'])
        self.assertFalse(self.search('Straße', exact=True)['items'])
        self.assertTrue(self.search('😀Straße!', exact=True)['items'])
        self.save('plain.txt', 'ß tail')
        self.assertEqual(self.search('ss', filename='plain')['items'][0]['previews'][0]['rows'][0]['match'], 'ß')

    def test_match_is_literal_keeps_spaces_and_counts_lines(self):
        self.save('literal.txt', ' a.* b a.* b\n a.* b\na.* b')
        item = self.search(' a.* b')['items'][0]
        self.assertEqual(item['matches'], 2)
        self.assertEqual([h['line'] for h in item['previews']], [1, 2])
        self.assertFalse(self.search('a.+b')['items'])
        self.assertFalse(self.search('A.* B', sensitive=True)['items'])

    def test_context_and_excerpt_budgets_do_not_hide_long_line_hits(self):
        self.save('wide.log', 'x'*800+'needle'+'y'*800+'\n'+'needle\n'*10)
        item = self.search(context=1)['items'][0]
        self.assertEqual((item['matches'], len(item['previews'])), (11, text_history.MATCH_PREVIEWS))
        hit, neighbor = item['previews'][0]['rows']
        self.assertEqual((hit['column'], hit['match'], hit['head'], hit['tail']), (801, 'needle', True, True))
        self.assertEqual(sum(len(hit[k]) for k in ('prefix','match','suffix')), text_history.PREVIEW_CHARS)
        self.assertIsNone(neighbor['column'])
        self.assertEqual(neighbor['suffix'], 'needle')
        self.save('folded.txt', 'ffi'*160)
        preview = self.search('ﬃ'*160)['items'][0]['previews'][0]['rows'][0]
        self.assertEqual(len(preview['match']), text_history.PREVIEW_CHARS)
        self.assertTrue(preview['tail'])

    def test_supported_encodings_and_binary_rejection(self):
        fixtures = {
            'bom.txt': codecs.BOM_UTF8+'中文'.encode(),
            'le.txt': codecs.BOM_UTF16_LE+'中文'.encode('utf-16-le'),
            'be.txt': codecs.BOM_UTF16_BE+'中文'.encode('utf-16-be'),
            'le32.txt': codecs.BOM_UTF32_LE+'中文'.encode('utf-32-le'),
            'be32.txt': codecs.BOM_UTF32_BE+'中文'.encode('utf-32-be'),
            'gb.txt': '中文'.encode('gb18030'),
            'embedded-nul.txt': b'hello\0',
            'bad.txt': codecs.BOM_UTF16_BE + b'x',
        }
        for name, raw in fixtures.items():
            self.save(name, raw)
        self.assertEqual({row['rel'] for row in self.api.dispatch('files', {})['items']}, set(fixtures))
        data = self.search('中文')
        self.assertEqual({v['encoding'] for v in data['items']},
                         {'GB18030','UTF-8 BOM','UTF-16 LE','UTF-16 BE','UTF-32 LE','UTF-32 BE'})
        self.assertEqual(data['skipped'], {'文本编码无法读取': 2})

    def test_skips_missing_corrupt_and_oversized_objects(self):
        self.save('corrupt.txt', 'needle')
        self.save('missing.txt', 'needle missing')
        self.save('big.txt', b'x' * (text_history.FILE_BYTES + 1))
        self.save('good.txt', 'needle good')
        self.store.obj(hashlib.sha256(b'needle').hexdigest()).write_bytes(b'eedlen')
        self.store.obj(hashlib.sha256(b'needle missing').hexdigest()).unlink()
        result = self.search()
        self.assertEqual((result['scanned'], result['checked']), (4, 1))
        self.assertEqual(result['skipped'], dict.fromkeys(text_history.SKIPS[:3], 1))
        self.assertEqual(result['items'][0]['rel'], 'good.txt')

    def test_non_regular_object_is_skipped(self):
        self.save('log.txt', 'needle')
        object_path = self.store.obj(hashlib.sha256(b'needle').hexdigest())
        object_path.unlink()
        object_path.mkdir()
        self.assertEqual(self.search()['skipped'], {'副本缺失或不可读': 1})

    def test_cursor_crosses_empty_batch_and_ignores_concurrent_saves(self):
        self.save('older.txt', 'needle')
        self.save('newest.txt', 'other')
        with patch.object(text_history, 'BATCH_VERSIONS', 1):
            page = self.search()
            self.assertFalse(page['items'])
            self.assertIsNotNone(page['next'])
            self.save('older.txt', 'replacement')
            self.save('injected.txt', 'needle outside')
            prior = self.search(cap=page['cap'], before=page['next'])
            self.assertEqual([(v['rel'], v['num']) for v in prior['items']], [('older.txt', 1)])
            self.assertIsNone(prior['next'])
        self.assertEqual([v['rel'] for v in self.search()['items']], ['injected.txt'])

    def test_byte_and_result_budgets_continue_before_the_next_unread_item(self):
        for name in ('one.txt', 'two.txt', 'three.txt'):
            self.save(name, 'needle ' + name)
        with patch.object(text_history, 'BATCH_BYTES', 23):
            page = self.search()
            self.assertEqual(page['scanned'], 1)
            other = self.search(cap=page['cap'], before=page['next'])
            self.assertEqual(other['items'][0]['rel'], 'two.txt')
        with patch.object(text_history, 'BATCH_RESULTS', 1):
            page = self.search()
            noms = []
            while True:
                noms.extend(v['rel'] for v in page['items'])
                if not page['next']:
                    break
                page = self.search(cap=page['cap'], before=page['next'])
            self.assertEqual(noms, ['three.txt', 'two.txt', 'one.txt'])

    def test_validation_rejects_bad_options(self):
        for args in ({'q':''}, {'q':'\t'}, {'q':'a\nb'}, {'q':'a\0b'}, {'q':'x'*161},
                     {'ext':'xlsx'}, {'ext':'.'}, {'scope':'unknown'}, {'start':'2025-02-30'},
                     {'start':'2025-02-02','end':'2025-02-01'}, {'root':-1}, {'file':True},
                     {'before':4,'cap':2}, {'before':4}, {'context':3}, {'exact':'true'}):
            with self.subTest(args=args), self.assertRaises(ValueError):
                self.api.dispatch('text_search', {'q':'needle', **args})
        self.assertEqual(self.search()['cap'], 0)
        self.assertFalse(self.search(end='9999-12-31')['items'])

    def test_csv_contains_batch_metadata_and_only_visible_match_previews(self):
        self.save('log.csv', '\t=needle,含"引号"\n'+ 'needle\n'*10)
        dest = self.base / '命中.csv'
        query = dict(q='needle', path=str(dest), context=2)
        actual = self.api.dispatch('text_search_csv', query)
        self.assertEqual(Path(actual), dest.resolve())
        self.assertTrue(dest.read_bytes().startswith(codecs.BOM_UTF8))
        with dest.open(encoding='utf-8-sig', newline='') as stream:
            rows = list(csv.DictReader(stream))
        self.assertEqual(len(rows), text_history.MATCH_PREVIEWS)
        self.assertEqual((rows[0]['行片段'], rows[0]['起始列'], rows[0]['匹配行数']),
                         ('\'\t=needle,含"引号"', '3', '11'))
        with self.assertRaises(FileExistsError):
            self.api.dispatch('text_search_csv', query)
        with self.assertRaises(ValueError):
            self.api.dispatch('text_search_csv', dict(query, path=str(self.store.home/'bad.csv')))
        with self.assertRaises(ValueError):
            self.api.dispatch('text_search_csv', dict(query, path=str(self.base/'bad.txt')))
        with self.assertRaises(ValueError):
            self.api.dispatch('text_search_csv', dict(query, q='missing', path=str(self.base/'empty.csv')))
        self.assertFalse((self.base/'empty.csv').exists())
        with self.store.db() as db:
            self.assertEqual(db.execute("SELECT count(*) FROM audit WHERE action='导出历史正文命中'").fetchone()[0], 1)
