import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
import unittest
from pathlib import Path
from engine.store import Store
from engine.service import Service


class LifecycleTest(unittest.TestCase):
    def test_private_worker_restarts_and_scans(self):
        from tests_helper import RpcProcess
        with tempfile.TemporaryDirectory() as tmp:
            base=Path(tmp);root=base/'业务';root.mkdir();f=root/'日志.txt'
            f.write_text('首次保存',encoding='utf-8')
            with RpcProcess(base/'Data') as app:
                app.call('settings',{'interval':5,'theme':'深色','autostart':False})
                app.call('configure',{'path':str(root)})
                app.until(lambda:app.call('files')['total']==1)
                f.write_text('第二次保存',encoding='utf-8')
                app.until(lambda:app.call('summary')['versions']==2)
                app.until(lambda:app.call('events')['items'][0]['status']=='已解析')
                self.assertEqual(app.call('events')['items'][0]['kind'],'内容修改')
            with RpcProcess(base/'Data') as reopened:
                self.assertEqual(reopened.call('summary')['versions'],2)
                self.assertEqual(reopened.call('summary')['settings']['theme'],'深色')

    def test_queue_merge_preserves_requested_full_scan(self):
        with tempfile.TemporaryDirectory() as tmp:
            base=Path(tmp);root=base/'业务';root.mkdir()
            store=Store(base/'Data');rid=store.configure(root)
            store.queue(rid,'手动扫描',0);store.queue(rid,'文件监听')
            with store.db() as db:
                tasks=list(db.execute('SELECT source FROM tasks'))
            self.assertEqual([r[0] for r in tasks],['手动扫描'])

    def test_relocated_repository_does_not_monitor_its_own_data(self):
        from tests_helper import RpcProcess

        with tempfile.TemporaryDirectory() as tmp:
            base = Path(tmp)
            monitored = base / '业务'
            monitored.mkdir()
            (monitored / '记录.txt').write_bytes(b'original content')
            store = Store(base / 'Data')
            rid = store.configure(monitored)
            store.scan(rid)
            nested = Store(monitored / 'RestoredData')
            with store.db() as source, nested.db() as destination:
                source.backup(destination)
            shutil.copytree(store.objects, nested.objects, dirs_exist_ok=True)

            with RpcProcess(nested.home) as process:
                def scan_finished():
                    report = process.call('scan_log', {'root': rid})['items'][0]
                    return report['id'] > 1 and report['status'] != '进行中'

                process.until(scan_finished)
                items = process.call('files', {'root': rid, 'scope': 'all'})['items']
                self.assertEqual([(file['rel'], file['version']) for file in items], [('记录.txt', 1)])
                first_root = process.call('roots')[0]
                self.assertIn('重叠', first_root['error'])
                process.until(lambda: '重叠' in process.call('roots')[0]['watch_mode'])
                self.assertIn('1 个历史对象', process.call('verify'))
                with self.assertRaisesRegex(RuntimeError, '重叠'):
                    process.call('restore_info', {'id': items[0]['vid']})

    def test_hidden_by_rule_keeps_history(self):
        with tempfile.TemporaryDirectory() as tmp:
            base=Path(tmp);root=base/'业务';root.mkdir();f=root/'记录.csv';f.write_text('a,1')
            store=Store(base/'Data');rid=store.configure(root);store.scan(rid)
            store.configure(root,'*.csv',root_id=rid);store.scan(rid);api=Service(store)
            self.assertEqual(api.dispatch('files',{})['total'],0)
            self.assertEqual(api.dispatch('files',{'history':True})['total'],1)
            self.assertNotIn('删除',[e['kind'] for e in api.dispatch('events',{})['items']])
            store.configure(root,'',root_id=rid);store.scan(rid)
            self.assertEqual(api.dispatch('files',{})['total'],1)

