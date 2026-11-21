import json
import os
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

