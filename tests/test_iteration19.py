import csv
from contextlib import closing
import json
import os
import sqlite3
import subprocess
import tempfile
import time
import unittest
import zipfile
from pathlib import Path
from unittest.mock import patch

from docx import Document
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.opc.constants import RELATIONSHIP_TYPE
from docx.shared import Pt, RGBColor
from openpyxl import Workbook
from openpyxl.comments import Comment
from PIL import Image
from pypdf import PdfWriter
from pypdf.generic import ArrayObject,DictionaryObject,NameObject,TextStringObject,NumberObject

from engine import backup_check,formats,record_admin,opendocument
from engine.maintenance import restore_backup
from engine.store import Store
from engine.service import Service
from engine.sheet_view import WorkbookView


class Work(unittest.TestCase):
    def setUp(self):
        tmp=tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.base=Path(tmp.name);self.a=self.base/'first';self.b=self.base/'second'
    def diff(self,ext,mode='aligned'):
        return formats.compare(self.a,self.b,ext,mode)[1]


class Formats(Work):
    def test_csv_insert_and_mixed_replacement(self):
        self.a.write_text('编号,数量\n001,3\n002,12\n003,0',encoding='utf-8')
        self.b.write_text('数量,编号,质检\n18,002,通过\n2,004,待验\n3,001,',encoding='utf-8')
        rows=self.diff('.csv')
        self.assertTrue(all(r['key_header']=='编号' for r in rows))
        cells=[r for r in rows if r['record_key']=='002' and r['field']=='数量']
        self.assertEqual([(v['old'],v['new']) for v in cells],[('12','18')])
        self.assertEqual({(r['record_key'],r['kind']) for r in rows if r['category']=='记录行'},{('003','删除'),('004','新增')})
        self.assertEqual({r['record_key'] for r in rows if r['category']=='记录顺序'},{'001','002'})
        self.assertTrue(any(r['location']=='表头 · 字段顺序' for r in rows))
        self.assertFalse(any('key_header' in r for r in self.diff('.csv','coordinate')))
    def test_csv_fallback_and_tsv(self):
        self.a.write_text('编号\t数量\n001\t5\n002\t2');self.b.write_text('编号\t数量\n002\t2\n001\t7')
        self.assertTrue(any(r.get('record_key')=='001' for r in self.diff('.tsv')))
        for content in ['编号\t数量\nA\t5\nA\t3','编号\t编号\nA\tB','编号\t数量\n\t4','编号\t数量\nA\tB\tC']:
            self.b.write_text(content)
            self.assertEqual(self.diff('.tsv'),self.diff('.tsv','coordinate'))
    def test_word_formatted_word_and_links(self):
        for n,path in enumerate([self.a,self.b]):
            d=Document()
            if n:d.add_paragraph('新插入的说明')
            p=d.add_paragraph('签名：');run=p.add_run('复核人')
            run.bold=bool(n);run.font.size=Pt(10+n);run.font.color.rgb=RGBColor(n,0,0)
            p.paragraph_format.left_indent=Pt(3+n);p.paragraph_format.keep_with_next=bool(n)
            link=OxmlElement('w:hyperlink');link.set(qn('r:id'),d.part.relate_to('https://example.org/v'+str(n),RELATIONSHIP_TYPE.HYPERLINK,is_external=True))
            r=OxmlElement('w:r');t=OxmlElement('w:t');t.text='详情';r.append(t);link.append(r);p._p.append(link)
            d.add_table(1,1).cell(0,0).paragraphs[0].add_run('格').italic=bool(n)
            d.save(path)
        rows=self.diff('.docx')
        self.assertTrue(any('旧第 1 段 → 新第 2 段'==r['location'] and '加粗' in str(r['new']) for r in rows))
        self.assertTrue(any('与下段同页' in str(r['new']) for r in rows))
        self.assertTrue(any('https://example.org/v1' in str(r['new']) for r in rows))
        self.assertTrue(any(r['sheet']=='表格 1' and '斜体' in str(r['new']) for r in rows))
    def test_word_unchanged_styles_ignore_split_runs(self):
        for n,path in enumerate([self.a,self.b]):
            d=Document();p=d.add_paragraph()
            for text in (['工程','验收'] if n else ['工程验收']):p.add_run(text).bold=True
            d.save(path)
        self.assertEqual(self.diff('.docx'),[])
    def test_pdf_form_fields_and_bookmarks(self):
        for n,path in enumerate((self.a,self.b)):
            w=PdfWriter();w.add_blank_page(200,200);w.add_blank_page(200,200)
            child=DictionaryObject()
            for key,val in [('T','批号'),('TU','提示'+str(n)),('V','P0'+str(n)),('DV',str(n))]:
                child[NameObject('/'+key)]=TextStringObject(val)
            child[NameObject('/FT')]=NameObject('/Ch' if n else '/Tx')
            child[NameObject('/Opt')]=ArrayObject([TextStringObject('选项'+str(n))])
            child[NameObject('/MaxLen')]=NumberObject(5+n)
            child[NameObject('/Ff')]=NumberObject(n)
            parent=DictionaryObject({NameObject('/T'):TextStringObject('收货'),NameObject('/Kids'):ArrayObject([w._add_object(child)])})
            w.root_object[NameObject('/AcroForm')]=DictionaryObject({NameObject('/Fields'):ArrayObject([w._add_object(parent)])})
            w.add_outline_item('批次记录',n);w.write(path);w.close()
        rows=self.diff('.pdf')
        self.assertEqual({r['location'] for r in rows if r['sheet']=='表单 · 收货.批号'},{'字段类型','填写提示','当前值','默认值','可选项','长度上限','字段标志'})
        self.assertTrue(any(r['sheet']=='书签' and '第 2 页' in r['new'] for r in rows))
    def test_animated_frames_timing_and_loop(self):
        for n,path in enumerate([self.a,self.b]):
            a=Image.new('RGB',(5,5),'red');b=Image.new('RGB',(5,5),'blue' if n else 'green')
            a.save(path,'GIF',save_all=True,append_images=[b],duration=[100,200+100*n],loop=n)
        rows=self.diff('.gif')
        self.assertEqual({(r['sheet'],r['location']) for r in rows},{('第 2 帧','像素摘要'),('第 2 帧','显示时长（毫秒）'),('动画','循环次数')})
    def odf(self,path,body,n=0):
        ns=' '.join(f'xmlns:{k}="{v}"' for k,v in opendocument.NS.items())
        with zipfile.ZipFile(path,'w') as z:
            z.writestr('content.xml',f'<office:document-content {ns}><office:body>{body}</office:body></office:document-content>')
            z.writestr('meta.xml',f'<office:document-meta {ns}><dc:title>指引{n}</dc:title></office:document-meta>')
            z.writestr('Pictures/图.png',bytes([n]))
    def test_odt_structured_text_and_assets(self):
        for n,path in enumerate([self.a,self.b]):
            self.odf(path,f'<office:text><text:h text:outline-level="{n+1}">总则</text:h><text:p text:style-name="S{n}">编号<text:s text:c="2"/><text:tab/>{n}<text:line-break/><text:a xlink:href="#p{n}">附件</text:a></text:p></office:text>',n)
        rows=self.diff('.odt')
        self.assertEqual({r['sheet'] for r in rows},{'段落样式','标题层级','正文','段落链接','文档属性','内嵌图片'})
        self.assertIn('  \t1\n',next(r['new'] for r in rows if r['sheet']=='正文'))
    def test_ods_intervals_types_and_limits(self):
        for n,path in enumerate([self.a,self.b]):
            self.odf(path,f'<office:spreadsheet><table:table table:name="库存"><table:table-row table:number-rows-repeated="99"/><table:table-row table:number-rows-repeated="2"><table:table-cell table:number-columns-repeated="3"/><table:table-cell table:formula="of:={n}" office:value-type="float" office:value="{n}"><text:p>数量{n}</text:p></table:table-cell></table:table-row></table:table></office:spreadsheet>')
        rows=self.diff('.ods')
        self.assertEqual(len(rows),6);self.assertTrue(any(r['location']=='第 101 行 · 第 4 列 · 公式' for r in rows))
        self.odf(self.b,'<office:spreadsheet><table:table><table:table-row table:number-rows-repeated="1000000"><table:table-cell office:value="1"/></table:table-row></table:table></office:spreadsheet>')
        with self.assertRaisesRegex(ValueError,'展开'):self.diff('.ods')
    def test_odp_frames_and_notes(self):
        for n,path in enumerate([self.a,self.b]):
            self.odf(path,f'<office:presentation><draw:page draw:name="P{n}"><draw:frame><draw:text-box><text:p>页{n}</text:p></draw:text-box></draw:frame><presentation:notes><text:p>注{n}</text:p></presentation:notes></draw:page></office:presentation>')
        self.assertEqual({r['location'] for r in self.diff('.odp')},{'名称','演讲者备注','文本框 1'})
    def test_grid_jump_two_axes_and_details(self):
        for n,path in enumerate([self.a,self.b]):
            b=Workbook();s=b.active
            s.append(['编号']+[f'列{k}' for k in range(2,30)])
            for i in range(2,89):s.append([f'P{i}']+[1]*28)
            s['AC80'].comment=Comment('注'+str(n),'仓库');b.save(path);b.close()
        view=WorkbookView(self.a,self.b,'.xlsx','aligned')
        for mode,query in [('old','ac80'),('new','AC80'),('key','P80')]:
            result=view.page(dict(locate=mode,target=query))
            self.assertTrue(result['expanded']);self.assertEqual(result['page'],3)
            hit=next(r for r in result['rows'] if r['target'])
            self.assertEqual(hit['paired_new'],80)
            if mode!='key':
                self.assertEqual(result['col_page'],3)
                self.assertIn('注0',hit['cells'][-1]['detail'])
        with self.assertRaises(ValueError):view.page(dict(target='AC1000'))
        self.assertEqual(result['summary']['修改行'],1)


class Workflow(Work):
    def setUp(self):
        super().setUp()
        self.root=self.base/'资料';self.root.mkdir()
        self.s=Store(self.base/'数据');self.api=Service(self.s)
        self.rid=self.s.configure(self.root)
        self.file=self.root/'受控台账.txt'
        for n in [1,2,3]:
            self.file.write_text('保存'+str(n));self.s.scan(self.rid)
            while self.s.parse_one():pass
    def call(self,cmd,**a):return self.api.dispatch(cmd,a)
    def admin(self,password='test-admin-passphrase'):
        with patch('getpass.getpass',side_effect=[password,password]):record_admin.initialize(self.s)
        return password
    def test_review_states_scope_and_optimistic_updates(self):
        self.assertEqual(self.call('review_queue')['total'],2)
        self.assertEqual(self.call('review_queue',baseline=True)['total'],3)
        self.assertEqual(self.call('review_queue',latest=True)['total'],1)
        vid=self.call('review_queue')['items'][0]['id']
        opt=dict(id=vid,state='需跟进',note='复查批号',revision=0)
        self.call('save_review',**opt);self.call('save_review',**opt)
        with self.assertRaisesRegex(ValueError,'已更新'):self.call('save_review',**{**opt,'state':'已复核'})
        with self.assertRaisesRegex(ValueError,'跟进'):self.call('save_review',**{**opt,'note':' '})
        self.assertEqual(self.call('audit',action='更新版本复核')['total'],1)
        row=self.call('review_queue',q='批号',root=self.rid,ext='TXT',status='已解析',state='需跟进')['items'][0]
        self.assertEqual(row['revision'],1);self.assertTrue(row['reviewed_at'])
        self.call('save_review',id=vid,state='已复核',note='已核对',revision=1)
        self.assertEqual(self.call('history',id=row['file_id'])[0]['review'],'已复核')
        self.assertEqual(self.call('review_queue',state='需跟进')['counts']['已复核'],1)
    def test_favorite_survives_rename_but_not_new_file(self):
        f=self.call('files')['items'][0]
        self.call('star_file',id=f['id'],starred=True)
        self.file.rename(self.root/'新名.txt');self.s.scan(self.rid)
        self.file.write_text('新文件');self.s.scan(self.rid)
        self.assertEqual([r['rel'] for r in self.call('files',starred=True)['items']],['新名.txt'])
        self.assertEqual(self.call('review_queue',starred=True,baseline=True)['total'],3)
        self.call('star_file',id=f['id'],starred=False);self.assertEqual(self.call('files',starred=True)['total'],0)
    def test_export_review_and_storage(self):
        f=self.call('review_queue')['items'][0]
        self.call('save_review',id=f['id'],state='需跟进',note='=公式按文字导出',revision=0)
        dest=self.base/'结果.csv';self.call('export_review',state='需跟进',path=str(dest))
        with dest.open(encoding='utf-8-sig') as src:records=list(csv.DictReader(src))
        self.assertEqual(len(records),1);self.assertTrue(records[0]['复核备注'].startswith("'="))
        (self.root/'副本.txt').write_bytes(self.file.read_bytes());self.s.scan(self.rid)
        s=self.call('storage');self.assertEqual(s['logical']-s['unique'],self.file.stat().st_size)
        self.assertEqual(s['saved'],self.file.stat().st_size);self.assertTrue(s['free']>0 and s['database']>0)
        self.assertEqual(sum(r['bytes'] for r in s['by_root']),s['logical'])
    def test_admin_withdraw_every_public_event_surface_and_restore(self):
        password=self.admin();evt=self.call('events')['items'][0];eid=evt['id']
        def amend(rev,action,caption=''):
            return self.call('record_amend',id=eid,password=password,revision=rev,action=action,reason='仅管理人员核查',caption=caption)
        amend(0,'更正','重复保存，已复核');self.assertEqual(self.call('events')['items'][0]['caption'],'重复保存，已复核')
        amend(1,'撤回')
        public=self.call('events')['items'][0];self.assertEqual(public['kind'],'已撤回')
        for key in ('file_id','current_rel','root','old_v','new_v','sha','caption','old_rel','source','ext'):
            self.assertFalse(public.get(key),key)
        self.assertEqual(self.call('summary')['recent'][0]['kind'],'已撤回')
        self.assertNotIn(eid,[r['id'] for r in self.call('events',q=self.file.name)['items']])
        p=self.base/'公开.csv';self.call('export',path=str(p),kind='已撤回')
        self.assertNotIn(self.file.name,p.read_text(encoding='utf-8-sig'))
        self.assertFalse(any('仅管理人员核查' in r['note'] for r in self.call('audit')['items']))
        with self.assertRaises(ValueError):self.call('record_detail',id=eid,password='wrong')
        with self.assertRaisesRegex(ValueError,'已更新'):amend(1,'恢复展示')
        detail=self.call('record_detail',id=eid,password=password);self.assertEqual(detail['original']['rel'],self.file.name)
        self.assertEqual(len(detail['changes']),2)
        amend(2,'恢复展示');self.assertEqual(self.call('events')['items'][0]['caption'],'重复保存，已复核')
        self.assertEqual(self.call('history',id=evt['file_id'])[0]['sha'],evt['sha'])
    def test_private_backup_and_credentials(self):
        pwd=self.admin();dest=self.base/'备份.zip'
        with self.assertRaises(ValueError):self.call('backup',path=str(dest))
        self.assertFalse(dest.exists())
        self.call('backup',path=str(dest),password=pwd)
        self.assertTrue(self.call('inspect_backup',path=str(dest))['manifest'])
        self.assertNotIn(pwd,json.dumps(self.call('summary'),ensure_ascii=False))
        with patch('getpass.getpass',side_effect=['wrong']):
            with self.assertRaisesRegex(ValueError,'不正确'):record_admin.initialize(self.s)
        for _ in range(5):
            with self.assertRaises(ValueError):self.call('record_detail',id=1,password='wrong')
        with self.assertRaisesRegex(ValueError,'过多'):self.call('record_detail',id=1,password=pwd)
    def test_backup_manifest_and_legacy_validation(self):
        path=self.base/'原件.zip';self.s.backup(path)
        for change in ['legacy','manifest','missing','content','length']:
            result=self.base/(change+'.zip')
            with zipfile.ZipFile(path) as src,zipfile.ZipFile(result,'w') as out:
                for name in src.namelist():
                    data=src.read(name)
                    if name==backup_check.MANIFEST:
                        if change=='legacy':continue
                        if change=='manifest':
                            obj=json.loads(data);obj['objects']+=1;data=json.dumps(obj).encode()
                    if name.startswith('objects/'):
                        if change=='missing':continue
                        if change=='content':data=b'x'*len(data)
                        if change=='length':data+=b'x'
                    out.writestr(name,data)
            if change=='legacy':self.assertFalse(backup_check.inspect(result)['manifest'])
            else:
                with self.assertRaises(ValueError):backup_check.inspect(result)
                with self.assertRaises(ValueError):restore_backup(result,self.s.home)
                self.assertEqual(self.call('files')['total'],1)
    def test_independent_engine_without_ui_requests(self):
        from tests_helper import RpcProcess
        with RpcProcess(self.base/'另一仓库') as proc:
            proc.call('settings',{'interval':5,'theme':'浅色','autostart':False})
            proc.call('configure',{'path':str(self.root)})
            proc.until(lambda:proc.call('files')['total']==1)
            self.file.write_text('关窗后的保存')
            # Observe SQLite through an independent read-only connection, never touch the worker's IPC.
            deadline=time.monotonic()+12
            database=(self.base/'另一仓库'/'fileguard.db').as_uri()
            with closing(sqlite3.connect(database+'?mode=ro',uri=True)) as db:
                while db.execute('SELECT count(*) FROM versions').fetchone()[0]<2 and time.monotonic()<deadline:
                    time.sleep(.15)
                self.assertEqual(db.execute('SELECT count(*) FROM versions').fetchone()[0],2)
