import codecs
import csv
import hashlib
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import zipfile

from engine import handoff, version_bundle
from engine.service import Service
from engine.store import Store


class VersionBundleTests(unittest.TestCase):
    def setUp(self):
        temp=tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.base=Path(temp.name)
        self.store=Store(self.base/'Data')
        self.service=Service(self.store)
        self.root=self.base/'监控一'
        self.root.mkdir()
        self.rid=self.store.configure(self.root)

    def save(self,name,text,root=None,rid=None):
        folder=root or self.root
        path=folder/name
        path.parent.mkdir(exist_ok=True,parents=True)
        path.write_bytes(text if isinstance(text,bytes) else text.encode())
        self.store.scan(rid or self.rid)
        with self.store.db() as db:
            return dict(db.execute("""SELECT v.* FROM versions v JOIN files f ON f.id=v.file_id
                                     WHERE f.rel=? AND f.root_id=? ORDER BY v.num DESC LIMIT 1""",
                                   (name,rid or self.rid)).fetchone())

    def call(self,cmd,**args):
        return self.service.dispatch('version_bundle_'+cmd,args)

    def ids(self,*rows):
        return [row['id'] for row in rows]

    def create(self,ids,name='交付.zip',**opts):
        dest=self.base/name
        preview=self.call('preview',ids=ids,**opts)
        return Path(self.call('create',ids=ids,token=preview['token'],path=str(dest),**opts))

    def test_actual_older_versions_across_roots_and_multiple_same_file(self):
        second_root=self.base/'监控二'
        second_root.mkdir()
        second_id=self.store.configure(second_root)
        v1=self.save('报表.txt','原文')
        v2=self.save('报表.txt','新版')
        twin=self.save('报表.txt','另一目录',second_root,second_id)
        ids=self.ids(twin,v2,v1)
        preview=self.call('preview',ids=ids)
        self.assertEqual((preview['total'],preview['roots'],preview['objects'],preview['ready']),(3,2,3,True))
        self.assertEqual([v['version_id'] for v in preview['items']],sorted(ids))
        dest=self.create(ids)
        with zipfile.ZipFile(dest) as bundle:
            manifest=json.loads(bundle.read(handoff.MANIFEST))
            self.assertEqual(manifest['selection'],'versions')
            self.assertEqual({bundle.read('files/'+r['rel']).decode() for r in manifest['files']},{'原文','新版','另一目录'})
            self.assertEqual(len(set(bundle.namelist())),4)
        self.assertTrue(handoff.verify(dest)['ok'])
        self.assertTrue(self.call('verify',ids=ids,path=str(dest))['compared'])

    def test_manifest_uses_relative_opt_in_and_never_absolute_root(self):
        row=self.save('private/签字.txt','文件')
        ids=self.ids(row)
        for include in (True,False):
            archive=self.create(ids,'opt'+str(include)+'.zip',include_paths=include,label=' 月末审计 ')
            with zipfile.ZipFile(archive) as bundle:
                raw=bundle.read(handoff.MANIFEST).decode()
                self.assertNotIn(str(self.root),raw)
                data=json.loads(raw)
            self.assertEqual(data['label'],'月末审计')
            self.assertEqual(data['files'][0]['name'],'签字.txt')
            self.assertEqual(data['files'][0].get('source_rel'),'private/签字.txt' if include else None)

    def test_stable_paths_despite_registration_rename_and_historical_extension(self):
        row=self.save('旧名.txt','payload')
        ids=self.ids(row)
        original=self.create(ids)
        first=self.call('preview',ids=ids)
        (self.root/'旧名.txt').rename(self.root/'新名.md')
        self.store.scan(self.rid)
        later=self.call('preview',ids=ids)
        one,=later['items']
        self.assertEqual(one['name'],'新名.md')
        self.assertEqual(one['rel'],first['items'][0]['rel'])
        self.assertTrue(one['rel'].endswith('.txt'))
        self.assertNotEqual(first['token'],later['token'])
        self.assertTrue(self.call('verify',ids=ids,path=str(original))['ok'])

    def test_pack_uses_archive_when_working_file_changed_or_removed(self):
        row=self.save('原文件.txt','已归档')
        path=self.root/'原文件.txt'
        path.write_text('现场草稿',encoding='utf-8')
        path.unlink()
        self.store.scan(self.rid)
        with zipfile.ZipFile(self.create(self.ids(row))) as archive:
            member=next(name for name in archive.namelist() if name.startswith('files/'))
            self.assertEqual(archive.read(member).decode(),'已归档')

    def test_dedup_statistics_keep_explicit_copies_and_empty_files(self):
        a=self.save('a.txt','')
        b=self.save('b.md','')
        preview=self.call('preview',ids=self.ids(a,b))
        self.assertEqual((preview['total'],preview['bytes'],preview['objects']),(2,0,1))
        z=self.create(self.ids(a,b))
        verified=handoff.verify(z)
        self.assertEqual((verified['verified'],verified['bytes'],verified['ok']),(2,0,True))

    def test_windows_compatible_names_with_unusual_extensions(self):
        self.assertEqual(version_bundle.member_name(18,3,'.xlsx'),'版本-18/V3.xlsx')
        for ext in ('.bad extension','...','.x'+('y'*25),'./extra',''):
            with self.subTest(ext=ext):
                member=version_bundle.member_name(18,3,ext)
                self.assertEqual(member,'版本-18/V3')
                handoff.portable(member,{})

    def test_stats_and_manifest_token_order_stability_and_binding(self):
        a=self.save('a.txt','A')
        b=self.save('b.txt','B')
        ids=self.ids(a,b)
        preview=self.call('preview',ids=ids)
        self.assertEqual(preview['token'],self.call('preview',ids=ids[::-1])['token'])
        for opts in ({'ids':ids[:1]},{'ids':ids,'label':'另一个交付名'},{'ids':ids,'include_paths':True}):
            with self.assertRaisesRegex(ValueError,'重新预览'):
                self.call('create',**opts,token=preview['token'],path=str(self.base/'未生成.zip'))
        self.assertFalse((self.base/'未生成.zip').exists())

    def test_absent_or_invalid_version_reports_specific_status(self):
        row=self.save('a.txt','A')
        preview=self.call('preview',ids=[row['id'],876543])
        self.assertFalse(preview['complete'])
        self.assertFalse(preview['ready'])
        self.assertEqual(preview['counts']['历史版本不存在'],1)
        self.assertEqual(preview['token'],'')
        with self.store.db() as db:
            db.execute('UPDATE versions SET size=-1 WHERE id=?',(row['id'],))
        self.assertEqual(self.call('preview',ids=self.ids(row))['counts'],{'版本索引无效':1})

    def test_size_budget_blocks_zip_but_permits_csv(self):
        row=self.save('a.txt','longer')
        ids=self.ids(row)
        with patch.object(version_bundle,'BYTE_LIMIT',4):
            preview=self.call('preview',ids=ids)
            self.assertTrue(preview['complete'])
            self.assertFalse(preview['ready'])
            self.assertTrue(preview['reasons'])
            with self.assertRaisesRegex(ValueError,'超出容量'):
                self.call('create',ids=ids,token=preview['token'],path=str(self.base/'超限.zip'))
            csv_path=self.base/'超限明细.csv'
            self.call('csv',ids=ids,token=preview['token'],path=str(csv_path))
            self.assertTrue(csv_path.exists())

    def test_preflight_classifies_size_missing_nonregular_and_allows_metadata_export(self):
        bad=self.save('wrong.txt','A')
        missing=self.save('missing.txt','BB')
        directory=self.save('dir.txt','CCC')
        self.store.obj(bad['sha']).write_bytes(b'excess')
        self.store.obj(missing['sha']).unlink()
        path=self.store.obj(directory['sha'])
        path.unlink()
        path.mkdir()
        ids=self.ids(bad,missing,directory)
        preview=self.call('preview',ids=ids)
        self.assertFalse(preview['ready'])
        self.assertEqual(preview['counts'],{'归档副本长度不符':1,'归档副本缺失':1,'归档副本不是普通文件':1})
        dest=self.base/'仍可检查.csv'
        self.call('csv',ids=ids,token=preview['token'],path=str(dest))
        self.assertIn('归档副本缺失',dest.read_text('utf-8-sig'))

    def test_metadata_preflight_detects_permission_errors_without_reading_body(self):
        row=self.save('只读归档.txt','A')
        with patch.object(version_bundle,'open_snapshot_source',side_effect=PermissionError('blocked')):
            result=self.call('preview',ids=self.ids(row))
        self.assertEqual(result['counts'],{'归档副本不可读取':1})
        self.assertFalse(result['ready'])

    def test_existing_package_can_be_checked_after_local_archive_is_missing(self):
        row=self.save('已交付.txt','仍可核查')
        dest=self.create(self.ids(row))
        self.store.obj(row['sha']).unlink()
        self.assertFalse(self.call('preview',ids=self.ids(row))['ready'])
        self.assertTrue(self.call('verify',ids=self.ids(row),path=str(dest))['ok'])

    def test_same_size_corruption_aborts_entire_zip_and_cleans_temporary_files(self):
        good=self.save('a.txt','first')
        bad=self.save('b.txt','second')
        ids=self.ids(good,bad)
        pre=self.call('preview',ids=ids)
        self.store.obj(bad['sha']).write_bytes(b'spoils')
        self.assertTrue(self.call('preview',ids=ids)['ready'])
        dest=self.base/'损坏.zip'
        with self.assertRaisesRegex(ValueError,'源版本校验失败'):
            self.call('create',ids=ids,token=pre['token'],path=str(dest))
        self.assertFalse(dest.exists())
        self.assertFalse(list(self.base.glob('.fileguard-export-*')))
        self.assertEqual(self.service.dispatch('audit',{'action':'生成历史版本交付包'})['total'],0)

    def test_reference_reports_missing_extra_and_wrong_version(self):
        a=self.save('a.txt','A')
        b=self.save('b.txt','B')
        c=self.save('c.txt','C')
        dest=self.create(self.ids(a,b))
        mismatch=self.call('verify',ids=self.ids(b,c),path=str(dest))
        self.assertEqual(mismatch['counts'],{'当前清单未选择':1,'当前清单条目未交付':1})
        modified=self.base/'错版.zip'
        with zipfile.ZipFile(dest) as src,zipfile.ZipFile(modified,'w') as out:
            manifest=json.loads(src.read(handoff.MANIFEST))
            entry=manifest['files'][0]
            entry['sha']=hashlib.sha256(b'Z').hexdigest()
            out.writestr(handoff.MANIFEST,json.dumps(manifest))
            for member in manifest['files']:
                key='files/'+member['rel']
                out.writestr(key,b'Z' if member is entry else src.read(key))
        self.assertTrue(handoff.verify(modified)['ok'])
        self.assertEqual(self.call('verify',ids=self.ids(a,b),path=str(modified))['counts'],{'与当前清单版本不符':1})

    def test_csv_safety_and_audit_no_clobber(self):
        row=self.save('folder/=中文,项目.txt','data')
        ids=self.ids(row)
        preview=self.call('preview',ids=ids,include_paths=True)
        opts=dict(ids=ids,include_paths=True,token=preview['token'])
        dest=self.base/'明细.csv'
        self.call('csv',path=str(dest),**opts)
        self.assertTrue(dest.read_bytes().startswith(codecs.BOM_UTF8))
        with dest.open(encoding='utf-8-sig',newline='') as reader:
            record,=list(csv.DictReader(reader))
        self.assertEqual(record['登记文件名'],"'=中文,项目.txt")
        self.assertEqual(record['最近登记相对路径'],'folder/=中文,项目.txt')
        with self.assertRaises(FileExistsError):
            self.call('csv',path=str(dest),**opts)
        with self.assertRaises(ValueError):
            self.call('csv',path=str(self.store.home/'禁止.csv'),**opts)
        with self.assertRaises(ValueError):
            self.call('create',path=str(self.base/'不是zip.txt'),**opts)
        self.assertEqual(self.service.dispatch('audit',{'action':'导出历史版本交付明细'})['total'],1)

    def test_validation_and_existing_schema(self):
        row=self.save('a.txt','A')
        for args in ({'ids':[]},{'ids':[True]},{'ids':[1,1]},{'ids':list(range(1,102))},
                     {'ids':self.ids(row),'include_paths':'true'},{'ids':self.ids(row),'label':'x'*81},
                     {'ids':self.ids(row),'label':'bad\nname'}):
            with self.subTest(args=args),self.assertRaises(ValueError):
                self.call('preview',**args)
        dest=self.create(self.ids(row))
        with self.assertRaises(FileExistsError):
            self.create(self.ids(row))
        self.assertTrue(handoff.verify(dest)['ok'])
        with self.store.db() as db:
            self.assertEqual(db.execute('PRAGMA user_version').fetchone()[0],11)
