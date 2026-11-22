import csv
from contextlib import closing
import hashlib
import json
import os
from pathlib import Path
import sqlite3
import stat
import tempfile
import threading
import time
import unittest
from unittest.mock import patch
import zipfile

from openpyxl import Workbook
from engine import backup_check,formats,handoff,health,variance
from engine.service import Service
from engine.store import Store


class Work(unittest.TestCase):
    def setUp(self):
        temp=tempfile.TemporaryDirectory();self.addCleanup(temp.cleanup)
        self.base=Path(temp.name);self.directory=self.base/'监控';self.directory.mkdir()
        self.store=Store(self.base/'Data');self.s=Service(self.store)
        self.rid=self.store.configure(self.directory)
    def call(self,cmd,**args):return self.s.dispatch(cmd,args)
    def write(self,name,value):
        p=self.directory/name;p.parent.mkdir(parents=True,exist_ok=True)
        p.write_bytes(value.encode() if isinstance(value,str) else value)
        return p
    def scan(self):
        self.store.scan(self.rid)
        while self.store.parse_one():pass
    def checkpoint(self,name='交接'):return self.call('checkpoint_create',root=self.rid,label=name)
    def csv(self,p):
        with p.open(encoding='utf-8-sig') as f:return list(csv.reader(f))


class Restore(Work):
    def test_guard_preserves_changed_disk_and_store(self):
        target=self.write('a.txt','old');self.scan();self.write('a.txt','saved next');self.scan()
        self.write('a.txt','unrecorded disk')
        info=self.call('restore_info',id=1)
        self.assertEqual(info['latest'],2);self.assertTrue(info['unrecorded']);self.assertFalse(info['identical'])
        self.assertEqual(info['current_sha'],hashlib.sha256(b'unrecorded disk').hexdigest())
        self.assertEqual(info['delta'],3-len(b'unrecorded disk'))
        self.write('a.txt','abc')
        with self.assertRaisesRegex(ValueError,'重新预览'):self.call('restore',id=1,preview=info['preview'])
        self.assertEqual(target.read_bytes(),b'abc');self.assertEqual(len(self.call('history',id=1)),2)
        self.assertFalse(self.store.obj(hashlib.sha256(b'abc').hexdigest()).exists())
        fresh=self.call('restore_info',id=1)
        self.call('restore',id=1,preview=fresh['preview'])
        self.assertEqual(target.read_bytes(),b'old')
        self.assertEqual(len(self.call('history',id=1)),4)
    def test_noop_and_missing_then_reappeared(self):
        file=self.write('a.txt','same');self.scan()
        info=self.call('restore_info',id=1)
        self.assertTrue(info['identical'])
        self.assertIn('一致',self.call('restore',id=1,preview=info['preview']))
        self.assertEqual(len(self.call('history',id=1)),1)
        file.unlink();info=self.call('restore_info',id=1);self.assertIsNone(info['current_sha'])
        self.write('a.txt','created')
        with self.assertRaises(ValueError):self.call('restore',id=1,preview=info['preview'])
        self.assertEqual(file.read_bytes(),b'created')
    def test_clean_historical_object_required_for_preview_and_copy(self):
        self.write('a','a');self.scan();obj=self.store.obj(self.call('history',id=1)[0]['sha'])
        obj.write_bytes(b'b')
        with self.assertRaisesRegex(ValueError,'校验'):self.call('restore_info',id=1)
        dest=self.base/'copy'
        with self.assertRaises(ValueError):self.call('copy',id=1,path=str(dest))
        self.assertFalse(dest.exists())
    def test_copy_is_only_published_after_verification(self):
        self.write('a','a');self.scan();dest=self.base/'expected'
        def partial(src,out):
            out.write(b'x');self.assertFalse(dest.exists());raise OSError('interrupted')
        with patch('engine.store.shutil.copyfileobj',side_effect=partial):
            with self.assertRaises(OSError):self.call('copy',id=1,path=str(dest))
        self.assertFalse(dest.exists());self.assertFalse(list(self.base.glob('.fileguard-export-*')))
        self.call('copy',id=1,path=str(dest));self.assertEqual(dest.read_bytes(),b'a')
        with self.assertRaises(FileExistsError):self.call('copy',id=1,path=str(dest))


class ComparisonIntegrity(Work):
    def test_corrupt_csv_snapshot_is_not_compared_cached_or_indexed(self):
        original = b'id,qty\nA,100\n'
        self.write('ledger.csv', original)
        self.scan()
        fid = self.call('files')['items'][0]['id']
        first, = self.call('history', id=fid)
        snapshot = self.store.obj(first['sha'])
        snapshot.write_bytes(b'id,qty\nA,777\n')
        self.write('ledger.csv', b'id,qty\nA,200\n')
        self.store.scan(self.rid)
        second, _ = self.call('history', id=fid)
        self.assertEqual(second['status'], '待解析')

        args = dict(old=first['id'], new=second['id'])
        for mode in ('aligned', 'coordinate'):
            with self.subTest(mode=mode):
                result = self.call('compare', **args, mode=mode)
                self.assertEqual((result['status'], result['items']), ('解析失败', []))
                self.assertIn('校验', result['error'])

        self.assertTrue(self.store.parse_one())
        result = self.call('compare', **args)
        self.assertEqual((result['status'], result['items']), ('解析失败', []))
        self.assertIn('校验', result['error'])
        self.assertEqual(self.call('finder', q='777')['total'], 0)
        trace = self.call('field_trace', id=fid, record='A', field='qty')
        self.assertEqual((trace['coverage'], trace['items']), ({'解析失败': 1}, []))

        snapshot.write_bytes(original)
        self.call('retry', id=second['id'])
        self.assertTrue(self.store.parse_one())
        change, = self.call('compare', **args)['items']
        self.assertEqual((change['old'], change['new']), ('100', '200'))
        self.assertEqual(self.call('finder', q='100')['total'], 1)

    def test_excel_row_view_rejects_parseable_but_corrupt_snapshot(self):
        path = self.directory / 'ledger.xlsx'
        for value in (100, 200):
            book = Workbook()
            book.active.append(['编号', '数量'])
            book.active.append(['A', value])
            book.save(path)
            book.close()
            with zipfile.ZipFile(path, 'a') as archive:
                archive.comment = b'export'
            self.scan()
        second, first = self.call('history', id=1)
        snapshot = self.store.obj(first['sha'])
        raw = snapshot.read_bytes()
        snapshot.write_bytes(raw[:-1] + b'X')
        self.assertTrue(zipfile.is_zipfile(snapshot))
        args = dict(old=first['id'], new=second['id'])
        for command in ('sheet_rows', 'sheet_find'):
            with self.subTest(command=command), self.assertRaisesRegex(ValueError, '校验'):
                self.call(command, **args, q='100')

        snapshot.write_bytes(raw)
        self.assertEqual(self.call('sheet_find', **args, q='100')['items'][0]['value'], '100')

    def test_snapshot_change_during_parse_is_not_published(self):
        path = self.write('notes.txt', 'good')
        self.scan()
        first, = self.call('history', id=1)
        snapshot = self.store.obj(first['sha'])
        before = snapshot.stat()
        path.write_bytes(b'next')
        self.store.scan(self.rid)

        compare = formats.compare
        def replace_before_read(*args, **kwargs):
            snapshot.write_bytes(b'bad!')
            os.utime(snapshot, ns=(before.st_atime_ns,before.st_mtime_ns+1_000_000_000))
            return compare(*args, **kwargs)

        with patch.object(formats, 'compare', side_effect=replace_before_read):
            self.assertTrue(self.store.parse_one())
        latest = self.call('history', id=1)[0]
        self.assertEqual((latest['status'], latest['changes']), ('解析失败', 0))
        self.assertIn('解析期间变化', latest['error'])
        self.assertEqual(self.call('finder', q='bad!')['total'], 0)

    def test_large_and_metadata_only_comparisons_skip_digest(self):
        for name in ('large.txt', 'content.bin'):
            self.write(name, b'older')
        self.scan()
        for name in ('large.txt', 'content.bin'):
            self.write(name, b'newer')
        self.store.scan(self.rid)

        with patch.object(formats, 'PARSE_BYTES', 4), patch('engine.store.digest', side_effect=AssertionError('应在读取前限制大小')):
            while self.store.parse_one():
                pass
        files = {row['rel']: row['id'] for row in self.call('files')['items']}
        versions = {name: self.call('history', id=fid) for name, fid in files.items()}
        self.assertEqual(versions['content.bin'][0]['status'], '属性对比')
        self.assertEqual(versions['large.txt'][0]['status'], '解析失败')
        self.assertIn('解析上限', versions['large.txt'][0]['error'])


class Packages(Work):
    def setUp(self):
        super().setUp()
        for name,data in [('明细/甲.csv','100'),('明细/乙.CSV','100'),('明细二/x.txt','b'),('notes.txt','note')]:self.write(name,data)
        self.scan();self.cid=self.checkpoint()
    def inventory(self,**args):return self.call('checkpoint_inventory',id=self.cid,**args)
    def test_inventory_filters_stats_export(self):
        selected=self.inventory(folder='明细',ext='csv，XLSX',q='明细\\')
        self.assertEqual((selected['total'],selected['objects'],selected['bytes']),(2,1,6))
        self.assertEqual(self.inventory(sha=selected['items'][0]['sha'][:8])['total'],2)
        self.assertEqual(self.inventory(sort='size')['items'][0]['rel'],'notes.txt')
        self.assertEqual(self.inventory(q='%')['total'],0)
        with self.assertRaises(ValueError):self.inventory(sha='W')
        for i in range(28):self.write(str(i)+'.csv','test')
        self.scan();self.cid=self.checkpoint('larger')
        self.assertEqual(len(self.inventory(page=300)['items']),7)
        dest=self.base/'inventory.csv';self.call('inventory_csv',id=self.cid,ext='csv',path=str(dest))
        self.assertEqual(len(self.csv(dest)),31)
    def test_snapshot_based_filtered_package_and_reference(self):
        dest=self.base/'部分.zip'
        (self.directory/'明细/甲.csv').unlink();self.write('明细/乙.CSV','changed');self.scan()
        self.call('handoff_create',id=self.cid,folder='明细',path=str(dest))
        with zipfile.ZipFile(dest) as z:
            self.assertEqual(z.read('files/明细/甲.csv'),b'100')
            self.assertEqual(z.read('files/明细/乙.CSV'),b'100')
            self.assertNotIn(str(self.directory),z.read(handoff.MANIFEST).decode())
            self.assertNotIn('fileguard.db',z.namelist())
        r=self.call('handoff_verify',id=self.cid,folder='明细',path=str(dest))
        self.assertTrue(r['ok'] and r['compared']);self.assertEqual(r['verified'],2)
        full=self.call('handoff_verify',id=self.cid,path=str(dest));self.assertEqual(full['counts'],{'当前清单条目未交付':2})
        with self.assertRaises(FileExistsError):self.call('handoff_create',id=self.cid,path=str(dest))
        with self.assertRaises(ValueError):self.call('handoff_create',id=self.cid,path=str(self.store.home/'z.zip'))
    def test_tampered_zip_reports_all_types(self):
        original=self.base/'good';self.call('handoff_create',id=self.cid,path=str(original))
        output=self.base/'bad'
        with zipfile.ZipFile(original) as src,zipfile.ZipFile(output,'w') as z:
            for name in src.namelist():
                if name=='files/明细/甲.csv':continue
                payload=src.read(name)
                if name=='files/明细/乙.CSV':payload=b'bad'
                if name=='files/notes.txt':payload=b'too long'
                if name=='files/明细二/x.txt':
                    info=zipfile.ZipInfo(name);info.external_attr=(stat.S_IFLNK|0o777)<<16;z.writestr(info,b'x');continue
                z.writestr(name,payload)
            z.writestr('foreign','x')
        report=self.call('handoff_verify',path=str(output))
        self.assertFalse(report['ok']);self.assertEqual(set(report['counts']),{'缺少文件','长度不符','摘要不符','非普通文件','额外条目'})
        special=self.base/'special'
        with zipfile.ZipFile(original) as src,zipfile.ZipFile(special,'w') as out:
            for name in src.namelist():
                info=zipfile.ZipInfo(name)
                if name=='files/notes.txt':info.external_attr=(stat.S_IFIFO|0o600)<<16
                out.writestr(info,src.read(name))
        self.assertEqual(self.call('handoff_verify',path=str(special))['counts'],{'非普通文件':1})
    def test_reject_incompatible_paths_and_partial_publication(self):
        for paths in [('dir/A','DIR/B'),('é','e\u0301'),('a','a/b'),('a/../b',),('Aux.txt',),('file. ',),('c:d',),('/absolute',),('x\\y',)]:
            with self.subTest(paths=paths), self.assertRaises(ValueError):
                used={}
                for path in paths:handoff.portable(path,used)
        invalid=self.inventory()['items'][0]['sha'];self.store.obj(invalid).unlink()
        dest=self.base/'incomplete.zip'
        with self.assertRaises(OSError):self.call('handoff_create',id=self.cid,path=str(dest))
        self.assertFalse(dest.exists());self.assertFalse(list(self.base.glob('.fileguard-export-*')))
    def test_disk_same_length_rename_missing_and_quick(self):
        self.write('notes.txt','NOTE');(self.directory/'明细/甲.csv').rename(self.directory/'moved.csv');self.write('明细二/x.txt','longer');self.scan()
        def bypath(**args):
            return {r['rel']:r for r in self.call('checkpoint_disk',id=self.cid,**args)['items']}
        full=bypath()
        self.assertEqual(full['notes.txt']['state'],'内容不同');self.assertEqual(full['明细二/x.txt']['state'],'大小不同')
        self.assertEqual(full['明细/甲.csv']['state'],'原路径缺失');self.assertEqual(full['明细/甲.csv']['current_rel'],'moved.csv')
        self.assertEqual(full['明细/乙.CSV']['state'],'内容一致')
        self.assertEqual(bypath(quick=True)['notes.txt']['state'],'大小一致，待验内容')
        self.assertEqual(self.inventory()['items'][0]['num'],1)
    def test_check_only_requested_page_and_changed_while_reading(self):
        import engine.store as m
        saved=m.digest
        def change(p):
            value=saved(p)
            if p.name=='notes.txt':p.write_bytes(b'changed after read')
            return value
        with patch('engine.store.digest',side_effect=change):
            r=self.call('checkpoint_disk',id=self.cid,q='notes')
        self.assertEqual(r['counts'],{'读取期间变化':1});self.assertIsNone(r['items'][0]['disk_sha'])


class Health(Work):
    def test_reports_corruption_repair_reference_and_retention(self):
        self.write('a.txt','one');self.write('b.txt','one');self.write('c.txt','two');self.scan()
        one=hashlib.sha256(b'one').hexdigest();two=hashlib.sha256(b'two').hexdigest()
        self.store.obj(one).write_bytes(b'xxx')
        self.store.obj(two).unlink()
        orphan=hashlib.sha256(b'never indexed').hexdigest();obj=self.store.obj(orphan);obj.parent.mkdir(exist_ok=True);obj.write_bytes(b'never indexed')
        first=health.run(self.store);data=self.call('health_results',id=first)
        self.assertEqual(data['report']['affected'],3);self.assertEqual(data['report']['unreferenced'],1)
        self.assertEqual(data['counts'],{'未被版本引用':1,'内容摘要不符':1,'缺少对象':1})
        refs=self.call('health_references',id=first,key=one);self.assertEqual(refs['total'],2)
        self.store.obj(one).write_bytes(b'one');self.store.obj(two).write_bytes(b'too long')
        second=health.run(self.store);r=self.call('health_results',id=second)
        self.assertEqual(r['changes'],{'本轮未再发现':1,'类别变化':1,'持续存在':1})
        self.assertEqual(self.call('health_results',id=second,change='本轮未再发现')['items'][0]['object_key'],one)
        dest=self.base/'report.csv';self.call('health_csv',id=second,status='长度不符',path=str(dest))
        self.assertEqual(len(self.csv(dest)),2);self.assertTrue(obj.exists())
        for _ in range(5):health.run(self.store)
        self.assertEqual(len(Service(Store(self.store.home)).dispatch('health_reports',{})),5)
        with self.assertRaises(ValueError):self.call('health_results',id=first)
        with self.store.db() as db:self.assertFalse(db.execute('SELECT 1 FROM health_findings WHERE report_id=?',(first,)).fetchone())

    def test_reference_total_and_page_share_snapshot_during_scan(self):
        content = b'previously unreferenced'
        sha = hashlib.sha256(content).hexdigest()
        obj = self.store.obj(sha)
        obj.parent.mkdir()
        obj.write_bytes(content)
        report = health.run(self.store)
        self.assertEqual(self.call('health_results', id=report)['counts'], {'未被版本引用': 1})
        scanned = []

        def complete_another_scan(statement):
            if not scanned and ' FROM versions v JOIN files f ' in statement and ' ORDER BY v.id DESC ' in statement:
                self.write('new.txt', content)
                self.scan()
                scanned.append(True)

        with self.store.db() as db:
            db.set_trace_callback(complete_another_scan)
            page = health.references(db, {'id': report, 'key': sha})
        self.assertTrue(scanned)
        self.assertEqual((page['total'], page['items']), (0, []))
        latest = self.call('health_references', id=report, key=sha)
        self.assertEqual((latest['total'], [item['rel'] for item in latest['items']]), (1, ['new.txt']))

    def test_background_cancellation_keeps_prior_and_allows_scans(self):
        self.write('a','ok');self.scan();prior=health.run(self.store)
        entered=threading.Event();resume=threading.Event();orig=health.assess
        def wait(*args):entered.set();resume.wait(5);return orig(*args)
        with patch('engine.health.assess',side_effect=wait):
            self.call('health_start');self.assertTrue(entered.wait(3))
            self.assertEqual(self.call('health_start')['state'],'检查中')
            self.write('b','new');self.scan()
            self.assertEqual(self.call('files')['total'],2)
            self.call('health_cancel');resume.set()
            for _ in range(200):
                if self.call('health_state')['state']!='检查中':break
                time.sleep(.01)
        self.assertEqual(self.call('health_state')['state'],'已取消')
        self.assertEqual([r['id'] for r in self.call('health_reports')],[prior])
    def test_empty_workspace_and_bad_foreign_key(self):
        rid=health.run(self.store);self.assertEqual(self.call('health_results',id=rid)['report']['objects'],0)
        with closing(sqlite3.connect(self.store.dbfile)) as db, db:
            db.execute("INSERT INTO tasks VALUES(10000,0,'测试')")
        with self.assertRaisesRegex(ValueError,'引用'):health.run(self.store)
        self.assertEqual(len(self.call('health_reports')),1)
    def test_coverage_uses_unique_content_and_version_references(self):
        self.write('a','shared');self.scan();path=self.base/'snapshot.zip';self.store.backup(path)
        self.write('a','new');self.write('b','new');self.scan()
        extra=self.base/'extra.zip'
        with zipfile.ZipFile(path) as src,zipfile.ZipFile(extra,'w') as z:
            for name in src.namelist():z.writestr(name,src.read(name))
            z.writestr('extra-readme','x')
        result=self.call('inspect_backup',path=str(extra))
        self.assertEqual(result['extra_entries'],1)
        self.assertEqual((result['coverage']['shared'],result['coverage']['missing'],result['coverage']['missing_bytes'],result['coverage']['affected_versions']),(1,1,3,2))
        self.assertEqual(result['logical'],6);self.assertEqual(result['files'],1)
        self.assertIsNone(backup_check.inspect(path)['coverage'])
    def test_schema_eight_upgrade_and_older_backup(self):
        self.write('a','a');self.scan()
        with self.store.db() as db:
            db.execute('DROP TABLE health_findings');db.execute('DROP TABLE health_reports');db.execute('PRAGMA user_version=8')
        dest=self.base/'older.zip';self.store.backup(dest)
        self.assertEqual(backup_check.inspect(dest)['schema'],8)
        current=Store(self.store.home)
        with current.db() as db:self.assertEqual(db.execute('PRAGMA user_version').fetchone()[0],11)
        self.assertEqual(current.verify(),'数据库与 1 个历史对象通过校验')


class Variances(Work):
    def test_decimal_direction_zero_and_thresholds(self):
        old='编号,数量\nA,9007199254740992\nB,-10\nC,0\nD,0.100\nE,x\nF,3'
        new='编号,数量\nA,9007199254740993\nB,-5\nC,20\nD,1e-1\nE,y\nF,4'
        self.write('amount.csv',old);self.scan();self.write('amount.csv',new);self.scan()
        def query(**opts):return self.call('variance',old=1,new=2,**opts)
        result=query()
        self.assertEqual(result['total'],5);self.assertEqual(result['skips'],{'非可比数值':1})
        rows={r['record']:r for r in result['items']}
        self.assertEqual(rows['A']['delta'],'1');self.assertEqual(rows['B']['percent'],'50')
        self.assertIsNone(rows['C']['percent']);self.assertEqual(rows['D']['direction'],'等值')
        self.assertEqual(rows['F']['percent'],'33.3333')
        self.assertEqual(query(rate='50')['total'],1);self.assertEqual(query(minimum='5')['total'],2)
        self.assertEqual(query(record='F',rate='33.33332')['total'],1);self.assertEqual(query(record='F',rate='33.33334')['total'],0)
        self.assertEqual(result['groups'][0]['delta'],'27');self.assertEqual(query(direction='下降')['total'],0)
        for opt in [dict(minimum='-1'),dict(rate='nan'),dict(minimum='1e900')]:
            with self.assertRaises(ValueError):query(**opt)
    def test_coordinate_csv_and_cross_page_export(self):
        self.write('amount.tsv','\n'.join('a\t'+str(i) for i in range(32)));self.scan()
        self.write('amount.tsv','\n'.join('a\t'+str(i+10) for i in range(32)));self.scan()
        args=dict(old=1,new=2,mode='coordinate',field='第 2 列')
        result=self.call('variance',page=2,**args);self.assertEqual(len(result['items']),7)
        p=self.base/'variance.csv';self.call('variance_csv',path=str(p),page=2,**args)
        self.assertEqual(len(self.csv(p)),33);self.assertEqual(self.csv(p)[0][-3:],['差额','变化率百分数','方向'])
    def test_excel_numeric_types_and_record_alignment(self):
        def save(n):
            b=Workbook();s=b.active;s.title='库存';s.append(['编码','数量','公式','备注']);s.append(['A',n,'=B2*'+str(n),str(n)])
            if n==8:s.append(['new',22,'',''])
            b.save(self.directory/'book.xlsx')
        save(10);self.scan();save(8);self.scan()
        r=self.call('variance',old=1,new=2,field='数量',record='A')
        self.assertEqual(r['total'],1);self.assertEqual((r['items'][0]['percent'],r['items'][0]['direction']),('-20','下降'))
        all_rows=self.call('variance',old=1,new=2)
        self.assertGreaterEqual(all_rows['skips']['非数值类型'],2)
        reversed_pair=self.call('variance',old=2,new=1,field='数量');self.assertEqual(reversed_pair['items'][0]['percent'],'25')
