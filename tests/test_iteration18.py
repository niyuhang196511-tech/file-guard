import csv
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import warnings
import zipfile

from docx import Document
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.formatting.rule import CellIsRule
from openpyxl.styles import Font
from openpyxl.worksheet.pagebreak import Break
from openpyxl.workbook.defined_name import DefinedName
from PIL import Image
from pptx import Presentation
from pypdf import PdfWriter
from pypdf.annotations import Link,Text

from engine.formats import compare,extract
from engine.service import Service
from engine.sheet_view import WorkbookView
from engine.store import Store
from engine.shared_read import open_snapshot_source


class Work(unittest.TestCase):
    def setUp(self):
        tmp=tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.base=Path(tmp.name)
        self.old=self.base/'before'
        self.new=self.base/'after'

    def book(self,path,rows,mutate=None):
        book=Workbook()
        ws=book.active
        for row in rows:
            ws.append(row)
        if mutate:
            mutate(book,ws)
        book.save(path)
        book.close()

    def check_diff(self,ext,label):
        rows=compare(self.old,self.new,ext)[1]
        self.assertIn(label,[r['location'] for r in rows])
        reverse=compare(self.new,self.old,ext)[1]
        forward=next(r for r in rows if r['location']==label)
        back=next(r for r in reverse if r['location']==label)
        self.assertEqual((forward['old'],forward['new']),(back['new'],back['old']))


class OfficeReview(Work):
    def test_word_layout_properties(self):
        tags={'pgSz':'纸张尺寸与方向','pgMar':'页面边距','type':'分节方式','cols':'分栏',
              'pgNumType':'页码编排','pgBorders':'页面边框','lnNumType':'行号设置','vAlign':'页面垂直对齐',
              'titlePg':'首页独立页眉页脚','textDirection':'页面文字方向'}
        attrs={'pgSz':('w','3400'),'pgMar':('top','1200'),'type':('val','continuous'),'cols':('num','2'),
               'pgNumType':('start','3'),'pgBorders':('offsetFrom','page'),'lnNumType':('countBy','2'),
               'vAlign':('val','center'),'titlePg':('val','true'),'textDirection':('val','tbRl')}
        d=Document();d.add_paragraph('复核记录');d.save(self.old)
        for tag in tags:
            el=d.sections[0]._sectPr.find(qn('w:'+tag))
            if el is None:
                el=OxmlElement('w:'+tag);d.sections[0]._sectPr.append(el)
            attr,val=attrs[tag];el.set(qn('w:'+attr),val)
        d.core_properties.title='出库复核';d.save(self.new)
        rows=compare(self.old,self.new,'.docx')[1]
        self.assertEqual({r['location'] for r in rows},set(tags.values())|{'标题'})

    def test_slide_layout_notes_and_accessible_label(self):
        d=Presentation();slide=d.slides.add_slide(d.slide_layouts[0]);title=slide.shapes.title
        title.text='验收';d.save(self.old)
        d.slide_width=d.slide_width+100;title.left=300000;slide._element.set('show','0')
        title._element.xpath('./*/p:cNvPr')[0].set('descr','批次图')
        slide.notes_slide.notes_text_frame.text='提醒复核';d.save(self.new)
        names={r['location'] for r in compare(self.old,self.new,'.pptx')[1]}
        self.assertTrue({'幻灯片尺寸（EMU）','演讲者备注','放映可见性'}<=names)
        for suffix in ['替代文字','位置尺寸']:
            self.assertTrue(any(n.endswith(suffix) for n in names))

    def test_pdf_boxes_annotations_and_links(self):
        for n,path in enumerate([self.old,self.new]):
            writer=PdfWriter();page=writer.add_blank_page(200+30*n,300)
            page.cropbox.upper_right=(190+n*3,270);page.rotate(n*90)
            writer.add_annotation(0,Text(rect=(10,10,20,20),text='复核'+str(n)))
            writer.add_annotation(0,Link(rect=(5,5,30,20),url='https://example.org/'+str(n)))
            writer.write(path);writer.close()
        self.assertEqual({r['location'] for r in compare(self.old,self.new,'.pdf')[1]},
                         {'纸张边界','裁切边界','页面旋转','批注 1','链接目标 2'})

    def test_grid_mixed_add_remove_reorder_and_duplicate_fallback(self):
        self.book(self.old,[['编码','件数'],['A',1],['B',2],['C',3]])
        self.book(self.new,[['件数','编码'],[3,'C'],[1,'A'],[4,'D']])
        view=WorkbookView(self.old,self.new,'.xlsx','aligned')
        page=view.page({'expand':True})
        self.assertEqual(page['key'],'编码')
        self.assertEqual([c['old'] for c in page['columns']],['B','A'])
        self.assertTrue(any(r['moved'] for r in page['rows']))
        self.assertTrue(any(r['kind']=='删除' and r['old']==3 for r in page['rows']))
        self.assertTrue(any(r['kind']=='新增' and r['new']==4 for r in page['rows']))
        self.book(self.new,[['编码','件数'],['A',1],['A',2]])
        self.assertFalse(WorkbookView(self.old,self.new,'.xlsx','aligned').page({})['key'])

    def test_grid_sparse_wide_and_context_page(self):
        def make(book,s):
            book.create_sheet('空表')
            for n in range(2,72):
                s.cell(n,1,n)
            s.cell(71,30,'尾列')
        rows=[[f'列{n}' for n in range(30)]]
        self.book(self.old,rows,make)
        def edit(book,s):
            make(book,s);s.cell(71,30,'改过')
        self.book(self.new,rows,edit)
        view=WorkbookView(self.old,self.new,'.xlsx','aligned')
        p=view.page({'col_page':3})
        self.assertEqual(p['rows'][0]['count'],70)
        self.assertIn('空表',p['sheets'])
        self.assertEqual(p['rows'][-1]['cells'][-1]['value'],'改过')
        self.assertEqual(view.page({'expand':True,'page':200})['page'],3)
        self.assertEqual(view.page({'sheet':'空表'})['rows'],[])

    def test_grid_format_comment_and_type_without_value_change(self):
        self.book(self.old,[['编码','数量'],['A',12]])
        def edit(book,s):
            s['B2'].font=Font(bold=True);s['B2'].comment=Comment('复核','李')
            s['B2'].hyperlink='https://example.org'
        self.book(self.new,[['编码','数量'],['A','12']],edit)
        grid=WorkbookView(self.old,self.new,'.xlsx','aligned').page({})
        a,b=grid['rows'][-2:]
        self.assertEqual([r['cells'][1]['type'] for r in (a,b)],['数字','文本'])
        self.assertEqual(set(b['cells'][1]['note'].split('、')),{'内容','格式','批注','超链接'})


def excel_case(label,mutate):
    def run(self):
        rows=[['编码','件数'],['A',1]]
        self.book(self.old,rows,lambda b,s:b.create_sheet('副表'))
        def edit(b,s):
            b.create_sheet('副表');mutate(b,s)
        self.book(self.new,rows,edit)
        self.check_diff('.xlsx',label)
    return run


for index,(label,mutate) in enumerate([
    ('B2 · 超链接',lambda b,s:setattr(s['B2'],'hyperlink','https://example.org')),
    ('工作表可见性',lambda b,s:setattr(s,'sheet_state','hidden')),('冻结窗格',lambda b,s:setattr(s,'freeze_panes','B2')),
    ('打印区域',lambda b,s:setattr(s,'print_area','A1:B2')),('打印标题',lambda b,s:setattr(s,'print_title_rows','1:1')),
    ('工作表保护',lambda b,s:setattr(s.protection,'sheet',True)),('自动筛选',lambda b,s:setattr(s.auto_filter,'ref','A1:B2')),
    ('打印边距',lambda b,s:setattr(s.page_margins,'left',1.2)),('纸张与分页设置',lambda b,s:setattr(s.page_setup,'orientation','landscape')),
    ('打印选项',lambda b,s:setattr(s.print_options,'horizontalCentered',True)),('标签颜色',lambda b,s:setattr(s.sheet_properties,'tabColor','FF223344')),
    ('手动横向分页',lambda b,s:s.row_breaks.append(Break(id=10))),('手动纵向分页',lambda b,s:s.col_breaks.append(Break(id=3))),
    ('显示网格线',lambda b,s:setattr(s.sheet_view,'showGridLines',False)),('显示公式',lambda b,s:setattr(s.sheet_view,'showFormulas',True)),
    ('视图缩放',lambda b,s:setattr(s.sheet_view,'zoomScale',130)),
    ('条件格式 B2',lambda b,s:s.conditional_formatting.add('B2',CellIsRule(operator='greaterThan',formula=['3']))),
    ('局部名称 产品',lambda b,s:s.defined_names.add(DefinedName('产品',attr_text='Sheet!$A$2'))),
    ('全局名称',lambda b,s:b.defined_names.add(DefinedName('全局名称',attr_text='Sheet!$B$2'))),
],1):
    setattr(OfficeReview,f'test_excel_property_{index:02}',excel_case(label,mutate))


class OtherFormats(Work):
    def test_text_serialization_and_invalid_encoding(self):
        self.old.write_bytes('行\r\n'.encode('utf-32'));self.new.write_bytes('行\n'.encode('utf-8-sig'))
        self.assertEqual({r['location'] for r in compare(self.old,self.new,'.txt')[1]},{'文本编码','换行方式'})
        self.new.write_text('行',encoding='utf-8')
        self.check_diff('.txt','文末换行')
        self.new.write_bytes(b'a\0b')
        with self.assertRaisesRegex(ValueError,'空字符'):compare(self.old,self.new,'.txt')

    def test_csv_dialects_empty_rows_and_quoted_newlines(self):
        for directive in ['', 'sep=;\r\n']:
            self.old.write_bytes((directive+'编号;说明\r\nA;"第一行\r\n第二行"\r\n\r\n').encode())
            data=extract(self.old,'.csv')
            self.assertEqual(data['数据表','第 2 行 · 第 2 列'],'第一行\r\n第二行')
            self.assertIn(('数据表','第 3 行 · 空记录'),data)

    def test_json_lines_pointer_and_repeated_keys(self):
        self.old.write_text('{"": 1,"a/b":true}\n{"x":2}')
        data=extract(self.old,'.jsonl')
        self.assertEqual(data['字段','/行1/'],'1');self.assertIn(('字段','/行1/a~1b'),data)
        self.old.write_text('{"":1}');self.assertEqual(len(extract(self.old,'.json')),2)
        self.old.write_text('{}\n{"a":0,"a":2}')
        with self.assertRaisesRegex(ValueError,'第 2 行.*重复'):extract(self.old,'.ndjson')

    def test_zip_entries_and_duplicate_guard(self):
        for n,path in enumerate([self.old,self.new]):
            with zipfile.ZipFile(path,'w') as z:
                z.writestr('a.txt',str(n))
                if n:z.writestr('空目录/',b'')
        diff=compare(self.old,self.new,'.zip')[1]
        self.assertEqual({r['location'] for r in diff},{'a.txt','空目录/'})
        with warnings.catch_warnings(),zipfile.ZipFile(self.new,'a') as z:
            warnings.simplefilter('ignore');z.writestr('a.txt',b'2')
        with self.assertRaisesRegex(ValueError,'重名'):extract(self.new,'.zip')

    def test_image_geometry_metadata_and_pixels(self):
        for n,path in enumerate([self.old,self.new]):
            im=Image.new(['RGB','RGBA'][n],(4+n,6),['red','blue'][n])
            exif=Image.Exif();exif[315]='作者'+str(n)
            im.save(path,format='PNG',exif=exif,icc_profile=b'profile'+bytes([n]))
        locs={r['location'] for r in compare(self.old,self.new,'.png')[1]}
        self.assertEqual(locs,{'像素尺寸','色彩模式','首帧像素摘要','ICC 色彩配置','Artist'})
        with Image.new('RGB',(3,3),'red') as a,Image.new('RGB',(3,3),'green') as b:
            a.save(self.old,format='GIF');a.save(self.new,format='GIF',save_all=True,append_images=[b])
        self.check_diff('.gif','帧数')


class OpenFilesAndSearch(Work):
    def setUp(self):
        super().setUp()
        self.root=self.base/'文件';self.root.mkdir()
        self.store=Store(self.base/'仓库');self.service=Service(self.store);self.rid=self.store.configure(self.root)
    def scan(self,source='手动扫描'):
        self.store.scan(self.rid,source)
    def api(self,cmd,**options):
        return self.service.dispatch(cmd,options)

    def test_open_workbook_unsaved_and_saved(self):
        from openpyxl import load_workbook
        file=self.root/'库存.xlsx';self.book(file,[['数量'],[100]])
        self.scan()
        book=load_workbook(file)
        try:
            book.active['A2']=80;self.scan()
            self.assertEqual(self.api('summary')['versions'],1)
            book.save(file)
            with patch('engine.store.time.monotonic',return_value=200):self.scan('文件监听')
            self.assertEqual(self.api('roots')[0]['waiting'],1)
            self.assertEqual(self.api('summary')['versions'],1)
            with patch('engine.store.time.monotonic',return_value=202):self.scan('保存复查')
            self.assertTrue(self.store.parse_one())
            self.assertEqual(self.api('compare',old=1,new=2)['items'][0]['new'],'80')
            self.assertFalse(self.api('roots')[0]['waiting'])
        finally:
            book.close()

    def test_settling_rest_when_file_changes_again(self):
        p=self.root/'A.xlsx';self.book(p,[['一']]);self.scan()
        for t,v in [(10,2),(11,3)]:
            self.book(p,[[v]])
            with patch('engine.store.time.monotonic',return_value=t):self.scan('文件监听')
        for t,expected in [(12,1),(13,2)]:
            with patch('engine.store.time.monotonic',return_value=t):self.scan('保存复查')
            self.assertEqual(self.api('summary')['versions'],expected)

    def test_temporary_absence_keeps_identity(self):
        p=self.root/'表.txt';p.write_text('A');self.scan();p.unlink()
        with patch('engine.store.time.monotonic',return_value=10):self.scan('文件监听')
        self.assertEqual(self.api('files')['total'],1)
        p.write_text('B')
        with patch('engine.store.time.monotonic',return_value=13):self.scan('保存复查')
        self.assertEqual(self.api('events',kind='删除')['total'],0)
        self.assertEqual(self.api('files')['items'][0]['version'],2)
        p.unlink()
        for t in [15,18]:
            with patch('engine.store.time.monotonic',return_value=t):self.scan('文件监听')
        self.assertEqual(self.api('events',kind='删除')['total'],1)

    def test_retry_and_peer_progress(self):
        p=self.root/'占用.txt';q=self.root/'其他.txt'
        p.write_text('1');q.write_text('1');self.scan()
        p.write_text('222');q.write_text('333')
        original=self.store.capture
        def locked(path):
            if path==p:raise PermissionError('模拟独占')
            return original(path)
        with patch.object(self.store,'capture',side_effect=locked):
            self.scan();self.scan()
        root=self.api('roots')[0]
        self.assertEqual(root['wait_samples'][0][0],p.name)
        self.assertEqual(root['retry_delay'],4)
        self.assertEqual(self.api('files',multiple=True)['items'][0]['rel'],q.name)
        reopened=Service(Store(self.store.home))
        self.assertEqual(reopened.dispatch('roots',{})[0]['waiting'],1)
        self.scan('保存复查')
        self.assertEqual(self.api('files',multiple=True)['total'],2)
        self.assertFalse(self.api('roots')[0]['waiting'])

    def test_concurrent_write_discards_incomplete_snapshot(self):
        p=self.root/'台账.txt';p.write_bytes(b'first');self.scan()
        p.write_bytes(b'working copy')
        from contextlib import contextmanager
        @contextmanager
        def read_and_modify(path):
            with open_snapshot_source(path) as src:
                class Changing:
                    changed=False
                    def fileno(self):
                        return src.fileno()
                    def read(self,n):
                        block=src.read(n)
                        if block and not self.changed:
                            self.changed=True
                            with path.open('ab') as out:out.write(b' finished')
                        return block
                yield Changing()
        with patch('engine.store.open_snapshot_source',read_and_modify):
            self.scan()
        self.assertEqual(self.api('summary')['versions'],1)
        self.assertEqual(self.api('roots')[0]['wait_samples'],[[p.name,'等待保存稳定']])
        self.scan('保存复查')
        self.assertEqual(self.api('summary')['versions'],2)
        self.assertEqual(self.store.obj(self.api('history',id=1)[0]['sha']).read_bytes(),p.read_bytes())

    def test_unreadable_file_metadata_remains_in_scope(self):
        p=self.root/'保留.txt';p.write_text('内容');self.scan()
        q=self.root/'新建.txt';q.write_text('新')
        from engine import store
        check=store.linklike
        def blocked(path):
            if path==p:raise PermissionError()
            return check(path)
        with patch('engine.store.linklike',blocked):
            self.scan()
        self.assertEqual(self.api('files')['total'],2)
        self.assertEqual(self.api('events',kind='删除')['total'],0)
        self.assertEqual(self.api('roots')[0]['waiting'],1)

    def test_upgrade_reparses_old_image_and_preserves_versions(self):
        p=self.root/'标签.png'
        for color in ['red','blue']:
            Image.new('RGB',(16,16),color).save(p);self.scan()
        self.store.parse_one()
        previous=[(v['num'],v['sha']) for v in self.api('history',id=1)]
        with self.store.db() as db:
            db.execute("UPDATE versions SET status='属性对比',details='[]' WHERE num=2")
            db.execute('PRAGMA user_version=4')
        self.store=Store(self.store.home);self.service=Service(self.store)
        self.assertTrue(self.store.parse_one())
        self.assertEqual(previous,[(v['num'],v['sha']) for v in self.api('history',id=1)])
        self.assertEqual(self.api('compare',old=1,new=2)['items'][0]['location'],'首帧像素摘要')

    def test_filters_sort_and_snapshot_export(self):
        for name in ['A.txt','B.md','C.csv']:
            (self.root/name).write_text(name)
        self.scan();(self.root/'A.txt').write_text('长内容'*12);self.scan()
        self.store.parse_one()
        for query in [dict(ext='TXT，.MD',sort='size'),dict(ext='csv MD',sort='name')]:
            self.assertEqual(self.api('files',**query)['total'],2)
        sha=self.api('files',multiple=True)['items'][0]['sha']
        self.assertEqual(self.api('files',sha=sha[:7],min_bytes=10,max_bytes=300,status='已解析')['total'],1)
        self.assertEqual(self.api('events',source='手动扫描',with_diff=True)['total'],1)
        self.assertEqual(self.api('files',page=40,size=2)['page'],2)
        for table,cmd in [('files','export_files'),('audit','export_audit')]:
            dest=self.base/(table+'.csv');n=self.api(table)['total']
            self.api(cmd,path=str(dest),sort='oldest')
            with dest.open(encoding='utf-8-sig') as f:self.assertEqual(len(list(csv.reader(f))),n+1)

    def test_diff_search_scope_export_and_history(self):
        p=self.root/'A.xlsx'
        self.book(p,[['编码','数量'],['AA','box'],['BB','box']]);self.scan()
        self.book(p,[['编码','数量'],['AA','Box'],['BB','Box']]);self.scan();self.store.parse_one()
        args=dict(old=1,new=2,q='Box',case_sensitive=True,exact=True,field='数量')
        self.assertEqual(self.api('compare',**args,search_in='old')['total'],0)
        self.assertEqual(self.api('compare',**args,search_in='new',size=1,page=2)['items'][0]['record_key'],'BB')
        dest=self.base/'差异.csv';self.api('export_diff',**args,record='AA',path=str(dest))
        with dest.open(encoding='utf-8-sig') as f:self.assertEqual([r['记录编号'] for r in csv.DictReader(f)],['AA'])
        versions=self.api('history',id=1)
        self.assertEqual(versions[0]['changes'],2)
        self.assertEqual(versions[0]['delta'],versions[0]['size']-versions[1]['size'])
        self.assertEqual(self.api('sheet_rows',old=1,new=2)['key'],'编码')

    def test_ignores_office_lockfile_and_keeps_open_handle(self):
        (self.root/'.~lock.报价.xlsx#').touch()
        p=self.root/'记录.txt'
        with p.open('w') as stream:
            stream.write('初稿');stream.flush();self.scan()
            stream.write('第二稿');stream.flush();self.scan()
            self.assertEqual(self.api('summary')['versions'],2)
        self.assertEqual(self.api('roots')[0]['skip_counts']['临时文件'],1)

    @unittest.skipUnless(os.name=='nt','需要 Windows 文件共享语义')
    def test_editing_application_can_replace_file_while_monitored_handle_open(self):
        from engine.shared_read import open_snapshot_source
        p=self.root/'记录.txt';p.write_bytes(b'old')
        q=self.root/'新文件.txt';q.write_bytes(b'new')
        with open_snapshot_source(p) as reader:
            os.replace(q,p)
            self.assertEqual(reader.read(),b'old')
        self.assertEqual(p.read_bytes(),b'new')
