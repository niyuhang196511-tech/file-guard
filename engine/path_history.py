"""根据可见变更记录查询路径两侧及文件身份。"""
from datetime import date,timedelta
from pathlib import Path,PureWindowsPath

from .comparison import csv_cell,new_csv
from .store import within

MODES=('path','folder','identity')
TYPES=('初始建档','新增','内容修改','属性修改','重命名','移动','删除','历史恢复','恢复前快照')
MOVEMENT=('初始建档','新增','重命名','移动','删除')
DIRECTIONS=('新占用记录','删除记录','移入范围','移出范围','范围内路径变化','重命名','移动','原位置记录')
SORTS={'newest':'stamp DESC,id DESC','oldest':'stamp,id'}
LIMIT=100_000
CSV_FIELDS=('id','file_id','root','stamp','direction','kind','old_rel','rel','prior','version','source','caption')
CSV_HEADER=('事件编号','文件身份','监控目录','记录时间','路径关系','事件类型','原路径','事件路径','旧版本','新版本','扫描来源','公开更正')


def text(args,key,limit=512,trim=True):
    value=args.get(key,'')
    if not isinstance(value,str) or len(value)>limit or any(ord(c)<32 for c in value):
        raise ValueError('无效的文本条件：'+key)
    return value.strip() if trim else value


def number(args,key,default=0):
    value=args.get(key,default)
    if type(value) is not int or not 0<=value<=2**53-1:
        raise ValueError('无效的数字条件：'+key)
    return value


def flag(args,key):
    value=args.get(key,False)
    if type(value) is not bool:
        raise ValueError('无效的开关条件：'+key)
    return value


def day(value):
    if not value:
        return None
    try:
        parsed=date.fromisoformat(value)
        if parsed.isoformat()==value:
            return parsed
    except ValueError:
        pass
    raise ValueError('请输入有效的起止日期')


def options(args):
    a={key:text(args,key) for key in ('mode','start','end','source','kind','direction','sort')}
    a['rel']=text(args,'rel',trim=False)
    a['mode']=a['mode'] or 'path'
    a['sort']=a['sort'] or 'newest'
    if a['mode'] not in MODES or a['sort'] not in SORTS:
        raise ValueError('无效的查询方式或排序')
    if (a['kind'] and a['kind'] not in TYPES) or (a['direction'] and a['direction'] not in DIRECTIONS):
        raise ValueError('无效的事件类型或路径关系')
    a.update({key:number(args,key,default) for key,default in (('root',0),('file',0),('page',1),('size',25),('identity_page',1))})
    if a['size'] not in (10,25,50,100):
        raise ValueError('无效的每页行数')
    a.update({key:flag(args,key) for key in ('fold','structural')})
    if a['mode']=='identity':
        if not a['file']:
            raise ValueError('请输入有效的文件身份编号')
        a['rel']=''
    else:
        raw=a['rel']
        path=raw.replace('\\','/')
        if a['mode']=='folder':
            path=path.rstrip('/')
        if raw.startswith(('/','\\')) or PureWindowsPath(raw).anchor or not path or any(
                part in ('','.','..') for part in path.split('/')):
            raise ValueError('请输入相对于监控目录的路径')
        a['rel']=path
    start,end=day(a['start']),day(a['end'])
    if start and end and start>end:
        raise ValueError('开始日期须早于或等于结束日期')
    a['until']=(end+timedelta(days=1)).isoformat() if end and end!=date.max else ''
    return a


def relation(mode):
    pattern="""CASE WHEN kind IN ('初始建档','新增') THEN '新占用记录'
                    WHEN kind='删除' THEN '删除记录' """
    if mode=='identity':
        return pattern+"""WHEN kind='重命名' THEN '重命名' WHEN kind='移动' THEN '移动'
                          ELSE '原位置记录' END"""
    return pattern+"""WHEN old_rel<>'' AND old_match AND new_match THEN '范围内路径变化'
                      WHEN old_rel<>'' AND old_match THEN '移出范围'
                      WHEN old_rel<>'' AND new_match THEN '移入范围'
                      ELSE '原位置记录' END"""


def relation_query(db,a):
    db.create_function('fg_path_fold',1,str.casefold,deterministic=True)
    params={}
    terms=['e.file_id IS NOT NULL']
    for key,column,op in (('root','root_id','='),('start','stamp','>='),('until','stamp','<'),('source','source','='),('kind','kind','=')):
        if a[key]:
            params[key]=a[key]
            terms.append('e.'+column+op+':'+key)
    if a['structural']:
        terms.append("e.kind IN ("+','.join(repr(k) for k in MOVEMENT)+')')
    if a['mode']=='identity':
        terms.append('e.file_id=:file')
        params['file']=a['file']
        new_match=old_match='0'
        matches='1'
    else:
        path=a['rel'].casefold() if a['fold'] else a['rel']
        params['path']=path
        params['prefix']=path+'/'
        def expression(column):
            val='fg_path_fold('+column+')' if a['fold'] else column
            return val+'=:path' if a['mode']=='path' else 'substr('+val+',1,length(:prefix))=:prefix'
        new_match,old_match=(expression(c) for c in ('e.rel','e.old_rel'))
        matches='old_match OR new_match'
    cte="""WITH candidates AS (
        SELECT e.id,e.file_id,e.root_id,r.path AS root,e.rel,e.old_rel,e.ext,e.stamp,e.kind,e.source,
               e.old_v,e.new_v,p.num prior,v.num version,e.caption,"""+old_match+' AS old_match,'+new_match+""" AS new_match
        FROM visible_events e JOIN roots r ON r.id=e.root_id
        LEFT JOIN versions p ON p.id=e.old_v LEFT JOIN versions v ON v.id=e.new_v
        WHERE """+' AND '.join(terms)+"""
    ), related AS (
        SELECT *,"""+relation(a['mode'])+""" AS direction FROM candidates WHERE """+matches+"""
    ), filtered AS (
        SELECT * FROM related"""+(' WHERE direction=:direction' if a['direction'] else '')+"""
    ) """
    params['direction']=a['direction']
    return cte,params


def pagination(total,page,size):
    pages=max(1,(total+size-1)//size)
    index=min(pages,max(1,page))
    return index,pages,(index-1)*size


def result(db,store,args,export=False):
    a=options(args)
    db.execute('BEGIN')
    cte,params=relation_query(db,a)
    order=' ORDER BY '+SORTS[a['sort']]
    stat=dict(db.execute(cte+"""SELECT count(*) AS total,count(DISTINCT file_id) AS identities,
        count(DISTINCT root_id) AS roots,min(stamp) AS first,max(stamp) AS last FROM filtered""",params).fetchone())
    if export:
        return write_csv(db,store,args,cte+'SELECT * FROM filtered'+order,params,stat['total'])
    counts=dict(db.execute(cte+'SELECT direction,count(*) FROM filtered GROUP BY direction',params))
    page,pages,offset=pagination(stat['total'],a['page'],a['size'])
    ip,ips,io=pagination(stat['identities'],a['identity_page'],20)
    identities=db.execute(cte+"""SELECT file_id,root_id,root,count(*) total,min(stamp) first,max(stamp) last
                  FROM filtered GROUP BY file_id,root_id,root ORDER BY last DESC,file_id DESC LIMIT 20 OFFSET :offset""",
                  {**params,'offset':io})
    items=db.execute(cte+'SELECT * FROM filtered'+order+' LIMIT :size OFFSET :offset',{**params,'size':a['size'],'offset':offset})
    return dict(**stat,items=[dict(r) for r in items],groups=[dict(r) for r in identities],counts=counts,
                page=page,pages=pages,size=a['size'],identity_page=ip,identity_pages=ips,path=a['rel'],mode=a['mode'])


def write_csv(db,store,args,sql,params,total):
    raw=args.get('path')
    if not isinstance(raw,str) or not raw or '\0' in raw:
        raise ValueError('请选择仓库外的新 CSV 文件')
    target=Path(raw)
    dest=target.parent.resolve()/target.name
    if within(dest,store.home) or dest.suffix.lower()!='.csv':
        raise ValueError('请选择仓库外的新 CSV 文件')
    if not 0<total<=LIMIT:
        raise ValueError('当前范围没有可导出的记录' if not total else '超过 10 万条，请缩小查询范围')
    with new_csv(dest) as writer:
        writer.writerow(CSV_HEADER)
        for row in db.execute(sql,params):
            writer.writerow([csv_cell(row[key]) for key in CSV_FIELDS])
    db.commit()
    store.audit(db,'导出路径沿革',f'{total} 条可见记录')
    return str(dest)
