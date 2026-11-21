import csv
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from engine.service import Service
from engine.store import Store


class EventTraceTests(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.base = Path(tmp.name)
        self.root = self.base/'业务'
        self.root.mkdir()
        self.store = Store(self.base/'仓库')
        self.service = Service(self.store)
        self.root_id = self.store.configure(self.root)
        folder = self.root/'待交接'
        folder.mkdir()
        original = folder/'交接单.txt'
        original.write_text('批次 01', encoding='utf-8')
        self.scan('2026-10-30T21:00:00+08:00')
        renamed = original.rename(original.with_name('签收表.txt'))
        self.scan('2026-10-31T00:00:00+08:00')
        renamed.rename(self.root/renamed.name)
        self.scan('2026-11-01T23:59:59+08:00')

    def scan(self, stamp):
        with patch('engine.store.now', return_value=stamp):
            self.store.scan(self.root_id)

    def events(self, **args):
        return self.service.dispatch('events', args)

    def test_original_paths_and_extension(self):
        rows = self.events(q=r' 待交接\交接单 ', ext=' TXT ', kind='重命名')['items']
        self.assertEqual([r['rel'] for r in rows], ['待交接/签收表.txt'])
        moved = self.events(q='待交接/', kind='移动')['items']
        self.assertEqual([r['old_rel'] for r in moved], ['待交接/签收表.txt'])
        self.assertEqual(self.events(q='签收表', ext='.txt')['total'], 2)

    def test_inclusive_ranges(self):
        dates = dict(start='2026-10-31', end='2026-11-01')
        self.assertEqual(self.events(**dates, activity=True)['total'], 2)
        self.assertEqual(self.events(end='2026-10-30')['total'], 1)
        self.assertEqual(self.events(start='2026-11-02')['total'], 0)
        self.assertEqual(self.events(day='2026-11-01')['total'], 1)
        for args in [dict(start='2026-10-32'), dict(start='2026-11-01', end='2026-10-31')]:
            with self.assertRaises(ValueError):
                self.events(**args)

    def test_export_includes_all_matching_pages(self):
        with self.store.db() as db:
            file_id = db.execute('SELECT id FROM files').fetchone()[0]
            for i in range(107):
                db.execute('INSERT INTO events(file_id,root_id,rel,old_rel,ext,kind,stamp,source) VALUES (?,?,?,?,?,?,?,?)',
                           (file_id,self.root_id,f'签收{i}.txt','旧名.txt','.txt','重命名','2026-11-01T12:00:00+08:00','目录扫描'))
        filters = dict(q='旧名', ext=' TXT ', root=self.root_id, kind='重命名', start='2026-11-01', end='2026-11-01')
        expected = self.events(**filters, size=100)['items'] + self.events(**filters, size=100, page=2)['items']
        path = self.base/'结果.csv'
        self.service.dispatch('export', {**filters, 'path':str(path), 'page':2})
        with path.open(encoding='utf-8-sig', newline='') as stream:
            contents = list(csv.DictReader(stream))
        self.assertEqual(len(contents), 107)
        self.assertEqual([int(r['编号']) for r in contents], [r['id'] for r in expected])
        self.assertTrue(all(r['原路径']=='旧名.txt' for r in contents))
