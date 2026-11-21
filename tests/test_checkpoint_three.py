import codecs
import csv
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from engine import checkpoint_three
from engine.service import Service
from engine.store import Store


class CheckpointThreeTests(unittest.TestCase):
    def setUp(self):
        temp=tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.base=Path(temp.name)
        self.root=self.base/'输入'
        self.root.mkdir()
        self.store=Store(self.base/'Data')
        self.api=Service(self.store)
        self.rid=self.store.configure(self.root)

    def write(self,rel,body):
        target=self.root/rel
        target.parent.mkdir(parents=True,exist_ok=True)
        target.write_text(body,encoding='utf-8')
        return target

    def scan(self):
        self.store.scan(self.rid)

    def snapshot(self,label):
        self.scan()
        return self.api.dispatch('checkpoint_create',dict(root=self.rid,label=label))

    def move(self,source,dest):
        target=self.root/dest
        target.parent.mkdir(parents=True,exist_ok=True)
        (self.root/source).rename(target)
        self.scan()

    def compare(self,base,left,right,**opts):
        return self.api.dispatch('checkpoint_three',dict(base=base,left=left,right=right,**opts))

    def test_side_only_change_and_direction_swap(self):
        self.write('规格.txt','甲')
        base=self.snapshot('基准')
        self.write('规格.txt','甲乙')
        left=self.snapshot('较早结果')
        self.write('规格.txt','甲')
        right=self.snapshot('返回基准正文')
        first=self.compare(base,left,right)
        row,=first['items']
        self.assertEqual((row['kind'],row['left_kind'],row['right_kind']),('仅左侧变动','内容修改','相同'))
        self.assertEqual((row['left_delta'],row['right_delta']),(3,0))
        self.assertNotEqual(row['right']['num'],row['base']['num'])
        self.assertEqual(row['candidate_sha'],row['left']['sha'])
        swapped,=self.compare(base,right,left)['items']
        self.assertEqual((swapped['kind'],swapped['right_delta']),('仅右侧变动',3))

    def test_same_result_different_versions_counts_as_agreed(self):
        self.write('记录.txt','初始')
        base=self.snapshot('基准')
        self.write('记录.txt','统一内容')
        left=self.snapshot('左侧')
        self.write('记录.txt','临时')
        self.scan()
        self.write('记录.txt','统一内容')
        right=self.snapshot('右侧')
        row,=self.compare(base,left,right)['items']
        self.assertEqual(row['kind'],'两侧结果相同')
        self.assertEqual(row['candidate_path'],'记录.txt')
        self.assertNotEqual(row['left']['num'],row['right']['num'])
        self.assertFalse(row['review'])

    def test_complementary_rename_and_content_change_do_not_touch_live_files(self):
        self.write('旧.txt','原文')
        base=self.snapshot('基准')
        self.move('旧.txt','文件夹/新.txt')
        left=self.snapshot('移到子目录')
        self.move('文件夹/新.txt','旧.txt')
        self.write('旧.txt','新正文')
        right=self.snapshot('原路径改写')
        with patch.object(self.store,'obj',side_effect=AssertionError('must not read stored body')):
            result=self.compare(base,left,right)
        row,=result['items']
        self.assertEqual((row['kind'],row['candidate_path'],row['candidate_sha']),
                         ('两侧互补','文件夹/新.txt',row['right']['sha']))
        self.assertEqual((row['left_kind'],row['right_kind']),('路径变更','内容修改'))
        self.assertEqual((self.root/'旧.txt').read_text(encoding='utf-8'),'新正文')
        self.assertFalse((self.root/'文件夹/新.txt').exists())

    def test_three_conflict_types_are_separate(self):
        for name in ('正文','路径','两种'):
            self.write(name+'.txt','原文')
        base=self.snapshot('基准')
        self.write('正文.txt','左正文')
        self.move('路径.txt','左路径.txt')
        self.move('两种.txt','左两种.txt')
        self.write('左两种.txt','左正文')
        left=self.snapshot('左侧')
        self.move('左路径.txt','右路径.txt')
        self.move('左两种.txt','右两种.txt')
        self.write('右两种.txt','右正文')
        self.write('正文.txt','右正文')
        right=self.snapshot('右侧')
        data=self.compare(base,left,right,issues=True)
        self.assertEqual((data['total'],data['review']),(3,3))
        self.assertEqual(set(data['counts']),{'两侧内容冲突','两侧路径冲突','两侧路径与内容冲突'})
        self.assertTrue(all(not r['candidate_path'] and not r['candidate_sha'] for r in data['items']))

    def test_remove_vs_edit_and_both_removed(self):
        self.write('删除冲突.txt','初始')
        self.write('共同删除.txt','另一正文')
        base=self.snapshot('基准')
        self.write('删除冲突.txt','左侧还留有修改')
        (self.root/'共同删除.txt').unlink()
        left=self.snapshot('左侧')
        (self.root/'删除冲突.txt').unlink()
        right=self.snapshot('右侧')
        found={row['base']['rel']:row for row in self.compare(base,left,right)['items']}
        self.assertEqual(found['删除冲突.txt']['kind'],'移出与变动冲突')
        self.assertTrue(found['删除冲突.txt']['review'])
        self.assertIsNone(found['删除冲突.txt']['right'])
        self.assertEqual(found['共同删除.txt']['kind'],'两侧结果相同')
        self.assertFalse(found['共同删除.txt']['review'])
        self.assertEqual(found['共同删除.txt']['candidate_path'],'')

    def test_path_collision_uses_full_union_even_if_filtered_to_one_side(self):
        base=self.snapshot('空目录基准')
        original=self.write('Docs/Report.txt','左侧新增')
        left=self.snapshot('左侧')
        original.unlink()
        self.scan()
        self.write('Docs/REPORT.txt','右侧新增')
        right=self.snapshot('右侧')
        report=self.compare(base,left,right,collision=True)
        self.assertEqual((report['review'],report['collisions'],report['total']),(2,2,2))
        self.assertEqual({r['kind'] for r in report['items']},{'仅左侧变动','仅右侧变动'})
        for row in report['items']:
            self.assertEqual(row['other_count'],1)
            self.assertNotIn(row['file_id'],row['others'])
        one,=self.compare(base,left,right,kind='仅左侧变动')['items']
        self.assertTrue(one['review'])

    def test_unicode_path_collision_uses_nfc(self):
        self.assertEqual(checkpoint_three.portable_key('A/é.TXT'),checkpoint_three.portable_key('a/e\u0301.txt'))

    def test_file_and_descendant_candidate_cannot_coexist(self):
        base=self.snapshot('空目录基准')
        self.write('归档','左侧文件')
        left=self.snapshot('左侧')
        (self.root/'归档').unlink()
        self.scan()
        self.write('归档/内容.txt','右侧文件')
        right=self.snapshot('右侧')
        rows=self.compare(base,left,right,collision=True)['items']
        self.assertEqual({r['collision'] for r in rows},{'归档','归档/内容.txt'})
        self.assertTrue(all(r['other_count']==1 and r['review'] for r in rows))

    def test_filters_use_old_intermediate_and_new_paths_and_suffixes(self):
        self.write('目录/原名.csv','原文')
        base=self.snapshot('基准')
        self.move('目录/原名.csv','阶段/中名.tsv')
        left=self.snapshot('左侧')
        self.move('阶段/中名.tsv','完成/新名.txt')
        right=self.snapshot('右侧')
        report=self.compare(base,left,right,q='目录\\原名',ext='TSV，xlsx;tsv')
        self.assertEqual(report['total'],1)
        self.assertEqual(self.compare(base,left,right,q='阶段')['total'],1)
        self.assertEqual(self.compare(base,left,right,q='完成',ext='missing')['total'],0)

    def test_empty_and_unchanged_sets_and_paging(self):
        for i in range(23):
            self.write(f'归档/{i:02}.txt',str(i))
        base=self.snapshot('基准')
        left=self.snapshot('左侧')
        right=self.snapshot('右侧')
        self.assertEqual(self.compare(base,left,right)['total'],0)
        data=self.compare(base,left,right,unchanged=True,size=10,page=999)
        self.assertEqual((data['total'],data['page'],data['pages']),(23,3,3))
        self.assertEqual(len(data['items']),3)
        self.assertEqual(data['counts'],{'相同':23})
        self.assertEqual(self.compare(base,left,right,kind='相同')['total'],23)

    def test_summary_deltas_cover_selected_set_and_review_first(self):
        self.write('大变动.txt','A')
        self.write('争用.txt','A')
        base=self.snapshot('基准')
        self.write('大变动.txt','a'*100)
        self.write('争用.txt','left')
        left=self.snapshot('左侧')
        self.write('大变动.txt','A')
        self.write('争用.txt','right')
        right=self.snapshot('右侧')
        result=self.compare(base,left,right)
        self.assertTrue(result['items'][0]['review'])
        self.assertEqual((result['left_delta'],result['right_delta']),(102,4))
        self.assertEqual(self.compare(base,left,right,sort='impact')['items'][0]['base']['rel'],'大变动.txt')

    def test_reject_mixed_roots_duplicates_old_order_and_limit(self):
        self.write('文件.txt','A')
        base=self.snapshot('基准')
        left=self.snapshot('左')
        right=self.snapshot('右')
        other=self.base/'其他监控'
        other.mkdir()
        oid=self.store.configure(other)
        self.store.scan(oid)
        fourth=self.api.dispatch('checkpoint_create',dict(root=oid,label='其他'))
        for args in ((base,base,right),(base,left,fourth),(left,base,right),(base,left,99999)):
            with self.subTest(args=args),self.assertRaises(ValueError):
                self.compare(*args)
        with patch.object(checkpoint_three,'LIMIT',2),self.assertRaisesRegex(ValueError,'10 万'):
            self.compare(base,left,right)

    def test_csv_base_and_deltas_atomic_output_and_audit(self):
        for i in range(12):
            self.write(f'=项目{i:02},对象.txt','A')
        base=self.snapshot('基准')
        left=self.snapshot('左侧')
        right=self.snapshot('右侧')
        dest=self.base/'三方.csv'
        args=dict(base=base,left=left,right=right,size=10,page=2,unchanged=True,path=str(dest))
        self.api.dispatch('checkpoint_three_csv',args)
        self.assertTrue(dest.read_bytes().startswith(codecs.BOM_UTF8))
        with dest.open(encoding='utf-8-sig',newline='') as stream:
            rows=list(csv.DictReader(stream))
        self.assertEqual(len(rows),12)
        self.assertEqual(rows[0]['基准路径'],"'=项目00,对象.txt")
        self.assertEqual(rows[0]['右侧清单'],'右侧')
        self.assertEqual(rows[0]['右侧字节差'],'0')
        with self.assertRaises(FileExistsError):
            self.api.dispatch('checkpoint_three_csv',args)
        for invalid in (self.store.home/'内.csv',self.base/'非.csv.log'):
            with self.assertRaises(ValueError):
                self.api.dispatch('checkpoint_three_csv',dict(args,path=str(invalid)))
        audit=self.api.dispatch('audit',{'action':'导出目录清单三方对照'})
        self.assertEqual(audit['total'],1)
        with self.store.db() as db:
            self.assertEqual(db.execute('PRAGMA user_version').fetchone()[0],11)
