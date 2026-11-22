import datetime as dt
import json
import os
import re
import stat
import threading
import time
from pathlib import Path

from . import formats, review, record_admin, backup_check, rules, checkpoints, finder, scan_log, handoff, health, variance, work_reports, save_receipt, table_source, text_history, content_catalog, line_origins, review_batch, version_bundle, path_history, checkpoint_three, snapshot_preview
from .sheet_view import WorkbookView
from .comparison import Comparison, HEADER, EXCEL_HEADER, csv_cell, new_csv
from .store import now, within


def rows(cursor):
    return [dict(r) for r in cursor]


def group_of(ext):
    return {'xlsx':'电子表格','xlsm':'电子表格','xls':'电子表格','xltx':'电子表格','csv':'电子表格',
            'ods':'电子表格','tsv':'电子表格','odt':'文档','odp':'演示文稿','docx':'文档','doc':'文档','pdf':'文档','pptx':'演示文稿','ppt':'演示文稿',
            'png':'图像','jpg':'图像','jpeg':'图像','webp':'图像','svg':'图像'}.get(ext.lstrip('.'),'其他文件')


def settings(db):
    return {'interval':300,'theme':'浅色','autostart':False,
            **{k:json.loads(v) for k,v in db.execute('SELECT key,val FROM settings')}}


def set_login(on):
    if os.name!='nt':
        raise ValueError('登录启动仅在 Windows 桌面版可配置')
    import winreg
    exe=os.getenv('FILEGUARD_DESKTOP_EXE')
    if not exe:
        raise ValueError('请从桌面程序配置登录启动')
    with winreg.CreateKey(winreg.HKEY_CURRENT_USER,r'Software\Microsoft\Windows\CurrentVersion\Run') as k:
        if on:
            winreg.SetValueEx(k,'FileGuard',0,winreg.REG_SZ,'"'+exe+'" --background')
        else:
            try:
                winreg.DeleteValue(k,'FileGuard')
            except FileNotFoundError:
                pass


class Service:
    def __init__(self,store):
        self.s=store
        self.stopping=threading.Event()
        self.watch_status='周期扫描'
        self.health_guard=threading.Lock()
        self.health_stop=threading.Event()
        self.health_job=dict(state='空闲',done=0,total=0,report=None,error='')
        self._cache=None
        self._sheet_cache=None
        self._sheet_lock=threading.Lock()
        self.record_gate=record_admin.Gate()
        self._threads=[]
        self.started=now()
        self.clock=time.monotonic()
        self.beats={}
        self.faults={}
        self.watch_modes={}
        self.seen_watches=set()
        self.state_lock=threading.Lock()

    def start(self):
        # Native and development entry points hold the exclusive workspace lock here.
        with self.s.db() as db:
            db.execute("UPDATE scan_runs SET status='中断',problem='上次引擎退出' WHERE status='进行中'")
        for f in (self._scanner,self._parser,self._watch):
            t=threading.Thread(target=f,daemon=True)
            t.start()
            self._threads.append(t)

    def beat(self,name):
        with self.state_lock:
            self.beats[name]=now()

    def runtime(self,db):
        with self.state_lock:
            beats=dict(self.beats)
            faults=dict(self.faults)
        task=db.execute('SELECT min(due),count(*) FROM tasks').fetchone()
        return dict(started=self.started,uptime=int(time.monotonic()-self.clock),pid=os.getpid(),
                    watch=self.watch_status,beats=beats,faults=faults,queued=task[1],
                    due_in=None if task[0] is None else max(0,int(task[0]-time.time())),
                    waiting=db.execute('SELECT coalesce(sum(w.total),0) FROM scan_waits w JOIN roots r ON r.id=w.root_id WHERE r.active AND NOT r.removed').fetchone()[0],
                    parsing=db.execute("SELECT count(*) FROM versions WHERE status='待解析'").fetchone()[0])

    def _scanner(self):
        last_full=0
        while not self.stopping.is_set():
            try:
                self.beat('扫描')
                with self.s.db() as cfg:
                    interval=int(settings(cfg)['interval'])
                if time.monotonic()-last_full>=min(3600,max(5,interval)) or last_full==0:
                    self.s.recover_intents()
                    with self.s.db() as db:
                        roots=list(db.execute('SELECT id FROM roots WHERE active=1 AND removed=0'))
                        interval=settings(db)['interval']
                    for rid, in roots:
                        self.s.queue(rid,'周期校对',0)
                    last_full=time.monotonic()
                with self.s.db() as db:
                    task=db.execute('DELETE FROM tasks WHERE root_id=(SELECT root_id FROM tasks WHERE due<=? ORDER BY due LIMIT 1) RETURNING root_id,source',(time.time(),)).fetchone()
                if task:
                    self.s.scan(*task)
                    continue
            except Exception as exc:
                self._fault('扫描异常',exc)
            self.stopping.wait(.4)

    def _fault(self,action,exc):
        with self.state_lock:
            self.faults[action]=now()
        try:
            with self.s.db() as db:
                self.s.audit(db,action,str(exc))
        except Exception:
            pass

    def _parser(self):
        while not self.stopping.is_set():
            try:
                self.beat('解析')
                if self.s.parse_one():
                    continue
            except Exception as exc:
                self._fault('解析队列异常',exc)
            self.stopping.wait(.5)

    def _watch(self):
        try:
            from watchdog.observers import Observer
            from watchdog.events import FileSystemEventHandler
        except ImportError:
            return
        store=self.s
        class Handler(FileSystemEventHandler):
            def __init__(self,rid):
                self.rid=rid
            def on_any_event(self,event):
                if event.event_type not in ('created','modified','deleted','moved','closed'):return
                paths=[p for p in (event.src_path,getattr(event,'dest_path','')) if p]
                if not event.is_directory and paths and all(rules.temporary(os.path.basename(os.fsdecode(p))) for p in paths):return
                store.queue(self.rid)
        delay=2
        while not self.stopping.is_set():
            observer=None
            started=time.monotonic()
            try:
                observer=Observer()
                observer.start()
                self.watch_loop(observer,Handler)
            except Exception as exc:
                self._fault('监听回退为周期扫描',exc)
            finally:
                self.watch_status='周期扫描'
                with self.state_lock:self.watch_modes={}
                if observer is not None and observer.ident is not None:
                    observer.stop();observer.join(timeout=5)
            if time.monotonic()-started>=60:delay=2
            self.stopping.wait(delay)
            delay=min(60,delay*2)

    def watch_loop(self,observer,handler):
        watches={}
        while not self.stopping.is_set():
            if not observer.is_alive() or any(not emitter.is_alive() for emitter in observer.emitters):
                raise RuntimeError('文件监听线程已停止')
            self.beat('监听')
            roots={};modes={}
            with self.s.db() as db:
                for rid,path in db.execute('SELECT id,path FROM roots WHERE active=1 AND removed=0'):
                    try:
                        st=Path(path).stat()
                        if stat.S_ISDIR(st.st_mode):
                            roots[rid]=(path,st.st_dev,st.st_ino)
                        else:modes[rid]='目录路径已被替换'
                    except OSError:
                        modes[rid]='目录不可访问'
            for rid,(watch,identity) in list(watches.items()):
                if roots.get(rid)!=identity:
                    observer.unschedule(watch)
                    del watches[rid]
            for rid in roots.keys()-watches.keys():
                try:
                    identity=roots[rid]
                    watch=observer.schedule(handler(rid),identity[0],recursive=True)
                    watches[rid]=watch,identity
                    # The observer cannot report changes made before this subscription.
                    source='监听重连校对' if rid in self.seen_watches else '监听接入校对'
                    self.s.queue(rid,source,0)
                    self.seen_watches.add(rid)
                except OSError:
                    modes[rid]='监听订阅失败，周期校对'
            modes.update({rid:'文件监听与周期校对' for rid in watches})
            with self.state_lock:self.watch_modes=modes
            self.watch_status='监听与周期校对' if watches else '周期扫描'
            self.stopping.wait(2)

    def roots(self,db):
        result=rows(db.execute('''SELECT r.*,coalesce(cp.settle_ms,1500) AS settle_ms,coalesce(cp.all_types,0) AS all_types,t.source AS queued_source,k.counts AS skip_counts,w.total AS waiting,w.samples AS wait_samples,w.delay AS retry_delay,
                      (SELECT count(*) FROM files f WHERE f.root_id=r.id AND f.live=1 AND f.tracked=1) AS total
                      FROM roots r LEFT JOIN capture_policy cp ON cp.root_id=r.id LEFT JOIN tasks t ON t.root_id=r.id LEFT JOIN scan_skips k ON k.root_id=r.id LEFT JOIN scan_waits w ON w.root_id=r.id WHERE removed=0 ORDER BY r.id'''))
        with self.state_lock:modes=self.watch_modes.copy()
        for r in result:
            r['watch_mode']=modes.get(r['id'],'周期校对') if r['active'] else '目录已暂停'
            r['skip_counts']=json.loads(r['skip_counts']) if r['skip_counts'] is not None else None
            r['wait_samples']=json.loads(r['wait_samples'] or '[]')
            r['progress']=self.s.progress.get(r['id'],'')
        return result

    def summary(self,db,a):
        days=int(a.get('days',7))
        if days not in (7,14,30):
            raise ValueError('无效的统计周期')
        today=dt.date.today()
        start=(today-dt.timedelta(days=days-1)).isoformat()
        db.execute('BEGIN')
        stats=rows(db.execute("""SELECT substr(stamp,1,10) AS day,kind,count(*) AS total FROM visible_events
                WHERE stamp>=? AND kind!='初始建档' GROUP BY day,kind""",(start,)))
        trend=[]
        for i in range(days):
            day=(today-dt.timedelta(days=days-1-i)).isoformat()
            subset={r['kind']:r['total'] for r in stats if r['day']==day}
            trend.append(dict(day=day,added=subset.get('新增',0),edited=subset.get('内容修改',0),other=sum(v for k,v in subset.items() if k not in ('新增','内容修改'))))
        def one(q):
            return db.execute(q).fetchone()[0]
        groups={}
        for ext,n in db.execute('SELECT ext,count(*) FROM files f JOIN roots r ON r.id=f.root_id WHERE f.live=1 AND f.tracked=1 AND r.removed=0 GROUP BY ext'):
            g=group_of(ext)
            groups[g]=groups.get(g,0)+n
        today_rows={r['kind']:r['total'] for r in stats if r['day']==today.isoformat()}
        return dict(roots=self.roots(db),files=sum(groups.values()),versions=one('SELECT count(*) FROM versions'),
                    objects=one('SELECT count(DISTINCT sha) FROM versions'),today=sum(today_rows.values()),breakdown=today_rows,
                    pending=one("SELECT count(*) FROM versions WHERE status='待解析'")+one('SELECT count(*) FROM tasks')+len(self.s.progress),
                    failures=one("SELECT count(*) FROM versions WHERE status='解析失败'"),trend=trend,
                    groups=sorted(groups.items(),key=lambda x:-x[1]),recent=self.page(db,'events',{'size':6})['items'],
                    recovery=one('SELECT count(*) FROM restores'),line_origin_exts=sorted(line_origins.EXTENSIONS),
                    record_admin_ready=bool(one('SELECT count(*) FROM record_admin')),watch=self.watch_status,settings=settings(db),home=str(self.s.home),stamp=now())

    def list_query(self,db,table,a):
        lookup={
          'events':('visible_events x LEFT JOIN files f ON f.id=x.file_id LEFT JOIN roots r ON r.id=x.root_id LEFT JOIN versions v ON v.id=x.new_v LEFT JOIN versions p ON p.id=x.old_v',
                    'x.*,r.path AS root,f.rel AS current_rel,f.ext AS current_ext,f.live,f.tracked,r.removed AS root_removed,r.active AS root_active,v.status,v.num AS version,p.num AS prior,v.sha,v.error,json_array_length(v.details) AS changes','x.rel','x.root_id','x.stamp','x.ext'),
          'files':('files x JOIN roots r ON r.id=x.root_id JOIN versions v ON v.id=(SELECT max(id) FROM versions WHERE file_id=x.id)',
                   'x.*,r.path AS root,r.removed AS root_removed,r.active AS root_active,v.num AS version,v.id AS vid,v.status','x.rel','x.root_id','x.updated','x.ext'),
          'audit':('audit x','x.*','x.note',None,'x.stamp',None)}
        source,fields,search,root,date,ext=lookup[table]
        cond=[];params=[]
        source_params=[]
        if table=='files':
            source+=' LEFT JOIN file_stars star ON star.file_id=x.id'
            fields+=',star.file_id IS NOT NULL AS starred'
            if a.get('starred'):cond.append('star.file_id IS NOT NULL')
            scope=a.get('scope') or ('all' if a.get('history') else 'current')
            scopes={'all':'', 'current':'x.live=1 AND x.tracked=1 AND r.removed=0',
                    'deleted':'x.live=0', 'removed':'x.live=1 AND r.removed=1',
                    'excluded':'x.live=1 AND r.removed=0 AND x.tracked=0'}
            if scope not in scopes:
                raise ValueError('无效的文件范围')
            if scopes[scope]:
                cond.append(scopes[scope])
        if table=='files' and a.get('prefix'):
            cond.append('substr(x.rel,1,length(?))=?');params.extend([a['prefix']+'/',a['prefix']+'/'])
        q=a.get('q','').strip()
        caption=a.get('caption','').strip() if table=='events' else ''
        if q or caption:
            db.create_function('fg_list_fold',1,lambda value:value.casefold() if value is not None else None,
                               deterministic=True)
        if q:
            if table in ('files','events'):
                q=q.replace('\\','/')
            q=q.casefold()
            criteria="instr(fg_list_fold("+search+"),?)>0"
            if table=='files':
                source+=""" LEFT JOIN visible_events former ON former.id=(
                    SELECT e.id FROM visible_events e WHERE e.file_id=x.id
                    AND instr(fg_list_fold(x.rel),?)=0 AND e.kind IN ('重命名','移动')
                    AND instr(fg_list_fold(e.old_rel),?)>0 ORDER BY e.id DESC LIMIT 1)"""
                fields+=',former.old_rel AS matched_path'
                source_params=[q,q]
                criteria='('+criteria+' OR former.id IS NOT NULL)'
            if table=='events':
                criteria='('+criteria+' OR instr(fg_list_fold(x.old_rel),?)>0)'
                params.append(q)
            if table=='audit':
                criteria='('+criteria+' OR instr(fg_list_fold(x.action),?)>0)'
                params.append(q)
            cond.append(criteria)
            params.append(q)
        extensions=list(dict.fromkeys('.'+e.lstrip('.').lower() for e in re.split(r'[,，;；\s]+',a.get('ext','').strip()) if e.lstrip('.')))
        if ext and extensions:
            if len(extensions)>50:
                raise ValueError('一次最多可筛选 50 种扩展名')
            cond.append(ext+' IN ('+','.join('?' for _ in extensions)+')')
            params.extend(extensions)
        for field,value in ((root,a.get('root')),('v.status' if ext else None,a.get('status')),
                            ('x.kind' if table=='events' else None,a.get('kind')),
                            ('x.source' if table=='events' else None,a.get('source'))):
            if field and value:
                cond.append(field+'=?');params.append(value)
        if table=='files':
            if a.get('multiple'):
                cond.append('v.num>1')
            for option,operator in [('min_bytes','>='),('max_bytes','<=')]:
                if a.get(option) not in ('',None):
                    limit=int(a[option])
                    if limit<0:
                        raise ValueError('文件大小不能为负数')
                    cond.append('x.size'+operator+'?');params.append(limit)
        if table=='events':
            if a.get('event_id'):
                cond.append('x.id=?');params.append(int(a['event_id']))
            if a.get('amended'):
                cond.append('x.revision>0')
            if caption:
                cond.append('instr(fg_list_fold(x.caption),?)>0');params.append(caption.casefold())
        if table=='events' and a.get('with_diff'):
            cond.append("x.old_v!=x.new_v AND v.status='已解析' AND json_array_length(v.details)>0")
        if table in ('files','events') and a.get('sha'):
            prefix=a['sha'].strip().lower()
            if not re.fullmatch('[0-9a-f]{1,64}',prefix):
                raise ValueError('请输入 1 至 64 位十六进制摘要')
            cond.append('substr(v.sha,1,length(?))=?');params.extend([prefix,prefix])
        if table in ('files','events','audit'):
            start=a.get('start','')
            end=a.get('end','')
            for date_value in (start,end):
                if date_value:
                    try:
                        if dt.date.fromisoformat(date_value).isoformat()!=date_value:
                            raise ValueError('日期格式无效')
                    except ValueError:
                        raise ValueError('请输入有效的日期')
            if start and end and start>end:
                raise ValueError('结束日期不能早于开始日期')
            if start:
                cond.append(date+'>=?')
                params.append(start)
            if end and end<'9999-12-31':
                cond.append(date+'<?')
                params.append((dt.date.fromisoformat(end)+dt.timedelta(days=1)).isoformat())
            if table=='audit' and a.get('action'):
                cond.append('x.action=?')
                params.append(a['action'])
        if a.get('day'):
            cond.append('substr('+date+',1,10)=?');params.append(a['day'])
        if table=='events' and a.get('activity'):
            cond.append("x.kind!='初始建档'")
        query=' FROM '+source
        if cond:
            query+=' WHERE '+' AND '.join(cond)
        orders={'':date+' DESC','oldest':date+' ASC'}
        if table=='files':
            orders.update(size='x.size DESC',versions='v.num DESC',name='x.rel COLLATE NOCASE ASC')
        order=orders.get(a.get('sort',''))
        if not order:
            raise ValueError('无效的排序方式')
        return 'SELECT '+fields+query+' ORDER BY '+order+',x.id DESC', 'SELECT count(*)'+query, source_params+params

    @staticmethod
    def list_records(table,cursor):
        for row in cursor:
            record=dict(row)
            if table in ('files','events'):
                if table=='events' and not record['file_id']:
                    state='已撤回'
                elif not record['live']:
                    state='已删除'
                elif record['root_removed']:
                    state='目录已移除'
                elif not record['tracked']:
                    state='规则已排除'
                else:
                    state='当前在册' if record['root_active'] else '目录已暂停'
                record['file_state']=state
            yield record

    def page(self,db,table,a):
        select,count_query,params=self.list_query(db,table,a)
        size=min(100,max(1,int(a.get('size',25))))
        page=max(1,int(a.get('page',1)))
        if not db.in_transaction:
            db.execute('BEGIN')
        count=db.execute(count_query,params).fetchone()[0]
        page=min(page,max(1,(count+size-1)//size))
        cursor=db.execute(select+' LIMIT ? OFFSET ?',params+[size,(page-1)*size])
        response=dict(items=list(self.list_records(table,cursor)),total=count,page=page,size=size)
        if table=='events':
            response['sources']=[r[0] for r in db.execute("SELECT DISTINCT source FROM visible_events WHERE source!='' ORDER BY source")]
        if table=='audit':
            response['actions']=[r[0] for r in db.execute('SELECT DISTINCT action FROM audit ORDER BY action')]
        return response

    def comparison(self,db,a):
        left,right = int(a['old']),int(a['new'])
        fields = 'id,file_id,num,parent_id,sha,size,ext,status,error'
        u = db.execute('SELECT '+fields+' FROM versions WHERE id=?',(left,)).fetchone()
        v = db.execute('SELECT '+fields+' FROM versions WHERE id=?',(right,)).fetchone()
        if not v or not u or v['file_id']!=u['file_id']:
            raise ValueError('请选择同一文件的两个版本')
        is_excel = v['ext'] in formats.excel_diff.EXTENSIONS
        is_word = v['ext']=='.docx'
        is_tabular=v['ext'] in ('.csv','.tsv')
        mode = a.get('mode','aligned') if is_excel or is_word or is_tabular or v['ext'] in formats.SOURCE_FORMATS else 'aligned'
        if mode not in ('aligned','coordinate'):
            raise ValueError('无效的对比方式')
        key = (left,right,mode,v['status'],v['error'])
        cached = self._cache
        if cached is not None and cached[0]==key:
            return cached[1]
        error = ''
        if mode=='aligned' and v['parent_id']==left and v['status']!='待解析':
            payload = db.execute('SELECT details FROM versions WHERE id=?',(right,)).fetchone()[0]
            status,details,error = v['status'],json.loads(payload),v['error']
        else:
            try:
                status,details = self.s.compare_versions(u,v,mode)
            except Exception as exc:
                status,details,error = '解析失败',[],str(exc)
        result = Comparison(details,status=status,error=error,is_excel=is_excel,is_word=is_word,is_tabular=is_tabular,ext=v['ext'],is_source=v['ext'] in formats.SOURCE_FORMATS,mode=mode,
                            old_number=u['num'],new_number=v['num'])
        if status!='解析失败':
            self._cache = (key,result)
        return result

    def sheet_rows(self,db,args,search=False):
        left,right=int(args['old']),int(args['new'])
        mode=args.get('mode','aligned')
        if mode not in ('aligned','coordinate'):
            raise ValueError('无效的行对齐方式')
        versions={r['id']:r for r in db.execute('SELECT id,file_id,sha,size,ext FROM versions WHERE id IN (?,?)',(left,right))}
        if len(versions)!=2 or versions[left]['file_id']!=versions[right]['file_id'] or any(
                r['ext'] not in formats.excel_diff.EXTENSIONS for r in versions.values()):
            raise ValueError('请选择同一 Excel 文件的两个工作簿版本')
        key=(left,right,mode)
        with self._sheet_lock:
            if not self._sheet_cache or self._sheet_cache[0]!=key:
                with self.s.parsing_paths(versions[left],versions[right]) as (a,b):
                    view=WorkbookView(a,b,versions[right]['ext'],mode)
                self._sheet_cache=(key,view)
            view=self._sheet_cache[1]
            return view.sheet(args)[1].search(args) if search else view.page(args)

    def export_difference(self,db,args):
        dest=Path(args['path']).resolve()
        if within(dest,self.s.home):
            raise ValueError('请在仓库之外保存')
        comparison=self.comparison(db,args)
        _,items=comparison.select(args)
        if not items:
            raise ValueError('当前筛选没有可导出的差异')
        name=db.execute('SELECT f.rel FROM files f JOIN versions v ON v.file_id=f.id WHERE v.id=?',(args['new'],)).fetchone()[0]
        info=comparison.metadata
        prefix=[name,'V'+str(info['old_number']),'V'+str(info['new_number'])]
        with new_csv(dest) as writer:
            writer.writerow(HEADER+EXCEL_HEADER if (info['is_excel'] or info['is_tabular']) else HEADER)
            for r in items:
                cells=prefix+[r.get(k) for k in ('sheet','location','record_key','kind','old','new')]
                if (info['is_excel'] or info['is_tabular']):
                    cells.extend(r.get(k) for k in ('field','category','old_type','new_type'))
                writer.writerow([csv_cell(value) for value in cells])
        self.s.audit(db,'导出版本差异',f"{name} · {prefix[1]} → {prefix[2]} · {len(items)} 项 · {dest}")
        return str(dest)

    def health_command(self,cmd):
        with self.health_guard:
            if cmd=='health_cancel' and self.health_job['state']=='检查中':
                self.health_stop.set()
            if cmd=='health_start' and self.health_job['state']!='检查中':
                self.health_stop.clear()
                self.health_job=dict(state='检查中',done=0,total=0,report=None,error='')
                threading.Thread(target=self.health_worker,daemon=True).start()
            return dict(self.health_job)

    def health_worker(self):
        def progress(done,total):
            with self.health_guard:self.health_job.update(done=done,total=total)
        try:
            report=health.run(self.s,progress,lambda:self.health_stop.is_set() or self.stopping.is_set())
            result=dict(state='完成',report=report)
        except InterruptedError:
            result=dict(state='已取消')
        except Exception as exc:
            result=dict(state='失败',error=str(exc))
        with self.health_guard:self.health_job.update(result)

    def dispatch(self,cmd,a):
        with self.s.db() as db:
            if cmd in ('snapshot_preview','snapshot_preview_csv'):
                return snapshot_preview.view(db,self.s,a,cmd=='snapshot_preview_csv')
            if cmd in ('path_history','path_history_csv'):
                return path_history.result(db,self.s,a,cmd=='path_history_csv')
            if cmd in ('version_bundle_preview','version_bundle_create','version_bundle_csv','version_bundle_verify'):
                return version_bundle.run(db,self.s,cmd,a)
            if cmd in ('line_origins','line_origins_csv'):
                return line_origins.query(db,self.s,a,cmd=='line_origins_csv')
            if cmd in ('content_groups','content_refs','content_groups_csv','content_refs_csv'):
                return content_catalog.catalog(db,self.s,cmd,a)
            if cmd=='content_verify':return content_catalog.verify(db,self.s,a)
            if cmd=='text_search':return text_history.search(db,self.s,a)
            if cmd=='text_search_csv':return text_history.export(db,self.s,a)
            if cmd=='save_receipt':return save_receipt.receipt(db,self.s,a)
            if cmd=='table_source':return table_source.read(db,self.s,a)
            if cmd in ('ledger_templates','ledger_save','ledger_remove'):return table_source.templates(db,self.s,cmd,a)
            if cmd=='ledger_csv':return table_source.save_csv(self.s,db,a)
            if cmd in ('period_report','period_csv'):return work_reports.period(db,self.s,a,cmd=='period_csv')
            if cmd in ('field_trace','trace_csv'):return work_reports.trace(db,self.s,a,cmd=='trace_csv')
            if cmd=='checkpoint_disk':return handoff.disk_page(db,self.s,a)
            if cmd=='checkpoint_inventory':
                meta,items=handoff.catalogue(db,a)
                return handoff.page(meta,items,a)
            if cmd in ('inventory_csv','handoff_create'):
                return handoff.export(db,self.s,dict(a,csv=cmd=='inventory_csv'))
            if cmd=='handoff_verify':
                ref=handoff.catalogue(db,a)[1] if a.get('id') else None
                return handoff.verify(a['path'],ref)
            if cmd in ('health_start','health_state','health_cancel'):return self.health_command(cmd)
            if cmd=='health_reports':return health.listing(db)
            if cmd in ('health_results','health_csv'):return health.results(db,self.s,a,cmd=='health_csv')
            if cmd=='health_references':return health.references(db,a)
            if cmd in ('variance','variance_csv'):
                return variance.query(self.s,db,self.comparison(db,a),a,cmd=='variance_csv')
            if cmd in ('finder','finder_export'):return finder.query(db,self.s,a,cmd=='finder_export')
            if cmd in ('finder_presets','finder_save','finder_forget'):return finder.presets(db,self.s,cmd,a)
            if cmd=='capture_policy':return scan_log.set_policy(db,self.s,a)
            if cmd=='waiting_files':return scan_log.waits(db,a)
            if cmd in ('scan_log','scan_log_export'):return scan_log.query(db,self.s,a,cmd=='scan_log_export')
            if cmd=='checkpoint_create':
                with self.s.lock:
                    return checkpoints.create(db,self.s,a)
            if cmd=='checkpoints': return checkpoints.listing(db,a['root'])
            if cmd in ('checkpoint_three','checkpoint_three_csv'):
                return checkpoint_three.report(db,self.s,a,cmd=='checkpoint_three_csv')
            if cmd in ('checkpoint_diff','checkpoint_export'): return checkpoints.compare(db,self.s,a,cmd=='checkpoint_export')
            if cmd=='rule_preview': return rules.preview(a)
            if cmd=='rule_history': return rows(db.execute('SELECT id,stamp,patterns,max_mb FROM rule_changes WHERE root_id=? ORDER BY id DESC LIMIT 100',(a['root'],)))
            if cmd=='runtime': return self.runtime(db)
            if cmd=='summary': return self.summary(db,a)
            if cmd in ('files','events','audit'): return self.page(db,cmd,a)
            if cmd=='private_records':
                db.execute('BEGIN')
                self.record_gate.require(db,a.get('password'))
                return record_admin.private_records(db,a.get('before'))
            if cmd in ('record_detail','record_amend'):
                db.execute('BEGIN IMMEDIATE' if cmd=='record_amend' else 'BEGIN')
                self.record_gate.require(db,a.get('password'))
                return record_admin.detail(db,a['id']) if cmd=='record_detail' else record_admin.amend(db,self.s,a,now())
            if cmd=='review_queue':
                db.execute('BEGIN')
                return review.query(db,a)
            if cmd in ('review_batch_preview','review_batch_apply'):
                return review_batch.run(db,self.s,a,now(),cmd=='review_batch_apply')
            if cmd=='save_review':return review.save(db,self.s,a,now())
            if cmd=='star_file':return review.star(db,self.s,a)
            if cmd=='inspect_backup':return backup_check.inspect(a['path'],db)
            if cmd=='storage':
                db.execute('BEGIN')
                return review.storage(db,self.s.home)
            if cmd=='export_review':
                dest=Path(a['path']).resolve()
                if within(dest,self.s.home):raise ValueError('请在仓库之外保存')
                db.execute('BEGIN')
                with new_csv(dest) as writer:
                    writer.writerow(review.EXPORT_HEADER)
                    for row in review.query(db,a,export=True):
                        writer.writerow([csv_cell(row[k]) for k in review.EXPORT_FIELDS])
                db.commit()
                self.s.audit(db,'导出版本复核',dest)
                return str(dest)
            if cmd=='history':
                return rows(db.execute("SELECT v.id,v.file_id,v.num,v.parent_id,v.sha,v.ext,v.size,v.stamp,v.status,v.error,v.size-p.size AS delta,json_array_length(v.details) AS changes,coalesce(m.state,'待复核') AS review,coalesce(m.note,'') AS note,coalesce(m.revision,0) AS revision,coalesce(m.stamp,'') AS reviewed_at FROM versions v LEFT JOIN version_reviews m ON m.version_id=v.id LEFT JOIN versions p ON p.id=v.parent_id WHERE v.file_id=? ORDER BY v.num DESC",(a['id'],)))
            if cmd in ('sheet_rows','sheet_find'): return self.sheet_rows(db,a,cmd=='sheet_find')
            if cmd=='compare': return self.comparison(db,a).page(a)
            if cmd=='export_diff': return self.export_difference(db,a)
            if cmd=='retry_recovery':
                remaining=self.s.recover_intents()
                return f'已完成核对，仍待处理 {remaining} 项'
            if cmd=='restore_info': return self.s.restore_info(a['id'])
            if cmd=='roots': return self.roots(db)
            if cmd=='open_dir':
                record=db.execute('SELECT r.path,f.rel FROM files f JOIN roots r ON f.root_id=r.id WHERE f.id=?',(a['id'],)).fetchone()
                if not record or os.name!='nt':
                    raise ValueError('此操作需要 Windows 桌面环境')
                folder=(Path(record['path'])/record['rel']).parent
                if not folder.is_dir():
                    raise ValueError('原目录不可访问')
                os.startfile(folder)
                return '已打开所在目录'
            if cmd=='folders':
                folders={}
                for rel, in db.execute('SELECT rel FROM files WHERE root_id=? AND live AND tracked',(a['id'],)):
                    directories=Path(rel).parent
                    while str(directories)!='.':
                        path=directories.as_posix()
                        folders[path]=folders.get(path,0)+1
                        directories=directories.parent
                if a.get('counts'):
                    return [dict(path=path,total=folders[path]) for path in sorted(folders)]
                return sorted(folders)

            if cmd=='configure': return self.s.configure(a['path'],a.get('patterns',''),a.get('max_mb',0),a.get('id'))
            if cmd=='root_action': return self.s.root_action(a['id'],a['action'])
            if cmd=='scan': return self.s.request_scan(a.get('id'))
            if cmd=='restore': return self.s.restore(a['id'],a.get('preview'))
            if cmd=='copy': return self.s.export_copy(a['id'],a['path'])
            if cmd=='verify': return self.s.verify()
            if cmd=='backup':
                return self.s.backup(a['path'],lambda snapshot:self.record_gate.require(snapshot,a.get('password')))
            if cmd=='retry':
                if a.get('id'):
                    if not db.execute("UPDATE versions SET status='待解析',error='' WHERE id=? AND status='解析失败'",(a['id'],)).rowcount:
                        raise ValueError('此版本当前无需重试')
                    self.s.audit(db,'重试指定版本',f"版本 ID {a['id']}")
                    return '已安排此版本重新解析'
                db.execute("UPDATE versions SET status='待解析',error='' WHERE status='解析失败'")
                self.s.audit(db,'重试解析','已重新安排失败任务')
                return '已重新安排解析'
            if cmd=='settings':
                val=a.get('interval')
                if int(val) not in (5,15,30,60,300,900,3600) or a.get('theme') not in ('浅色','深色'):
                    raise ValueError('设置值无效')
                if a.get('autostart',False)!=settings(db)['autostart']:
                    set_login(bool(a.get('autostart')))
                for k in ('theme','interval','autostart'):
                    db.execute('INSERT OR REPLACE INTO settings VALUES (?,?)',(k,json.dumps(a.get(k))))
                self.s.audit(db,'更新系统设置','扫描间隔 '+str(val)+' 秒，'+a['theme'])
                return '设置已保存'
            if cmd in ('export','export_files','export_audit'):
                dest=Path(a['path']).resolve()
                if within(dest,self.s.home):
                    raise ValueError('请在仓库之外保存')
                db.execute('BEGIN')
                table={'export':'events','export_files':'files','export_audit':'audit'}[cmd]
                headers,keys={'events':('编号 时间 目录 文件 原路径 类型 旧版本 新版本 摘要 来源 解析状态 公开更正','id stamp root rel old_rel kind prior version sha source status caption'),
                              'files':('编号 目录 文件 大小字节 版本 更新时间 SHA-256 在册状态 解析状态','id root rel size version updated sha file_state status'),
                              'audit':('编号 时间 操作 内容','id stamp action note')}[table]
                select,_,params=self.list_query(db,table,a)
                fields=keys.split()
                with new_csv(dest) as writer:
                    writer.writerow(headers.split())
                    for record in self.list_records(table,db.execute(select,params)):
                        writer.writerow([csv_cell(record.get(key)) for key in fields])
                db.commit()
                self.s.audit(db,{'events':'导出变更记录','files':'导出文件清单','audit':'导出审计记录'}[table],dest)
                return str(dest)
        raise ValueError('未知操作')

