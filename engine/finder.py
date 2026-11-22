"""从可见的相邻版本事件检索已经解析的差异，列表与导出共享查询。"""
import datetime as dt
from decimal import Decimal, InvalidOperation
import json
from pathlib import Path
import re

from .comparison import new_csv, csv_cell, page_integer
from .store import within

TEXT_FILTERS = ('q','filename','ext','root','kind','sheet','field','record','start','end','side','sort','direction')
FLAGS = ('starred','exact','sensitive')
TEXT_COLUMNS = ('old_value','new_value','location','sheet','field','record_key')
EXPORT = {'rel':'事件路径','root_path':'监控目录','eid':'事件编号','stamp':'保存时间','prior':'旧版本','version':'新版本',
          'sheet':'工作表或分组','location':'位置','field':'字段','record_key':'业务编号','kind':'变化','old_value':'旧值','new_value':'新值'}

DETAILS = """
WITH hits AS (
 SELECT e.id eid,e.file_id,e.root_id,e.rel,e.ext,e.stamp,e.old_v,e.new_v,r.path root_path,
        p.num prior,v.num version,CAST(j.key AS INTEGER) ordinal,
        j.value->>'$.sheet' sheet,j.value->>'$.location' location,j.value->>'$.field' field,
        j.value->>'$.record_key' record_key,j.value->>'$.kind' kind,
        j.value->>'$.old' old_value,j.value->>'$.new' new_value
 FROM visible_events e JOIN versions v ON v.id=e.new_v AND v.parent_id=e.old_v
 JOIN versions p ON p.id=e.old_v JOIN roots r ON r.id=e.root_id JOIN json_each(v.details) j
 WHERE v.status='已解析' {scope}
)
"""


def options(args):
    a={k:str(args.get(k) or '').strip() for k in TEXT_FILTERS}
    a.update({k:bool(args.get(k)) for k in FLAGS})
    if any(len(a[k])>512 for k in TEXT_FILTERS):
        raise ValueError('每个查询条件最多 512 字')
    for k in ('start','end'):
        if a[k] and dt.date.fromisoformat(a[k]).isoformat()!=a[k]:
            raise ValueError('日期格式无效')
    if a['start'] and a['end'] and a['start']>a['end']:
        raise ValueError('开始日期须早于或等于结束日期')
    for k,allowed in {'side':('','old_value','new_value','location'),'sort':('','oldest','path'),
                      'kind':('','新增','修改','删除'),'direction':('','up','down','same')}.items():
        if a[k] not in allowed:
            raise ValueError('无效的检索条件：'+k)
    return a


def numeric(value):
    if value is None:return None
    text=str(value).strip()
    if not re.fullmatch(r'[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?',text):
        return None
    try:return Decimal(text)
    except InvalidOperation:return None


def movement(before,after):
    x,y=numeric(before),numeric(after)
    if x is None or y is None:return ''
    return 'up' if y>x else 'down' if y<x else 'same'


def query(db,store,args,export=False):
    a=options(args)
    db.create_function('fg_fold',1,lambda v:str(v).casefold() if v is not None else None,deterministic=True)
    db.create_function('fg_movement',2,movement,deterministic=True)
    scope,filter_by,params=[],[],[]
    if a['root']:
        scope.append('e.root_id=?');params.append(int(a['root']))
    if a['filename']:
        scope.append('instr(fg_fold(e.rel),fg_fold(?))>0');params.append(a['filename'].replace('\\','/'))
    exts=list(dict.fromkeys('.'+e.lstrip('.').lower() for e in re.split(r'[,，;；\s]+',a['ext']) if e.lstrip('.')))
    if exts:
        scope.append("e.ext IN ("+','.join('?' for _ in exts)+")");params.extend(exts)
    if a['starred']:scope.append('EXISTS(SELECT 1 FROM file_stars f WHERE f.file_id=e.file_id)')
    if a['start']:scope.append('e.stamp>=?');params.append(a['start'])
    if a['end']:scope.append('substr(e.stamp,1,10)<=?');params.append(a['end'])
    for opt,col in [('sheet','sheet'),('field','field'),('record','record_key'),('kind','kind')]:
        if a[opt]:
            filter_by.append(col+'=?');params.append(a[opt])
    if a['q']:
        predicates=[]
        for col in (a['side'],) if a['side'] else TEXT_COLUMNS:
            val='CAST('+col+' AS TEXT)'
            param='?'
            if not a['sensitive']:val,param='fg_fold('+val+')','fg_fold(?)'
            predicates.append(val+'='+param if a['exact'] else 'instr('+val+','+param+')>0')
            params.append(a['q'])
        filter_by.append('('+' OR '.join(predicates)+')')
    if a['direction']:
        filter_by.append('fg_movement(old_value,new_value)=?');params.append(a['direction'])
    sql=DETAILS.format(scope=''.join(' AND '+s for s in scope))
    source=' FROM hits'+(' WHERE '+' AND '.join(filter_by) if filter_by else '')
    order={'':'unixepoch(stamp) DESC,eid DESC','oldest':'unixepoch(stamp),eid','path':'rel COLLATE NOCASE,unixepoch(stamp) DESC,eid DESC'}[a['sort']]
    tail=source+' ORDER BY '+order+',ordinal'
    db.execute('BEGIN')
    if export:
        path=Path(args['path']).resolve()
        if within(path,store.home):raise ValueError('请在仓库外保存')
        with new_csv(path) as writer:
            writer.writerow(EXPORT.values())
            for r in db.execute(sql+'SELECT *'+tail,params):writer.writerow([csv_cell(r[k]) for k in EXPORT])
        db.commit();store.audit(db,'导出跨文件差异','按当前条件导出')
        return str(path)
    total,files,events=db.execute(sql+'SELECT count(*),count(DISTINCT file_id),count(DISTINCT eid)'+source,params).fetchone()
    size=max(1,min(page_integer(args,'size',25),100))
    pages=max(1,(total+size-1)//size);page=min(pages,max(1,page_integer(args,'page',1)))
    # Match and export the complete values. Bound only the preview sent to the window.
    fields=['eid','file_id','root_id','rel','ext','stamp','old_v','new_v','root_path','prior','version','ordinal','sheet','location','field','record_key','kind']
    for col in ('old_value','new_value'):
        fields.extend([f'CASE WHEN length({col})>320 THEN substr({col},1,320) ELSE {col} END AS {col}',
                       f'coalesce(length({col})>320,0) AS {col}_truncated'])
    select=sql+'SELECT '+','.join(fields)+tail+' LIMIT ? OFFSET ?'
    items=[dict(r) for r in db.execute(select,params+[size,(page-1)*size])]
    return dict(items=items,total=total,files=files,events=events,page=page,pages=pages,size=size)


def presets(db,store,cmd,args):
    if cmd=='finder_presets':
        return [dict(id=i,name=n,filters=json.loads(f)) for i,n,f in db.execute('SELECT id,name,filters FROM finder_presets ORDER BY name,id')]
    if cmd=='finder_forget':
        if not db.execute('DELETE FROM finder_presets WHERE id=?',(args['id'],)).rowcount:raise ValueError('条件组合已移除')
        return '已移除条件组合'
    name=str(args.get('name','')).strip()
    if not 1<=len(name)<=60:raise ValueError('请输入 1 至 60 字的名称')
    db.execute('BEGIN IMMEDIATE')
    if db.execute('SELECT 1 FROM finder_presets WHERE name=?',(name,)).fetchone():raise ValueError('已有同名条件组合')
    return db.execute('INSERT INTO finder_presets(name,filters) VALUES (?,?)',(name,json.dumps(options(args),ensure_ascii=False))).lastrowid
