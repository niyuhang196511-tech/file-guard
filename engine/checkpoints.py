"""保存已入库的目录清单，利用稳定文件编号对照两次清单。"""
from .comparison import csv_cell, new_csv
from .store import now, within
from pathlib import Path
import sqlite3


def create(db, store, args):
    label = str(args.get('label','')).strip()
    if not 1 <= len(label) <= 80:
        raise ValueError('清单名称须为 1 至 80 字')
    db.execute('BEGIN IMMEDIATE')
    root = db.execute('SELECT * FROM roots WHERE id=? AND removed=0',(args['root'],)).fetchone()
    if not root or not root['last_scan'] or root['error']:
        raise ValueError('请先完成一次成功的目录扫描')
    scan = db.execute('SELECT status FROM scan_runs WHERE root_id=? ORDER BY id DESC LIMIT 1',
                      (root['id'],)).fetchone()
    if scan and scan['status']=='等待保存':
        raise ValueError('上次扫描仍有文件等待保存，请完成复查后再保存目录清单')
    if scan and scan['status']!='完成':
        raise ValueError('请先完成一次成功的目录扫描')
    try:
        checkpoint = db.execute('INSERT INTO checkpoints(root_id,label,stamp,last_scan) VALUES (?,?,?,?)',
                                (root['id'],label,now(),root['last_scan'])).lastrowid
    except sqlite3.IntegrityError as exc:
        raise ValueError('此目录已有同名清单') from exc
    db.execute('''INSERT INTO checkpoint_files SELECT ?,f.id,f.rel,
                 (SELECT v.id FROM versions v WHERE v.file_id=f.id ORDER BY v.num DESC LIMIT 1)
                 FROM files f WHERE f.root_id=? AND f.live AND f.tracked''',(checkpoint,root['id']))
    store.audit(db,'保存目录清单',f"{label} · 目录 #{root['id']} · 清单 #{checkpoint}")
    return checkpoint


def listing(db, root):
    return [dict(r) for r in db.execute('''SELECT c.*,count(f.file_id) AS files,coalesce(sum(v.size),0) AS bytes
        FROM checkpoints c LEFT JOIN checkpoint_files f ON f.checkpoint=c.id
        LEFT JOIN versions v ON v.id=f.version WHERE c.root_id=? GROUP BY c.id ORDER BY c.id DESC''',(root,))]


KINDS = ('新增','移出','内容修改','路径变更','路径与内容变更','相同')
FIELDS = ('kind','old_path','new_path','old_num','new_num','old_size','new_size','delta','old_sha','new_sha')
HEADERS = ('变化','原路径','现路径','旧版本','新版本','旧字节','新字节','字节变化','旧摘要','新摘要')
QUERY = """WITH a AS (SELECT * FROM checkpoint_files WHERE checkpoint=?),
b AS (SELECT * FROM checkpoint_files WHERE checkpoint=?),
ids AS (SELECT file_id FROM a UNION SELECT file_id FROM b),
diff AS (SELECT ids.file_id,a.rel AS old_path,b.rel AS new_path,a.version AS old,b.version AS new,
x.num AS old_num,y.num AS new_num,x.size AS old_size,y.size AS new_size,x.sha AS old_sha,y.sha AS new_sha,
coalesce(y.size,0)-coalesce(x.size,0) AS delta,CASE
WHEN a.version IS NULL THEN '新增' WHEN b.version IS NULL THEN '移出'
WHEN a.rel!=b.rel AND x.sha!=y.sha THEN '路径与内容变更'
WHEN a.rel!=b.rel THEN '路径变更' WHEN x.sha!=y.sha THEN '内容修改' ELSE '相同' END AS kind
FROM ids LEFT JOIN a USING(file_id) LEFT JOIN b USING(file_id)
LEFT JOIN versions x ON x.id=a.version LEFT JOIN versions y ON y.id=b.version) """


def compare(db,store,args,export=False):
    db.execute('BEGIN')
    pair = (int(args['old']),int(args['new']))
    roots = db.execute('SELECT root_id FROM checkpoints WHERE id IN (?,?)',pair).fetchall()
    if len(roots)!=2 or roots[0][0]!=roots[1][0]:
        raise ValueError('请选择同一目录的两份不同清单')
    predicates, params = [], list(pair)
    keyword = args.get('q','').strip().replace('\\','/')
    if keyword:
        predicates.append("(instr(lower(coalesce(old_path,'')),lower(?)) OR instr(lower(coalesce(new_path,'')),lower(?)))")
        params.extend((keyword,keyword))
    counts = dict(db.execute(QUERY+'SELECT kind,count(*) FROM diff'+(' WHERE '+predicates[0] if predicates else '')+' GROUP BY kind',params))
    kind = args.get('kind','')
    if kind:
        if kind not in KINDS:
            raise ValueError('清单变化类型无效')
        predicates.append('kind=?')
        params.append(kind)
    elif not args.get('unchanged'):
        predicates.append("kind!='相同'")
    source = ' FROM diff'+(' WHERE '+' AND '.join(predicates) if predicates else '')
    order = {'':'coalesce(new_path,old_path) COLLATE NOCASE','growth':'delta DESC','shrink':'delta ASC','change':'abs(delta) DESC'}.get(args.get('sort',''))
    if order is None:
        raise ValueError('清单排序无效')
    select = QUERY+'SELECT *'+source+' ORDER BY '+order+',file_id'
    if export:
        dest = Path(args['path']).resolve()
        if within(dest,store.home):
            raise ValueError('请在仓库之外保存')
        with new_csv(dest) as writer:
            writer.writerow(HEADERS)
            for row in db.execute(select,params):
                writer.writerow([csv_cell(row[k]) for k in FIELDS])
        db.commit()
        store.audit(db,'导出目录清单对照',f'清单 #{pair[0]} → #{pair[1]}')
        return str(dest)
    total,delta = db.execute(QUERY+'SELECT count(*),coalesce(sum(delta),0)'+source,params).fetchone()
    size = min(100,max(1,int(args.get('size',25))))
    page = min(max(1,int(args.get('page',1))),max(1,(total+size-1)//size))
    items = [dict(r) for r in db.execute(select+' LIMIT ? OFFSET ?', [*params,size,(page-1)*size])]
    return dict(items=items,total=total,delta=delta,counts=counts,page=page,size=size)
