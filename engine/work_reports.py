"""Reports derived from ordinary visible events. Read a consistent snapshot per request."""
from collections import Counter
from datetime import date, timedelta
import json
from pathlib import Path
import re

from .comparison import csv_cell, new_csv, page_integer
from .store import within

PERIOD_COLUMNS = {'label':'分组','before':'上期次数','after':'本期次数','delta':'增减次数','files':'本期文件数','days':'本期活跃天数','first':'本期首次','last':'本期最近'}
TRACE_COLUMNS = {'prior':'旧版本','version':'新版本','stamp':'保存时间','rel':'当时路径','sheet':'分组','record':'业务编号','field':'字段','category':'类别','location':'位置','kind':'变化','old':'旧值','new':'新值','returning':'回到先前可见值'}
GROUPS = ('file','root','folder','ext','kind','source','weekday','hour')


def publish(store,db,args,rows,columns):
    path=Path(args['path']).resolve()
    if within(path,store.home):raise ValueError('请在仓库外保存')
    with new_csv(path) as writer:
        writer.writerow(columns.values())
        for row in rows:
            writer.writerow([csv_cell(row[k]) for k in columns])
    db.commit()
    store.audit(db,'导出变动分析',f'{len(rows)} 行')
    return str(path)


def page(rows,args):
    pages=max(1,(len(rows)+24)//25)
    number=max(1,min(pages,page_integer(args,'page',1)))
    return dict(items=rows[(number-1)*25:number*25],total=len(rows),page=number,pages=pages)


def period(db,store,args,export=False):
    end=date.fromisoformat(args.get('end') or date.today().isoformat())
    start=date.fromisoformat(args.get('start') or (end-timedelta(days=6)).isoformat())
    span=(end-start).days+1
    if not 1<=span<=366:raise ValueError('请选择 1 至 366 天')
    previous=start-timedelta(days=span)
    group=args.get('group','file')
    if group not in GROUPS:raise ValueError('未知的分组方式')
    policy=args.get('trend','')
    if policy not in ('','new','gone','up','down','equal'):raise ValueError('未知的趋势筛选')
    conditions=['e.file_id IS NOT NULL','e.stamp>=?','substr(e.stamp,1,10)<=?']
    params=[previous.isoformat(),end.isoformat()]
    if not args.get('initial'):conditions.append("e.kind!='初始建档'")
    for col in ('root_id','kind','source'):
        if args.get(col):
            conditions.append('e.'+col+'=?');params.append(args[col])
    q=str(args.get('q') or '').strip().replace('\\','/').casefold()
    if q:
        db.create_function('fg_period_fold',1,lambda text:text.casefold() if text is not None else None,
                           deterministic=True)
        conditions.append('(instr(fg_period_fold(e.rel),?)>0 OR instr(fg_period_fold(e.old_rel),?)>0)')
        params.extend((q,q))
    exts={'.'+x.lstrip('.').lower() for x in re.split(r'[,，;；\s]+',str(args.get('ext',''))) if x.lstrip('.')}
    if len(exts)>50:raise ValueError('一次最多 50 个后缀')
    if exts:
        conditions.append('e.ext IN ('+','.join('?' for _ in exts)+')');params.extend(exts)
    db.execute('BEGIN')
    sql="""SELECT e.id,e.file_id,e.root_id,e.rel,e.stamp,e.kind,e.ext,e.source,r.path
           FROM visible_events e JOIN roots r ON e.root_id=r.id WHERE """+' AND '.join(conditions)
    # Keep grouping by the recorded local day, but find the earliest and latest instants.
    sql+=' ORDER BY unixepoch(e.stamp),e.id'
    grouped={};totals=[0,0];unique=[set(),set()]
    for r in db.execute(sql,params):
        day=r['stamp'][:10]; current=day>=start.isoformat()
        totals[current]+=1;unique[current].add(r['file_id'])
        if group=='file':key=r['file_id'];label=r['path']+' / '+r['rel']
        elif group=='root':key=r['root_id'];label=r['path']
        elif group=='folder':
            folder=r['rel'].rpartition('/')[0];key=(r['root_id'],folder);label=r['path']+' / '+(folder or '（根目录）')
        elif group=='weekday':
            key=date.fromisoformat(day).weekday();label='星期'+'一二三四五六日'[key]
        elif group=='hour':key=r['stamp'][11:13];label=key+' 时'
        else:key=r[group];label=key or '（无）'
        entry=grouped.setdefault(key,dict(before=0,after=0,first='',last='',file_set=set(),day_set=set(),event_id=0))
        entry.update(label=label,event_id=r['id'])
        if current:
            entry['after']+=1;entry['file_set'].add(r['file_id']);entry['day_set'].add(day)
            if not entry['first']:entry['first']=r['stamp']
            entry['last']=r['stamp']
        else:entry['before']+=1
    rows=[]
    for entry in grouped.values():
        entry['delta']=entry['after']-entry['before'];entry['files']=len(entry.pop('file_set'));entry['days']=len(entry.pop('day_set'))
        if policy=='new' and entry['before'] or policy=='gone' and entry['after']:continue
        if policy=='up' and entry['delta']<=0 or policy=='down' and entry['delta']>=0 or policy=='equal' and entry['delta']!=0:continue
        rows.append(entry)
    sort=args.get('sort','after')
    if sort not in ('after','before','delta','drop','files','days','label'):raise ValueError('无效的统计排序')
    rows.sort(key=lambda r:r['label'])
    if sort!='label':rows.sort(key=lambda r:r['delta' if sort=='drop' else sort],reverse=sort!='drop')
    if export:
        dates=dict(start=start.isoformat(),end=end.isoformat(),previous=previous.isoformat(),previous_end=(start-timedelta(days=1)).isoformat())
        for row in rows:row.update(dates)
        columns={'previous':'上期开始','previous_end':'上期结束','start':'本期开始','end':'本期结束',**PERIOD_COLUMNS}
        return publish(store,db,args,rows,columns)
    return dict(**page(rows,args),before=totals[0],after=totals[1],files_before=len(unique[0]),files_after=len(unique[1]),
                previous=previous.isoformat(),previous_end=(start-timedelta(days=1)).isoformat(),start=start.isoformat(),end=end.isoformat())


def trace(db,store,args,export=False):
    def opt(k):return str(args.get(k) or '').strip()
    record,field,location,sheet=(opt(k) for k in ('record','field','location','sheet'))
    if not any((record,field,location)):raise ValueError('至少输入一个业务编号、字段或位置')
    low=int(opt('low') or 1);high=int(opt('high') or 2**31)
    if low<1 or low>high:raise ValueError('版本区间无效')
    db.execute('BEGIN')
    pairs=db.execute("""SELECT e.id,e.rel,e.stamp,e.old_v,e.new_v,v.ext,p.num prior,v.num version,v.status,v.details
         FROM visible_events e JOIN versions v ON v.id=e.new_v AND v.parent_id=e.old_v
         JOIN versions p ON p.id=e.old_v WHERE e.file_id=? AND v.num BETWEEN ? AND ?
         ORDER BY v.num,e.id""",(int(args['id']),low,high))
    rows=[];coverage=Counter();seen={};matched=set()
    for event in pairs:
        coverage[event['status']]+=1
        if event['status']!='已解析':continue
        for detail in json.loads(event['details']):
            rec=detail.get('record_key') or '';col=detail.get('field') or '';loc=detail['location']
            if record and rec!=record or field and col!=field or sheet and detail['sheet']!=sheet:continue
            # Compare both ends of the aligned Excel address without matching C20 for C2.
            endpoints=loc.split(' · ',1)[0].split(' → ')
            if location and location!=loc and location not in endpoints:continue
            cat=detail.get('category') or ''
            # Formula and type transitions still belong to the same cell's value history.
            value_category='单元格值' if cat in ('单元格值','数据类型','公式') else cat
            ident=(detail['sheet'],rec,col,value_category,loc if not(rec and col) else '')
            old,new=detail.get('old'),detail.get('new')
            memory=seen.setdefault(ident,set())
            old_key=(detail.get('old_type'),old)
            new_key=(detail.get('new_type'),new)
            returning=new is not None and new_key!=old_key and new_key in memory
            if old is not None:memory.add(old_key)
            if new is not None:memory.add(new_key)
            if args.get('only_return') and not returning:continue
            if opt('kind') and detail['kind']!=opt('kind') or opt('category') and cat!=opt('category'):continue
            if opt('value') and not any(opt('value').casefold() in str(v).casefold() for v in (old,new) if v is not None):continue
            matched.add(event['new_v'])
            row={k:event[k] for k in ('prior','version','stamp','rel','old_v','new_v')}
            row.update(sheet=detail['sheet'],record=rec,field=col,category=cat,location=loc,kind=detail['kind'],
                       old=old,new=new,returning='是' if returning else '否',event_id=event['id'])
            rows.append(row)
    if not args.get('ascending'):rows.sort(key=lambda r:-r['version'])
    if export:return publish(store,db,args,rows,TRACE_COLUMNS)
    result=page(rows,args)
    for row in result['items']:
        for k in ('old','new'):
            value=row[k]
            if isinstance(value,str) and len(value)>800:row[k]=value[:800]+'…'
    return dict(**result,coverage=dict(coverage),versions=len(matched),returns=sum(r['returning']=='是' for r in rows))
