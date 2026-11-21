import codecs
import csv
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from engine import line_origins
from engine.service import Service
from engine.store import Store


class LineOriginsTests(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.base = Path(tmp.name)
        self.root = self.base/'监控'
        self.root.mkdir()
        self.store = Store(self.base/'仓库')
        self.api = Service(self.store)
        self.rid = self.store.configure(self.root)

    def save(self, content, name='日志.txt'):
        path = self.root/name
        path.write_bytes(content if isinstance(content,bytes) else content.encode())
        self.store.scan(self.rid)
        with self.store.db() as db:
            return dict(db.execute("SELECT v.* FROM versions v JOIN files f ON f.id=v.file_id WHERE f.rel=? ORDER BY v.num DESC LIMIT 1",(name,)).fetchone())

    def trace(self, row, **conditions):
        return self.api.dispatch('line_origins',dict(id=row['id'],**conditions))

    def test_first_insertion_and_edit_go_to_distinct_versions(self):
        first = self.save('标题\n初始字段\n尾部\n')
        second = self.save('标题\n插入行\n初始字段\n尾部\n')
        third = self.save('标题\n插入行\n本次修改\n尾部\n')
        report = self.trace(third)
        self.assertEqual([v['id'] for v in report['chain']],[third['id'],second['id'],first['id']])
        self.assertEqual([(r['origin']['id'],r['source_line'],r['kind']) for r in report['items']],
                         [(first['id'],1,'initial'),(second['id'],2,'introduced'),
                          (third['id'],3,'introduced'),(first['id'],3,'initial')])
        self.assertEqual((report['target']['rel'],report['target']['encoding']),('日志.txt','UTF-8'))
        self.assertEqual(report['boundary']['reason'],'已到首次建档')

    def test_historical_target_and_deleted_line_readded(self):
        early = self.save('上\n删除后重加\n下')
        middle = self.save('上\n下')
        latest = self.save('上\n删除后重加\n下')
        disk = self.root/'日志.txt'
        disk.write_text('unscanned',encoding='utf-8')
        self.assertEqual(self.trace(early)['total'],3)
        self.assertEqual(self.trace(middle)['total'],2)
        new, = self.trace(latest,kind='target')['items']
        self.assertEqual((new['text'],new['origin']['num']),('删除后重加',3))
        disk.unlink()
        self.store.scan(self.rid)
        self.assertEqual(self.trace(latest)['total'],3)

    def test_unique_move_is_optional_and_does_not_count_simple_line_shift(self):
        self.save('top\nmove\nA\nB\nbottom')
        second = self.save('top\nnew line\nA\nB\nmove\nbottom')
        ordinary, = [r for r in self.trace(second)['items'] if r['text']=='move']
        self.assertEqual(ordinary['origin']['num'],2)
        moved, = self.trace(second,moves=True,kind='moved')['items']
        self.assertEqual((moved['text'],moved['source_line'],moved['origin']['num'],moved['moves']),('move',2,1,1))
        self.assertFalse(self.trace(second,moves=True,q='B',kind='moved')['items'])

    def test_repeated_lines_and_blank_lines_are_not_relabelled_as_unique_moves(self):
        self.save('start\nsame\nsame\n\nanchor1\nanchor2\nanchor3\nanchor4\nfinal')
        chosen = self.save('start\nanchor1\nanchor2\nanchor3\nanchor4\nsame\nsame\n\nfinal')
        result = self.trace(chosen,moves=True)
        self.assertEqual(result['counts']['moved'],0)
        self.assertEqual([r['line'] for r in result['items'] if r['text']==''],[8])

    def test_truncation_bounds_only_the_preview_not_matching_or_export(self):
        row = self.save('L'*390+'尾部匹配\n第二行')
        result = self.trace(row,q='尾部匹配')
        item, = result['items']
        self.assertEqual((len(item['text']),item['truncated'],item['line']),(360,True,1))
        dest = self.base/'原文.csv'
        self.api.dispatch('line_origins_csv',dict(id=row['id'],q='尾部匹配',path=str(dest)))
        with dest.open(encoding='utf-8-sig',newline='') as stream:
            exported, = list(csv.DictReader(stream))
        self.assertTrue(exported['原文'].endswith('尾部匹配'))

    def test_mixed_physical_newlines_and_encoding_changes(self):
        self.save('首行\r\n\r尾行\n')
        changed = self.save(codecs.BOM_UTF16_LE+'首行\n\n尾行\r\n'.encode('utf-16-le'))
        result = self.trace(changed)
        self.assertEqual(result['target']['encoding'],'UTF-16 LE')
        self.assertEqual([(r['text'],r['origin']['num'],r['source_line']) for r in result['items']],
                         [('首行',1,1),('',1,2),('尾行',1,3)])
        self.assertEqual(self.trace(self.save(''))['lines'],0)
        self.assertEqual(self.trace(self.save('\n'))['lines'],1)

    def test_depth_preserves_confirmed_and_marks_other_lines_unknown(self):
        for i in range(1,8):
            target=self.save(f'稳定行\n变动 {i}')
        shallow=self.trace(target,depth=5)
        self.assertEqual((len(shallow['chain']),shallow['boundary']['reason']),(5,'达到所选追溯深度'))
        unknown,=self.trace(target,depth=5,kind='unknown')['items']
        self.assertEqual((unknown['origin']['num'],unknown['source_line']),(3,1))
        recent,=self.trace(target,depth=5,kind='target')['items']
        self.assertEqual(recent['origin']['num'],7)
        self.assertEqual(self.trace(target,depth=10,kind='initial')['total'],1)

    def test_missing_older_snapshot_preserves_newer_attribution(self):
        earlier=self.save('稳定\n甲')
        self.save('稳定\n乙')
        last=self.save('稳定\n丙')
        self.store.obj(earlier['sha']).unlink()
        report=self.trace(last)
        self.assertEqual(report['boundary'],dict(reason='副本缺失或不可读',num=1))
        self.assertEqual([(r['kind'],r['origin']['num']) for r in report['items']],[('unknown',2),('introduced',3)])
        with self.assertRaisesRegex(ValueError,'无法追溯目标版本'):
            self.trace(earlier)

    def test_corrupt_or_binary_targets_are_explicit_failures(self):
        text=self.save('target')
        self.store.obj(text['sha']).write_bytes(b'xarget')
        with self.assertRaisesRegex(ValueError,'副本校验失败'):
            self.trace(text)
        invalid=self.save(b'NUL\0','其他.txt')
        with self.assertRaisesRegex(ValueError,'文本编码无法读取'):
            self.trace(invalid)
        binary=self.save('text','未知.bin')
        with self.assertRaisesRegex(ValueError,'不支持'):
            self.trace(binary)

    def test_chain_refuses_cross_file_or_nonconsecutive_parent(self):
        self.save('A\nB')
        target=self.save('A\nC')
        other=self.save('A\nC','旁系.txt')
        with self.store.db() as db:
            db.execute('UPDATE versions SET parent_id=? WHERE id=?',(other['id'],target['id']))
        report=self.trace(target)
        self.assertEqual(report['boundary']['reason'],'版本链缺失或不连续')
        self.assertEqual(report['counts']['unknown'],2)

    def test_work_and_byte_limits_preserve_honest_boundary(self):
        self.save('A\nB\nC')
        target=self.save('A\nZ\nC')
        with patch.object(line_origins,'COMPARE_BUDGET',0):
            self.assertEqual(self.trace(target)['boundary']['reason'],'达到逐行比较上限')
        with patch.object(line_origins,'TOTAL_BYTES',target['size']):
            self.assertEqual(self.trace(target)['boundary']['reason'],'达到累计读取上限')
        with patch.object(line_origins,'MAX_LINES',2):
            with self.assertRaisesRegex(ValueError,'超过'):
                self.trace(target)
        with patch.object(line_origins,'FILE_BYTES',2):
            with self.assertRaisesRegex(ValueError,'超过'):
                self.trace(target)

    def test_filters_combined_and_page_numbers_clamped(self):
        baseline=self.save('\n'.join(f'Straße {i}' for i in range(1,46)))
        target=self.save('\n'.join(f'Straße {i}' for i in range(1,46))+'\nnew')
        filtered=self.trace(target,q='STRASSE',kind='earlier',origin=baseline['id'],low=2,high=45,size=20,page=99)
        self.assertEqual((filtered['total'],filtered['page'],filtered['pages']),(44,3,3))
        self.assertEqual([r['line'] for r in filtered['items']],[42,43,44,45])
        self.assertEqual(self.trace(target,q='STRASSE',sensitive=True)['total'],0)
        self.assertEqual(self.trace(target,q='STRASSE 2',exact=True)['total'],1)
        self.assertEqual(self.trace(target,q='Straße 2',exact=True,sensitive=True)['total'],1)
        self.assertEqual(self.trace(target,origin=target['id'])['total'],1)

    def test_csv_reuses_filters_writes_all_matching_rows_and_protects_destination(self):
        target=self.save('=公式,说明\n'+'\n'.join(f'记录 {i}' for i in range(40)))
        dest=self.base/'结果.csv'
        options=dict(id=target['id'],path=str(dest),size=20,page=2)
        self.api.dispatch('line_origins_csv',options)
        self.assertTrue(dest.read_bytes().startswith(codecs.BOM_UTF8))
        with dest.open(encoding='utf-8-sig',newline='') as stream:
            rows=list(csv.DictReader(stream))
        self.assertEqual((len(rows),rows[0]['原文'],rows[-1]['目标行号']),(41,"'=公式,说明",'41'))
        with self.assertRaises(FileExistsError):
            self.api.dispatch('line_origins_csv',options)
        with self.assertRaises(ValueError):
            self.api.dispatch('line_origins_csv',dict(options,path=str(self.store.home/'内.csv')))
        with self.assertRaises(ValueError):
            self.api.dispatch('line_origins_csv',dict(options,q='不存在',path=str(self.base/'空.csv')))
        with self.store.db() as db:
            self.assertEqual(db.execute("SELECT count(*) FROM audit WHERE action='导出逐行来源'").fetchone()[0],1)

    def test_validation_and_existing_repository_format(self):
        row=self.save('确定')
        for args in ({'id':0},{'depth':2},{'size':16},{'low':3,'high':2},{'moves':'yes'},
                     {'kind':'invalid'},{'q':'with\nnewline'},{'q':'字'*161},{'high':False}):
            with self.subTest(args=args),self.assertRaises(ValueError):
                self.api.dispatch('line_origins',{ 'id':row['id'],**args})
        self.assertEqual(self.trace(row)['total'],1)
        with self.store.db() as db:
            self.assertEqual(db.execute('PRAGMA user_version').fetchone()[0],11)
