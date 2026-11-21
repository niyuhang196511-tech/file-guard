import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from docx import Document
from docx.enum.section import WD_SECTION
from engine.formats import compare
from engine.service import Service
from engine.store import Store, digest
from engine.word_diff import highlight


class Iteration13Tests(unittest.TestCase):
    def setUp(self):
        tmp=tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.base=Path(tmp.name)
        self.root=self.base/'资料'
        self.root.mkdir()
        self.s=Store(self.base/'库')
        self.rid=self.s.configure(self.root)
        self.api=Service(self.s)

    def document(self,path,new=False):
        doc=Document()
        for i in range(80):
            if i==2 and new:
                doc.add_paragraph('增加复核签名。')
            doc.add_paragraph(f'步骤 {i} 请复核编号。')
        doc.sections[0].footer.paragraphs[0].text='文件修订 '+('B' if new else 'A')
        doc.save(path)

    def test_insert_and_footer_only(self):
        a,b=self.base/'a',self.base/'b'
        self.document(a);self.document(b,True)
        aligned=compare(a,b,'.docx')[1]
        self.assertEqual(len(aligned),2)
        self.assertEqual((aligned[0]['location'],aligned[0]['kind']),('第 3 段','新增'))
        self.assertEqual((aligned[1]['sheet'],aligned[1]['new']),('第 1 节 · 页脚','文件修订 B'))
        self.assertGreater(len(compare(a,b,'.docx','coordinate')[1]),75)
        rev=compare(b,a,'.docx')[1]
        self.assertEqual(rev[0]['kind'],'删除')

    def test_moved_edit_and_style_only(self):
        for new in (False,True):
            d=Document()
            for text in (['标题','新增复核','共同的正文'] if new else ['标题','共同的正文']):
                d.add_paragraph(text)
            d.add_paragraph('记录保存 3 份。' if new else '记录保存 2 份。')
            d.add_paragraph('签名页',style='Heading 2' if new else 'Heading 1')
            d.save(self.base/str(new))
        changes=compare(self.base/'False',self.base/'True','.docx')[1]
        self.assertEqual(len(changes),3)
        body=next(r for r in changes if r['kind']=='修改' and r['sheet']=='正文')
        self.assertEqual(body['location'],'旧第 3 段 → 新第 4 段')
        parts=highlight(body)
        self.assertEqual([t for t,changed in parts['new_parts'] if changed],['3'])
        self.assertEqual(''.join(p[0] for p in parts['old_parts']),body['old'])
        self.assertTrue(any(r['sheet']=='段落样式' for r in changes))

    def test_header_nested_table_and_linked_section(self):
        for new in (False,True):
            d=Document()
            d.sections[0].header.paragraphs[0].text='受控编号 '+str(int(new))
            cell=d.add_table(1,1).cell(0,0)
            cell.add_table(1,1).cell(0,0).text='嵌套内容 '+str(int(new))
            d.add_section(WD_SECTION.NEW_PAGE)
            d.save(self.base/str(new))
        changes=compare(self.base/'False',self.base/'True','.docx')[1]
        self.assertEqual(len(changes),2)
        self.assertTrue(any(r['sheet']=='第 1 节 · 页眉' for r in changes))
        self.assertTrue(any(' / 表格 1' in r['sheet'] for r in changes))

    def test_word_cache_upgrade_and_full_text_preserved(self):
        path=self.root/'试验.docx'
        self.document(path);self.s.scan(self.rid)
        self.document(path,True);self.s.scan(self.rid);self.s.parse_one()
        with self.s.db() as db:
            db.execute("UPDATE versions SET details='[]' WHERE num=2")
            db.execute('PRAGMA user_version=2')
        updated=Store(self.s.home)
        self.assertTrue(updated.parse_one())
        self.assertFalse(Store(self.s.home).parse_one())
        result=Service(updated).dispatch('compare',{'old':1,'new':2})
        self.assertEqual(result['total'],2)
        self.assertTrue(result['is_word'])
        self.assertEqual(result['items'][1]['new_parts'][-1],['B',True])

    def test_dates_actions_combine_with_text(self):
        with self.s.db() as db:
            db.execute('DELETE FROM audit')
            for day,act,note in [('01','导出差异','库存'),('02','导出差异','库存'),('02','更新设置','监控'),('03','导出差异','库存')]:
                db.execute('INSERT INTO audit(stamp,action,note) VALUES (?,?,?)',('2026-11-'+day+'T23:59:59+08:00',act,note))
        result=self.api.dispatch('audit',{'q':'导出','start':'2026-11-02','end':'2026-11-02','action':'导出差异'})
        self.assertEqual(result['total'],1)
        self.assertIn('更新设置',result['actions'])
        self.assertEqual(self.api.dispatch('audit',{'q':'库存','end':'2026-11-02','size':1})['total'],2)
        with self.assertRaisesRegex(ValueError,'结束日期'):
            self.api.dispatch('audit',{'start':'2026-11-03','end':'2026-11-01'})

    def seed_intents(self):
        files=[self.root/name for name in ('甲.txt','乙.txt')]
        for f in files:f.write_bytes(b'previous')
        self.s.scan(self.rid)
        for f in files:f.write_bytes(b'new')
        self.s.scan(self.rid)
        with self.s.db() as db:
            for f in files:
                v=db.execute('SELECT v.id,v.file_id FROM versions v JOIN files f ON f.id=v.file_id WHERE f.rel=? AND v.num=1',(f.name,)).fetchone()
                db.execute('INSERT INTO restores(file_id,version_id,prior_sha,stamp) VALUES (?,?,?,?)',(v['file_id'],v['id'],digest(f),'now'))
                f.write_bytes(b'previous')
        return files

    def test_one_unreadable_intent_does_not_block_next(self):
        first,_=self.seed_intents()
        def selective(path):
            if path==first: raise PermissionError('占用')
            return digest(path)
        with patch('engine.store.digest',side_effect=selective):
            self.assertEqual(self.s.recover_intents(),1)
            self.assertEqual(self.api.dispatch('summary',{})['recovery'],1)
        self.assertEqual(self.s.recover_intents(),0)
        self.assertEqual(self.s.recover_intents(),0)
        self.assertEqual(self.api.dispatch('events',{'kind':'历史恢复'})['total'],2)

    def test_same_digest_cannot_prove_a_write(self):
        self.seed_intents()
        with self.s.db() as db:db.execute('UPDATE restores SET prior_sha=(SELECT sha FROM versions WHERE id=version_id)')
        self.s.recover_intents()
        self.assertEqual(self.api.dispatch('events',{'kind':'历史恢复'})['total'],0)
        self.assertEqual(self.api.dispatch('audit',{'action':'恢复内容一致'})['total'],2)

    def test_reused_identity_keeps_its_history(self):
        first,_=self.seed_intents()
        first.unlink();self.s.scan(self.rid)
        first.write_bytes(b'previous');self.s.scan(self.rid)
        with self.s.db() as db:
            owner=db.execute('SELECT id FROM files WHERE rel=? AND live',(first.name,)).fetchone()[0]
        self.s.recover_intents()
        self.assertEqual(self.api.dispatch('audit',{'action':'恢复核对终止'})['total'],1)
        self.assertEqual(len(self.api.dispatch('history',{'id':owner})),1)
