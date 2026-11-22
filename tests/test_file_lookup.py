import csv
import tempfile
import unittest
from pathlib import Path

from engine import record_admin
from engine.service import Service
from engine.store import Store


class FileLookupTests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.root = Path(temp.name)/'业务'
        self.root.mkdir()
        self.store = Store(Path(temp.name)/'仓库')
        self.api = Service(self.store)
        self.rid = self.store.configure(self.root)

    def files(self, **filters):
        return self.api.dispatch('files', filters)

    def scan(self):
        self.store.scan(self.rid)

    def test_former_names_reuse_identity_and_do_not_duplicate(self):
        path = self.root/'交接草案.txt'
        path.write_text('批次 A', encoding='utf-8')
        self.scan()
        fid = self.files()['items'][0]['id']
        for name in ('交接复核.txt','最终稿.txt'):
            path = path.rename(self.root/name)
            self.scan()
        for fragment, matched in [('交接','交接复核.txt'),('草案','交接草案.txt'),('最终',None)]:
            page = self.files(q=fragment, root=self.rid, ext='TXT', size=1)
            self.assertEqual(page['total'],1)
            self.assertEqual((page['items'][0]['id'],page['items'][0]['matched_path']),(fid,matched))
        event = self.api.dispatch('events',{'kind':'初始建档'})['items'][0]
        self.assertEqual((event['rel'],event['current_rel']),('交接草案.txt','最终稿.txt'))

    def test_moved_files_accept_windows_paths_and_current_prefix(self):
        folder=self.root/'计划'
        folder.mkdir()
        path=folder/'记录.txt'
        path.write_text('文本', encoding='utf-8')
        self.scan()
        new=self.root/'归档'
        new.mkdir()
        path.rename(new/path.name)
        self.scan()
        query=dict(q=r'计划\记录',root=self.rid,scope='all')
        self.assertEqual(self.files(**query,prefix='归档')['items'][0]['matched_path'],'计划/记录.txt')
        self.assertEqual(self.files(**query,prefix='计划')['total'],0)

    def test_unicode_queries_find_current_and_former_paths_in_lists_and_csv(self):
        folder = self.root/'Änderungen'
        folder.mkdir()
        original = folder/'Straße%.txt'
        original.write_text('first', encoding='utf-8')
        (folder/'StraßeX.txt').write_text('other', encoding='utf-8')
        self.scan()

        filters = dict(q='änderungen\\STRASSE%.TXT', root=self.rid)
        first, = self.files(**filters)['items']
        self.assertEqual(first['rel'],'Änderungen/Straße%.txt')
        self.assertIsNone(first['matched_path'])
        events = self.api.dispatch('events',filters)['items']
        self.assertEqual([event['file_id'] for event in events],[first['id']])

        original.rename(folder/'Current.txt')
        self.scan()
        current, = self.files(**filters)['items']
        self.assertEqual((current['id'],current['rel'],current['matched_path']),
                         (first['id'],'Änderungen/Current.txt',first['rel']))
        events = self.api.dispatch('events',{**filters,'kind':'重命名'})['items']
        self.assertEqual([event['old_rel'] for event in events],[first['rel']])
        for command in ('export_files','export'):
            destination = self.root.parent/(command+'.csv')
            options = {**filters,'path':str(destination)}
            if command=='export':
                options['kind']='重命名'
            self.api.dispatch(command,options)
            with destination.open(encoding='utf-8-sig', newline='') as stream:
                exported, = csv.DictReader(stream)
            self.assertEqual(exported['文件'],current['rel'])

    def test_unicode_caption_and_audit_search_preserves_retraction(self):
        (self.root/'Note.txt').write_text('first', encoding='utf-8')
        self.scan()
        event = self.api.dispatch('events',{})['items'][0]
        password = 'local test password'
        salt = b'test salt'
        with self.store.db() as db:
            db.execute('INSERT INTO record_admin VALUES (1,?,?)',(salt,record_admin.derive(password,salt)))
            self.store.audit(db,'Übergabe','Prüfung')
        amend = dict(id=event['id'], password=password, reason='测试')
        self.api.dispatch('record_amend',dict(amend,action='更正',caption='Freigabe Straße',revision=0))

        self.assertEqual(self.api.dispatch('events',{'caption':'STRASSE'})['total'],1)
        for q in ('übergabe','prüfung'):
            self.assertEqual(self.api.dispatch('audit',{'q':q})['total'],1)
        self.api.dispatch('record_amend',dict(amend,action='撤回',revision=1))
        self.assertEqual(self.api.dispatch('events',{'caption':'STRASSE'})['total'],0)
        self.assertEqual(self.api.dispatch('events',{'q':'已撤回'})['total'],1)

    def test_recreated_name_preserves_two_distinct_histories(self):
        file=self.root/'交接单.txt'
        for value in ('第一版','第二版'):
            file.write_text(value,encoding='utf-8')
            self.scan()
        file.unlink()
        self.scan()
        file.write_text('新建',encoding='utf-8')
        self.scan()
        current=self.files(q='交接单')['items'][0]
        deleted=self.files(q='交接单',scope='deleted')['items'][0]
        self.assertNotEqual(current['id'],deleted['id'])
        self.assertEqual((current['version'],current['file_state']),(1,'当前在册'))
        self.assertEqual((deleted['version'],deleted['file_state']),(2,'已删除'))
        self.assertEqual(self.files(history=True)['total'],2)
        with self.assertRaisesRegex(ValueError,'同名文件'):
            self.store.restore_info(deleted['vid'])

    def test_excluded_paused_and_removed_root(self):
        for name in ('保留.txt','暂存.txt'):
            (self.root/name).write_text(name,encoding='utf-8')
        self.scan()
        self.store.configure(self.root,'暂存*',root_id=self.rid)
        self.scan()
        self.assertEqual(self.files(scope='excluded')['items'][0]['rel'],'暂存.txt')
        self.store.root_action(self.rid,'暂停')
        self.assertEqual(self.files()['items'][0]['file_state'],'目录已暂停')
        self.store.root_action(self.rid,'移除')
        self.assertEqual(self.files()['total'],0)
        self.assertEqual(self.files(scope='excluded')['total'],0)
        removed=self.files(scope='removed')
        self.assertEqual(removed['total'],2)
        self.assertTrue(all(f['file_state']=='目录已移除' for f in removed['items']))
        with self.assertRaises(ValueError):
            self.files(scope='invalid')
