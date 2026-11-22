import csv
import json
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from openpyxl import Workbook

from engine.comparison import new_csv
from engine.service import Service
from engine.store import Store


class Iteration12Tests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.base = Path(temp.name)
        self.root = self.base/'业务资料'
        self.root.mkdir()
        self.store = Store(self.base/'版本库')
        self.rid = self.store.configure(self.root)
        self.service = Service(self.store)

    def versions(self):
        with self.store.db() as db:
            return [r[0] for r in db.execute('SELECT id FROM versions ORDER BY id')]

    def test_edit_preserves_pause_and_readd_starts(self):
        self.store.root_action(self.rid,'暂停')
        self.store.configure(self.root,'*.tmp',9,self.rid)
        self.assertFalse(self.service.dispatch('roots',{})[0]['active'])
        with self.store.db() as db:
            self.assertEqual(db.execute('SELECT count(*) FROM tasks').fetchone()[0],0)
        self.store.root_action(self.rid,'移除')
        self.assertEqual(self.store.configure(self.root),self.rid)
        self.assertTrue(self.service.dispatch('roots',{})[0]['active'])

    def test_continuous_notifications_preserve_first_deadline(self):
        with self.store.db() as db:
            db.execute('DELETE FROM tasks')
        for i in range(60):
            with patch('engine.store.time.time',return_value=100+i*.1):
                self.store.queue(self.rid)
        with self.store.db() as db:
            task=db.execute('SELECT due,source FROM tasks').fetchone()
            self.assertAlmostEqual(task[0],100.6)
            self.assertEqual(task[1],'文件监听')

    def test_pure_touch_and_rename_reuse_snapshot(self):
        file=self.root/'检验.bin'
        file.write_bytes(b'data'*512_000)
        self.store.scan(self.rid)
        t=file.stat().st_mtime_ns+1_000_000_000
        os.utime(file,ns=(t,t))
        with patch.object(self.store,'capture',side_effect=AssertionError('触发多余的临时快照')):
            self.store.scan(self.rid)
            file.rename(self.root/'复核.bin')
            self.store.scan(self.rid)
        self.assertEqual(self.versions(),[1])
        events=self.service.dispatch('events',{})['items']
        self.assertEqual([r['kind'] for r in events[:2]],['重命名','属性修改'])

    def test_same_size_edit_not_reused(self):
        file=self.root/'检验.txt';file.write_bytes(b'123');self.store.scan(self.rid)
        stat=file.stat();file.write_bytes(b'456')
        os.utime(file,ns=(stat.st_atime_ns,stat.st_mtime_ns))
        self.store.scan(self.rid)
        self.assertEqual(len(self.versions()),2)

    def test_restore_blocks_unsampled_replacement_after_preview(self):
        file=self.root/'批次.txt';file.write_text('原批次',encoding='utf-8')
        self.store.scan(self.rid)
        file.unlink();self.store.scan(self.rid)
        self.assertFalse(self.service.dispatch('restore_info',{'id':1})['exists'])
        file.write_text('同名新批次',encoding='utf-8')
        for cmd in ('restore_info','restore'):
            with self.assertRaisesRegex(ValueError,'同名'):
                self.service.dispatch(cmd,{'id':1})
        self.assertEqual(file.read_text(encoding='utf-8'),'同名新批次')
        self.assertEqual(self.versions(),[1])
        with self.store.db() as db:
            self.assertEqual(db.execute('SELECT count(*) FROM restores').fetchone()[0],0)

    def test_restore_preview_and_restore_keeps_dirty_version(self):
        file=self.root/'批次.txt';file.write_bytes(b'v1');self.store.scan(self.rid)
        info=self.service.dispatch('restore_info',{'id':1})
        self.assertEqual((info['path'],info['version'],info['size'],info['exists']),(str(file.resolve()),1,2,True))
        file.write_bytes(b'changed')
        self.service.dispatch('restore',{'id':1})
        self.assertEqual(len(self.versions()),3)
        self.assertEqual(file.read_bytes(),b'v1')

    def test_failed_staging_cannot_be_recovered_as_a_success(self):
        file=self.root/'原件.txt'
        file.write_bytes(b'unchanged')
        self.store.scan(self.rid)
        mkstemp=tempfile.mkstemp
        def fail_output(*args,**kwargs):
            if kwargs.get('prefix')=='.fileguard-':
                raise OSError('模拟目标磁盘无法创建临时文件')
            return mkstemp(*args,**kwargs)
        with patch('engine.store.tempfile.mkstemp',side_effect=fail_output):
            with self.assertRaises(OSError):
                self.store.restore(1)
        self.store.recover_intents()
        self.assertEqual(self.versions(),[1])
        self.assertEqual(file.read_bytes(),b'unchanged')
        self.assertEqual(self.service.dispatch('audit',{})['items'][0]['action'],'恢复未写回')

    def ledger(self):
        file=self.root/'库存.xlsx'
        for revised in (False,True):
            book=Workbook()
            sheet=book.active;sheet.title='业务台账'
            sheet.append(['物料编号','复核状态','金额'])
            for i in range(125):
                sheet.append([f'MD-{i:03}',f'待复核 {i:03}' if revised else '已登记',
                              '=1+1' if revised else '=1+0'])
            book.save(file);book.close()
            self.store.scan(self.rid)
        self.assertTrue(self.store.parse_one())
        return dict(old=1,new=2)

    def test_search_and_page_cache(self):
        args=self.ledger()
        with patch('engine.service.json.loads',wraps=json.loads) as deserialize:
            one=self.service.dispatch('compare',{**args,'q':'待复核','page':1})
            two=self.service.dispatch('compare',{**args,'q':'待复核','page':2})
            self.assertEqual((one['total'],two['total'],len(two['items'])),(125,125,40))
            self.assertEqual(deserialize.call_count,1)
        self.assertNotEqual(one['items'][0]['location'],two['items'][0]['location'])
        for term,expected in [('已登记',125),('md-007',2),('业务台账',250),('=1+0',125),('不存在',0)]:
            result=self.service.dispatch('compare',{**args,'q':term,'sheet':'业务台账'})
            self.assertEqual(result['total'],expected)
        self.assertEqual((one['old_number'],one['new_number']),(1,2))

    def test_export_all_filtered_pages_with_formula_text(self):
        args=self.ledger()
        destination=self.base/'差异.csv'
        self.service.dispatch('export_diff',{**args,'path':destination,'kind':'修改','q':'=1+0','page':3})
        data=destination.read_bytes();self.assertTrue(data.startswith(b'\xef\xbb\xbf'))
        with destination.open(encoding='utf-8-sig',newline='') as f:
            exported=list(csv.DictReader(f))
        self.assertEqual(len(exported),125)
        self.assertEqual(len({r['记录编号'] for r in exported}),125)
        self.assertEqual((exported[0]['旧值'],exported[0]['新值']),("'=1+0","'=1+1"))
        self.assertEqual((exported[0]['旧版本'],exported[0]['新版本']),('V1','V2'))
        self.assertIn('125 项',self.service.dispatch('audit',{})['items'][0]['note'])
        with self.assertRaises(FileExistsError):
            self.service.dispatch('export_diff',{**args,'path':destination})
        self.assertEqual(destination.read_bytes(),data)

    def test_empty_and_interrupted_export_leave_no_file(self):
        args=self.ledger()
        destination=self.base/'空.csv'
        with self.assertRaisesRegex(ValueError,'没有可导出'):
            self.service.dispatch('export_diff',{**args,'q':'未命中','path':destination})
        with self.assertRaises(OSError):
            with new_csv(destination) as writer:
                writer.writerow(['部分内容'])
                raise OSError('模拟写入失败')
        self.assertFalse(destination.exists())
        self.assertFalse(list(destination.parent.glob('.fileguard-export-*')))
