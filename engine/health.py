"""保留最近五轮检查。读取历史对象，检查期间不更改对象内容。"""
from collections import Counter
from pathlib import Path
import re
import stat
import time

from .comparison import csv_cell,new_csv,page_integer
from .store import digest,ensure_plain,linklike,now,within

SHA=re.compile('[0-9a-f]{64}')
KEYS=('object_key','status','expected','actual','versions','files')
HEADERS=('对象或位置','检查结果','索引字节','实际字节','引用版本数','引用文件数')


def assess(store,sha,low,high):
    if not isinstance(sha,str) or not SHA.fullmatch(sha):return '索引摘要无效',None
    if low!=high or low<0:return '索引长度冲突',None
    obj=store.obj(sha)
    try:
        ensure_plain(obj,store.home)
        before=obj.stat()
        if not stat.S_ISREG(before.st_mode):return '非普通对象',None
        if before.st_size!=low:return '长度不符',before.st_size
        actual=digest(obj)
        after=obj.stat()
        if (before.st_ino,before.st_mtime_ns,before.st_size)!=(after.st_ino,after.st_mtime_ns,after.st_size):
            return '读取期间变化',after.st_size
        return ('通过' if actual==sha else '内容摘要不符'),after.st_size
    except FileNotFoundError:return '缺少对象',None
    except ValueError:return '对象路径为链接',None
    except OSError:return '对象不可读取',None


def extras(store,known):
    base=store.objects
    if linklike(base):raise ValueError('仓库对象目录为链接')
    for folder in sorted(base.iterdir()):
        if not re.fullmatch('[0-9a-f]{2}',folder.name) or linklike(folder) or not folder.is_dir():continue
        for obj in sorted(folder.iterdir()):
            if not SHA.fullmatch(obj.name) or obj.name[:2]!=folder.name or obj.name in known:continue
            yield obj.name,None if linklike(obj) else obj.lstat().st_size


def run(store,progress=None,cancelled=None):
    def check_cancel():
        if cancelled and cancelled():raise InterruptedError('检查已取消')
    with store.db() as db:
        stamp=now();start=time.monotonic()
        if db.execute('PRAGMA integrity_check').fetchone()[0]!='ok':
            raise ValueError('数据库结构校验失败，未生成新报告')
        if db.execute('PRAGMA foreign_key_check').fetchone():
            raise ValueError('数据库引用校验失败，未生成新报告')
        seen=set();problems=[];versions=passed=size=affected=0
        indexed=list(db.execute('SELECT sha,min(size),max(size),count(*),count(DISTINCT file_id) FROM versions GROUP BY sha'))
        if progress:progress(0,len(indexed))
        for index,(sha,low,high,n,files) in enumerate(indexed,1):
            check_cancel()
            seen.add(sha);versions+=n
            status,actual=assess(store,sha,low,high)
            if status=='通过':
                passed+=1;size+=actual
            else:
                problems.append((sha,status,low,actual,n,files));affected+=n
            if progress:progress(index,len(indexed))
        check_cancel()
        failures=len(problems)
        with store.lock:
            # Objects published by a scan since the initial inventory have legitimate new references.
            current={r[0] for r in db.execute('SELECT DISTINCT sha FROM versions')}
            for sha,actual in extras(store,current):
                check_cancel()
                problems.append((sha,'未被版本引用',None,actual,0,0))
        check_cancel()
        db.execute('BEGIN IMMEDIATE')
        report=db.execute("""INSERT INTO health_reports(started,ended,elapsed_ms,objects,versions,verified,verified_bytes,
                          issues,unreferenced,affected) VALUES (?,?,?,?,?,?,?,?,?,?)""",
                          (stamp,now(),round((time.monotonic()-start)*1000),len(seen),versions,passed,size,
                           failures,len(problems)-failures,affected)).lastrowid
        db.executemany('INSERT INTO health_findings VALUES(?,?,?,?,?,?,?)',((report,*r) for r in problems))
        db.execute('DELETE FROM health_reports WHERE id NOT IN (SELECT id FROM health_reports ORDER BY id DESC LIMIT 5)')
        store.audit(db,'生成仓库体检报告',f'报告 #{report} · 异常对象 {failures} · 未引用对象 {len(problems)-failures}')
        return report


def listing(db):
    return [dict(r) for r in db.execute('SELECT * FROM health_reports ORDER BY id DESC')]


def results(db,store,args,export=False):
    db.execute('BEGIN')
    report=db.execute('SELECT * FROM health_reports WHERE id=?',(args['id'],)).fetchone()
    if not report:raise ValueError('报告不存在或已超过保留范围')
    previous=db.execute('SELECT max(id) FROM health_reports WHERE id<?',(report['id'],)).fetchone()[0]
    current={r['object_key']:dict(r) for r in db.execute('SELECT * FROM health_findings WHERE report_id=?',(report['id'],))}
    prior={r['object_key']:dict(r) for r in db.execute('SELECT * FROM health_findings WHERE report_id=?',(previous,))}
    data=[]
    for key in sorted(current.keys()|prior.keys()):
        row=current.get(key) or prior[key]
        change=('本轮未再发现' if key not in current else '首次检查' if not previous else '本轮新发现' if key not in prior
                else '类别变化' if prior[key]['status']!=row['status'] else '持续存在')
        data.append(dict(row,change=change))
    counts=dict(Counter(r['status'] for r in current.values()))
    changes=dict(Counter(r['change'] for r in data))
    q=str(args.get('q','')).strip().casefold()
    filtered=[r for r in data if (not args.get('change') and r['change']!='本轮未再发现' or args.get('change')==r['change'])
              and (not args.get('status') or args['status']==r['status']) and q in r['object_key'].casefold()]
    if export:
        dest=Path(args['path']).resolve()
        if within(dest,store.home):raise ValueError('请在仓库外保存')
        with new_csv(dest) as out:
            out.writerow((*HEADERS,'与上轮相比'))
            for r in filtered:out.writerow([csv_cell(r[k]) for k in (*KEYS,'change')])
        db.commit();store.audit(db,'导出仓库体检明细',f"报告 #{report['id']} · {len(filtered)} 项")
        return str(dest)
    pages=max(1,(len(filtered)+24)//25);p=min(pages,max(1,page_integer(args,'page',1)))
    return dict(report=dict(report),previous=previous,counts=counts,changes=changes,total=len(filtered),
                items=filtered[(p-1)*25:p*25],page=p,pages=pages)


def references(db,args):
    db.execute('BEGIN')
    opts=(args['id'],args['key'])
    if not db.execute('SELECT 1 FROM health_findings WHERE report_id=? AND object_key=?',opts).fetchone():
        raise ValueError('该报告没有此对象')
    query=' FROM versions v JOIN files f ON f.id=v.file_id JOIN roots r ON r.id=f.root_id WHERE v.sha=?'
    total=db.execute('SELECT count(*)'+query,(opts[1],)).fetchone()[0]
    pages=max(1,(total+24)//25);p=min(pages,max(1,page_integer(args,'page',1)))
    rows=db.execute('SELECT v.id,v.num,v.stamp,v.file_id,f.rel,f.ext,r.path AS root'+query+' ORDER BY v.id DESC LIMIT 25 OFFSET ?',(opts[1],(p-1)*25))
    return dict(items=[dict(r) for r in rows],total=total,page=p,pages=pages)
