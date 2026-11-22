"""复核元数据绑定到不可变版本，快照字节与用户意见独立存储。"""
from datetime import date

STATES=('待复核','需跟进','已复核')
BASE=""" FROM versions v JOIN files f ON f.id=v.file_id JOIN roots r ON r.id=f.root_id
         LEFT JOIN version_reviews m ON m.version_id=v.id
         LEFT JOIN file_stars star ON star.file_id=f.id """
FIELDS="""v.id,v.file_id,v.num,v.parent_id,v.size,v.sha,v.ext,v.status,v.error,v.stamp,
          f.rel,r.path AS root,f.root_id,coalesce(m.state,'待复核') AS review,
          coalesce(m.note,'') AS note,coalesce(m.revision,0) AS revision,
          coalesce(m.stamp,'') AS reviewed_at,star.file_id IS NOT NULL AS starred,
          json_array_length(v.details) AS changes"""
EXPORT_FIELDS=('rel','root','num','stamp','review','note','reviewed_at','status','changes','sha')
EXPORT_HEADER=('文件','监控目录','版本号','保存时间','复核状态','复核备注','最近复核时间','解析状态','差异条数','SHA-256')


def selection(a):
    terms=[];params=[]
    if not a.get('baseline'):
        terms.append('v.parent_id IS NOT NULL')
    if a.get('starred'):
        terms.append('star.file_id IS NOT NULL')
    if a.get('latest'):
        terms.append('v.num=(SELECT max(num) FROM versions WHERE file_id=v.file_id)')
    if a.get('root'):
        terms.append('f.root_id=?');params.append(a['root'])
    if a.get('status'):
        terms.append('v.status=?');params.append(a['status'])
    if a.get('ext','').strip():
        terms.append('v.ext=?');params.append('.'+a['ext'].strip('. ').lower())
    if q:=a.get('q','').strip():
        terms.append("(instr(lower(f.rel),lower(?)) OR instr(lower(m.note),lower(?)) OR instr(lower(v.error),lower(?)))")
        params.extend([q.replace('\\','/'),q,q])
    start,end=a.get('start',''),a.get('end','')
    for value in (start,end):
        if value and date.fromisoformat(value).isoformat()!=value:
            raise ValueError('日期格式无效')
    if start and end and start>end:
        raise ValueError('结束日期不能早于开始日期')
    if start:
        terms.append('v.stamp>=?');params.append(start)
    if end:
        terms.append('substr(v.stamp,1,10)<=?');params.append(end)
    return terms,params


def query(db,args,export=False):
    terms,params=selection(args)
    where=lambda parts:' WHERE '+' AND '.join(parts) if parts else ''
    counts=dict.fromkeys(STATES,0)
    if not export:
        counts.update(dict(db.execute("SELECT coalesce(m.state,'待复核'),count(*)"+BASE+where(terms)+' GROUP BY 1',params)))
    state=args.get('state','')
    if state:
        if state not in STATES:raise ValueError('复核状态无效')
        terms.append("coalesce(m.state,'待复核')=?");params.append(state)
    order={'':'unixepoch(v.stamp) DESC,v.id DESC','oldest':'unixepoch(v.stamp),v.id','changes':'changes DESC,v.id DESC',
           'reviewed':'unixepoch(m.stamp) DESC,v.id DESC'}.get(args.get('sort',''))
    if not order:raise ValueError('复核排序无效')
    sql='SELECT '+FIELDS+BASE+where(terms)+' ORDER BY '+order
    if export:
        return db.execute(sql,params)
    size=max(1,min(100,int(args.get('size',25))))
    total=counts[state] if state else sum(counts.values())
    pages=max(1,(total+size-1)//size)
    page=min(pages,max(1,int(args.get('page',1))))
    items=[dict(r) for r in db.execute(sql+' LIMIT ? OFFSET ?',params+[size,(page-1)*size])]
    return dict(items=items,total=total,size=size,page=page,pages=pages,counts=counts)


def save(db,store,args,stamp):
    vid=int(args['id'])
    state=args['state'];note=args.get('note','').strip()
    if state not in STATES:raise ValueError('复核状态无效')
    if len(note)>2000:raise ValueError('备注最多 2000 字')
    if state=='需跟进' and not note:raise ValueError('请填写需要跟进的事项')
    db.execute('BEGIN IMMEDIATE')
    row=db.execute('SELECT '+FIELDS+BASE+' WHERE v.id=?',(vid,)).fetchone()
    if not row:raise ValueError('版本不存在')
    if (state,note)==(row['review'],row['note']):return '复核记录已保存'
    if int(args['revision'])!=row['revision']:
        raise ValueError('复核记录已更新，请关闭后刷新，再核对新意见')
    write_review(db,store,row,state,note,stamp)
    return '复核记录已保存'


def write_review(db,store,row,state,note,stamp,batch=''):
    db.execute("""INSERT INTO version_reviews VALUES (?,?,?,?,?)
                  ON CONFLICT(version_id) DO UPDATE SET state=excluded.state,note=excluded.note,
                  stamp=excluded.stamp,revision=excluded.revision""",
               (row['id'],state,note,stamp,row['revision']+1))
    note_text=f"{row['rel']} · V{row['num']} · {row['review']} → {state}\n此前意见：{row['note'] or '（空）'}\n本次意见：{note or '（空）'}"
    if batch:
        note_text=f'批次 {batch}\n'+note_text
    store.audit(db,'更新版本复核',note_text)


def star(db,store,args):
    fid=int(args['id'])
    record=db.execute('SELECT rel FROM files WHERE id=?',(fid,)).fetchone()
    if record is None:raise ValueError('文件不存在')
    adding=args.get('starred') is True
    operation='INSERT OR IGNORE INTO file_stars VALUES (?)' if adding else 'DELETE FROM file_stars WHERE file_id=?'
    if db.execute(operation,(fid,)).rowcount:
        store.audit(db,'关注文件' if adding else '取消关注文件',record[0])
    return '已关注文件' if adding else '已取消关注'


def storage(db,home):
    import shutil
    versions,logical=db.execute('SELECT count(*),coalesce(sum(size),0) FROM versions').fetchone()
    objects,unique=db.execute('SELECT count(*),coalesce(sum(size),0) FROM (SELECT max(size) AS size FROM versions GROUP BY sha)').fetchone()
    def rows(sql):return [dict(r) for r in db.execute(sql)]
    database=0
    for suffix in ('','-wal','-shm'):
        try:database+=(home/('fileguard.db'+suffix)).stat().st_size
        except FileNotFoundError:pass
    return dict(versions=versions,logical=logical,objects=objects,unique=unique,saved=logical-unique,
        free=shutil.disk_usage(home).free,
        database=database,
        largest=rows("""SELECT f.id,f.rel,r.path AS root,count(*) AS versions,sum(v.size) AS bytes
                        FROM versions v JOIN files f ON f.id=v.file_id JOIN roots r ON r.id=f.root_id
                        GROUP BY f.id ORDER BY bytes DESC,f.id LIMIT 8"""),
        by_root=rows("""SELECT r.path AS root,count(v.id) AS versions,coalesce(sum(v.size),0) AS bytes
                        FROM roots r LEFT JOIN files f ON f.root_id=r.id LEFT JOIN versions v ON v.file_id=f.id
                        GROUP BY r.id ORDER BY bytes DESC,r.id"""))
