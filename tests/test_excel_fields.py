import csv
import tempfile
import unittest
from pathlib import Path

from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.styles import Font

from engine.formats import compare
from engine.service import Service
from engine.store import Store


class ExcelFieldTests(unittest.TestCase):
    def setUp(self):
        tmp=tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.base=Path(tmp.name)
        self.old=self.base/'旧.xlsx'
        self.new=self.base/'新.xlsx'

    def write(self,path,rows,decorate=None):
        book=Workbook()
        sheet=book.active
        sheet.title='收货'
        for row in rows:
            sheet.append(row)
        if decorate:
            decorate(sheet)
        book.save(path)
        book.close()

    def changes(self,mode='aligned',reverse=False):
        a,b=(self.new,self.old) if reverse else (self.old,self.new)
        return compare(a,b,'.xlsx',mode)[1]

    def test_eighty_rows_reordered_key_and_one_changed_quantity(self):
        self.write(self.old,[['编码','名称','数量']]+[[f'M-{n:03}',f'物料{n}',n] for n in range(1,81)])
        self.write(self.new,[['数量','编码','名称']]+[[n+int(n==32),f'M-{n:03}',f'物料{n}'] for n in range(1,81)])
        items=self.changes()
        self.assertEqual(len(items),2)
        self.assertEqual(items[0]['location'],'字段顺序')
        self.assertEqual((items[1]['location'],items[1]['field'],items[1]['record_key']),('C33 → A33','数量','M-032'))
        self.assertEqual((items[1]['old'],items[1]['new']),('32','33'))
        self.assertEqual(len(self.changes('coordinate')),243)
        self.assertEqual(self.changes(reverse=True)[1]['location'],'A33 → C33')

    def test_column_added_removed_and_type_only_edit(self):
        self.write(self.old,[['编码','数量'],['A',12]])
        self.write(self.new,[['编码','复核人','数量'],['A','张宁','12']])
        items=self.changes()
        self.assertEqual(len(items),3)
        self.assertEqual([(r['category'],r['field']) for r in items],
                         [('字段结构','复核人'),('单元格值','复核人'),('数据类型','数量')])
        self.assertEqual([items[-1][k] for k in ('old','new','old_type','new_type')],['12','12','数字','文本'])
        reverse=self.changes(reverse=True)
        self.assertCountEqual([(r['kind'],r['category']) for r in reverse],
                              [('删除','字段结构'),('删除','单元格值'),('修改','数据类型')])
        self.assertEqual(next(r['new_type'] for r in reverse if r['category']=='数据类型'),'数字')

    def test_moved_key_annotations_and_styles(self):
        def annotations(sheet):
            sheet['A2'].comment=Comment('已复核','仓库')
            sheet['A2'].font=Font(bold=True)
        self.write(self.old,[['编码','数量'],['A',12]])
        self.write(self.new,[['数量','编码'],[12,'A']],annotations)
        items=self.changes()
        self.assertEqual({r['category'] for r in items},{'字段结构','批注','格式'})
        self.assertTrue(all(r['record_key']=='A' and r['location'].startswith('B2 → A2') for r in items[1:]))

    def test_formula_text_preserved_across_both_axis_changes(self):
        self.write(self.old,[['编码','金额','数量'],['A','=C2*2',1],['B','=C3*2',3]])
        self.write(self.new,[['数量','金额','编码'],[1,'=A2*2','A'],[8,'=A3*2','N'],[3,'=C4*2','B']])
        formulas=[r for r in self.changes() if r['category']=='公式']
        self.assertEqual([(r['record_key'],r['old'],r['new']) for r in formulas],
                         [('A','=C2*2','=A2*2'),('B','=C3*2','=C4*2')])

    def test_duplicate_or_missing_headers_do_not_pair_across_columns(self):
        for name in ['数量', None]:
            self.write(self.old,[['编码','数量',name],['A',1,4]])
            self.write(self.new,[['数量','编码',name],[1,'A',4]])
            self.assertEqual(self.changes(),self.changes('coordinate'))

    def test_upgrade_filter_and_export_all_pages(self):
        root=self.base/'监控';root.mkdir()
        book=root/'批次.xlsx'
        self.write(book,[['编码','数量']]+[[f'A{i}',i] for i in range(46)])
        store=Store(self.base/'库');rid=store.configure(root);store.scan(rid)
        self.write(book,[['数量','编码']]+[[str(i),f'A{i}'] for i in range(46)])
        store.scan(rid)
        store.parse_one()
        with store.db() as db:
            db.execute("UPDATE versions SET details='[]' WHERE num=2")
            db.execute('PRAGMA user_version=3')
        store=Store(store.home)
        self.assertTrue(store.parse_one());self.assertFalse(Store(store.home).parse_one())
        api=Service(store)
        opts=dict(old=1,new=2,q='数量',category='数据类型',kind='修改',page=2)
        page=api.dispatch('compare',opts)
        self.assertEqual((page['total'],len(page['items'])),(46,6))
        dest=self.base/'复核.csv'
        api.dispatch('export_diff',{**opts,'path':str(dest)})
        with dest.open(encoding='utf-8-sig',newline='') as stream:
            rows=list(csv.DictReader(stream))
        self.assertEqual(len(rows),46)
        self.assertEqual({row['字段'] for row in rows},{'数量'})
        self.assertEqual({(r['旧类型'],r['新类型'],r['差异类别']) for r in rows},{('数字','文本','数据类型')})
        self.assertEqual(len({r['记录编号'] for r in rows}),46)
