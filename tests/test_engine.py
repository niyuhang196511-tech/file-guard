import contextlib
import io
import json
import os
import shutil
import sqlite3
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

from openpyxl import Workbook,load_workbook
from openpyxl.comments import Comment
from openpyxl.styles import Font
from openpyxl.worksheet.datavalidation import DataValidation
from docx import Document
from pptx import Presentation
from pypdf import PdfWriter
from engine import formats
from engine.store import FileChanging,Store,digest
from engine.shared_read import open_snapshot_source,replace_guarded_file
from engine.service import Service
from engine.maintenance import restore_backup,workspace_lock


def xlsx(path,qty):
    book=Workbook()
    s=book.active;s.title='库存表'
    s['A1']='产品';s['B1']='数量';s['C1']='现存量';s['A2']='移动滑垫';s['C2']=qty
    s['D2']=12.5;s['E2']='=C2*D2'
    book.save(path);book.close()


def later_ctime(info):
    return SimpleNamespace(st_dev=info.st_dev, st_ino=info.st_ino, st_size=info.st_size,
                           st_mtime_ns=info.st_mtime_ns, st_ctime_ns=info.st_ctime_ns+100)


class EngineTest(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.base=Path(self.tmp.name);self.root=self.base/'仓库';self.root.mkdir()
        self.store=Store(self.base/'数据');self.api=Service(self.store)
        self.rid=self.store.configure(self.root)
    def scan(self):
        self.store.scan(self.rid)
        while self.store.parse_one():
            pass
    def events(self):
        return self.api.dispatch('events',{})['items']
    def files(self):
        return self.api.dispatch('files',{})['items']
    def versions(self):
        return self.api.dispatch('history',{'id':self.files()[0]['id']})
    def edit_file(self):
        f=self.root/'库存台账.xlsx';xlsx(f,100);self.scan();xlsx(f,80);self.scan()
        return f
    def test_excel_cell_and_persistence(self):
        self.edit_file();v,u=self.versions()
        self.assertEqual((v['num'],u['num']),(2,1))
        other=Service(Store(self.store.home))
        diff=other.dispatch('compare',{'old':u['id'],'new':v['id']})
        self.assertEqual(diff['items'],[{'sheet':'库存表','location':'C2','kind':'修改','old':'100','new':'80',
                                         'field':'现存量','category':'单元格值','old_type':'数字','new_type':'数字'}])
    def test_initial_excluded_from_today(self):
        xlsx(self.root/'台账.xlsx',100);self.scan();s=self.api.dispatch('summary',{})
        self.assertEqual((s['today'],s['files'],s['versions']),(0,1,1))
    def test_formula_format_comment_merge_validation(self):
        f=self.root/'台账.xlsx';xlsx(f,100);self.scan()
        w=load_workbook(f);s=w.active;s['E2']='=ROUND(C2*D2,2)';s['C2'].font=Font(bold=True);s['C2'].comment=Comment('复核','仓库');s.merge_cells('G3:H3')
        dv=DataValidation(type='whole',formula1=0);s.add_data_validation(dv);dv.add('C2')
        w.save(f);w.close();self.scan()
        v,u=self.versions();ds=self.api.dispatch('compare',{'old':u['id'],'new':v['id']})
        self.assertTrue({'C2 · 格式','C2 · 批注','合并 G3:H3','数据验证 C2','E2'}<={d['location'] for d in ds['items']})
    def test_metadata_no_new_version(self):
        f=self.root/'A.txt';f.write_text('相同',encoding='utf-8');self.scan()
        t=f.stat().st_mtime_ns+3_000_000_000;os.utime(f,ns=(t,t));self.scan()
        self.assertEqual(len(self.versions()),1);self.assertEqual(self.events()[0]['kind'],'属性修改')
    def test_move_and_rename(self):
        f=self.root/'a.bin';f.write_bytes(b'abc');self.scan()
        other=self.root/'b.bin';f.rename(other);self.scan()
        dest=self.root/'子目录';dest.mkdir();other.rename(dest/'b.bin');self.scan()
        self.assertEqual([e['kind'] for e in self.events()],['移动','重命名','初始建档'])
        self.assertEqual(len(self.versions()),1)
    def test_snapshot_dedup(self):
        for name in ('a.bin','b.bin'):
            (self.root/name).write_bytes(b'123')
        self.scan();self.assertEqual(len(list(self.store.objects.glob('*/*'))),1)
    @unittest.skipUnless(os.name=='nt','需要 Windows 路径和句柄时间语义')
    def test_windows_capture_and_receipt_with_different_ctimes(self):
        path=self.root/'台账.txt'
        path.write_bytes(b'archive this')
        handle_info=later_ctime(path.stat())
        with patch('engine.store.os.fstat',return_value=handle_info):
            self.scan()
            fid=self.files()[0]['id']
            receipt=self.api.dispatch('save_receipt',{'id':fid,'mode':'full'})
        self.assertEqual(receipt['result'],'已记入最新版本')
        self.assertEqual(self.store.obj(receipt['disk_sha']).read_bytes(),b'archive this')
    def test_capture_rejects_ctime_change_on_open_handle(self):
        path=self.root/'台账.txt'
        path.write_bytes(b'archive this')
        before=path.stat()
        with patch('engine.store.os.fstat',side_effect=[before,later_ctime(before)]):
            with self.assertRaisesRegex(FileChanging,'读取期间文件发生变化'):
                self.store.capture(path)
        self.assertFalse(list(self.store.temp.iterdir()))
        self.assertFalse(list(self.store.objects.iterdir()))
    def test_capture_rejects_path_replacement_before_and_after_open(self):
        for before_open,error in ((True,'文件正在替换'),(False,'文件写入中')):
            with self.subTest(before_open=before_open):
                path=self.root/'台账.txt'
                path.write_bytes(b'old')
                replacement=self.root/'新台账.txt'
                replacement.write_bytes(b'new')
                before=path.stat()
                os.utime(replacement,ns=(before.st_atime_ns,before.st_mtime_ns))

                @contextlib.contextmanager
                def replace_on_open(source_path):
                    if before_open:
                        replacement.replace(source_path)
                    with open_snapshot_source(source_path) as stream:
                        yield stream
                    if not before_open:
                        replacement.replace(source_path)

                with patch('engine.store.open_snapshot_source',replace_on_open):
                    with self.assertRaisesRegex(FileChanging,error):
                        self.store.capture(path)
                self.assertFalse(list(self.store.objects.iterdir()))
    def test_restore_saves_dirty_file(self):
        f=self.edit_file();v,u=self.versions();xlsx(f,55)
        self.store.restore(u['id']);self.assertEqual(digest(f),u['sha'])
        cur=self.versions();self.assertEqual(len(cur),4)
        self.assertEqual([e['kind'] for e in self.events()][:2],['历史恢复','恢复前快照'])
        with self.store.obj(cur[1]['sha']).open('rb') as stream:
            book=load_workbook(stream);self.assertEqual(book.active['C2'].value,55);book.close()
    def test_restore_deleted_file(self):
        f=self.edit_file();v,u=self.versions();f.unlink();self.scan();self.assertEqual(self.files(),[])
        self.store.restore(u['id']);self.assertEqual(digest(f),u['sha']);self.assertEqual(self.versions()[0]['num'],3)
    def test_restore_rejects_corrupt_object(self):
        f=self.edit_file();v,u=self.versions();self.store.obj(u['sha']).write_bytes(b'bad')
        with self.assertRaises(ValueError): self.store.restore(u['id'])
        self.assertEqual(digest(f),v['sha'])
    def test_restore_rejects_reused_path(self):
        f=self.edit_file();v,u=self.versions();f.unlink();self.scan();xlsx(f,123);self.scan()
        with self.assertRaises(ValueError):self.store.restore(u['id'])
    def test_exclusions_pause_resume_remove(self):
        f=self.root/'工单.txt';f.write_text('a');(self.root/'b.tmp').write_text('b')
        self.store.configure(self.root,'*.tmp',root_id=self.rid);self.scan()
        self.assertEqual([x['rel'] for x in self.files()],[f.name])
        self.store.root_action(self.rid,'暂停');f.write_text('changed');self.scan();self.assertEqual(len(self.versions()),1)
        self.store.root_action(self.rid,'继续');self.scan();self.assertEqual(len(self.versions()),2)
        self.store.root_action(self.rid,'移除');self.assertFalse(self.files())
        self.assertEqual(self.api.dispatch('files',{'history':True})['total'],1)
    def test_offline_is_not_deleted(self):
        (self.root/'a.txt').write_text('a');self.scan();self.root.rename(self.base/'已断开');self.scan()
        self.assertEqual(len(self.events()),1);self.assertTrue(self.api.dispatch('roots',{})[0]['error'])
    def test_parser_failure_isolation(self):
        f=self.root/'bad.xlsx';f.write_bytes(b'first');self.scan();f.write_bytes(b'second')
        other=self.root/'记录.txt';other.write_text('test');self.scan()
        self.assertEqual(self.api.dispatch('summary',{})['failures'],1);self.assertEqual(len(self.files()),2)
    def test_backup_roundtrip(self):
        self.edit_file();backup=self.base/'备份.zip';self.store.backup(backup)
        dest=self.base/'另一个仓库';dest.mkdir();(dest/'旧标识').touch()
        former=restore_backup(backup,dest);self.assertTrue((Path(former)/'旧标识').exists())
        restored=Store(dest);self.assertIn('2 个历史对象',restored.verify())
        self.assertEqual(Service(restored).dispatch('summary',{})['versions'],2)
    def test_backup_rejects_damage_before_swap(self):
        self.edit_file();backup=self.base/'正常.zip';self.store.backup(backup);bad=self.base/'损坏.zip'
        with zipfile.ZipFile(backup) as src,zipfile.ZipFile(bad,'w') as dst:
            for name in src.namelist():
                dst.writestr(name,b'broken' if name.startswith('objects/') else src.read(name))
        with self.assertRaises(ValueError):restore_backup(bad,self.store.home)
        self.assertEqual(len(self.versions()),2)
    def test_workspace_guard(self):
        with workspace_lock(self.store.home):
            with self.assertRaises(ValueError):
                with workspace_lock(self.store.home): pass
    def test_overlap_rejected(self):
        for path in [self.root,self.base,self.store.objects]:
            with self.assertRaises(ValueError):self.store.configure(path)
    def test_export_filtered_log_and_copy(self):
        self.edit_file();dest=self.base/'筛选.csv'
        self.api.dispatch('export',{'path':dest,'kind':'内容修改'})
        self.assertEqual(len(dest.read_text(encoding='utf-8-sig').splitlines()),2)
        v=self.versions()[-1];copy=self.base/'另存.xlsx';self.store.export_copy(v['id'],copy)
        self.assertEqual(digest(copy),v['sha'])
        with self.assertRaises(FileExistsError):self.store.export_copy(v['id'],copy)
    def test_full_scan_catches_same_time_same_size(self):
        f=self.root/'a.txt';f.write_text('a');self.scan();s=f.stat()
        f.write_text('b');os.utime(f,ns=(s.st_atime_ns,s.st_mtime_ns));self.scan()
        self.assertEqual(len(self.versions()),2)
    def test_text_and_structured_formats(self):
        for ext,a,b,loc in [('.json','{"a":1}','{"a":2}','/a'),('.xml','<a x="1"/>','<a x="2"/>','/a/@x'),('.yaml','a: 1','a: 2','/a'),('.csv','材料,10','材料,11','第 1 行 · 第 2 列'),('.txt','一\n二','一\n三','旧 2 行 / 新 2 行')]:
            with self.subTest(ext=ext):
                p=self.base/'旧';q=self.base/'新';p.write_text(a,encoding='utf-8');q.write_text(b,encoding='utf-8')
                self.assertEqual(formats.compare(p,q,ext)[1][0]['location'],loc)
    def test_office_word_slides_pdf(self):
        for ext in ['.docx','.pptx','.pdf']:
            paths=[]
            for idx in [1,2]:
                p=self.base/(str(idx)+ext);paths.append(p)
                if ext=='.docx':
                    d=Document();d.add_paragraph(str(idx));d.add_table(1,1).cell(0,0).text=str(idx);d.save(p)
                if ext=='.pptx':
                    d=Presentation();s=d.slides.add_slide(d.slide_layouts[0]);s.shapes.title.text=str(idx);d.save(p)
                if ext=='.pdf':
                    d=PdfWriter()
                    for _ in range(idx):d.add_blank_page(width=100,height=100)
                    d.write(p);d.close()
            self.assertTrue(formats.compare(*paths,ext)[1])
    @unittest.skipUnless(os.name=='nt','需要 Windows 独占句柄')
    def test_windows_locked_restore(self):
        import ctypes
        from ctypes import wintypes
        f=self.edit_file();v,u=self.versions()
        k=ctypes.WinDLL('kernel32',use_last_error=True)
        k.CreateFileW.argtypes=[wintypes.LPCWSTR,wintypes.DWORD,wintypes.DWORD,ctypes.c_void_p,wintypes.DWORD,wintypes.DWORD,wintypes.HANDLE]
        k.CreateFileW.restype=wintypes.HANDLE;k.CloseHandle.argtypes=[wintypes.HANDLE]
        handle=k.CreateFileW(str(f),0x80000000,0,None,3,0x80,None)
        self.assertNotEqual(handle,ctypes.c_void_p(-1).value)
        try:
            with self.assertRaises(OSError):self.store.restore(u['id'])
        finally:k.CloseHandle(handle)
        self.assertEqual(digest(f),v['sha'])
    @unittest.skipUnless(os.name=='nt','需要 Windows 独占句柄')
    def test_windows_restore_replaces_target_while_guard_remains_active(self):
        path=self.edit_file()
        latest,initial=self.versions()
        prior_bytes=path.read_bytes()

        def replace_while_guarded(source,target):
            with self.assertRaises(PermissionError):
                with target.open('r+b'):
                    pass
            with open_snapshot_source(target) as old_reader:
                replace_guarded_file(source,target)
                self.assertEqual(old_reader.read(),prior_bytes)

        with patch('engine.store.replace_guarded_file',side_effect=replace_while_guarded):
            self.store.restore(initial['id'])
        self.assertEqual(digest(path),initial['sha'])
        self.assertEqual(self.versions()[1]['id'],latest['id'])


if __name__=='__main__':
    unittest.main()

