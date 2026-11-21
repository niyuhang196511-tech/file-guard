import csv
from email.message import EmailMessage
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import zipfile
from openpyxl import Workbook
from openpyxl.chart import BarChart, LineChart, Reference
from openpyxl.drawing.image import Image as BookImage
from PIL import Image
from engine import backup_check, finder, formats, record_admin
from engine.service import Service
from engine.store import Store


class Work(unittest.TestCase):
    def setUp(self):
        tmp=tempfile.TemporaryDirectory();self.addCleanup(tmp.cleanup)
        self.base=Path(tmp.name);self.directory=self.base/'root';self.directory.mkdir()
        self.store=Store(self.base/'data');self.service=Service(self.store)
        self.rid=self.store.configure(self.directory,'*.tmp')
    def call(self,cmd,**opts):return self.service.dispatch(cmd,opts)
    def scan(self,source='手动扫描'):
        self.store.scan(self.rid,source)
        while self.store.parse_one():pass
    def records(self,**args):return self.call('scan_log',root=self.rid,**args)


class Finder(Work):
    def setUp(self):
        super().setUp()
        sub=self.directory/'业务';sub.mkdir()
        self.a=sub/'qty.csv';self.b=self.directory/'note.txt'
        self.a.write_text('编号,数量\nP-1,2\nP-2,15');self.b.write_text('Straße')
        self.scan()
        self.a.write_text('编号,数量\nP-1,10\nP-2,5');self.b.write_text('Résumé')
        self.scan()
    def find(self,**args):return self.call('finder',**args)
    def test_columns_filters_scopes_and_stats(self):
        all_hits=self.find()
        self.assertEqual((all_hits['files'],all_hits['events'],all_hits['total']),(2,2,3))
        x=self.find(direction='up',field='数量',record='P-1',root=self.rid,filename='业务\\qty',ext='xlsx，CSV',kind='修改')['items'][0]
        self.assertEqual((x['prior'],x['version'],x['old_value'],x['new_value']),(1,2,'2','10'))
        self.assertEqual(self.find(sheet=x['sheet'],q='10',side='new_value',exact=True)['total'],1)
        self.assertEqual(self.find(q='10',side='old_value')['total'],0)
        self.assertEqual(self.find(q='strasse',side='old_value')['total'],1)
        self.assertEqual(self.find(q='strasse',sensitive=True)['total'],0)
        self.assertEqual(self.find(q='%',side='location')['total'],0)
        self.assertEqual(self.find(direction='down')['items'][0]['record_key'],'P-2')
        self.assertEqual(self.find(start='2000-01-01',end='2000-01-01')['total'],0)
        with self.assertRaises(ValueError):self.find(start='2025-03-01',end='2024-12-01')
        with self.assertRaises(ValueError):self.find(side='invalid')
        self.assertEqual(self.find(starred=True)['total'],0)
        self.call('star_file',id=x['file_id'],starred=True);self.assertEqual(self.find(starred=True)['total'],2)
    def test_page_orders_and_csv_entire_result(self):
        first=self.find(size=1,sort='oldest');last=self.find(size=1,sort='oldest',page=1000)
        self.assertEqual(last['page'],3)
        self.assertNotEqual(first['items'][0],last['items'][0])
        dest=self.base/'differences.csv';self.call('finder_export',path=str(dest),size=1,filename='qty')
        with dest.open(encoding='utf-8-sig') as f:rows=list(csv.DictReader(f))
        self.assertEqual(len(rows),2);self.assertEqual(rows[0]['事件路径'],'业务/qty.csv')
        with self.assertRaises((FileExistsError,ValueError)):self.call('finder_export',path=str(dest))
        with self.assertRaises(ValueError):self.call('finder_export',path=str(self.store.home/'a.csv'))
    def test_long_values_search_and_export_beyond_preview(self):
        self.b.write_text('x'*500+'TAIL');self.scan()
        result=self.find(q='TAIL',side='new_value')['items'][0]
        self.assertEqual(result['new_value'],'x'*320);self.assertTrue(result['new_value_truncated'])
        dest=self.base/'long.csv';self.call('finder_export',path=str(dest),q='TAIL',side='new_value')
        self.assertIn('x'*500+'TAIL',dest.read_text(encoding='utf-8-sig'))
    def test_decimal_and_literal(self):
        for x,y,expected in [('9007199254740992','9007199254740993','up'),('1e-5','0.000010','same'),('-1.3','-2','down'),('1,000','2',''),('NaN','4',''),('=1+1','4','')]:
            self.assertEqual(finder.movement(x,y),expected)
    def test_hidden_events_do_not_surface_in_stats_or_export(self):
        pwd='local test password';salt=b'random-test'
        with self.store.db() as db:db.execute('INSERT INTO record_admin VALUES(1,?,?)',(salt,record_admin.derive(pwd,salt)))
        hit=self.find(ext='txt')['items'][0]
        for action in ('撤回','移出普通日志'):
            generation=0 if action=='撤回' else 2
            args=dict(id=hit['eid'],password=pwd,reason='仅限测试')
            self.call('record_amend',**args,action=action,revision=generation)
            self.assertEqual(self.find(q='Résumé')['events'],0)
            self.assertEqual(self.find()['files'],1)
            dest=self.base/(action+'.csv');self.call('finder_export',path=str(dest))
            self.assertNotIn('Résumé',dest.read_text(encoding='utf-8-sig'))
            self.call('record_amend',**args,action='恢复展示',revision=generation+1)
            self.assertEqual(self.find(q='Résumé')['total'],1)
    def test_preset_restart_unique_and_delete(self):
        key=self.call('finder_save',name=' 控制库存 ',direction='down',field='数量',page=3)
        with self.assertRaisesRegex(ValueError,'同名'):self.call('finder_save',name='控制库存')
        saved=Service(Store(self.store.home)).dispatch('finder_presets',{})[0]
        self.assertEqual(saved['id'],key);self.assertNotIn('page',saved['filters'])
        self.assertEqual(self.find(**saved['filters'])['total'],1)
        self.call('finder_forget',id=key);self.assertFalse(self.call('finder_presets'))
        self.assertEqual(self.find()['total'],3)


class Journal(Work):
    def test_activity_reuse_omissions_and_offline(self):
        (self.directory/'document').write_bytes(b'abc')
        (self.directory/'skip.tmp').write_bytes(b'x');self.scan();self.scan('周期校对')
        self.assertEqual(self.records()['total'],2)
        first=self.records(source='手动扫描')['items'][0]
        self.assertEqual((first['captured'],first['candidates'],first['skipped'],first['read_bytes']),(1,1,1,3))
        self.assertEqual(first['skip_reasons'],{'规则排除文件':1})
        self.assertEqual(self.records(source='周期校对')['items'][0]['reused'],1)
        self.directory.rename(self.base/'offline');self.scan()
        failed=self.records(state='有异常')['items'][0]
        self.assertTrue(failed['problem']);self.assertEqual(failed['skipped'],0)
        self.assertEqual(self.records(skips=True)['total'],2)
        self.assertFalse(any('document' in str(r) for r in self.records()['items']))
        dest=self.base/'runs.csv';self.call('scan_log_export',root=self.rid,state='完成',path=str(dest))
        with dest.open(encoding='utf-8-sig') as f:self.assertEqual(len(list(csv.DictReader(f))),2)
    def test_waiting_stable_over_multiple_saves(self):
        file=self.directory/'book.odt'
        def write(value):
            with zipfile.ZipFile(file,'w') as z:z.writestr('content.xml',f'<document><p>{value}</p></document>')
        write('first');self.scan()
        for stamp,value in [(1,'second'),(2,'third')]:
            write(value)
            with patch('engine.store.time.monotonic',return_value=stamp):self.scan('文件监听')
        self.assertEqual(self.records(state='等待保存')['total'],2)
        self.assertEqual(self.records()['items'][0]['waiting'],1)
        with patch('engine.store.time.monotonic',return_value=4):self.scan('保存复查')
        self.assertEqual(self.call('history',id=1)[0]['num'],2)
    def test_retention_paging_and_restart_recovery(self):
        with self.store.db() as db:
            db.executemany("INSERT INTO scan_runs(root_id,source,started,status) VALUES(?,'测试','2025-01-01','完成')",[(self.rid,)]*204)
        self.scan();self.assertEqual(self.records()['total'],200);self.assertEqual(self.records(page=500)['page'],10)
        with self.store.db() as db:db.execute("INSERT INTO scan_runs(root_id,source,started,status) VALUES(?,'测试','2025-01-01','进行中')",(self.rid,))
        self.service.stopping.set();self.service.start()
        self.assertEqual(self.records(state='中断')['items'][0]['problem'],'上次引擎退出')
        self.store.root_action(self.rid,'暂停');self.scan();self.assertEqual(self.records()['total'],201)
    def test_all_format_wait_policy_survives_restart(self):
        self.call('capture_policy',root=self.rid,settle_ms=3000,all_types=True)
        p=self.directory/'note.txt';p.write_text('start');self.scan()
        p.write_text('new text')
        with patch('engine.store.time.monotonic',return_value=1):self.scan('文件监听')
        self.assertEqual(self.call('waiting_files',root=self.rid)['items'][0]['attempts'],1)
        self.store=Store(self.store.home);self.service=Service(self.store)
        with patch('engine.store.time.monotonic',return_value=12):self.scan('周期校对')
        self.assertEqual(self.call('history',id=1)[0]['num'],1)
        wait=self.call('waiting_files',root=self.rid,reason='等待保存稳定',q='note',sort='attempts')['items'][0]
        self.assertEqual(wait['attempts'],2);self.assertTrue(wait['first_seen'] and wait['last_seen'])
        with patch('engine.store.time.monotonic',return_value=16):self.scan('保存复查')
        self.assertEqual(self.call('history',id=1)[0]['num'],2);self.assertEqual(self.call('waiting_files',root=self.rid)['total'],0)
        root=self.call('roots')[0];self.assertEqual((root['settle_ms'],root['all_types']),(3000,1))
        with self.assertRaises(ValueError):self.call('capture_policy',root=self.rid,settle_ms=-1)
    def test_entire_waiting_queue_and_pause(self):
        self.call('capture_policy',root=self.rid,all_types=True)
        for i in range(38):(self.directory/f'bulk{i}.txt').write_text('open')
        self.scan('文件监听')
        page=self.call('waiting_files',root=self.rid,page=2)
        self.assertEqual((page['total'],len(page['items'])),(38,13))
        self.assertTrue(all(row['reason']=='等待保存稳定' for row in page['items']))
        self.store.root_action(self.rid,'暂停');self.assertEqual(self.call('waiting_files',root=self.rid)['total'],0)
    def test_subscription_updates_on_replaced_directory(self):
        from types import SimpleNamespace
        from threading import Event
        counters=[];removed=[];finished=Event()
        def subscribe(handler,path,recursive):
            counters.append(path)
            return 'watch'+str(len(counters))
        def wait(_):
            if len(counters)==1 and not removed:
                self.directory.rename(self.base/'old');self.directory.mkdir()
            elif len(counters)>1:finished.set()
        observer=SimpleNamespace(is_alive=lambda:True,emitters=set(),schedule=subscribe,unschedule=removed.append)
        self.service.stopping=SimpleNamespace(is_set=finished.is_set,wait=wait)
        self.service.watch_loop(observer,lambda rid:rid)
        self.assertEqual((len(counters),removed),(2,['watch1']))
        self.assertEqual(self.call('roots')[0]['watch_mode'],'文件监听与周期校对')
    def test_migration_requeues_only_relevant_and_backup(self):
        self.directory.joinpath('mail.eml').write_text('Subject: A\n\nfirst');self.scan()
        self.directory.joinpath('mail.eml').write_text('Subject: B\n\nnext');self.scan()
        with self.store.db() as db:
            db.execute("UPDATE versions SET status='属性对比' WHERE num=2")
            db.execute('PRAGMA user_version=7')
        newer=Store(self.store.home)
        self.assertTrue(newer.parse_one());self.assertEqual(self.call('finder',ext='eml')['total'],2)
        dest=self.base/'b.zip';newer.backup(dest);self.assertEqual(backup_check.inspect(dest)['schema'],11)


class Office(Work):
    def test_cell_search_across_pages_exact_side_and_type(self):
        file=self.directory/'wide.xlsx'
        def save(new):
            b=Workbook();s=b.active;s.append(['编号']+['栏'+str(i) for i in range(1,15)])
            for n in range(1,43):
                s.append([f'id{n}']+['x']*13+[('ALPHA-2' if new else 'ALPHA') if n==42 else 'Alpha'])
            if new:s['C2']='=SUM(1,2)'
            b.save(file)
        save(False);self.scan();save(True);self.scan()
        args=dict(old=1,new=2,mode='aligned')
        def search(**q):return self.call('sheet_find',**args,**q)
        self.assertTrue(search(q='alpha',field='栏14',side='old')['more'])
        self.assertEqual(len(search(q='alpha',field='栏14',side='old',offset=40)['items']),2)
        hit=search(q='ALPHA-2',exact=True,changed=True,side='new',type='文本')['items'][0]
        self.assertEqual(hit['address'],'O43')
        self.assertFalse(search(q='alpha-2',sensitive=True)['items'])
        self.assertEqual(search(q='SUM',type='公式')['items'][0]['address'],'C2')
        page=self.call('sheet_rows',**args,locate='new',target=hit['address'])
        self.assertGreater(page['page'],1);self.assertGreater(page['col_page'],1)
        with self.assertRaises(ValueError):search(q='')
    def test_chart_picture_and_macro_metadata(self):
        files=[]
        for i in range(2):
            book=Workbook();ws=book.active
            for row in [['amount','other'],[10,1],[20,2]]:ws.append(row)
            chart=(BarChart if i==0 else LineChart)()
            chart.title='发货' if i==0 else '入库';chart.legend.position='r' if i==0 else 'b'
            chart.add_data(Reference(ws,min_col=i+1,min_row=1,max_row=3),titles_from_data=True)
            ws.add_chart(chart,'E1' if i==0 else 'F2')
            image=self.base/f'img{i}.png';Image.new('RGB',(4,4),(i*125,0,0)).save(image)
            ws.add_image(BookImage(str(image)),'D5');path=self.base/f't{i}.xlsx';book.save(path)
            with zipfile.ZipFile(path,'a') as z:z.writestr('xl/vbaProject.bin',bytes([i]))
            files.append(path)
        rows=formats.compare(*files,'.xltm')[1]
        locations={r['location'] for r in rows}
        for name in ['图表 1 · 标题 1','图表 1 · 图形类型','图表 1 · 图例位置','图表 1 · 系列 1 · val','图表 1 · 锚点 from','图片 1 · 内容摘要','VBA 项目摘要']:
            self.assertIn(name,locations)


class ExtraFormats(Work):
    def test_eml_headers_body_attachments_and_transport_encoding(self):
        paths=[]
        for n in (0,1):
            m=EmailMessage();m['Subject']='交接'+str(n);m['To']='a@example.invalid';m.set_content('正文'+str(n))
            m.add_alternative('<p>说明</p>',subtype='html')
            for payload in (b'a',bytes([n])):m.add_attachment(payload,maintype='application',subtype='octet-stream',filename='记录.bin')
            p=self.base/str(n);p.write_bytes(m.as_bytes());paths.append(p)
        rows=formats.compare(*paths,'.eml')[1]
        self.assertEqual({r['sheet'] for r in rows},{'邮件头','邮件正文','附件'})
        self.assertTrue(any(r['location']=='记录.bin #2 · 内容摘要' for r in rows))
        self.assertFalse(any('text/html' in r['location'] for r in rows))
    def test_tracks_routes_waypoints(self):
        base='<gpx><metadata><name>base</name></metadata><wpt lat="1" lon="3"><name>A</name></wpt><trk><trkseg><trkpt lat="1" lon="2"><ele>10</ele></trkpt></trkseg></trk><rte><rtept lat="0" lon="0"/></rte></gpx>'
        a=self.base/'old';a.write_text(base);b=self.base/'new';b.write_text(base.replace('>10<','>12<').replace('>A<','>B<').replace('lon="0"','lon="5"'))
        rows=formats.compare(a,b,'.gpx')[1]
        self.assertEqual({r['location'] for r in rows},{'ele','name','lon'})
        self.assertEqual(formats.compare(a,b,'.gpx','coordinate')[1][0]['sheet'],'文本')
    def test_epub_manifest_read_order_resources_and_paragraph(self):
        def write(path,n):
            with zipfile.ZipFile(path,'w') as z:
                z.writestr('META-INF/container.xml','<container><rootfile full-path="OPS/book.opf"/></container>')
                order=['p','i'] if n==1 else ['i','p']
                z.writestr('OPS/book.opf',f'<package><metadata><title>T{n}</title></metadata><manifest><item id="p" href="text/1.xhtml" media-type="application/xhtml+xml"/><item id="i" href="img.bin" media-type="application/octet-stream"/></manifest><spine>'+''.join(f'<itemref idref="{i}"/>' for i in order)+'</spine></package>')
                z.writestr('OPS/text/1.xhtml',f'<html><body><p>第 {n} 稿</p></body></html>')
                z.writestr('OPS/img.bin',bytes([n]))
        a=self.base/'a';b=self.base/'b';write(a,1);write(b,2)
        rows=formats.compare(a,b,'.epub')[1]
        self.assertEqual({r['sheet'] for r in rows},{'出版信息','阅读顺序','资源摘要','章节 text/1.xhtml'})
