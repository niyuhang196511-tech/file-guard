from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import tempfile
from threading import Barrier
import unittest
from unittest.mock import patch

from engine import review
from engine.service import Service
from engine.store import Store


class ReviewBatchTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.base = Path(temporary.name)
        self.folder = self.base/'监控'
        self.folder.mkdir()
        self.store = Store(self.base/'Data')
        self.api = Service(self.store)
        self.rid = self.store.configure(self.folder)

    def capture(self, *files):
        for name in files:
            path = self.folder/name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(name,encoding='utf-8')
        self.store.scan(self.rid)
        queue = self.api.dispatch('review_queue',{'baseline':True,'sort':'oldest','size':100})
        return queue['items']

    def call(self,cmd,**opts):
        return self.api.dispatch(cmd,opts)

    def args(self,rows,**opts):
        return dict(targets=[dict(id=r['id'],revision=r['revision']) for r in rows],**opts)

    def preview(self,opts):
        return self.call('review_batch_preview',**opts)

    def apply(self,opts,report):
        return self.call('review_batch_apply',**opts,token=report['token'])

    def current(self,row):
        return next(v for v in self.call('history',id=row['file_id']) if v['id']==row['id'])

    def save_one(self,row,state,note,revision=None):
        return self.call('save_review',id=row['id'],revision=row['revision'] if revision is None else revision,
                         state=state,note=note)

    def test_preview_is_read_only_and_explicit_selection_only(self):
        first, second, other = self.capture('甲.txt','乙.txt','其他.txt')
        opts=self.args([first,second],state='已复核',mode='keep')
        report=self.preview(opts)
        self.assertEqual((report['total'],report['counts']['change'],len(report['token'])),(2,2,64))
        self.assertTrue(all(self.current(v)['revision']==0 for v in (first,second,other)))
        outcome=self.apply(opts,report)
        self.assertEqual((outcome['applied'],outcome['changed'],outcome['unchanged']),(True,2,0))
        self.assertEqual([self.current(v)['review'] for v in (first,second,other)],['已复核','已复核','待复核'])
        self.assertEqual(self.current(first)['reviewed_at'],self.current(second)['reviewed_at'])

    def test_keep_notes_and_count_unchanged_without_increment(self):
        first,second=self.capture('a.txt','b.txt')
        self.save_one(first,'待复核','既有记录 A')
        self.save_one(second,'已复核','既有记录 B')
        current=[self.current(v) for v in (first,second)]
        opts=self.args(current,state='已复核')
        report=self.preview(opts)
        self.assertEqual((report['counts']['change'],report['counts']['same']),(1,1))
        self.assertTrue(self.apply(opts,report)['applied'])
        values=[self.current(v) for v in (first,second)]
        self.assertEqual([(v['note'],v['revision']) for v in values],[('既有记录 A',2),('既有记录 B',1)])

    def test_append_note_separates_lines_and_retry_cannot_append_twice(self):
        first, second=self.capture('a.txt','b.txt')
        self.save_one(first,'待复核','初次意见')
        opts=self.args([self.current(first),second],mode='append',note='  第二次意见  ')
        report=self.preview(opts)
        self.assertTrue(self.apply(opts,report)['applied'])
        again=self.apply(opts,report)
        self.assertFalse(again['applied'])
        self.assertEqual(again['preview']['counts']['conflict'],2)
        self.assertEqual(self.current(first)['note'],'初次意见\n第二次意见')
        self.assertEqual(self.current(second)['note'],'第二次意见')

    def test_clear_replacement_applies_only_when_final_state_allows(self):
        first,second=self.capture('a.txt','b.txt')
        self.save_one(first,'需跟进','旧意见')
        self.save_one(second,'待复核','其他意见')
        opts=self.args([self.current(first),self.current(second)],mode='replace',note='')
        preview=self.preview(opts)
        self.assertEqual((preview['counts']['invalid'],preview['counts']['change']),(1,1))
        self.assertEqual(preview['token'],'')
        self.assertEqual(self.current(second)['note'],'其他意见')
        replacement=dict(opts,state='已复核')
        self.assertTrue(self.apply(replacement,self.preview(replacement))['applied'])
        self.assertEqual(self.current(first)['note'],'')
        self.assertEqual(self.current(second)['note'],'')

    def test_combined_note_length_and_followup_validated_per_item(self):
        first,second=self.capture('a.txt','b.txt')
        self.save_one(first,'待复核','中'*1999)
        args=self.args([self.current(first),second],mode='append',note='字')
        plan=self.preview(args)
        self.assertEqual(plan['counts']['invalid'],1)
        self.assertEqual(plan['counts']['change'],1)
        self.assertIn('超过 2000',plan['items'][0]['issue'])
        followup=self.args([self.current(first),second],state='需跟进')
        self.assertEqual(self.preview(followup)['counts']['invalid'],1)

    def test_revision_conflict_after_preview_aborts_entire_batch(self):
        first,second=self.capture('a.txt','b.txt')
        opts=self.args([first,second],state='已复核')
        report=self.preview(opts)
        self.save_one(second,'需跟进','并行复核意见')
        denied=self.apply(opts,report)
        self.assertFalse(denied['applied'])
        item=next(v for v in denied['preview']['items'] if v['id']==second['id'])
        self.assertEqual((item['expected'],item['revision'],item['note']),(0,1,'并行复核意见'))
        self.assertEqual(self.current(first)['revision'],0)
        reselected=self.args([first,self.current(second)],state='已复核')
        self.assertTrue(self.apply(reselected,self.preview(reselected))['applied'])
        self.assertEqual(self.current(second)['note'],'并行复核意见')

    def test_token_binds_membership_reason_and_operations(self):
        first,second=self.capture('a.txt','b.txt')
        opts=self.args([first,second],state='已复核',reason='月末复核')
        report=self.preview(opts)
        self.assertEqual(self.preview(dict(opts,targets=list(reversed(opts['targets']))))['token'],report['token'])
        for tampered in (dict(opts,reason='其他说明'),dict(opts,state='需跟进',mode='replace',note='补记'),
                         dict(opts,targets=opts['targets'][:1])):
            self.assertFalse(self.apply(tampered,report)['applied'])
        self.assertEqual(self.current(first)['revision'],0)

    def test_missing_targets_are_reported_and_cannot_be_applied(self):
        first,=self.capture('a.txt')
        clean=self.args([first],state='已复核')
        real=self.preview(clean)
        bad=dict(clean,targets=[*clean['targets'],{'id':700000,'revision':0}])
        result=self.apply(bad,real)
        self.assertFalse(result['applied'])
        self.assertEqual(result['preview']['counts']['missing'],1)
        self.assertEqual(self.current(first)['revision'],0)

    def test_noop_does_not_add_revision_or_audit(self):
        first,=self.capture('a.txt')
        outcome=self.preview(self.args([first],state='待复核'))
        self.assertEqual((outcome['counts']['same'],outcome['token']),(1,''))
        with self.store.db() as db:
            self.assertEqual(db.execute("SELECT count(*) FROM audit WHERE action LIKE '%版本复核'").fetchone()[0],0)
            self.assertEqual(db.execute('SELECT count(*) FROM version_reviews').fetchone()[0],0)

    def test_simultaneous_submissions_commit_only_once(self):
        first,second=self.capture('a.txt','b.txt')
        opts=self.args([first,second],mode='append',note='并发测试')
        preview=self.preview(opts)
        barrier=Barrier(2,timeout=5)
        def compete():
            barrier.wait()
            return self.apply(opts,preview)['applied']
        with ThreadPoolExecutor(max_workers=2) as pool:
            a=pool.submit(compete)
            b=pool.submit(compete)
            self.assertEqual(sorted([a.result(timeout=8),b.result(timeout=8)]),[False,True])
        self.assertTrue(all(self.current(v)['note']=='并发测试' for v in (first,second)))

    def test_exception_after_first_review_rolls_back_data_and_audit(self):
        first,second=self.capture('a.txt','b.txt')
        opts=self.args([first,second],state='已复核')
        preview=self.preview(opts)
        original=review.write_review
        def fail_second(*args):
            if args[2]['id']==preview['items'][-1]['id']:
                raise RuntimeError('模拟后续写入错误')
            original(*args)
        with patch.object(review,'write_review',side_effect=fail_second),self.assertRaises(RuntimeError):
            self.apply(opts,preview)
        self.assertTrue(all(self.current(v)['revision']==0 for v in (first,second)))
        with self.store.db() as db:
            self.assertEqual(db.execute("SELECT count(*) FROM audit WHERE action LIKE '%版本复核'").fetchone()[0],0)
        self.assertTrue(self.apply(opts,preview)['applied'])

    def test_audit_links_entries_and_does_not_touch_snapshots(self):
        first,second=self.capture('a.txt','b.txt')
        opts=self.args([first,second],state='需跟进',mode='replace',note='待办',reason='业务复查')
        receipt=self.apply(opts,self.preview(opts))
        audit=self.call('audit',q=receipt['batch'])['items']
        self.assertEqual([v['action'] for v in audit],['批量更新版本复核','更新版本复核','更新版本复核'])
        self.assertIn('业务复查',audit[0]['note'])
        self.assertIn('本次意见：待办',audit[-1]['note'])
        self.assertEqual(self.current(first)['sha'],first['sha'])
        self.assertEqual(self.store.obj(first['sha']).read_text(),first['rel'])
        reopened=Service(Store(self.store.home))
        self.assertEqual(reopened.dispatch('history',{'id':second['file_id']})[0]['note'],'待办')

    def test_bad_requests_rejected_and_schema_preserved(self):
        first,=self.capture('a.txt')
        opts=self.args([first],state='已复核')
        malformed=[dict(opts,targets=[]),dict(opts,targets=opts['targets']*2),
                   dict(opts,targets=[{'id':i,'revision':0} for i in range(1,102)]),
                   dict(opts,targets=[{'id':True,'revision':0}]),dict(opts,targets=[{'id':1,'revision':-1}]),
                   dict(opts,note='文'*2001),dict(opts,reason='文'*301),dict(opts,state='未知'),
                   dict(opts,mode='append',note=' '),dict(opts,state='',mode='keep')]
        for case in malformed:
            with self.subTest(case=case.get('mode')),self.assertRaises(ValueError):
                self.preview(case)
        with self.assertRaisesRegex(ValueError,'先预览'):
            self.call('review_batch_apply',**opts)
        with self.store.db() as db:
            self.assertEqual(db.execute('PRAGMA user_version').fetchone()[0],11)

    def test_batch_capacity_updates_all_one_hundred_items(self):
        rows=self.capture(*(f'item-{i:03}.txt' for i in range(100)))
        opts=self.args(rows,state='已复核')
        receipt=self.apply(opts,self.preview(opts))
        self.assertEqual(receipt['changed'],100)
        self.assertEqual(self.call('review_queue',baseline=True,state='已复核')['total'],100)
