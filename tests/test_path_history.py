import codecs
import csv
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from engine import path_history,record_admin
from engine.service import Service
from engine.shared_read import _open_windows_file
from engine.store import Store


class PathHistoryTests(unittest.TestCase):
    def setUp(self):
        temp=tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.base=Path(temp.name)
        self.store=Store(self.base/'Data')
        self.service=Service(self.store)
        self.root=self.base/'监控一'
        self.root.mkdir()
        self.rid=self.store.configure(self.root)

    def put(self,name,body='正文',root=None):
        path=(root or self.root)/name
        path.parent.mkdir(parents=True,exist_ok=True)
        path.write_text(body,encoding='utf-8')
        return path

    def move(self,old,new):
        dest=self.root/new
        dest.parent.mkdir(parents=True,exist_ok=True)
        (self.root/old).rename(dest)

    def scan(self,rid=None,stamp=None,source='手动扫描'):
        if stamp:
            with patch('engine.store.now',return_value=stamp):
                self.store.scan(rid or self.rid,source)
        else:
            self.store.scan(rid or self.rid,source)

    def path(self,**opts):
        return self.service.dispatch('path_history',opts)

    def test_rename_is_visible_on_both_sides_and_preserves_identity(self):
        self.put('旧名.txt')
        self.scan()
        self.move('旧名.txt','新名.txt')
        self.scan()
        source=self.path(rel='旧名.txt',sort='oldest')
        departure=source['items'][1]
        self.assertEqual((departure['direction'],departure['old_match'],departure['new_match']),('移出范围',1,0))
        arrival,=self.path(rel='新名.txt')['items']
        self.assertEqual((arrival['direction'],arrival['old_match'],arrival['new_match']),('移入范围',0,1))
        self.assertEqual((arrival['id'],arrival['file_id']),(departure['id'],departure['file_id']))
        self.assertEqual((arrival['prior'],arrival['version']),(1,1))
        identity=self.path(mode='identity',file=arrival['file_id'])
        self.assertEqual(identity['counts'],{'新占用记录':1,'重命名':1})
        self.assertEqual((source['identities'],source['roots'],source['groups'][0]['total']),(1,1,2))

    @unittest.skipUnless(os.name == 'nt', '需要 Windows 独占句柄')
    def test_rename_waits_for_locked_destination(self):
        self.put('旧名.txt')
        self.scan()
        original, = self.service.dispatch('files', {})['items']
        self.move('旧名.txt', '新名.txt')
        kernel, handle = _open_windows_file(self.root / '新名.txt', 0x80000000, 0, 0x80)
        try:
            self.scan()
            wait, = self.service.dispatch('waiting_files', {'root': self.rid})['items']
            self.assertEqual((wait['rel'], wait['reason']), ('新名.txt', '等待文件解除占用'))
            current, = self.service.dispatch('files', {'scope': 'all'})['items']
            self.assertEqual((current['id'], current['rel'], current['live']), (original['id'], '旧名.txt', 1))
        finally:
            kernel.CloseHandle(handle)

        self.scan(source='保存复查')
        current, = self.service.dispatch('files', {'scope': 'all'})['items']
        self.assertEqual((current['id'], current['rel'], current['version']), (original['id'], '新名.txt', 1))
        history = self.path(mode='identity', file=original['id'], sort='oldest')['items']
        self.assertEqual([item['kind'] for item in history], ['初始建档', '重命名'])
        self.assertEqual(self.service.dispatch('waiting_files', {'root': self.rid})['total'], 0)

    def test_rename_waits_for_destination_to_settle(self):
        self.put('旧名.xlsx')
        self.scan()
        original, = self.service.dispatch('files', {})['items']
        self.move('旧名.xlsx', '新名.xlsx')
        with patch('engine.store.time.monotonic', return_value=10):
            self.scan(source='文件监听')

        path = self.root / '新名.xlsx'
        before = path.stat()
        os.utime(path, ns=(before.st_atime_ns, before.st_mtime_ns + 3_000_000_000))
        with patch('engine.store.time.monotonic', return_value=13):
            self.scan(source='保存复查')
        wait, = self.service.dispatch('waiting_files', {'root': self.rid})['items']
        self.assertEqual((wait['rel'], wait['reason']), ('新名.xlsx', '等待保存稳定'))
        current, = self.service.dispatch('files', {'scope': 'all'})['items']
        self.assertEqual((current['id'], current['live']), (original['id'], 1))

        with patch('engine.store.time.monotonic', return_value=15):
            self.scan(source='保存复查')
        current, = self.service.dispatch('files', {'scope': 'all'})['items']
        self.assertEqual((current['id'], current['rel'], current['version']), (original['id'], '新名.xlsx', 1))
        self.assertEqual(self.path(mode='identity', file=original['id'], kind='重命名')['total'], 1)

    def test_deleted_and_recreated_same_path_has_two_identities(self):
        p=self.put('同名.txt','甲')
        self.scan()
        p.unlink()
        self.scan()
        self.put('同名.txt','乙')
        self.scan()
        report=self.path(rel='同名.txt',sort='oldest')
        self.assertEqual([r['direction'] for r in report['items']],['新占用记录','删除记录','新占用记录'])
        self.assertEqual(report['identities'],2)
        self.assertEqual(sorted(g['total'] for g in report['groups']),[1,2])
        deletion=report['items'][1]
        self.assertEqual((deletion['prior'],deletion['version']),(1,None))

    def test_directory_occupancy_separates_recreated_file_history(self):
        path = self.put('报告', '原文件')
        self.scan()
        original, = self.service.dispatch('files', {})['items']
        path.unlink()
        path.mkdir()

        with patch('engine.store.time.monotonic', return_value=10):
            self.scan(source='文件监听')
        wait, = self.service.dispatch('waiting_files', {'root': self.rid})['items']
        self.assertEqual((wait['rel'], wait['reason']), ('报告', '等待路径替换完成'))
        self.assertEqual(self.path(rel='报告', kind='删除')['total'], 0)

        with patch('engine.store.time.monotonic', return_value=12):
            self.scan(source='保存复查')
        removed, = self.service.dispatch('files', {'scope': 'deleted'})['items']
        self.assertEqual(removed['id'], original['id'])

        path.rmdir()
        self.put('报告', '后来的文件')
        self.scan()
        current, = self.service.dispatch('files', {})['items']
        self.assertNotEqual(current['id'], original['id'])
        self.assertEqual(current['version'], 1)
        self.assertEqual([row['kind'] for row in self.path(rel='报告', sort='oldest')['items']],
                         ['初始建档', '删除', '新增'])

    def test_rename_preserves_identity_when_source_path_becomes_directory(self):
        self.put('旧名.txt')
        self.scan()
        original, = self.service.dispatch('files', {})['items']
        self.move('旧名.txt', '新名.txt')
        (self.root / '旧名.txt').mkdir()
        self.scan()

        moved, = self.service.dispatch('files', {'scope': 'all'})['items']
        self.assertEqual((moved['id'], moved['rel'], moved['version']), (original['id'], '新名.txt', 1))
        self.assertEqual([row['kind'] for row in self.path(rel='旧名.txt', sort='oldest')['items']],
                         ['初始建档', '重命名'])

    def test_folder_membership_boundary_handles_enter_internal_leave(self):
        self.put('外/资料.txt')
        self.put('归档二/同款.txt')
        self.scan()
        for current,target in [('外/资料.txt','归档/资料.txt'),('归档/资料.txt','归档/子/资料.txt'),('归档/子/资料.txt','外/资料.txt')]:
            self.move(current,target)
            self.scan()
        folder=self.path(mode='folder',rel='归档/',sort='oldest')
        self.assertEqual([r['direction'] for r in folder['items']],['移入范围','范围内路径变化','移出范围'])
        self.assertEqual(folder['path'],'归档')
        self.assertNotIn('归档二/同款.txt',[r['rel'] for r in folder['items']])
        self.assertEqual(self.path(mode='folder',rel='归档',direction='移出范围')['total'],1)
        moved=self.path(mode='identity',file=folder['items'][0]['file_id'])
        self.assertEqual(moved['counts']['移动'],3)

    def test_case_folding_and_windows_separator_with_exact_path(self):
        self.put('Reports/Straße.txt')
        self.scan()
        self.assertEqual(self.path(rel='REPORTS\\STRASSE.txt')['total'],0)
        self.assertEqual(self.path(rel='REPORTS\\STRASSE.txt',fold=True)['total'],1)
        self.assertEqual(self.path(rel='Reports/Straße')['total'],0)
        self.assertEqual(self.path(mode='folder',rel='reports',fold=True)['total'],1)

    def test_root_scope_separates_same_relative_paths(self):
        other=self.base/'监控二'
        other.mkdir()
        second=self.store.configure(other)
        self.put('资料.txt','甲')
        self.put('资料.txt','乙',other)
        self.scan()
        self.scan(second)
        all_events=self.path(rel='资料.txt')
        self.assertEqual((all_events['roots'],all_events['identities']),(2,2))
        limited=self.path(rel='资料.txt',root=second)
        item,=limited['items']
        self.assertEqual((item['root_id'],item['root']),(second,str(other.resolve())))
        self.assertEqual(self.path(rel='资料.txt',root=99999)['total'],0)

    def test_removed_root_still_has_ordinary_path_history(self):
        self.put('归档.txt')
        self.scan()
        self.store.root_action(self.rid,'移除')
        result=self.path(rel='归档.txt',root=self.rid)
        self.assertEqual((result['total'],result['groups'][0]['root_id']),(1,self.rid))

    def test_case_only_rename_folded_path_marks_both_sides(self):
        self.put('Note.txt')
        self.scan()
        original,=self.service.dispatch('files',{})['items']
        self.move('Note.txt','intermediate.txt')
        self.move('intermediate.txt','note.txt')
        self.scan()
        renamed,=self.path(rel='NOTE.txt',fold=True,kind='重命名')['items']
        self.assertEqual((renamed['old_match'],renamed['new_match'],renamed['direction']),
                         (1,1,'范围内路径变化'))
        current,=self.service.dispatch('files',{})['items']
        self.assertEqual((current['id'],current['rel'],current['version']),(original['id'],'note.txt',1))
        self.scan()
        self.assertEqual(self.path(rel='NOTE.txt',fold=True)['counts'],{'新占用记录':1,'范围内路径变化':1})

    @unittest.skipUnless(os.name == 'nt', '依赖 Windows 路径别名')
    def test_case_only_rename_with_edit_preserves_both_versions(self):
        original_path = self.put('Note.txt', '初版')
        if not (self.root / 'note.txt').exists():
            self.skipTest('当前目录区分文件名大小写')
        self.scan()
        original, = self.service.dispatch('files', {})['items']

        self.move('Note.txt', 'intermediate.txt')
        self.move('intermediate.txt', 'note.txt')
        self.put('note.txt', '修改后的版本')
        self.assertTrue(original_path.exists())
        self.scan()

        current, = self.service.dispatch('files', {'scope': 'all'})['items']
        self.assertEqual((current['id'], current['rel'], current['version'], current['live'], current['tracked']),
                         (original['id'], 'note.txt', 2, 1, 1))
        history = self.path(mode='identity', file=original['id'], sort='oldest')['items']
        self.assertEqual([(row['kind'], row['rel'], row['old_rel'], row['prior'], row['version']) for row in history],
                         [('初始建档', 'Note.txt', '', None, 1), ('重命名', 'note.txt', 'Note.txt', 1, 1),
                          ('内容修改', 'note.txt', '', 1, 2)])

    def test_existing_case_variants_remain_distinct(self):
        first=self.put('Note.txt','第一份')
        try:
            with (self.root/'note.txt').open('xb') as second:
                second.write(b'second')
        except FileExistsError:
            self.skipTest('当前目录不区分文件名大小写')
        self.scan()
        report=self.path(rel='NOTE.txt',fold=True)
        self.assertEqual((report['identities'],report['counts']),(2,{'新占用记录':2}))
        first.unlink()
        self.scan()
        current,=self.service.dispatch('files',{})['items']
        self.assertEqual(current['rel'],'note.txt')
        self.assertEqual(self.path(rel='NOTE.txt',fold=True)['counts'],{'新占用记录':2,'删除记录':1})

    def test_structural_kind_and_source_filters_are_intersected(self):
        self.put('核对.txt','初始')
        self.scan(source='全量复查')
        self.put('核对.txt','变更')
        self.scan(source='手动扫描')
        raw=self.path(rel='核对.txt')
        self.assertEqual(raw['counts'],{'新占用记录':1,'原位置记录':1})
        self.assertEqual(self.path(rel='核对.txt',structural=True)['total'],1)
        self.assertEqual(self.path(rel='核对.txt',structural=True,kind='内容修改')['total'],0)
        self.assertEqual(self.path(rel='核对.txt',source='手动扫描',kind='内容修改')['total'],1)
        self.assertEqual(self.path(rel='核对.txt',source='手动')['total'],0)

    def test_date_includes_entire_day_and_id_breaks_equal_timestamps(self):
        self.put('核对.txt','初始')
        self.scan(stamp='2025-12-30T09:00:00+08:00')
        for value in ('变更一','变更二'):
            self.put('核对.txt',value)
            self.scan(stamp='2025-12-31T23:59:59+08:00')
        self.put('核对.txt','变更三')
        self.scan(stamp='2026-01-01T00:00:00+08:00')
        opts=dict(rel='核对.txt',start='2025-12-31',end='2025-12-31')
        new=self.path(**opts)
        self.assertEqual((new['total'],new['first'],new['last']),(2,'2025-12-31T23:59:59+08:00','2025-12-31T23:59:59+08:00'))
        self.assertEqual([r['id'] for r in new['items']],[r['id'] for r in reversed(self.path(**opts,sort='oldest')['items'])])
        self.assertEqual(self.path(rel='核对.txt',end='9999-12-31')['total'],4)

    def test_independent_event_and_identity_paging_reports_full_totals(self):
        for i in range(23):
            self.put(f'归档/{i:02}.txt',str(i))
        self.scan()
        opts=dict(mode='folder',rel='归档',size=10,page=999,identity_page=999)
        result=self.path(**opts)
        self.assertEqual((result['total'],result['page'],result['pages']),(23,3,3))
        self.assertEqual((result['identities'],result['identity_page'],result['identity_pages']),(23,2,2))
        self.assertEqual((len(result['items']),len(result['groups'])),(3,3))
        first=self.path(mode='folder',rel='归档',size=10)
        self.assertEqual(first['counts'],result['counts'])
        self.assertFalse({r['id'] for r in first['items']}&{r['id'] for r in result['items']})

    def test_move_removed_or_withdrawn_is_excluded_from_scope_groups_and_csv(self):
        self.put('旧.txt')
        self.scan()
        self.move('旧.txt','新.txt')
        self.scan()
        row,=self.path(rel='新.txt')['items']
        password='path-history test passphrase'
        salt=b'path-history-fixture'
        with self.store.db() as db:
            db.execute('INSERT INTO record_admin VALUES(1,?,?)',(salt,record_admin.derive(password,salt)))
        for rev,action in enumerate(('更正','撤回','恢复展示','移出普通日志','恢复展示')):
            self.service.dispatch('record_amend',dict(id=row['id'],action=action,caption='公开意见',
                                  reason='内部说明',password=password,revision=rev))
            visible=self.path(rel='新.txt')
            identity=self.path(mode='identity',file=row['file_id'])
            withdrawn=action in ('撤回','移出普通日志')
            self.assertEqual((visible['total'],identity['total']),(0,1) if withdrawn else (1,2))
            if withdrawn:
                path=self.base/f'隐藏-{rev}.csv'
                self.service.dispatch('path_history_csv',dict(rel='旧.txt',path=str(path)))
                self.assertNotIn('新.txt',path.read_text(encoding='utf-8-sig'))
            elif action=='更正':
                self.assertEqual(visible['items'][0]['caption'],'公开意见')
                self.assertNotIn('内部说明',str(identity))

    def test_empty_path_query_and_unseen_identity_have_usable_results(self):
        self.put('1.txt')
        self.scan()
        for opts in ({'rel':'unknown.txt'},{'mode':'identity','file':123456}):
            found=self.path(**opts)
            self.assertEqual((found['total'],found['identities'],found['roots'],found['first']),(0,0,0,None))
            self.assertFalse(found['items'])
            self.assertFalse(found['groups'])
            self.assertEqual(found['pages'],1)

    def test_export_all_pages_formulas_audit_and_output_protection(self):
        for i in range(13):
            self.put(f'归档/=条目{i:02}.txt')
        self.scan()
        one=self.path(mode='folder',rel='归档',size=10)
        dest=self.base/'路径沿革.csv'
        opts=dict(mode='folder',rel='归档',size=10,page=2,path=str(dest))
        self.service.dispatch('path_history_csv',opts)
        self.assertTrue(dest.read_bytes().startswith(codecs.BOM_UTF8))
        with dest.open(encoding='utf-8-sig',newline='') as stream:
            rows=list(csv.DictReader(stream))
        self.assertEqual(len(rows),13)
        self.assertEqual(int(rows[0]['事件编号']),one['items'][0]['id'])
        with self.assertRaises(FileExistsError):
            self.service.dispatch('path_history_csv',opts)
        with patch.object(path_history,'LIMIT',3),self.assertRaises(ValueError):
            self.service.dispatch('path_history_csv',dict(opts,path=str(self.base/'超限.csv')))
        for bad in (self.store.home/'内.csv',self.base/'后缀.txt'):
            with self.assertRaises(ValueError):
                self.service.dispatch('path_history_csv',dict(opts,path=str(bad)))
        file=self.put('=公式,中文.txt')
        self.scan()
        formula=self.base/'公式.csv'
        self.service.dispatch('path_history_csv',dict(rel=file.name,path=str(formula)))
        with formula.open(encoding='utf-8-sig',newline='') as stream:
            row,=csv.DictReader(stream)
        self.assertEqual(row['事件路径'],"'=公式,中文.txt")
        self.assertEqual(self.service.dispatch('audit',{'action':'导出路径沿革'})['total'],2)

    def test_validation_rejects_absolute_ambiguous_and_invalid_options(self):
        for opts in ({'rel':''},{'rel':'/tmp/secret'},{'rel':'C:\\secret'},{'rel':'a/../secret'},
                     {'rel':'a//b'},{'rel':'a\0b'},{'start':'2025-02-30'},{'start':'2026-02-02','end':'2026-02-01'},
                     {'mode':'identity','file':False},{'root':'1'},{'size':11},{'kind':'已撤回'},
                     {'direction':'xx'},{'fold':'yes'},{'sort':'new'}):
            with self.subTest(opts=opts),self.assertRaises(ValueError):
                self.path(**{'rel':'valid.txt',**opts})
        with self.store.db() as db:
            self.assertEqual(db.execute('PRAGMA user_version').fetchone()[0],11)
