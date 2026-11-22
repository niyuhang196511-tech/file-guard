import csv
from contextlib import contextmanager
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from openpyxl import Workbook
from openpyxl.comments import Comment
from engine import backup_check, formats, record_admin, rules
from engine.service import Service
from engine.sheet_view import WorkbookView
from engine.store import FileChanging, Store, digest
from tests_helper import RpcProcess


class Work(unittest.TestCase):
    def setUp(self):
        temp=tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.base=Path(temp.name)
        self.root=self.base/'input'
        self.root.mkdir()
        self.store=Store(self.base/'data')
        self.service=Service(self.store)
        self.rid=self.store.configure(self.root)
    def api(self,cmd,**args):
        return self.service.dispatch(cmd,args)
    def scan(self):
        self.store.scan(self.rid)
    def snap(self,label):
        return self.api('checkpoint_create',root=self.rid,label=label)
    def write(self,name,data):
        path=self.root/name
        path.parent.mkdir(parents=True,exist_ok=True)
        path.write_text(data,encoding='utf-8')
        return path
    def compare(self,ext,a,b):
        return formats.compare(self.write('a',a),self.write('b',b),ext)[1]


class Checkpoints(Work):
    def test_classification_search_sort_totals_and_reverse(self):
        for name in ('old','move','stay','remove','edit'):self.write(name,name)
        self.scan();first=self.snap('交接前')
        (self.root/'old').rename(self.root/'new')
        (self.root/'move').rename(self.root/'moved')
        self.scan()
        (self.root/'remove').unlink()
        self.write('new','edited after rename');self.write('edit','e');self.write('add','added')
        self.scan();last=self.snap('交接后')
        def diff(**fields):return self.api('checkpoint_diff',old=first,new=last,**fields)
        result=diff(unchanged=True)
        items={r['kind']:r for r in result['items']}
        self.assertEqual(set(items),{'路径与内容变更','路径变更','相同','内容修改','新增','移出'})
        self.assertEqual(items['路径与内容变更']['old_path'],'old')
        self.assertEqual(diff()['total'],5)
        self.assertEqual(diff(kind='相同')['total'],1)
        self.assertEqual(diff(q='old')['items'][0]['new_path'],'new')
        self.assertEqual(diff(q='NEW')['total'],1)
        self.assertEqual(diff(sort='growth',size=1)['items'][0]['kind'],'路径与内容变更')
        self.assertEqual(diff(sort='shrink',size=1)['items'][0]['kind'],'移出')
        self.assertEqual(diff(sort='change',size=1)['items'][0]['kind'],'路径与内容变更')
        self.assertEqual(diff(page=900,size=2)['page'],3)
        rev=self.api('checkpoint_diff',old=last,new=first)
        self.assertEqual(rev['delta'],-result['delta'])
        self.assertEqual(diff(q='%')['total'],0)
        self.assertEqual(self.api('checkpoints',root=self.rid)[0]['files'],5)
        with self.assertRaises(ValueError):diff(sort='unknown')

    def test_diff_rejects_malformed_page_arguments(self):
        self.write('file.txt','before');self.scan();first=self.snap('前')
        self.write('file.txt','after');self.scan();last=self.snap('后')
        for args in ({'size':None},{'size':5.5},{'page':None},{'page':'1.5'},{'page':'1_0'}):
            with self.subTest(args=args), self.assertRaisesRegex(ValueError,'分页条件无效'):
                self.api('checkpoint_diff',old=first,new=last,**args)
    def test_unicode_path_search_matches_both_sides_and_csv(self):
        original = self.write('Änderungen/Straße%.txt', 'renamed content')
        nearby = self.write('Änderungen/StraßeX.txt', 'nearby content')
        self.scan()
        first = self.snap('筛选前')
        original.rename(original.with_name('Όρος%.txt'))
        nearby.write_text('nearby content changed', encoding='utf-8')
        self.scan()
        last = self.snap('筛选后')

        for query in ('  änderungen\\STRASSE%.TXT  ', 'ÄNDERUNGEN/ΌΡΟΣ%.TXT'):
            with self.subTest(query=query):
                result = self.api('checkpoint_diff', old=first, new=last, q=query)
                self.assertEqual(result['total'], 1)
                self.assertEqual(result['counts'], {'路径变更': 1})
                self.assertEqual(result['items'][0]['old_path'], 'Änderungen/Straße%.txt')
                self.assertEqual(result['items'][0]['new_path'], 'Änderungen/Όρος%.txt')

        dest = self.base/'unicode.csv'
        self.api('checkpoint_export', old=first, new=last, q='änderungen\\STRASSE%.TXT', path=str(dest))
        with dest.open(encoding='utf-8-sig', newline='') as src:
            row, = csv.DictReader(src)
        self.assertEqual(row['原路径'], 'Änderungen/Straße%.txt')
        self.assertEqual(row['现路径'], 'Änderungen/Όρος%.txt')

    def test_snapshot_constraints_and_archived_content(self):
        with self.assertRaises(ValueError):self.snap('过早')
        self.scan();empty=self.snap('空')
        with self.assertRaises(ValueError):self.snap(' 空 ')
        with self.assertRaises(ValueError):self.snap(' '*10)
        with self.assertRaises(ValueError):self.snap('x'*81)
        f=self.write('sample','a');self.write('cache.tmp','skip')
        self.store.configure(self.root,'*.tmp',0,self.rid);self.scan()
        saved=self.snap('发布');f.unlink();self.scan()
        self.assertEqual(self.api('checkpoint_diff',old=empty,new=saved)['total'],1)
        target=self.base/'other';target.mkdir()
        rid=self.store.configure(target);self.store.scan(rid)
        other=self.api('checkpoint_create',root=rid,label='发布')
        for pair in [(saved,other),(saved,saved),(saved,12345)]:
            with self.assertRaises(ValueError):self.api('checkpoint_diff',old=pair[0],new=pair[1])
        self.store.root_action(self.rid,'移除')
        with self.assertRaises(ValueError):self.snap('已移除')
    def test_export_all_rows_and_backup(self):
        self.scan();first=self.snap('空')
        self.write('=expr','value');self.write('part','123');self.scan();last=self.snap('完整')
        dest=self.base/'out.csv'
        args=dict(old=first,new=last,size=1,path=str(dest))
        self.api('checkpoint_export',**args)
        with dest.open(encoding='utf-8-sig') as src:rows=list(csv.DictReader(src))
        self.assertEqual(len(rows),2);self.assertEqual(rows[0]['现路径'],"'=expr")
        self.assertEqual(len(rows[0]['新摘要']),64)
        with self.assertRaises((FileExistsError,ValueError)):self.api('checkpoint_export',**args)
        with self.assertRaises(ValueError):self.api('checkpoint_export',**{**args,'path':str(self.store.home/'private.csv')})
        backup=self.base/'copy.zip';self.store.backup(backup)
        self.assertEqual(backup_check.inspect(backup)['schema'],11)
    def test_snapshot_during_scan_cannot_observe_half_finished_update(self):
        from concurrent.futures import ThreadPoolExecutor
        from threading import Event
        self.write('file','old');self.scan();self.write('file','new bytes')
        wait=Event();entered=Event()
        capture=self.store.capture
        def block(path):
            entered.set();wait.wait(4)
            return capture(path)
        with patch.object(self.store,'capture',side_effect=block),ThreadPoolExecutor(2) as pool:
            task=pool.submit(self.scan)
            self.assertTrue(entered.wait(2))
            snap=pool.submit(self.snap,'一致清单')
            try:self.assertFalse(snap.done())
            finally:wait.set()
            task.result();snap.result()
        self.assertEqual(self.api('checkpoints',root=self.rid)[0]['bytes'],9)

    def test_snapshot_waits_for_all_pending_files_to_be_captured(self):
        self.write('first.txt','old')
        self.write('locked.txt','old')
        self.scan()
        before = self.snap('编辑前')
        self.write('first.txt','new 1')
        self.write('locked.txt','new 2')
        capture = self.store.capture

        def temporarily_locked(path):
            if path.name == 'locked.txt':
                raise PermissionError('文件正在使用')
            return capture(path)

        with patch.object(self.store,'capture',side_effect=temporarily_locked):
            self.scan()
        run, = self.api('scan_log',root=self.rid,state='等待保存')['items']
        self.assertEqual((run['captured'],run['waiting']),(1,1))
        for action in (None, '暂停'):
            if action:
                self.store.root_action(self.rid,action)
            with self.assertRaisesRegex(ValueError,'等待保存'):
                self.snap('编辑后')
        self.assertEqual([row['id'] for row in self.api('checkpoints',root=self.rid)], [before])

        self.store.root_action(self.rid,'继续')
        self.scan()
        after = self.snap('编辑后')
        items = self.api('checkpoint_diff',old=before,new=after)['items']
        self.assertEqual([(row['new_path'],row['new_num']) for row in items], [('first.txt',2),('locked.txt',2)])

    def test_snapshot_waits_for_pending_restore_of_same_directory(self):
        target = self.write('note.txt', 'original').resolve()
        self.scan()
        file, = self.api('files')['items']
        original, = self.api('history', id=file['id'])
        self.write('note.txt', 'updated contents')
        self.scan()
        before = self.snap('恢复前')

        def temporarily_unreadable(path):
            if path == target and path.read_bytes() == b'original':
                raise PermissionError('写回后短时间无法读取')
            return digest(path)

        with patch('engine.store.digest', side_effect=temporarily_unreadable):
            with self.assertRaises(PermissionError):
                self.api('restore', id=original['id'])

        self.assertEqual(target.read_bytes(), b'original')
        self.assertEqual(self.api('summary')['recovery'], 1)
        with self.assertRaisesRegex(ValueError, '恢复.*核对'):
            self.snap('恢复后')
        self.assertEqual([row['id'] for row in self.api('checkpoints', root=self.rid)], [before])

        peer = self.base / 'other'
        peer.mkdir()
        peer_id = self.store.configure(peer)
        self.store.scan(peer_id)
        self.assertTrue(self.api('checkpoint_create', root=peer_id, label='其他目录'))

        self.api('retry_recovery')
        self.assertEqual(self.api('summary')['recovery'], 0)
        after = self.snap('恢复后')
        item, = self.api('checkpoint_diff', old=before, new=after)['items']
        self.assertEqual((item['old_num'], item['new_num'], item['new_sha']), (2, 3, original['sha']))


class Monitoring(Work):
    def test_rules_match_actual_scanner_and_size_boundary(self):
        paths=['draft/nested/file.txt','a.tmp','稿子.txt','~$sheet.xlsx','.~lock.x#','.fileguard-staging']
        patterns='draft；*.tmp'
        for name in paths:self.write(name,'a')
        self.store.configure(self.root,patterns,1,self.rid);self.scan()
        result=self.api('rule_preview',paths='\n'.join(paths),patterns=patterns,max_mb=1,bytes=1048576)
        self.assertEqual([r['reason'] for r in result],['规则排除目录','规则排除文件','允许采集']+['临时文件']*3)
        self.assertEqual([r['rel'] for r in self.api('files')['items']],['稿子.txt'])
        self.assertEqual(result[0]['part'],'draft')
        for size,expected in [(None,'待核对大小'),(1048577,'超出大小上限'),(0,'允许采集')]:
            self.assertEqual(self.api('rule_preview',paths='稿子.txt',max_mb=1,bytes=size)[0]['reason'],expected)
        for name in ('../p','C:\\private','/etc/passwd','\n'.join(['p']*101),'   '):
            with self.assertRaises(ValueError):self.api('rule_preview',paths=name)
        self.assertEqual(len(self.api('rule_history',root=self.rid)),2)
        self.store.configure(self.root,'draft， *.tmp',1,self.rid)
        self.assertEqual(len(self.api('rule_history',root=self.rid)),2)
        self.assertEqual(rules.preview(dict(paths='A\\x.log',patterns='A/*'))[0]['rel'],'A/x.log')
    def test_short_read_discards_temp_and_published_version(self):
        p=self.write('file','long enough')
        @contextmanager
        def short(path):
            with path.open('rb') as src:
                class Short:
                    def fileno(self):return src.fileno()
                    def read(self,n):return b''
                yield Short()
        with patch('engine.store.open_snapshot_source',short):
            with self.assertRaises(FileChanging):self.store.capture(p)
        self.assertFalse(list(self.store.temp.iterdir()))
        self.assertFalse(list(self.store.objects.iterdir()))
    def test_worker_state_and_cause(self):
        with patch.dict(os.environ,{'FILEGUARD_START_CAUSE':'后台自动恢复'}),RpcProcess(self.store.home) as proc:
            proc.until(lambda:'解析' in proc.call('runtime')['beats'])
            info=proc.call('runtime')
            self.assertEqual(info['pid'],proc.pid)
            self.assertIn('扫描',info['beats']);self.assertGreaterEqual(info['uptime'],0)
            self.assertTrue(any(r['note']=='后台自动恢复' for r in proc.call('audit')['items']))
    def test_legacy_rules_migrated_once(self):
        self.store.configure(self.root,'a/*.tmp',0,self.rid)
        with self.store.db() as db:
            db.execute('DROP TABLE rule_changes');db.execute('PRAGMA user_version=6')
        Store(self.store.home);Store(self.store.home)
        self.assertEqual([r['patterns'] for r in self.api('rule_history',root=self.rid)],['a/*.tmp'])


class Privacy(Work):
    def test_private_event_visibility_and_authenticated_recovery(self):
        self.write('secret.txt','a');self.scan();self.write('secret.txt','aa');self.scan()
        event=self.api('events')['items'][0];eid=event['id']
        password='a test password'
        with self.store.db() as db:
            db.execute('INSERT INTO record_admin VALUES(1,?,?)',(b'salt',record_admin.derive(password,b'salt')))
        args=dict(id=eid,password=password,reason='private reason')
        self.api('record_amend',**args,action='更正',caption='公开备注',revision=0)
        self.assertEqual(self.api('events',caption='备注',amended=True)['total'],1)
        self.api('record_amend',**args,action='移出普通日志',revision=1)
        for opts in [dict(event_id=eid),dict(caption='备注'),dict(amended=True),dict(kind='内容修改')]:
            self.assertEqual(self.api('events',**opts)['total'],0)
        self.assertNotIn(eid,[r['id'] for r in self.api('summary')['recent']]);self.assertEqual(self.api('summary')['today'],0)
        dest=self.base/'public.csv';self.api('export',path=str(dest),event_id=eid)
        self.assertEqual(len(dest.read_text(encoding='utf-8-sig').splitlines()),1)
        with self.assertRaises(ValueError):self.api('private_records',password='wrong')
        private=self.api('private_records',password=password)['items']
        self.assertEqual(list(r['id'] for r in private),[eid]);self.assertNotIn('rel',private[0])
        self.assertNotIn('private reason',str(self.api('audit')))
        with self.assertRaises(ValueError):self.api('record_amend',**args,action='恢复展示',revision=1)
        self.api('record_amend',**args,action='恢复展示',revision=2)
        self.assertFalse(self.api('private_records',password=password)['items'])
        self.assertEqual(self.api('events',event_id=eid)['items'][0]['caption'],'公开备注')


class Semantic(Work):
    def test_ini_and_incomplete_config_fallback(self):
        data='[DEFAULT]\nDefault = 12%\n[app]\nPath = First\npath = lower\n'
        self.assertEqual(self.compare('.ini',data,data.replace('First','Next')),[dict(sheet='节 app',location='Path',kind='修改',old='First',new='Next')])
        self.assertFalse(self.compare('.ini',data,'; comment\n'+data))
        self.assertEqual(formats.compare(self.root/'a',self.root/'b','.ini','coordinate')[1][0]['new'],'; comment')
        self.assertTrue(all(r['sheet'].startswith('配置原文') for r in self.compare('.ini','key=1','key=2')))
    def test_toml_typed_paths_and_order(self):
        a='[app]\n"a/b" = [1, true]\nwhen = 2025-01-02\n'
        b='[app]\nwhen = "2025-01-02"\n"a/b" = [1, false, 2]\n'
        rows=self.compare('.toml',a,b)
        self.assertEqual({r['location'] for r in rows},{'/app/a~1b','/app/a~1b/1','/app/a~1b/2','/app/when'})
        self.assertFalse(self.compare('.toml','x=1\ny=2','y=2\nx=1'))
        self.assertTrue(self.compare('.toml','a=2','a='))
    def test_notebook_attachment_outputs_and_move(self):
        code=dict(cell_type='code',id='a',source=['result'],metadata={},outputs=[{'output_type':'stream','text':'old'}],execution_count=2)
        text=dict(cell_type='markdown',id='b',source='Intro',metadata={})
        def nb(cells):return json.dumps(dict(nbformat=4,nbformat_minor=5,metadata={},cells=cells))
        revised={**code,'outputs':[{'output_type':'stream','text':'new'}],'attachments':{'fig':{'image/png':'abc'}},'execution_count':3}
        rows=self.compare('.ipynb',nb([code,text]),nb([text,revised]))
        self.assertEqual({r['location'] for r in rows},{'顺序','输出 1','执行次数','附件 fig'})
        with self.assertRaisesRegex(ValueError,'编号重复'):self.compare('.ipynb',nb([code]),nb([code,code]))
    def test_subtitle_and_xml_source_formats(self):
        a='1\n00:00:01,000 --> 00:00:02,000\nHello\nworld'
        rows=self.compare('.srt',a,a.replace('01,','00,').replace('02,','03,').replace('world','there'))
        self.assertEqual({r['location'] for r in rows},{'开始','结束','字幕文字'})
        with self.assertRaisesRegex(ValueError,'编号重复'):self.compare('.srt',a,a+'\n\n'+a)
        for ext in ('.svg','.xsl','.csproj','.targets'):
            self.assertEqual(self.compare(ext,'<x a="1"/>','<x a="2"/>')[0]['sheet'],'属性')
        for ext in ('.ps1','.sh','.tsx','.rs','.java','.diff'):
            self.assertEqual(self.compare(ext,'a','b')[0]['sheet'],'文本')
    def test_excel_logical_row_filters_and_jump(self):
        from openpyxl.styles import Font
        files=[]
        for i in range(2):
            wb=Workbook();ws=wb.active
            for r in [['编号','内容'],['A','x'],['B','y']]:ws.append(r)
            if i:
                ws['B2'].comment=Comment('新批注','审核');ws['B2'].font=Font(bold=True)
                ws['B3'].hyperlink='https://example.org';ws.append(['C','z'])
            path=self.base/(str(i)+'.xlsx');wb.save(path);files.append(path)
        view=WorkbookView(*files,'.xlsx','aligned')
        for focus,expected in [('批注',1),('格式',1),('超链接',1),('新增行',1),('删除行',0)]:
            result=view.page(dict(row_filter=focus))
            self.assertEqual(result['matches'],expected)
            self.assertTrue(all(focus in line['filters'] for line in result['rows']))
        jump=view.page(dict(row_filter='删除行',target='B2',locate='new'))
        self.assertFalse(jump['row_filter']);self.assertTrue(any(r['target'] for r in jump['rows']))
