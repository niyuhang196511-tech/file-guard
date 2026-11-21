import csv
import io
import json
from pathlib import Path
import struct
import tarfile
import tempfile
import unittest
import wave
from unittest.mock import patch

from engine import formats
from engine.service import Service
from engine.store import Store
from openpyxl import Workbook


class Formats(unittest.TestCase):
    def setUp(self):
        temp=tempfile.TemporaryDirectory();self.addCleanup(temp.cleanup)
        self.root=Path(temp.name)

    def textdiff(self,ext,a,b,mode='aligned'):
        files=[self.root/n for n in ('one','two')]
        for f,s in zip(files,(a,b)):f.write_text(s,encoding='utf-8')
        return formats.compare(*files,ext,mode)[1]

    def test_vcard_fold_uid_reorder_and_repeated_contacts(self):
        template='BEGIN:VCARD\nVERSION:4.0\nUID:{}\nFN:{}\nTEL;TYPE="work:office":123\nTEL;TYPE=home:555\nEND:VCARD\n'
        a=template.format('a','陈女士');b=template.format('b','李医生')
        self.assertFalse(self.textdiff('.vcf',a+b,b+a.replace('陈女士','陈女\n 士')))
        differences=self.textdiff('.vcf',a+b,b+a.replace('TYPE=home:555','TYPE=cell:666'))
        self.assertEqual({(r['location'],r['new']) for r in differences},{('TEL #2','666'),('TEL #2 · 参数','TYPE=cell')})
        self.assertTrue(self.textdiff('.vcf',a+b,b+a,'coordinate'))
        self.assertEqual(len(self.textdiff('.vcf',a+a,a+a.replace('陈女士','新姓名'))),1)

    def test_calendar_instances_and_nested_components(self):
        header='BEGIN:VCALENDAR\nVERSION:2.0\n'
        block='BEGIN:VEVENT\nUID:u\nRECURRENCE-ID:{}\nDTSTART;TZID=Asia/Shanghai:0900\nRRULE:FREQ=WEEKLY\nSUMMARY:{}\nBEGIN:VALARM\nTRIGGER:-PT15M\nEND:VALARM\nEND:VEVENT\n'
        a=block.format('d1','初检');b=block.format('d2','复检')
        def cal(s):return header+s+'END:VCALENDAR'
        rows=self.textdiff('.ics',cal(a+b),cal(b.replace('-PT15M','-PT30M')+a.replace('WEEKLY','DAILY')))
        self.assertEqual({r['location'] for r in rows},{'TRIGGER #1','RRULE #1'})
        self.assertTrue(any('VALARM' in r['sheet'] and 'd2' in r['sheet'] for r in rows))
        with self.assertRaises(ValueError):self.textdiff('.ics',cal(a),cal(a).replace('END:VALARM','END:OTHER'))

    def test_geojson_identity_coordinates_collections_pointers(self):
        def feature(id,x):
            return {'type':'Feature','id':id,'properties':{'a/b~c':{'value':x}},'geometry':{'type':'GeometryCollection','geometries':[{'type':'LineString','coordinates':[[1,2],[x,4]]}]}}
        def doc(x):return json.dumps({'type':'FeatureCollection','features':x})
        a,b=feature(1,3),feature('1',7)
        rows=self.textdiff('.geojson',doc([a,b]),doc([b,feature(1,5)]))
        self.assertEqual(sum(r['location']=='顺序' for r in rows),2)
        self.assertEqual({r['location'] for r in rows if r['location']!='顺序'},{'properties/a~1b~0c/value','geometry/geometries/0/coordinates/1'})
        a['geometry']=None
        self.assertTrue(any(r['new']=='null' for r in self.textdiff('.geojson',doc([b]),doc([a]))))
        with self.assertRaises(ValueError):self.textdiff('.geojson',doc([a]),'{"type":"Point","coordinates":[],"coordinates":[0,0]}')

    def test_vtt_order_body_settings_and_aux_blocks(self):
        header='WEBVTT 培训\nKind: captions\n\n'
        a='到货\n00:00:01.000 --> 00:00:04.000 align:start\n核对\n数量\n\n';b=a.replace('到货','签字')
        rows=self.textdiff('.vtt',header+a+b+'NOTE A\n备注',header+b+a.replace('align:start','align:end').replace('数量','批号')+'NOTE B\n备注')
        self.assertEqual({r['location'] for r in rows},{'顺序','显示设置','字幕','NOTE #1'})
        self.assertTrue(any(r['new']=='核对\n批号' for r in rows))
        with self.assertRaisesRegex(ValueError,'WEBVTT'):self.textdiff('.vtt','bad',header+a)

    def test_wave_metadata_audio_even_and_odd_lengths(self):
        def audio(name,channels,bits,rate,frames,byte):
            f=self.root/name
            with wave.open(str(f),'wb') as w:
                w.setparams((channels,bits,rate,frames,'NONE',''));w.writeframes(bytes([byte])*frames*channels*bits)
            return f
        a=audio('a',1,1,8000,81,1);b=audio('b',2,2,16000,160,2)
        rows=formats.compare(a,b,'.wav')[1]
        self.assertTrue({'声道数','采样率','位深','每秒字节','帧对齐字节','帧数','时长（微秒）','内容摘要'} <= {r['location'] for r in rows})
        c=audio('c',1,1,8000,81,2)
        self.assertEqual([r['location'] for r in formats.compare(a,c,'.wav')[1]],['内容摘要'])
        damaged=self.root/'truncated';damaged.write_bytes(a.read_bytes()[:-1])
        with self.assertRaises(ValueError):formats.compare(a,damaged,'.wav')

    def test_tar_attributes_links_duplicates_and_order(self):
        def make(name,revision):
            f=self.root/name
            with tarfile.open(f,'w') as z:
                for data in (b'one',b'two' if not revision else b'TWO'):
                    info=tarfile.TarInfo('同名.txt');info.size=len(data)
                    info.uid=10+revision;info.gname='质管' if revision else '仓库'
                    z.addfile(info,io.BytesIO(data))
                info=tarfile.TarInfo('link');info.type=tarfile.SYMTYPE;info.linkname='../foo' if revision else '/elsewhere'
                z.addfile(info)
            return f
        rows=formats.compare(make('a',0),make('b',1),'.tar')[1]
        self.assertEqual({r['location'] for r in rows},{'用户 ID','组名','内容摘要','链接目标'})
        self.assertTrue(any(r['sheet'].endswith('#2') and r['location']=='内容摘要' for r in rows))


    def test_ics_timezone_attendees_and_text_fallback(self):
        def calendar(zone):
            return ('BEGIN:VCALENDAR\nBEGIN:VTIMEZONE\nTZID:zoneA\nBEGIN:STANDARD\nTZOFFSETTO:'+zone+
                    '\nEND:STANDARD\nEND:VTIMEZONE\nBEGIN:VEVENT\nUID:work\nATTENDEE:a\nATTENDEE:b\nDTEND;TZID=Zone:1100\nEND:VEVENT\nEND:VCALENDAR')
        sample=calendar('+0800')
        rows=self.textdiff('.ics',sample,calendar('+0900').replace('ATTENDEE:b','ATTENDEE:c').replace('TZID=Zone','TZID=Zone2'))
        self.assertEqual({r['location'] for r in rows},{'TZOFFSETTO #1','ATTENDEE #2','DTEND #1 · 参数'})
        self.assertTrue(self.textdiff('.ics',sample,sample.replace('END:VEVENT','END:BAD'),'coordinate'))

    def test_geojson_bbox_and_repeated_ids(self):
        def f(bbox):return {'type':'Feature','id':'x','properties':{},'geometry':None,'bbox':bbox}
        old={'type':'FeatureCollection','bbox':[1,2,3,4],'features':[f([1,2,3,4]),f([1,2,3,4])]}
        new=json.loads(json.dumps(old));new['bbox'][0]=0;new['features'][1]['bbox'][0]=0
        rows=self.textdiff('.geojson',json.dumps(old),json.dumps(new))
        self.assertEqual(len(rows),2);self.assertTrue(any(r['sheet'].endswith('#2') for r in rows))

    def test_vtt_repeated_ids_unnamed_and_annotations(self):
        old='WEBVTT\n\nNOTE first\n\nSTYLE\n::cue {color:red}\n\nREGION\nid:a\n\nid\n00:01.000 --> 00:02.500\na\n\nid\n00:03.000 --> 00:04.000\nb\n\n00:05.000 --> 00:06.000\nc'
        new=old.replace('color:red','color:blue').replace('id:a','id:b').replace('00:04.000','00:04.500').replace('06.000\nc','06.000\nd')
        rows=self.textdiff('.vtt',old,new)
        self.assertEqual({r['location'] for r in rows},{'STYLE #1','REGION #1','结束','字幕'})
        self.assertTrue(any(r['sheet'].endswith('#2') for r in rows))
        with self.assertRaises(ValueError):self.textdiff('.vtt',old,new.replace('-->','→'))

    def test_wave_extra_chunks_and_truncated_frame(self):
        def write(name,body,extra=b'abc'):
            fmt=struct.pack('<HHIIHH',1,1,8000,16000,2,16)
            def chunk(key,data):return key+struct.pack('<I',len(data))+data+b'\0'*(len(data)%2)
            content=b'WAVE'+chunk(b'fmt ',fmt)+chunk(b'JUNK',extra)+chunk(b'data',body)
            file=self.root/name;file.write_bytes(b'RIFF'+struct.pack('<I',len(content))+content);return file
        a=write('a',b'aa');b=write('b',b'aa',b'xyz')
        self.assertTrue(any(r['sheet']=='JUNK #1' and r['location']=='内容摘要' for r in formats.compare(a,b,'.wav')[1]))
        with self.assertRaisesRegex(ValueError,'帧不完整'):formats.compare(a,write('bad',b'a'),'.wav')

    def test_tar_permissions_order_metadata_and_hard_links(self):
        def build(name,rev):
            path=self.root/name
            with tarfile.open(path,'w') as z:
                members=['a','b','l']
                for n in reversed(members) if rev else members:
                    info=tarfile.TarInfo(n)
                    if n=='l':info.type=tarfile.LNKTYPE;info.linkname='a' if rev else 'b'
                    else:
                        info.mode=0o444 if rev else 0o644
                        info.mtime=int(rev)
                    z.addfile(info)
            return path
        rows=formats.compare(build('1',False),build('2',True),'.tar')[1]
        self.assertEqual({r['location'] for r in rows},{'顺序','权限','修改时间','链接目标'})


class Reports(unittest.TestCase):
    def setUp(self):
        temp=tempfile.TemporaryDirectory();self.addCleanup(temp.cleanup)
        self.base=Path(temp.name);self.root=self.base/'监控';self.root.mkdir()
        self.store=Store(self.base/'Data');self.api=Service(self.store);self.rid=self.store.configure(self.root)
    def call(self,cmd,**args):return self.api.dispatch(cmd,args)
    def scan(self,day):
        with patch('engine.store.now',return_value=f'2026-11-{day:02}T09:00:00+08:00'):
            self.store.scan(self.rid)
        while self.store.parse_one():pass
    def make(self):
        self.old=self.root/'旧.csv';self.new=self.root/'新.csv'
        def content(p,n):p.write_text(f'编号,数量\nA,{n}\nB,2',encoding='utf-8')
        content(self.old,10);self.scan(1)
        content(self.old,12);self.scan(5)
        self.old.rename(self.new);self.scan(7)
        content(self.new,10);self.scan(8)
        self.fid=self.call('files')['items'][0]['id']
    def period(self,**args):return self.call('period_report',**{'start':'2026-11-07','end':'2026-11-09',**args})
    def trace(self,**args):return self.call('field_trace',**{'id':self.fid,'record':'A',**args})
    def hide(self,eid,hidden):
        with self.store.db() as db:
            db.execute("INSERT INTO event_edits VALUES(?,1,'now','测试','','',?)",(eid,hidden))

    def test_period_same_file_rename_windows_filters_and_navigation(self):
        self.make();data=self.period()
        self.assertEqual((data['before'],data['after'],data['files_before'],data['files_after']),(1,2,1,1))
        r=data['items'][0];self.assertEqual((r['delta'],r['days'],r['files']),(1,2,1))
        self.assertTrue(r['label'].endswith('新.csv'));self.assertEqual(self.call('events',event_id=r['event_id'])['items'][0]['rel'],'新.csv')
        self.assertEqual(self.period(ext='CSV;tsv',q='旧',trend='equal')['total'],1)
        self.assertEqual(self.period(group='kind',trend='new')['items'][0]['label'],'重命名')
        for mode in ('source','ext','hour','root','folder','weekday'):
            with self.subTest(mode=mode):
                rows=self.period(group=mode)['items'];self.assertEqual(sum(r['after'] for r in rows),2)
        self.assertEqual(self.period(group='kind',kind='内容修改',root_id=self.rid)['total'],1)
        self.assertEqual(self.period(source='missing')['total'],0)

    def test_period_date_edges_missing_extensions_and_csv(self):
        for i in range(31):(self.root/f'f{i}').write_text('a')
        self.scan(1)
        opt=dict(start='2026-11-01',end='2026-11-01',initial=True)
        self.assertEqual(self.period(**opt,page=2)['total'],31)
        self.assertEqual(self.period(**opt,group='ext')['items'][0]['label'],'（无）')
        dest=self.base/'report.csv';self.call('period_csv',**opt,path=str(dest),page=2)
        with dest.open(encoding='utf-8-sig') as f:self.assertEqual(len(list(csv.reader(f))),32)
        with self.assertRaises(FileExistsError):self.call('period_csv',**opt,path=str(dest))
        with self.assertRaises(ValueError):self.period(start='2025-01-01')
        with self.assertRaises(ValueError):self.period(start='2026-12-01')
        self.assertEqual(self.period(start='2026-11-01',end='2026-11-01')['total'],0)

    def test_trace_return_scope_order_before_and_after_filter(self):
        self.make();rows=self.trace()['items']
        self.assertEqual([r['version'] for r in rows],[3,2])
        self.assertEqual([(r['old'],r['new'],r['returning']) for r in rows],[('12','10','是'),('10','12','否')])
        self.assertEqual(rows[0]['rel'],'新.csv');self.assertEqual(rows[1]['rel'],'旧.csv')
        self.assertEqual(self.trace(ascending=True)['items'][0]['version'],2)
        self.assertEqual(self.trace(value='12',field='数量',only_return=True)['total'],1)
        self.assertEqual(self.trace(low=3,only_return=True)['total'],0)
        self.assertEqual(self.trace(high=2)['versions'],1)
        self.assertEqual(self.trace(record='a')['total'],0)
        self.assertEqual(self.trace(kind='删除')['total'],0)
        with self.assertRaises(ValueError):self.trace(low=3,high=2)
        with self.assertRaises(ValueError):self.trace(record='')

    def test_withdrawn_records_are_absent_in_stats_reversions_and_exports(self):
        self.make();first,second=self.trace(ascending=True)['items']
        self.hide(first['event_id'],2)
        self.assertEqual(self.trace()['returns'],0)
        self.assertEqual(self.period()['before'],0)
        self.hide(second['event_id'],1)
        self.assertEqual(self.trace()['total'],0);self.assertEqual(self.period()['after'],1)
        out=self.base/'trace.csv';self.call('trace_csv',id=self.fid,record='A',path=str(out))
        self.assertEqual(len(out.read_text(encoding='utf-8-sig').splitlines()),1)

    def test_pending_and_long_values_csv_cross_page(self):
        f=self.root/'rows.csv'
        def write(s):
            f.write_text('编号,备注\n'+'\n'.join(f'{i},{s}{i}' for i in range(27)))
        write('old');self.scan(1);write('x'*999);self.scan(2)
        self.fid=self.call('files')['items'][0]['id']
        data=self.trace(record='',field='备注',page=2);self.assertEqual((data['total'],len(data['items'])),(27,2))
        self.assertEqual(len(data['items'][0]['new']),801)
        dest=self.base/'all.csv';self.call('trace_csv',id=self.fid,field='备注',path=str(dest),page=2)
        with dest.open(encoding='utf-8-sig') as f:
            rows=list(csv.DictReader(f));self.assertEqual(len(rows),27);self.assertTrue(all(len(r['新值'])>999 for r in rows))
        with self.store.db() as db:db.execute("UPDATE versions SET status='待解析' WHERE num=2")
        data=self.trace(record='',field='备注');self.assertEqual(data['coverage'],{'待解析':1});self.assertEqual(data['total'],0)

    def test_excel_moved_address_filters_and_nonadjacent_paths(self):
        f=self.root/'数量.xlsx'
        for i,rows in enumerate([[['A',1],['B',2]],[['B',9],['A',1]]],1):
            b=Workbook();s=b.active;s.title='库存';s.append(['编号','数量'])
            for row in rows:s.append(row)
            b.save(f);b.close();self.scan(i)
        self.fid=self.call('files')['items'][0]['id']
        for address in ('B2','B3'):
            self.assertEqual(self.trace(record='B',location=address,sheet='库存',category='单元格值')['total'],1)
        self.assertEqual(self.trace(record='B',location='B20')['total'],0)

    def test_schema_nine_existing_new_formats_requeued(self):
        f=self.root/'培训.vtt';f.write_text('WEBVTT\n\n00:00:00.000 --> 00:00:01.000\n一');self.scan(1)
        f.write_text(f.read_text()+'二');self.scan(2)
        with self.store.db() as db:
            db.execute("UPDATE versions SET status='属性对比',details='[]' WHERE num=2");db.execute('PRAGMA user_version=9')
        store=Store(self.store.home)
        with store.db() as db:self.assertEqual(db.execute('SELECT status FROM versions WHERE num=2').fetchone()[0],'待解析')
        self.assertTrue(store.parse_one())
        self.assertEqual(self.call('compare',old=1,new=2)['items'][0]['new'],'一二')
