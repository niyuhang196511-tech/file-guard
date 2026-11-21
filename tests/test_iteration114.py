import csv
from datetime import date
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from openpyxl import Workbook

from engine import table_source, backup_check
from engine.service import Service
from engine.store import Store


class Workspace(unittest.TestCase):
    def setUp(self):
        temp=tempfile.TemporaryDirectory();self.addCleanup(temp.cleanup)
        self.base=Path(temp.name);self.root=self.base/'监控';self.root.mkdir()
        self.store=Store(self.base/'Data');self.api=Service(self.store);self.rid=self.store.configure(self.root)
    def call(self,cmd,**args):return self.api.dispatch(cmd,args)
    def file(self,name,value):
        p=self.root/name
        p.write_bytes(value if isinstance(value,bytes) else value.encode())
        return p
    def scan(self):
        self.store.scan(self.rid)
        while self.store.parse_one():pass
    def receipt(self,**args):return self.call('save_receipt',id=1,**args)
    def source(self,**args):return self.call('table_source',id=1,**args)


class Receipt(Workspace):
    def test_disk_save_without_close_and_unchanged_memory(self):
        path=self.file('ledger.csv','id,n\nA,1');self.scan()
        with path.open('r+',encoding='utf-8',newline='') as editor:
            editor.seek(0);editor.write('id,n\nA,2')
            self.assertEqual(self.receipt(mode='full')['result'],'已记入最新版本')
            editor.flush()
            self.assertEqual(self.receipt()['result'],'大小相同，尚未核对内容')
            result=self.receipt(mode='full');self.assertEqual(result['result'],'磁盘内容尚未入库')
            self.assertEqual(result['delta'],0)
            self.assertEqual(len(self.call('history',id=1)),1)
            self.scan();self.assertEqual(self.receipt(mode='full')['version'],2)

    def test_prior_content_and_repeated_version_count(self):
        for val in ['aaa','bbb','aaa','cccc']:
            self.file('f',val);self.scan()
        self.file('f','aaa')
        result=self.receipt(mode='full',object=True)
        self.assertEqual((result['result'],result['matches'],result['matched_version'],result['delta']),('与较早历史版本相同',2,3,-1))
        self.assertEqual(result['object_state'],'历史副本校验通过')
        self.assertEqual(self.receipt()['disk_sha'],None)

    def test_changed_during_hash_not_mistaken_for_saved(self):
        path=self.file('x','word');self.scan()
        import engine.save_receipt as module
        real=module.read_digest
        def race(target,before):
            sha=real(target,before);path.write_text('changed');return sha
        with patch.object(module,'read_digest',side_effect=race):
            item=self.receipt(mode='full');self.assertEqual(item['result'],'读取期间变化');self.assertIsNone(item['disk_sha'])

    def test_queued_waiting_rules_and_paused(self):
        self.file('draft','a');self.scan()
        with self.store.db() as db:
            db.execute("INSERT OR REPLACE INTO waiting_files VALUES(?,?,'等待保存稳定','x','y',4)",(self.rid,'draft'))
            db.execute("INSERT OR REPLACE INTO tasks VALUES(?,0,'手动扫描')",(self.rid,))
            db.execute("UPDATE roots SET patterns='draft' WHERE id=?",(self.rid,))
            db.execute("INSERT OR REPLACE INTO capture_policy VALUES(?,3000,1)",(self.rid,))
        r=self.receipt();self.assertEqual((r['waiting']['attempts'],r['queued'],r['rule'],r['settle_ms']), (4,'手动扫描','规则排除文件',3000))
        self.store.root_action(self.rid,'暂停');self.assertFalse(self.receipt()['active'])

    def test_deleted_reappeared_and_other_file_identity(self):
        f=self.file('old','one');self.scan();f.unlink();self.scan()
        self.assertEqual(self.receipt()['result'],'原路径缺失')
        self.file('old','two')
        self.assertIn('尚未确认身份',self.receipt(mode='full')['result'])
        self.scan();self.assertIn('其他文件占用',self.receipt(mode='full')['result'])

    def test_offline_link_and_directory(self):
        p=self.file('f','a');self.scan()
        offline=self.base/'away';self.root.rename(offline)
        self.assertEqual(self.receipt()['result'],'监控目录离线')
        offline.rename(self.root);p.unlink();p.mkdir()
        self.assertEqual(self.receipt()['result'],'原路径不是普通文件');p.rmdir()
        try:p.symlink_to(self.base/'outside')
        except OSError:self.skipTest('文件系统不允许链接')
        self.assertEqual(self.receipt(mode='full')['result'],'已跳过链接路径')

    def test_independent_historical_copy_check_and_io_error(self):
        self.file('a','good');self.scan();sha=self.receipt()['sha'];self.store.obj(sha).write_bytes(b'evil')
        r=self.receipt(mode='full',object=True)
        self.assertEqual(r['result'],'已记入最新版本');self.assertIn('损坏',r['object_state'])
        with patch('engine.save_receipt.read_digest',side_effect=PermissionError):
            self.assertEqual(self.receipt(mode='full')['result'],'文件被占用或无读取权限')

    def test_concurrent_index_change_invalidates_receipt(self):
        path=self.file('f','abc');self.scan()
        from engine import save_receipt
        orig=save_receipt.read_digest
        def observed(p,s):
            sha=orig(p,s)
            with self.store.db() as db:db.execute("UPDATE files SET rel='next' WHERE id=1")
            return sha
        with patch('engine.save_receipt.read_digest',side_effect=observed):
            r=self.receipt(mode='full');self.assertIn('在册状态已更新',r['result']);self.assertIsNone(r['disk_sha'])


class Inputs(Workspace):
    def test_saved_snapshot_csv_bom_quotes_and_empty_records(self):
        path=self.file('f.csv','sep=;\n编号;名称;备注\n001;"含;分隔";"两\n行"\n\n002;末项;\n'.encode('utf-8-sig'));self.scan()
        path.write_text('不同的现场',encoding='utf8')
        result=self.source();self.assertEqual(result['width'],3)
        rows=result['rows'];self.assertEqual(rows[1],[['文本','001'],['文本','含;分隔'],['文本','两\n行']])
        self.assertEqual(rows[2],[]);self.assertEqual(rows[3][-1],['文本',''])
        self.assertEqual(result['num'],1)

    def test_semicolon_csv_keeps_long_quoted_records_and_version_differences(self):
        old_note='第一行\r\n'+'a'*9000+'\r\n原备注'
        new_note=old_note.removesuffix('原备注')+'新备注'
        for note in (old_note,new_note):
            self.file('f.csv',f'编号;备注\r\nA;"{note}"\r\nB;完成\r\n')
            self.scan()

        source=self.source()
        self.assertEqual(source['width'],2)
        self.assertEqual(source['rows'], [
            [['文本','编号'],['文本','备注']],
            [['文本','A'],['文本',old_note]],
            [['文本','B'],['文本','完成']],
        ])
        change,=self.call('compare',old=1,new=2)['items']
        self.assertEqual((change['record_key'],change['field'],change['old'],change['new']),
                         ('A','备注',old_note,new_note))

    def test_semicolon_csv_after_leading_blank_record(self):
        self.file('f.csv','\r\n编号;备注\r\nA;完成\r\n')
        self.scan()

        source=self.source()
        self.assertEqual(source['width'],2)
        self.assertEqual(source['rows'], [
            [],
            [['文本','编号'],['文本','备注']],
            [['文本','A'],['文本','完成']],
        ])

    def test_existing_cached_csv_differences_are_reparsed_once(self):
        self.file('f.csv','编号;数量\r\nA;2\r\n')
        self.file('f.txt','原文')
        self.scan()
        self.file('f.csv','编号;数量\r\nA;3\r\n')
        self.file('f.txt','新文')
        self.scan()
        with self.store.db() as db:
            db.execute('DROP TABLE IF EXISTS data_migrations')
            db.execute("UPDATE versions SET details=? WHERE ext='.csv' AND parent_id IS NOT NULL",
                       (json.dumps([{'field':'旧缓存'}]),))

        self.store=Store(self.store.home)
        self.api=Service(self.store)
        with self.store.db() as db:
            states=[tuple(row) for row in db.execute('SELECT ext,status FROM versions WHERE parent_id IS NOT NULL ORDER BY ext')]
            self.assertEqual(db.execute("SELECT details FROM versions WHERE ext='.csv' AND parent_id IS NOT NULL").fetchone()[0],'[]')
            self.assertEqual(db.execute('PRAGMA user_version').fetchone()[0],11)
        self.assertEqual(states,[('.csv','待解析'),('.txt','已解析')])
        self.assertTrue(self.store.parse_one())
        self.assertFalse(self.store.parse_one())

        self.store=Store(self.store.home)
        self.api=Service(self.store)
        self.assertFalse(self.store.parse_one())
        with self.store.db() as db:
            versions=db.execute("SELECT id,details FROM versions WHERE ext='.csv' ORDER BY num").fetchall()
        change,=self.call('compare',old=versions[0]['id'],new=versions[1]['id'])['items']
        cached,=json.loads(versions[1]['details'])
        self.assertEqual((change['field'],change['old'],change['new']),('数量','2','3'))
        self.assertEqual((cached['field'],cached['old'],cached['new']),('数量','2','3'))

    def test_tsv_and_legacy_chinese_encoding(self):
        self.file('单.tsv','编号\t领料\nA\t包装盒'.encode('gb18030'));self.scan()
        self.assertEqual(self.source()['rows'][1][1],['文本','包装盒'])
        with self.assertRaises(ValueError):self.source(sheet='other')

    def test_excel_types_hidden_sheets_offset_and_corrupt_object(self):
        b=Workbook();hidden=b.active;hidden.title='隐藏';hidden['A1']='辅助';main=b.create_sheet('业务');hidden.sheet_state='hidden'
        main.append(['标题']);main.append(['编号','数量','日期','启用','公式','错误']);main.append(['001',23,date(2026,11,21),True,'=B3*2','#DIV/0!'])
        b.save(self.root/'book.xlsx');b.close();self.scan()
        source=self.source();self.assertEqual(source['sheet'],'业务')
        self.assertEqual([c[0] for c in source['rows'][2]],['文本','数值','日期时间','布尔','公式','错误'])
        self.assertEqual(self.source(sheet='隐藏')['rows'][0][0][1],'辅助')
        with patch.object(table_source,'MAX_ROWS',1):
            oversized=self.source(report_problem=True)
            self.assertIn('业务',oversized['sheets']);self.assertTrue(oversized['problem'])
            self.assertEqual(self.source(sheet='隐藏')['width'],1)
        self.store.obj(source['sha']).write_bytes(b'broken')
        with self.assertRaises(ValueError):self.source()

    def test_input_limits_no_partial_table(self):
        self.file('x.csv','id,v\nx,012345\ny,3');self.scan()
        for opt,v in [('MAX_ROWS',2),('MAX_COLUMNS',1),('MAX_SLOTS',3),('MAX_TEXT',4)]:
            with self.subTest(opt=opt),patch.object(table_source,opt,v),self.assertRaises(ValueError):self.source()
        with self.assertRaises(ValueError):self.call('table_source',id=999)

    def test_export_literal_utf8_no_overwrite_and_atomic_error(self):
        file=self.base/'out.csv'
        self.call('ledger_csv',path=str(file),rows=[['业务值','行'],['=SUM(A1)',3],['含,引号"','两\n行']])
        with file.open(encoding='utf-8-sig') as f:self.assertEqual(list(csv.reader(f))[1:], [["'=SUM(A1)",'3'],['含,引号"','两\n行']])
        with self.assertRaises(FileExistsError):self.call('ledger_csv',path=str(file),rows=[['复写']])
        bad=self.base/'bad.csv'
        with self.assertRaises(ValueError):self.call('ledger_csv',path=str(bad),rows=[['头'],[{}]])
        self.assertFalse(bad.exists())
        for dest in (self.store.home/'inside.csv',self.base/'bad.txt'):
            with self.assertRaises(ValueError):self.call('ledger_csv',path=str(dest),rows=[['a']])


class Templates(Workspace):
    @staticmethod
    def config():return dict(left=['id','数量'],right=['ID','数量'],keys=[dict(l=0,r=0)],pairs=[dict(l=1,r=1,use=True)],typed=True)
    def test_template_roundtrip_restart_protected_fields_and_delete(self):
        cfg=self.config();cfg.update(rows=['DATA'],root='sensitive')
        id=self.call('ledger_save',name='月核',config=cfg)
        self.api=Service(Store(self.store.home))
        r=self.call('ledger_templates')[0]
        self.assertEqual((r['id'],r['name'],r['config']['keys']),(id,'月核',cfg['keys']))
        self.assertNotIn('rows',r['config']);self.assertNotIn('root',r['config'])
        with self.assertRaises(ValueError):self.call('ledger_save',name='月核',config=cfg)
        self.call('ledger_remove',id=id);self.assertFalse(self.call('ledger_templates'))

    def test_invalid_template_keys_column_overlap_and_maximum(self):
        for name,change in [('bad',dict(keys=[])),('bad',dict(keys=[{'l':-1,'r':0}])),('bad',dict(pairs=[dict(l=0,r=1,use=True),dict(l=0,r=0,use=True)])),('',{})]:
            with self.subTest(change=change),self.assertRaises(ValueError):self.call('ledger_save',name=name,config=dict(self.config(),**change))
        for i in range(50):self.call('ledger_save',name=str(i),config=self.config())
        with self.assertRaisesRegex(ValueError,'50'):self.call('ledger_save',name='other',config=self.config())

    def test_v10_migration_and_backup_roundtrip(self):
        with self.store.db() as db:db.execute('DROP TABLE ledger_templates');db.execute('PRAGMA user_version=10')
        old=self.base/'v10.zip';self.store.backup(old)
        self.assertEqual(backup_check.inspect(old)['schema'],10)
        self.api=Service(Store(self.store.home));self.call('ledger_save',name='仓库',config=self.config())
        new=self.base/'v11.zip';self.store.backup(new)
        self.assertEqual(backup_check.inspect(new)['schema'],11)
