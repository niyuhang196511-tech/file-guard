"""每个目录保留最近 200 次扫描运行，不保存文件名或差异正文。"""
import json
from pathlib import Path
from .comparison import new_csv
from .store import within

STATES=('进行中','完成','等待保存','有异常','中断')
COLUMNS={'started':'开始','ended':'结束','status':'结果','source':'触发来源','elapsed_ms':'耗时毫秒',
         'candidates':'候选数','captured':'快照读取数','read_bytes':'快照读取字节','reused':'内容复用数',
         'waiting':'等待数','skipped':'跳过数','problem':'异常类别'}


def query(db,store,args,export=False):
    filters=['root_id=?'];params=[int(args['root'])]
    if status:=args.get('state'):
        if status not in STATES:raise ValueError('无效的扫描状态')
        filters.append('status=?');params.append(status)
    if source:=args.get('source'):
        filters.append('source=?');params.append(source)
    if args.get('skips'):filters.append('skipped>0')
    sql=' FROM scan_runs WHERE '+' AND '.join(filters)
    db.execute('BEGIN')
    if export:
        dest=Path(args['path']).resolve()
        if within(dest,store.home):raise ValueError('请在仓库外保存')
        from .comparison import csv_cell
        with new_csv(dest) as writer:
            writer.writerow(COLUMNS.values())
            for row in db.execute('SELECT *'+sql+' ORDER BY id DESC',params):
                writer.writerow([csv_cell(row[k]) for k in COLUMNS])
        db.commit();store.audit(db,'导出扫描运行记录',f"目录 #{params[0]}")
        return str(dest)
    total,avg,longest=db.execute('SELECT count(*),avg(CASE WHEN ended!=\'\' THEN elapsed_ms END),max(CASE WHEN ended!=\'\' THEN elapsed_ms END)'+sql,params).fetchone()
    size=20;pages=max(1,(total+size-1)//size);page=max(1,min(pages,int(args.get('page',1))))
    items=[]
    for row in db.execute('SELECT *'+sql+' ORDER BY id DESC LIMIT ? OFFSET ?',params+[size,(page-1)*size]):
        item=dict(row);item['skip_reasons']=json.loads(item['skip_reasons']);items.append(item)
    sources=[r[0] for r in db.execute('SELECT DISTINCT source FROM scan_runs WHERE root_id=? ORDER BY source',(params[0],))]
    return dict(items=items,total=total,pages=pages,page=page,sources=sources,average=round(avg or 0),longest=longest or 0)


def set_policy(db,store,args):
    window=int(args.get('settle_ms',1500))
    if window not in (500,1500,3000,5000,10000):raise ValueError('无效的稳定等待时长')
    all_types=int(bool(args.get('all_types')))
    rid=int(args['root'])
    with store.lock:
        db.execute('BEGIN IMMEDIATE')
        if not db.execute('SELECT 1 FROM roots WHERE id=? AND NOT removed',(rid,)).fetchone():raise ValueError('目录已移除')
        prior=db.execute('SELECT settle_ms,all_types FROM capture_policy WHERE root_id=?',(rid,)).fetchone()
        if (tuple(prior) if prior else (1500,0))!=(window,all_types):
            db.execute('INSERT OR REPLACE INTO capture_policy VALUES(?,?,?)',(rid,window,all_types))
            store.audit(db,'设置文件稳定等待',f"目录 #{rid} · {window} ms · "+('所有文件' if all_types else '指定格式'))
    return '已保存监听采集策略'


def waits(db,args):
    sql=' FROM waiting_files WHERE root_id=?';params=[int(args['root'])]
    if q:=args.get('q','').strip():
        sql+=" AND instr(lower(rel),lower(?))>0";params.append(q.replace('\\','/'))
    if reason:=args.get('reason'):
        sql+=' AND reason=?';params.append(reason)
    orders={'':'first_seen,rel','attempts':'attempts DESC,first_seen,rel','path':'rel COLLATE NOCASE,rel'}
    if args.get('sort','') not in orders:raise ValueError('无效的等待队列排序')
    db.execute('BEGIN')
    total=db.execute('SELECT count(*)'+sql,params).fetchone()[0]
    pages=max(1,(total+24)//25);page=max(1,min(pages,int(args.get('page',1))))
    rows=[dict(r) for r in db.execute('SELECT *'+sql+' ORDER BY '+orders[args.get('sort','')]+' LIMIT 25 OFFSET ?',params+[(page-1)*25])]
    reasons=[r[0] for r in db.execute('SELECT DISTINCT reason FROM waiting_files WHERE root_id=? ORDER BY reason',(params[0],))]
    return dict(items=rows,total=total,pages=pages,page=page,reasons=reasons)
