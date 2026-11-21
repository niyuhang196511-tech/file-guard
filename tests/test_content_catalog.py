import codecs
import csv
import hashlib
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from engine import content_catalog
from engine.service import Service
from engine.store import Store


def sha(text):
    return hashlib.sha256(text.encode()).hexdigest()


class ContentCatalogTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.base = Path(temporary.name)
        self.store = Store(self.base/'Data')
        self.api = Service(self.store)
        self.root, self.rid = self.directory('监控')
        self.other, self.oid = self.directory('异地')

    def dispatch(self, cmd, **args):
        return self.api.dispatch(cmd, args)

    def directory(self, name):
        path = self.base/name
        path.mkdir()
        return path, self.store.configure(path)

    def write(self, name, text, root=None):
        path = (root or self.root)/name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding='utf-8')
        return path

    def scan(self, rid=None, stamp=None):
        if stamp is None:
            self.store.scan(rid or self.rid)
        else:
            with patch('engine.store.now', return_value=stamp):
                self.store.scan(rid or self.rid)

    def groups(self, **args):
        return self.dispatch('content_groups', **args)

    def refs(self, text, **args):
        return self.dispatch('content_refs', sha=sha(text), **args)

    def verify(self, text):
        return self.dispatch('content_verify', sha=sha(text))

    def test_cross_folder_group_counts_and_bytes(self):
        self.write('original.txt','审核')
        self.write('copy.md','审核',self.other)
        self.write('original.txt','不同',self.other)
        self.scan()
        self.scan(self.oid)
        result = self.groups()
        row, = result['items']
        self.assertEqual((row['sha'],row['size'],row['versions'],row['files'],row['roots'],row['formats'],row['latest']),
                         (sha('审核'),6,2,2,2,2,2))
        self.assertEqual((row['logical'],row['saved']), (12,6))
        self.assertEqual(result['summary'],dict(total=1,versions=2,unique_bytes=6,logical=12,saved=6,conflicts=0))
        self.assertEqual(self.groups(mode='all')['total'],2)

    def test_same_file_returns_to_earlier_body(self):
        for text in ('original','changed','original'):
            self.write('track.txt',text)
            self.scan()
        self.assertFalse(self.groups()['items'])
        for mode in ('repeat','shared'):
            row, = self.groups(mode=mode)['items']
            self.assertEqual((row['versions'],row['files'],row['latest'],row['saved']), (2,1,1,8))
        self.assertEqual([row['num'] for row in self.refs('original')['items']], [3,1])
        self.assertFalse(self.groups(mode='repeat',latest=True)['items'])

    def test_empty_files_opt_in_and_exact_reference_default(self):
        self.write('empty.txt','')
        self.write('copy.md','')
        self.scan()
        self.assertEqual(self.groups()['total'],0)
        row, = self.groups(empty=True,maximum=0)['items']
        self.assertEqual((row['sha'],row['saved'],row['versions']), (sha(''),0,2))
        self.assertEqual(self.refs('')['total'],2)
        self.assertEqual(self.refs('',empty=False)['total'],0)
        self.assertEqual(self.verify('')['actual'],0)

    def test_filters_precede_groups_and_full_references_remain_available(self):
        self.write('Reports/甲.csv','body')
        self.write('Reports/乙.CSV','body')
        self.write('archive.md','body',self.other)
        self.scan()
        self.scan(self.oid)
        opts = dict(sha=sha('body')[:8].upper(), root=self.rid, q=' REPORTS\\ ',
                    ext='CSV，.md;csv', minimum=4, maximum=4)
        row, = self.groups(**opts)['items']
        self.assertEqual((row['versions'],row['roots'],row['formats']), (2,1,1))
        self.assertEqual(self.refs('body')['total'],3)
        opts.pop('sha')
        self.assertEqual(self.refs('body',**opts)['total'],2)
        self.assertEqual(self.groups(root=self.oid)['total'],0)
        self.assertEqual(self.groups(mode='all',root=self.oid)['total'],1)

    def test_latest_status_uses_actual_file_latest_version(self):
        self.write('same.txt','same')
        self.write('copy.txt','same')
        self.scan()
        self.write('same.txt','newer')
        self.scan()
        self.assertEqual(self.groups()['items'][0]['latest'],1)
        self.assertFalse(self.groups(latest=True)['items'])
        matches = self.refs('same')['items']
        self.assertEqual({r['rel']:r['latest'] for r in matches},{'same.txt':0,'copy.txt':1})
        self.assertEqual(self.refs('same',latest=True)['items'][0]['rel'],'copy.txt')

    def test_dates_inclusive_and_star_filter(self):
        self.write('first.txt','body')
        self.scan(stamp='2025-12-30T08:30:00+08:00')
        self.write('second.txt','body')
        self.scan(stamp='2025-12-31T23:59:59+08:00')
        self.write('third.txt','body')
        self.scan(stamp='2026-01-01T00:00:00+08:00')
        result = self.refs('body', start='2025-12-31',end='2025-12-31')
        row, = result['items']
        self.assertEqual(row['rel'],'second.txt')
        self.dispatch('star_file', id=row['file_id'],starred=True)
        self.assertEqual(self.refs('body',starred=True)['total'],1)
        group, = self.groups(mode='all',start='2025-12-30',end='9999-12-31')['items']
        self.assertEqual((group['first_stamp'][:10],group['last_stamp'][:10]),('2025-12-30','2026-01-01'))

    def test_renames_use_registered_path_and_saved_extension(self):
        path = self.write('old.log','earlier')
        self.scan()
        renamed = path.rename(self.root/'latest.txt')
        self.scan()
        renamed.write_text('later')
        self.scan()
        previous, = self.refs('earlier',ext='.LOG')['items']
        self.assertEqual((previous['rel'],previous['ext'],previous['latest']),('latest.txt','.log',0))
        self.assertFalse(self.refs('earlier',q='old.log')['items'])
        self.assertTrue(self.refs('earlier',q='LATEST.TXT')['items'])

    def test_active_paused_excluded_removed_deleted_states(self):
        gone = self.write('gone.txt','body')
        self.write('one.txt','body')
        self.write('two.md','body',self.other)
        self.scan()
        self.scan(self.oid)
        gone.unlink()
        self.scan()
        self.store.root_action(self.oid,'暂停')
        self.assertEqual(self.refs('body',state='目录已暂停')['items'][0]['rel'],'two.md')
        self.assertEqual(self.refs('body',state='已删除')['items'][0]['rel'],'gone.txt')
        self.store.configure(self.root,patterns='one.txt',root_id=self.rid)
        self.scan()
        self.assertEqual(self.refs('body',state='规则已排除')['items'][0]['rel'],'one.txt')
        self.store.root_action(self.oid,'移除')
        self.assertEqual(self.refs('body',state='目录已移除')['items'][0]['rel'],'two.md')
        self.assertEqual(self.refs('body',state='当前在册')['total'],0)

    def test_deleted_and_recreated_same_path_counts_two_files(self):
        one = self.write('same.txt','same')
        self.scan()
        one.unlink()
        self.scan()
        self.write('same.txt','same')
        self.scan()
        rows = self.refs('same')['items']
        self.assertEqual({r['state'] for r in rows},{'当前在册','已删除'})
        self.assertEqual(len({r['file_id'] for r in rows}),2)
        self.assertEqual(self.groups()['items'][0]['files'],2)

    def test_group_paging_and_order_and_reference_order(self):
        for i in range(1,13):
            self.write(f'a{i:02}.txt','x'*i)
            self.write(f'b{i:02}.txt','x'*i)
        self.scan()
        first = self.groups(size=10,sort='bytes')
        last = self.groups(size=10,sort='bytes',page=99)
        self.assertEqual((first['total'], first['pages'], last['page']), (12,2,2))
        self.assertEqual([r['size'] for r in first['items']+last['items']],list(range(12,0,-1)))
        for order in ('recent','saved','files','versions'):
            self.assertEqual(self.groups(sort=order)['total'],12)
        self.assertEqual([r['rel'] for r in self.refs('xxx',sort='path')['items']],['a03.txt','b03.txt'])
        recent = [r['id'] for r in self.refs('xxx',sort='recent')['items']]
        self.assertEqual(recent,[r['id'] for r in reversed(self.refs('xxx',sort='oldest')['items'])])

    def test_integrity_results_are_independent_of_previous_disk_edits(self):
        path = self.write('one.txt','saved')
        self.scan()
        obj = self.store.obj(sha('saved'))
        path.write_text('not yet saved')
        self.assertEqual(self.verify('saved')['status'],'通过')
        obj.write_bytes(b'wrong')
        self.assertEqual(self.verify('saved')['status'],'内容摘要不符')
        obj.write_bytes(b'longer')
        self.assertEqual(self.verify('saved')['status'],'长度不符')
        obj.unlink()
        self.assertEqual(self.verify('saved')['status'],'缺少对象')
        obj.mkdir()
        self.assertEqual(self.verify('saved')['status'],'非普通对象')
        self.assertEqual(self.groups(mode='all')['total'],1)

    def test_small_verification_limit_and_group_length_conflict(self):
        self.write('first.txt','saved')
        self.write('second.txt','saved')
        self.scan()
        with patch.object(content_catalog,'VERIFY_LIMIT',4), patch('engine.health.assess') as assess:
            check = self.verify('saved')
            self.assertEqual((check['status'],check['expected'],check['actual']),('超过单对象校验上限',5,None))
            assess.assert_not_called()
        with self.store.db() as db:
            db.execute("UPDATE versions SET size=10 WHERE id=(SELECT max(id) FROM versions)")
        group = self.groups()
        self.assertEqual((group['items'][0]['conflict'],group['items'][0]['size']), (1,None))
        self.assertEqual((group['summary']['saved'],group['summary']['conflicts']), (0,1))
        self.assertEqual(self.verify('saved')['status'],'索引长度冲突')

    def test_export_fields_escaping_publication_and_limits(self):
        self.write('=路径,中文.txt','body')
        self.write('text.md','body')
        self.scan()
        groups = self.base/'分组.csv'
        refs = self.base/'明细.csv'
        self.dispatch('content_groups_csv',path=str(groups),size=10,page=99)
        self.dispatch('content_refs_csv',path=str(refs),sha=sha('body'),sort='path')
        self.assertTrue(groups.read_bytes().startswith(codecs.BOM_UTF8))
        with groups.open(encoding='utf-8-sig',newline='') as stream:
            summary, = list(csv.DictReader(stream))
        self.assertEqual((summary['版本引用'],summary['复用字节'],summary['长度冲突']),('2','4','否'))
        with refs.open(encoding='utf-8-sig',newline='') as stream:
            rows = list(csv.DictReader(stream))
        self.assertEqual(rows[0]['最近登记路径'],"'=路径,中文.txt")
        self.assertEqual(rows[0]['是否最新版'],'是')
        with self.assertRaises(FileExistsError):
            self.dispatch('content_groups_csv',path=str(groups))
        with self.assertRaises(ValueError):
            self.dispatch('content_groups_csv',path=str(self.store.home/'unsafe.csv'))
        with self.assertRaises(ValueError):
            self.dispatch('content_groups_csv',path=str(self.base/'not-csv.log'))
        never = self.base/'unpublished.csv'
        with patch.object(content_catalog,'EXPORT_LIMIT',1),self.assertRaises(ValueError):
            self.dispatch('content_refs_csv',path=str(never),sha=sha('body'))
        self.assertFalse(never.exists())
        with self.store.db() as db:
            actions = db.execute("SELECT action FROM audit WHERE action LIKE '导出%' ORDER BY id").fetchall()
        self.assertEqual([i[0] for i in actions],['导出相同正文分组','导出正文引用明细'])

    def test_options_and_missing_digest_validation(self):
        for args in ({'sha':'abc'}, {'sha':'g'*64}, {'end':'2025-02-30'}, {'end':'2025-01-01','start':'2025-01-02'},
                     {'minimum':9,'maximum':2}, {'minimum':-1}, {'maximum':1.2}, {'root':True}, {'size':11},
                     {'mode':'invalid'}, {'sort':'invalid'}, {'state':'invalid'}, {'starred':'yes'}, {'q':'x'*513},
                     {'ext':','.join(map(str,range(33)))}):
            with self.subTest(args=args), self.assertRaises(ValueError):
                self.groups(**args)
        self.assertEqual(self.groups(sha='f'*64,mode='all')['total'],0)
        with self.assertRaises(ValueError):
            self.dispatch('content_refs',sha='abcdef')
        with self.assertRaises(ValueError):
            self.refs('absent')
        with self.assertRaises(ValueError):
            self.verify('absent')

    def test_group_reads_metadata_without_object_inspection_or_database_changes(self):
        self.write('test.txt','content')
        self.scan()
        with patch.object(self.store,'obj',side_effect=AssertionError('unexpected read')):
            self.assertEqual(self.groups(mode='all')['total'],1)
            self.assertEqual(self.refs('content')['total'],1)
        with self.store.db() as db:
            self.assertEqual(db.execute('PRAGMA user_version').fetchone()[0],11)
            self.assertEqual(db.execute('SELECT count(*) FROM versions').fetchone()[0],1)
