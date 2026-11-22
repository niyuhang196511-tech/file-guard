import os
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
from unittest.mock import patch

from engine.service import Service
from engine.store import Store, exclusion_patterns


class DirectoryMonitorTests(unittest.TestCase):
    def setUp(self):
        temp=TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.base=Path(temp.name)
        self.root=self.base/'监控'
        self.root.mkdir()
        self.store=Store(self.base/'数据')
        self.rid=self.store.configure(self.root)
        self.api=Service(self.store)

    def roots(self):
        return {r['id']:r for r in self.api.dispatch('roots',{})}

    def test_chinese_separators_and_legacy_settings(self):
        rules='*.bak，*.tmp；日志、 草稿;缓存\\子目录\r\n*.bak,, '
        expected=['*.bak','*.tmp','日志','草稿','缓存/子目录']
        self.assertEqual(exclusion_patterns(rules),expected)
        self.store.configure(self.root,rules,root_id=self.rid)
        self.assertEqual(self.roots()[self.rid]['patterns'],', '.join(expected))
        with self.store.db() as db:
            db.execute('UPDATE roots SET patterns=? WHERE id=?',(rules,self.rid))
        for name in ('签收.bak','草稿.tmp','清单.txt'):
            (self.root/name).touch()
        self.store.scan(self.rid)
        self.assertEqual(self.api.dispatch('files',{})['total'],1)

    def test_settings_rejects_malformed_values_as_api_errors(self):
        for args in (
                {'interval':None,'theme':'浅色','autostart':False},
                {'interval':'not-a-number','theme':'浅色','autostart':False},
                {'interval':5.5,'theme':'浅色','autostart':False},
                {'interval':5,'theme':'浅色','autostart':'false'},
        ):
            with self.subTest(args=args), self.assertRaisesRegex(ValueError,'设置值无效'):
                self.api.dispatch('settings',args)

    def test_single_scan_is_atomic_and_source_survives_background_queue(self):
        second=self.base/'第二';second.mkdir()
        another=self.store.configure(second)
        with self.store.db() as db:
            db.execute('DELETE FROM tasks')
        self.assertIn('1 个目录',self.api.dispatch('scan',{'id':self.rid}))
        self.assertIn('合并',self.api.dispatch('scan',{'id':self.rid}))
        self.store.queue(self.rid,'周期校对',0)
        roots=self.roots()
        self.assertEqual(roots[self.rid]['queued_source'],'手动扫描')
        self.assertIsNone(roots[another]['queued_source'])
        self.store.root_action(self.rid,'暂停')
        with self.assertRaisesRegex(ValueError,'未启用'):
            self.api.dispatch('scan',{'id':self.rid})
        self.assertIn('1 个目录',self.api.dispatch('scan',{}))
        self.store.root_action(another,'移除')
        with self.assertRaisesRegex(ValueError,'没有启用'):
            self.api.dispatch('scan',{})

    def test_skip_counts_survive_restart_and_offline_scan(self):
        self.store.configure(self.root,'*.bak,缓存',1,self.rid)
        (self.root/'~$清单.xlsx').touch()
        (self.root/'旧.bak').touch()
        (self.root/'缓存').mkdir()
        (self.root/'缓存'/'跳过.txt').touch()
        with (self.root/'大文件.bin').open('wb') as stream:
            stream.truncate(1048577)
        self.store.scan(self.rid)
        expected={'临时文件':1,'规则排除文件':1,'超出大小上限':1,'规则排除目录':1}
        self.assertEqual(self.roots()[self.rid]['skip_counts'],expected)
        self.root.rename(self.base/'离线')
        self.store.scan(self.rid)
        other=Service(Store(self.store.home)).dispatch('roots',{})[0]
        self.assertEqual(other['skip_counts'],expected)
        self.assertEqual(other['skipped'],4)
        self.assertTrue(other['error'])

    def test_pruned_ancestor_prevents_false_deletions(self):
        nested=self.root/'业务'/'缓存'
        nested.mkdir(parents=True)
        old=nested/'样例.txt';old.write_text('V1')
        self.store.scan(self.rid)
        fid=self.api.dispatch('files',{})['items'][0]['id']
        old.unlink()
        self.store.configure(self.root,'业务/缓存',root_id=self.rid)
        self.store.scan(self.rid)
        self.assertEqual(self.api.dispatch('events',{'kind':'删除'})['total'],0)
        self.assertEqual(self.api.dispatch('files',{'scope':'excluded'})['items'][0]['id'],fid)
        old.write_text('V2')
        self.store.configure(self.root,'',root_id=self.rid)
        self.store.scan(self.rid)
        self.assertEqual(self.api.dispatch('files',{})['items'][0]['version'],2)

    def test_linked_directory_is_outside_scan(self):
        folder=self.root/'归档';folder.mkdir()
        (folder/'留存.txt').touch()
        self.store.scan(self.rid)
        folder.rename(self.base/'原资料')
        empty=self.base/'空目录';empty.mkdir()
        try:
            folder.symlink_to(empty,target_is_directory=True)
        except OSError as exc:
            self.skipTest(str(exc))
        self.store.scan(self.rid)
        self.assertEqual(self.api.dispatch('events',{'kind':'删除'})['total'],0)
        self.assertEqual(self.roots()[self.rid]['skip_counts'],{'链接目录':1})

    def test_vanishing_child_does_not_block_peer_capture_or_delete_old_records(self):
        root = self.root.resolve()
        child = root / '子目录'
        child.mkdir()
        nested = child / '原件.txt'
        nested.write_bytes(b'known content')
        peer = root / '同级.txt'
        peer.write_bytes(b'baseline')
        self.store.scan(self.rid)
        original = {row['rel']: row['id'] for row in self.api.dispatch('files', {})['items']}
        walk = os.walk
        temporary_home = self.base / '暂移'

        for phase, modified in (('before stat', b'updated'), ('before descent', b'latest content')):
            with self.subTest(phase=phase):
                peer.write_bytes(modified)

                def disappear_during_walk(path, **options):
                    for directory, dirs, names in walk(path, **options):
                        if Path(directory) != root:
                            yield directory, dirs, names
                        elif phase == 'before stat':
                            child.rename(temporary_home)
                            yield directory, dirs, names
                        else:
                            yield directory, dirs, names
                            child.rename(temporary_home)

                with patch('engine.store.os.walk', side_effect=disappear_during_walk):
                    self.store.scan(self.rid, '手动扫描')
                files = {row['rel']: row for row in self.api.dispatch('files', {})['items']}
                self.assertEqual({rel: row['id'] for rel, row in files.items()}, original)
                self.assertEqual(self.store.obj(files['同级.txt']['sha']).read_bytes(), modified)
                self.assertEqual(self.api.dispatch('events', {'kind': '删除'})['total'], 0)
                waiting, = self.api.dispatch('waiting_files', {'root': self.rid})['items']
                self.assertEqual((waiting['rel'], waiting['reason']), ('子目录', '等待目录复查'))
                scan = self.api.dispatch('scan_log', {'root': self.rid})['items'][0]
                self.assertEqual((scan['status'], scan['problem'], scan['waiting']), ('等待保存', '', 1))
                self.assertEqual(self.roots()[self.rid]['queued_source'], '保存复查')

                temporary_home.rename(child)
                self.store.scan(self.rid, '保存复查')
                self.assertEqual(self.api.dispatch('waiting_files', {'root': self.rid})['total'], 0)
                self.assertEqual(self.api.dispatch('events', {'kind': '删除'})['total'], 0)

    def test_subtree_counts_match_file_query(self):
        for rel in ['A/根.txt','A/B/二.txt','A/B/C/三.txt','同级.txt']:
            p=self.root/rel;p.parent.mkdir(parents=True,exist_ok=True);p.touch()
        self.store.scan(self.rid)
        folders=self.api.dispatch('folders',{'id':self.rid,'counts':True})
        self.assertEqual([f['total'] for f in folders],[3,2,1])
        self.assertEqual([f['path'] for f in folders],self.api.dispatch('folders',{'id':self.rid}))
        for f in folders:
            self.assertEqual(self.api.dispatch('files',{'root':self.rid,'prefix':f['path']})['total'],f['total'])
