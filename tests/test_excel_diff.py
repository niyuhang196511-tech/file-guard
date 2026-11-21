import tempfile
import unittest
from copy import copy
from pathlib import Path
from unittest.mock import patch

from openpyxl import Workbook, load_workbook

from engine.formats import compare
from engine.service import Service
from engine.store import Store


def ledger(path, records, header=('名称', '物料编码', '数量', '金额')):
    book = Workbook()
    sheet = book.active
    sheet.title = '库存表'
    sheet.append(header)
    for i, (code, count) in enumerate(records, 2):
        sheet.append([f'物料 {code}', code, count, f'=C{i}*2'])
    book.save(path)
    book.close()


class ExcelAlignmentTests(unittest.TestCase):
    def setUp(self):
        folder = tempfile.TemporaryDirectory()
        self.addCleanup(folder.cleanup)
        self.base = Path(folder.name)
        self.first = self.base/'旧.xlsx'
        self.last = self.base/'新.xlsx'
        ledger(self.first, [('A',1), ('B',2), ('C',3)])
        ledger(self.last, [('A',1), ('N',4), ('B',2), ('C',5)])

    def changes(self, mode='aligned'):
        return compare(self.first,self.last,'.xlsx',mode)[1]

    def test_insert_and_edit(self):
        items = self.changes()
        self.assertEqual([(d['kind'],d['location']) for d in items],
                         [('新增','第 3 行'),('修改','C4 → C5')])
        self.assertEqual(items[0]['record_key'],'N')
        self.assertIn('B3 · 物料编码：N',items[0]['new'])
        self.assertIn('D3 · 金额：=C3*2',items[0]['new'])
        self.assertEqual((items[1]['old'],items[1]['new']),('3','5'))
        self.assertEqual(items[1]['record_key'],'C')

    def test_reverse_and_raw(self):
        raw=self.changes('coordinate')
        self.assertGreater(len(raw),2)
        self.assertFalse(any('record_key' in d for d in raw))
        reverse=compare(self.last,self.first,'.xlsx')[1]
        self.assertEqual([(r['location'],r['kind']) for r in reverse],
                         [('第 3 行','删除'),('C5 → C4','修改')])

    def test_ambiguous_identifiers_use_coordinates(self):
        for ids in [('A','X','B','B'),('C','A','X','B'),('A','X','','C'),('A','N','M','C')]:
            with self.subTest(ids=ids):
                ledger(self.last,[(k,10) for k in ids])
                self.assertEqual(self.changes(),self.changes('coordinate'))

    def test_two_candidate_headers(self):
        for p,ids in [(self.first,['A','B']), (self.last,['A','S','B'])]:
            ledger(p,[(v,1) for v in ids],header=('编号','物料编码','数量','金额'))
        self.assertEqual(self.changes(),self.changes('coordinate'))

    def test_moved_formula_edit_preserved(self):
        book=load_workbook(self.last)
        book.active['D4']='=C4*3'
        book.save(self.last);book.close()
        changed=next(r for r in self.changes() if r['location']=='D3 → D4')
        self.assertEqual((changed['old'],changed['new']),('=C3*2','=C4*3'))

    def test_human_style_diff(self):
        book=load_workbook(self.first)
        cell=book.active['C2']
        font=copy(cell.font);font.b=True;cell.font=font
        cell.number_format='0.00'
        book.save(self.last);book.close()
        result=self.changes()
        self.assertEqual(len(result),1)
        old,new=result[0]['old'],result[0]['new']
        self.assertIn('加粗：否',old);self.assertIn('加粗：是',new)
        self.assertIn('数字格式：常规',old);self.assertIn('数字格式：0.00',new)
        self.assertNotIn('<',new)
        reverse=compare(self.last,self.first,'.xlsx')[1][0]
        self.assertEqual((reverse['old'],reverse['new']),(new,old))

    def test_multiple_sheets_and_sparse_data(self):
        for p in (self.first,self.last):
            book=load_workbook(p)
            s=book.create_sheet('备注')
            s['A1']='编码';s['A2']='Z';s['A5']='Y'
            s['B5']=1 if p==self.first else 2
            book.save(p);book.close()
        diff=self.changes()
        self.assertEqual(next(r for r in diff if r['sheet']=='备注')['location'],'B5')
        self.assertIn('第 3 行',[r['location'] for r in diff])

    def test_migrate_old_cached_comparisons_and_filters(self):
        root=self.base/'监控';root.mkdir()
        file=root/'库存.xlsx';file.write_bytes(self.first.read_bytes())
        store=Store(self.base/'库');rid=store.configure(root);store.scan(rid)
        file.write_bytes(self.last.read_bytes());store.scan(rid)
        self.assertTrue(store.parse_one())
        with store.db() as db:
            ids=[r[0] for r in db.execute('SELECT id FROM versions ORDER BY num')]
            db.execute("UPDATE versions SET details='[]',status='已解析' WHERE id=?",(ids[1],))
            db.execute('PRAGMA user_version=1')
        store=Store(store.home)
        self.assertTrue(store.parse_one())
        self.assertFalse(Store(store.home).parse_one())
        api=Service(store);args={'old':ids[0],'new':ids[1]}
        with patch('engine.formats.compare', side_effect=AssertionError('未复用已保存差异')):
            answer=api.dispatch('compare',{**args,'q':'N','kind':'新增','sheet':'库存表'})
            self.assertEqual(answer['total'],1)
            self.assertEqual(answer['counts'],{'新增':1,'删除':0,'修改':0})
        self.assertEqual(api.dispatch('compare',args)['aligned'],{'库存表':'物料编码'})
        raw=api.dispatch('compare',{**args,'mode':'coordinate'})
        self.assertGreater(raw['total'],2)
        self.assertFalse(raw['aligned'])
