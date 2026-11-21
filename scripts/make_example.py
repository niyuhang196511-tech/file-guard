"""从隔离的临时业务文件生成可离线打开的只读样例。"""
import datetime as dt
import json
import sys
import tempfile
import zipfile
from pathlib import Path
from unittest.mock import patch
from docx import Document
from openpyxl import Workbook
from copy import copy
from pypdf import PdfWriter
from pptx import Presentation
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from engine.store import Store
from engine.service import Service
from engine import finder,scan_log,health,handoff,variance,work_reports,exchange_formats,table_source,text_history,content_catalog,line_origins,version_bundle,path_history,checkpoint_three,snapshot_preview
import base64
import hashlib

def write(path,n):
    ext=path.suffix
    if ext=='.xlsx':
        w=Workbook();s=w.active;s.title='库存表' if path.stem=='库存台账' else '明细表'
        s.append(['编码','物料名称','现存量','单价','金额'])
        s.append(['MD-001','移动滑垫',n,12.5,'=C2*D2'])
        s.append(['MD-002','移位辅助带',48,18,'=C3*D3'])
        if path.stem=='库存台账' and n==80:
            s['E2']='=ROUND(C2*D2,2)'
            s.insert_rows(3)
            for col,value in enumerate(['MD-003','移位板',30,25,'=C3*D3'],1):
                s.cell(3,col,value)
            s['C4']=52
            s['E4']='=C4*D4'
            font=copy(s['D2'].font)
            font.b=True
            s['D2'].font=font
            s['D2'].number_format='0.00'
        w.save(path);w.close()
    elif ext=='.docx':
        doc=Document()
        doc.add_heading(path.stem,1)
        if path.stem=='检验作业指导书':
            doc.add_paragraph('核对批次编号及记录日期。')
            if n==3:
                doc.add_paragraph('请填写本次复核记录人姓名。')
            doc.add_paragraph('确认本批资料完整。')
            doc.add_paragraph(f'复核记录保存 {3 if n==3 else 2} 份。')
            doc.sections[0].footer.paragraphs[0].text='文件版次 '+('B' if n==3 else 'A')
        else:
            doc.add_paragraph(f'本次复核数量为 {n} 件。')
        doc.save(path)
    elif ext=='.toml':
        path.write_text(f'# 库存预警规则\n[warehouse]\nminimum = {n}\n',encoding='utf-8')
    elif ext=='.srt':
        path.write_text(f'1\n00:00:00,000 --> 00:00:02,000\n本批次复核数量 {n}',encoding='utf-8')
    elif ext=='.eml':
        from email.message import EmailMessage
        msg=EmailMessage();msg['From']='warehouse@example.invalid';msg['To']='quality@example.invalid'
        msg['Subject']='批次交接回执';msg.set_content(f'本批次交接 {n} 件。')
        msg.add_attachment(f'交接数量,{n}'.encode(),maintype='text',subtype='csv',filename='交接明细.csv')
        path.write_bytes(msg.as_bytes())
    elif ext=='.gpx':
        path.write_text(f'<gpx version="1.1"><trk><name>配送路线</name><trkseg><trkpt lat="36.6" lon="117.0"><ele>{n}</ele></trkpt></trkseg></trk></gpx>',encoding='utf-8')
    elif ext=='.vcf':
        path.write_text(f'BEGIN:VCARD\nVERSION:4.0\nUID:vendor-7\nFN:物流联系人\nTEL;TYPE=work:010-55550{n}\nEND:VCARD\n',encoding='utf-8')
    elif ext=='.ics':
        path.write_text(f'BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nUID:qa-1\nSUMMARY:月末复核\nLOCATION:复核室 {n}\nDTSTART:20261201T090000Z\nEND:VEVENT\nEND:VCALENDAR\n',encoding='utf-8')
    elif ext=='.geojson':
        path.write_text(json.dumps({'type':'FeatureCollection','features':[{'type':'Feature','id':'站点A','properties':{'核对数量':n},'geometry':{'type':'Point','coordinates':[117+n/1000,36.6]}}]},ensure_ascii=False),encoding='utf-8')
    elif ext=='.vtt':
        path.write_text(f'WEBVTT\n\n入库\n00:00:01.000 --> 00:00:04.000 align:start\n核对 {n} 件\n',encoding='utf-8')
    elif ext=='.wav':
        import wave
        with wave.open(str(path),'wb') as w:
            w.setparams((1,1,8000,0,'NONE',''));w.writeframes(bytes([128])*n)
    elif ext=='.tar':
        import tarfile,io
        with tarfile.open(path,'w') as archive:
            data=f'复核件数 {n}'.encode()
            info=tarfile.TarInfo('资料/交付说明.txt');info.size=len(data);archive.addfile(info,io.BytesIO(data))
    elif ext=='.csv':
        path.write_text(f'编号,数量,状态\nRK-001,{n},已复核\n',encoding='utf-8-sig')
    elif ext=='.json':
        path.write_text(json.dumps({'仓库':{'最低库存':n}},ensure_ascii=False),encoding='utf-8')
    elif ext=='.zip':
        with zipfile.ZipFile(path,'w') as pack:
            pack.writestr('版本说明.txt',f'交付版次 {n}')
            if n>100:pack.writestr('验收记录/',b'')
    elif ext=='.pptx':
        doc=Presentation();slide=doc.slides.add_slide(doc.slide_layouts[0]);slide.shapes.title.text=path.stem;slide.placeholders[1].text=f'批次 {n}';slide.notes_slide.notes_text_frame.text=f'核对批次 {n} 的资料。';doc.save(path)
    elif ext=='.pdf':
        pdf=PdfWriter();page=pdf.add_blank_page(width=600,height=842);page.rotate((n%2)*90);pdf.add_metadata({'/Title':path.stem,'/Subject':str(n)});pdf.write(path);pdf.close()
    elif ext=='.png':
        Image.new('RGB',(16,16),(40,n%256,130)).save(path)
    else:
        path.write_text(f'{path.stem}\n本次核对 {n} 项。',encoding='utf-8')


def receiving_book(path,revised):
    book=Workbook()
    sheet=book.active
    sheet.title='批次明细'
    sheet.append(['数量','编码','名称','复核人'] if revised else ['编码','名称','数量'])
    for code,name,quantity in [('RK-001','移动滑垫',12),('RK-002','移位辅助带',8)]:
        if revised:
            sheet.append([str(quantity) if code=='RK-001' else 9,code,name,'张宁' if code=='RK-001' else None])
        else:
            sheet.append([code,name,quantity])
    book.save(path)
    book.close()


def batch_ledgers(root,revised):
    book=Workbook();s=book.active;s.title='计划领料'
    s.append(['物料编号','批号','数量','单位','备注'])
    for row in [('A-01','L1',80 if revised else 75,'件','已复核'),('A-01','L2',12,'件','备货'),
                ('B-02','L1',25,'盒',None),('C-03','L8',8,'盒','仅计划')]:
        s.append(row)
    note=book.create_sheet('填表说明');note.append(['字段','规则']);note.append(['批号','按供应商批号填写'])
    book.save(root/'计划领料.xlsx');book.close()
    text='物料编号\t批号\t数量\t单位\t备注\nA-01\tL2\t12\t件\t备货\nA-01\tL1\t'+('78' if revised else '70')+'\t件\t已复核\nB-02\tL1\t25\t盒\t\nD-04\tL9\t3\t盒\t临时追加\n'
    (root/'领料回执.tsv').write_text(text,encoding='utf-8')


def generate(tmp):
    store=Store(tmp/'Data');api=Service(store)
    names=[('仓库台账',['库存台账.xlsx','入库登记.xlsx','出库复核.xlsx','工具流转卡.xlsx','产品批次.xlsx','盘点计划.docx','货位清单.xlsx','签收记录.pdf','仓库交接.md','货架示意.png']),
           ('质量管理',['质量检验记录.xlsx','检验作业指导书.docx','供应商评价.xlsx','巡检记录.xlsx','受控文件清单.xlsx','质量复核报告.pdf','质量会议.pptx','器械标识.png','产品验收规范.docx']),
           ('产品资料',['产品目录.xlsx','移动滑垫说明书.docx','产品参数.xlsx','培训资料.pptx','包装说明.pdf','规格清单.xlsx','产品外观.png','包装标签.png','交付说明.md'])]
    dirs=[];paths=[]
    for title,files in names:
        root=tmp/title;root.mkdir();rid=store.configure(root,'*.bak，缓存' if title=='仓库台账' else '');dirs.append((root,rid))
        for j,name in enumerate(files):
            folder=root if j<4 else root/('归档资料' if j%2 else '业务明细')
            folder.mkdir(exist_ok=True)
            path=folder/name;write(path,100+j);paths.append(path)
    examples=[dirs[0][0]/'批次汇总.csv',dirs[1][0]/'阈值配置.json',dirs[2][0]/'交付资料.zip',dirs[1][0]/'预警规则.toml',dirs[2][0]/'培训字幕.srt',dirs[1][0]/'交接回执.eml',dirs[2][0]/'配送路线.gpx']
    examples.extend(dirs[2][0]/name for name in ['供应联系人.vcf','质量复核日历.ics','配送站点.geojson','培训讲解.vtt','提示音.wav','交付目录.tar'])
    returns=dirs[0][0]/'退货轨迹.csv'
    write(returns,100)
    approved='月末交接\n领料与退货已复核\n'.encode()
    catalog_source=dirs[0][0]/'月末交接签收.txt'
    catalog_source.write_bytes(approved)
    (dirs[1][0]/'质检交接备存.md').write_bytes(approved)
    for path in examples:write(path,100)
    day=dt.date.today()
    def clock(days,hour=9,minute=15):
        return dt.datetime.combine(day-dt.timedelta(days=days),dt.time(hour,minute)).astimezone().isoformat(timespec='seconds')
    def run(stamp):
        with patch('engine.store.now',return_value=stamp):
            for _,rid in dirs:store.scan(rid)
        while store.parse_one():pass
    checklist=dirs[0][0]/'交接复核清单.txt'
    write(checklist,0)
    receiving=dirs[0][0]/'批次收货台账.xlsx'
    receiving_book(receiving,False)
    batch_ledgers(dirs[0][0],False)
    run(clock(29))
    warehouse_id=dirs[0][1]
    # Retained sample runs between the first and second batches of saved versions.
    scan_examples=(
        ('文件监听','等待保存',10,42,2,0,0,0,2,{},''),
        ('保存复查','完成',11,78,29,2,67320,27,0,{},''),
        ('周期扫描','中断',12,0,0,0,0,0,0,{},'上次引擎退出'),
        ('周期扫描','完成',13,108,29,0,0,29,0,{'临时文件':1},''),
        ('手动扫描','完成',14,92,29,0,0,29,0,{},''),
    )
    with store.db() as db:
        db.executemany('''INSERT INTO scan_runs(root_id,source,started,ended,status,elapsed_ms,candidates,
            captured,read_bytes,reused,waiting,skipped,skip_reasons,problem) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)''',
            ((warehouse_id,source,clock(27,10,minute),clock(27,10,minute) if status!='中断' else '',
              status,elapsed,candidates,captured,read_bytes,reused,waiting,sum(skips.values()),
              json.dumps(skips,ensure_ascii=False),problem)
             for source,status,minute,elapsed,candidates,captured,read_bytes,reused,waiting,skips,problem in scan_examples))
    def snapshot(label,stamp):
        with patch('engine.checkpoints.now',return_value=stamp):
            for _,rid in dirs:
                api.dispatch('checkpoint_create',dict(root=rid,label=label))
    snapshot('月初交接',clock(29))
    reference_backup=tmp/'月初样例备份.zip';store.backup(reference_backup)
    for j,changes in enumerate([2,4,3,6,4,2,7,5,8,3,6,4,3,7]):
        if j in (0,7):write(returns,120 if j==0 else 100)
        if j==0:catalog_source.write_bytes('月末交接\n仍待复核\n'.encode())
        if j==7:catalog_source.write_bytes(approved)
        write(checklist,j+1)
        age=13-j
        for k in range(changes):
            p=paths[1+(j*3+k*5)%(len(paths)-1)]
            write(p,110+j*10+k)
        if j%3!=1:
            write(dirs[j%3][0]/f'第{j+1:02}批核对.xlsx',35+j)
        run(clock(age,10+j%6,8+j*2))
        if j==6:snapshot('月中复核',clock(age,10+j%6,8+j*2))
    batch_ledgers(dirs[0][0],True)
    for path in examples:write(path,120)
    run(clock(0,15,8))
    original=next(p for p in paths if p.name=='仓库交接.md')
    checklist.unlink()
    original.rename(original.with_name('仓库移交记录.md'))
    run(clock(0,17,20))
    write(checklist,100)
    write(next(p for p in paths if p.stem=='检验作业指导书'),3)
    run(clock(0,17,35))
    warehouse=dirs[0][0]
    for name in ('~$库存台账.xlsx','交接备份.bak'):
        (warehouse/name).write_bytes(b'example')
    (warehouse/'缓存').mkdir()
    receiving_book(receiving,True)
    write(paths[0],80);run(clock(0,17,42))
    snapshot('月末交接',clock(0,17,42))
    quality,quality_id=dirs[1]
    offline=quality.rename(tmp/'暂时离线')
    store.scan(quality_id)
    offline.rename(quality)
    store.root_action(dirs[2][1],'暂停')
    # All disk operations below use the disposable example workspace.
    previews={};disk_pages={}
    with store.db() as db:
        for v in db.execute('SELECT v.id,r.path,f.rel FROM versions v JOIN files f ON f.id=v.file_id JOIN roots r ON r.id=f.root_id'):
            try:
                info=store.restore_info(v['id'])
                info['path']='D:/业务资料/'+Path(v['path']).name+'/'+v['rel']
                info['preview']='example'
                previews[v['id']]=info
            except ValueError:
                previews[v['id']]={'error':'原路径已出现同名文件，请另存副本'}
        for c, in db.execute('SELECT id FROM checkpoints'):
            result=api.dispatch('checkpoint_disk',dict(id=c))
            all_items=result['items'][:]
            for page_no in range(2,result['pages']+1):
                all_items+=api.dispatch('checkpoint_disk',dict(id=c,page=page_no))['items']
            disk_pages[c]={r['rel']:r for r in all_items}
    receipts={}
    saved=dirs[0][0]/'领料回执.tsv'
    original_bytes=saved.read_bytes()
    with saved.open('a',encoding='utf-8') as f:f.write('S-05\tL2\t3\t件\t刚保存\n')
    with store.db() as db:
        for fid, in db.execute('SELECT id FROM files'):
            receipts[fid]={}
            for mode in ('quick','full'):
                result=api.dispatch('save_receipt',dict(id=fid,mode=mode,object=True))
                result['root']='D:/业务资料/'+Path(result['root']).name
                if result['root_error']:result['root_error']='目录离线或不可访问'
                receipts[fid][mode]=result
    saved.write_bytes(original_bytes)
    # Expose only fictional Windows directory labels in the example.
    with store.db() as db:
        for folder,rid in dirs:
            db.execute('UPDATE roots SET path=? WHERE id=?',('D:\\业务资料\\'+folder.name,rid))
        db.execute('DELETE FROM tasks')
        db.execute('DELETE FROM audit')
        # Fictional pending files are separate from the retained scan statistics.
        sample_waits=(('业务明细/入库补录.xlsx','等待保存稳定',1,3),
                      ('业务明细/盘点补录.xlsx','等待保存稳定',2,2),
                      ('归档资料/质检附录.pdf','等待文件读取权限',3,4))
        db.executemany('INSERT INTO waiting_files VALUES (?,?,?,?,?,?)',
                       ((warehouse_id,rel,reason,clock(0,17,39),clock(0,17,40+minute),attempts)
                        for rel,reason,minute,attempts in sample_waits))
        db.execute('INSERT INTO scan_waits VALUES (?,?,?,?)',
                   (warehouse_id,len(sample_waits),json.dumps([r[:2] for r in sample_waits],ensure_ascii=False),2))
        for folder,rid in dirs:
            db.execute('INSERT INTO audit(stamp,action,note) VALUES (?,?,?)',(clock(29),'添加监控目录','D:\\业务资料\\'+folder.name))
        db.execute('INSERT INTO audit(stamp,action,note) VALUES (?,?,?)',(clock(0,17,43),'导出版本差异','库存台账.xlsx · V1 → V2 · 示例工作区'))
    def all_rows(cmd,**opts):
        data=[];page=1
        while True:
            result=api.dispatch(cmd,{**opts,'size':100,'page':page});data+=result['items']
            if len(data)>=result['total']:return data
            page+=1
    d={'summary':api.dispatch('summary',{'days':30}),'files':all_rows('files',history=True),'events':all_rows('events'),'audit':all_rows('audit'),'history':{},'pairs':{},'coordinates':{},'grids':{},'storage':api.dispatch('storage',{})}
    d['saveReceipts']=receipts;d['ledgerSources']={}
    d['diskPages']=disk_pages;d['restorePreviews']=previews
    d['backupExample']=api.dispatch('inspect_backup',dict(path=str(reference_backup)))
    d['periodColumns']=work_reports.PERIOD_COLUMNS;d['traceColumns']=work_reports.TRACE_COLUMNS
    d['varColumns']=variance.COLUMNS
    d['inventory']={};d['packages']={};d['receipts']={};d['variance']={}
    with store.db() as db:
        ids=[r[0] for r in db.execute('SELECT id FROM checkpoints')]
    for cid in ids:
        dest=tmp/f'delivery-{cid}.zip'
        d['inventory'][cid]=all_rows('checkpoint_inventory',id=cid)
        api.dispatch('handoff_create',dict(id=cid,path=str(dest)))
        d['packages'][cid]=base64.b64encode(dest.read_bytes()).decode('ascii')
        d['receipts'][cid]=api.dispatch('handoff_verify',dict(path=str(dest)))
    sample_object=b'example unreferenced object';sample_key=hashlib.sha256(sample_object).hexdigest()
    obj=store.obj(sample_key);obj.parent.mkdir(exist_ok=True);obj.write_bytes(sample_object)
    with store.db() as db:key=db.execute('SELECT sha FROM versions ORDER BY id LIMIT 1').fetchone()[0]
    historical=store.obj(key);kept=tmp/'health-fixture'
    historical.rename(kept)
    try:health.run(store)
    finally:kept.rename(historical)
    health.run(store)
    d['healthReports']=api.dispatch('health_reports',{})
    d['healthRows']={};d['healthRefs']={}
    for r in d['healthReports']:
        rid=r['id'];res=api.dispatch('health_results',dict(id=rid));resolved=api.dispatch('health_results',dict(id=rid,change='本轮未再发现'))
        d['healthRows'][rid]=dict(res,items=res['items']+resolved['items'])
        for row in d['healthRows'][rid]['items']:
            if row['versions']:
                d['healthRefs'][row['object_key']]=all_rows('health_references',id=row['report_id'],key=row['object_key'])
    d['checkpoints']={rid:api.dispatch('checkpoints',dict(root=rid)) for _,rid in dirs}
    d['cpDiff']={}
    d['cpThree']={}
    d['cpThreeHeader']=checkpoint_three.CSV_HEADER
    for items in d['checkpoints'].values():
        for left in items:
            for right in items:
                if left['id']!=right['id']:
                    key=f"{left['id']}-{right['id']}"
                    d['cpDiff'][key]=all_rows('checkpoint_diff',old=left['id'],new=right['id'],unchanged=True)
                    for base in items:
                        if base['id']<min(left['id'],right['id']):
                            with store.db() as db:
                                meta,rows=checkpoint_three.assemble(db,dict(base=base['id'],left=left['id'],right=right['id']))
                            d['cpThree'][f"{base['id']}-{key}"]=dict(meta=meta,items=rows)
    d['finder']=all_rows('finder')
    with store.db() as db:
        for hit in d['finder']:
            if hit['old_value_truncated'] or hit['new_value_truncated']:
                details=json.loads(db.execute('SELECT details FROM versions WHERE id=?',(hit['new_v'],)).fetchone()[0])
                hit['old_value']=details[hit['ordinal']].get('old')
                hit['new_value']=details[hit['ordinal']].get('new')
            hit['direction']=finder.movement(hit['old_value'],hit['new_value'])
    d['finderColumns']=finder.EXPORT
    with store.db() as db:
        cap=db.execute('SELECT max(id) FROM versions').fetchone()[0]
        before=0
        snapshots=[]
        while True:
            batch=text_history.candidates(db,text_history.options(dict(q='样例',latest=False,before=before,cap=cap)),cap)
            for version in batch[:text_history.BATCH_VERSIONS]:
                row=dict(version)
                if row['size']<=text_history.FILE_BYTES:
                    decoded,problem=text_history.snapshot(store,row)
                else:
                    decoded,problem=None,text_history.SKIPS[0]
                del row['sha']
                text,encoding=decoded or ('','')
                snapshots.append(dict(row,text=text,encoding=encoding,problem=problem))
            if len(batch)<=text_history.BATCH_VERSIONS:
                break
            before=batch[text_history.BATCH_VERSIONS-1]['id']
    d['textSearch'] = dict(
        cap=cap, versions=snapshots, extensions=sorted(text_history.EXTENSIONS),
        limits=[text_history.BATCH_VERSIONS,text_history.BATCH_RESULTS,text_history.FILE_BYTES,
                text_history.BATCH_BYTES,text_history.MATCH_PREVIEWS,text_history.PREVIEW_CHARS],
        header=text_history.CSV_HEADER,
        fold={c:c.casefold() for c in map(chr,range(0x110000)) if c.casefold()!=c.lower()},
    )
    with store.db() as db:
        checks={sha:content_catalog.verify(db,store,dict(sha=sha)) for sha, in db.execute('SELECT DISTINCT sha FROM versions')}
    d['contentCatalog']=dict(checks=checks,group_fields=content_catalog.GROUP_FIELDS,
                             group_header=content_catalog.GROUP_HEADER,ref_fields=content_catalog.REF_FIELDS,
                             ref_header=content_catalog.REF_HEADER,example=hashlib.sha256(approved).hexdigest())
    d['scanColumns']=scan_log.COLUMNS
    d['scanDetailColumns']=scan_log.DETAIL_COLUMNS
    d['scanStates']=scan_log.STATES
    d['waits']={rid:all_rows('waiting_files',root=rid) for _,rid in dirs}
    d['scanRuns']={rid:all_rows('scan_log',root=rid) for _,rid in dirs}
    d['rules']={rid:api.dispatch('rule_history',dict(root=rid)) for _,rid in dirs}
    d['storage']['free']=186*1024**3  # Fictional example workstation.
    d['summary']['stamp']=clock(0,17,44)
    d['summary']['home']=r'C:\用户\示例\FileGuard\Data'
    d['summary']['watch']='监听与周期校对'
    for root in d['summary']['roots']:
        root['watch_mode']='目录已暂停' if not root['active'] else '目录不可访问' if root['error'] else '文件监听与周期校对'
    for f in d['files']:
        history=api.dispatch('history',{'id':f['id']});d['history'][f['id']]=history
        for v in history:
            if v['ext'] in table_source.EXTENSIONS:
                source=api.dispatch('table_source',dict(id=v['id']))
                sheets={source['sheet']:source}
                for name in source['sheets']:
                    if name not in sheets:sheets[name]=api.dispatch('table_source',dict(id=v['id'],sheet=name))
                d['ledgerSources'][v['id']]=sheets
            for u in history:
                if v!=u:
                    args={'old':u['id'],'new':v['id']}
                    modes=['aligned','coordinate'] if f['ext'] in exchange_formats.TEXT_EXTENSIONS or f['ext'] in ('.xlsx','.xlsm','.xltx','.docx','.csv','.tsv','.toml','.srt','.gpx') else ['aligned']
                    for mode in modes:
                        opts={**args,'mode':mode}
                        first=api.dispatch('compare',opts)
                        items=first['items'][:]
                        for p in range(2,(first['total']+39)//40+1):
                            items+=api.dispatch('compare',{**opts,'page':p})['items']
                        first['items']=items
                        dest='pairs' if mode=='aligned' else 'coordinates'
                        d[dest][f"{u['id']}-{v['id']}"]=first
                        if (first['is_excel'] or first['is_tabular']) and first['status']=='已解析':
                            vk=f"{u['id']}-{v['id']}-{mode}"
                            vr=api.dispatch('variance',dict(opts,sort='position'))
                            vr['items']=all_rows('variance',**opts,sort='position')
                            d['variance'][vk]=vr
                        if first['is_excel'] and not first['error']:
                            initial=api.dispatch('sheet_rows',opts)
                            pages={};cells={}
                            for sheet in initial['sheets']:
                                cells[sheet]=list(api._sheet_cache[1].sheet({'sheet':sheet})[1].cell_entries())
                                for expand in (False,True):
                                    params={**opts,'sheet':sheet,'expand':expand}
                                    top=api.dispatch('sheet_rows',params)
                                    for rp in range(1,top['pages']+1):
                                        for cp in range(1,top['col_pages']+1):
                                            pages[json.dumps([sheet,expand,rp,cp],ensure_ascii=False,separators=(',',':'))]=api.dispatch(
                                                'sheet_rows',{**params,'page':rp,'col_page':cp})
                            d['grids'][f"{u['id']}-{v['id']}-{mode}"]={'first':initial['sheet'],'pages':pages,'cells':cells}
    line_reports={}
    line_example=None
    for f in d['files']:
        history=d['history'][f['id']]
        for v in history:
            if v['ext'] not in line_origins.EXTENSIONS or v['size']>line_origins.FILE_BYTES:
                continue
            modes={}
            for moves in (False,True):
                reports=[]
                for depth in line_origins.DEPTHS:
                    try:
                        with store.db() as db:
                            report=line_origins.trace(db,store,dict(id=v['id'],depth=depth,moves=moves))
                    except ValueError:
                        break
                    reports.append([depth,report])
                    if report['boundary']['reason']!='达到所选追溯深度':
                        break
                modes[int(moves)]=reports
            line_reports[v['id']]=modes
        if f['rel']=='退货轨迹.csv':
            line_example={**history[0],'root':f['root'],'rel':f['rel']}
    d['lineOrigins']=dict(reports=line_reports,example=line_example,header=line_origins.COLUMNS,width=line_origins.WIDTH)
    package_rows={}
    version_ids=sorted(v['id'] for history in d['history'].values() for v in history)
    for first in range(0,len(version_ids),version_bundle.LIMIT):
        batch=api.dispatch('version_bundle_preview',dict(ids=version_ids[first:first+version_bundle.LIMIT]))
        package_rows.update((row['version_id'],row) for row in batch['items'])
    files={f['rel']:f for f in d['files']}
    returns=d['history'][files['退货轨迹.csv']['id']]
    reference=d['history'][files['检验作业指导书.docx']['id']][0]
    ids=sorted([returns[0]['id'],returns[-1]['id'],reference['id']])
    draft=api.dispatch('version_bundle_preview',dict(ids=ids))
    archive=tmp/'示例历史版本交付.zip'
    api.dispatch('version_bundle_create',dict(ids=ids,token=draft['token'],path=str(archive)))
    receipt=api.dispatch('version_bundle_verify',dict(ids=ids,path=str(archive)))
    example=[dict(id=i,num=package_rows[i]['num'],rel=package_rows[i]['source_rel'],root=package_rows[i]['root']) for i in ids]
    d['versionBundle']=dict(rows=package_rows,example=example,zip=base64.b64encode(archive.read_bytes()).decode('ascii'),
                            receipt=receipt,header=version_bundle.CSV_HEADER,fields=version_bundle.CSV_FIELDS)
    d['pathHistoryHeader']=path_history.CSV_HEADER
    d['pathHistoryFields']=path_history.CSV_FIELDS
    binary_file=next(f for f in d['files'] if f['rel']=='库存台账.xlsx')
    hex_id=d['history'][binary_file['id']][0]['id']
    text_id=returns[0]['id']
    samples={}
    with store.db() as db:
        for v in (v for versions in d['history'].values() for v in versions):
            if (v['ext'] not in snapshot_preview.EXTENSIONS and v['id']!=hex_id) or v['size']>snapshot_preview.MAX_BYTES:
                continue
            meta,raw=snapshot_preview.load(db,store,v['id'])
            decoded=None
            error=''
            try:
                rows,encoding,endings=snapshot_preview.text_info(raw)
                decoded=dict(rows=rows,encoding=encoding,endings=endings)
            except ValueError as exc:
                error=str(exc)
            samples[v['id']]=dict(meta=meta,raw=base64.b64encode(raw).decode('ascii'),text=decoded,error=error,
                                  auto_text=v['ext'] in snapshot_preview.EXTENSIONS)
    d['snapshotPreview']=dict(samples=samples,examples=dict(text=samples[text_id]['meta'],hex=samples[hex_id]['meta']),
                              text_header=snapshot_preview.TEXT_HEADER,hex_header=snapshot_preview.HEX_HEADER,screen=snapshot_preview.SCREEN)
    return d


def main(dest):
    with tempfile.TemporaryDirectory() as t:
        d=generate(Path(t))
    web=ROOT/'web';html=(web/'index.html').read_text(encoding='utf-8')
    html=html.replace('<link rel="stylesheet" href="style.css">','<style>'+(web/'style.css').read_text(encoding='utf-8')+'</style>')
    example='window.FILEGUARD_EXAMPLE='+json.dumps(d,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')+';\n'+(ROOT/'scripts/example_adapter.js').read_text(encoding='utf-8')
    for name in ('vue.js','icons.js','ledger.js','view.js','app.js'):
        data=(web/name).read_text(encoding='utf-8')
        if name=='app.js':data=example+'\n'+data
        html=html.replace('<script src="'+name+'"></script>','<script>'+data.replace('</script','<\\/script')+'</script>')
    Path(dest).write_text(html,encoding='utf-8')
    print(len(d['files']),'个文件，',len(d['events']),'条示例事件')


if __name__=='__main__':
    main(sys.argv[1])

