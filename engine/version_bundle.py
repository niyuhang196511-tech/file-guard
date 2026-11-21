"""把显式选择的历史版本打包并按所选版本核查。"""
from collections import Counter
from hashlib import sha256
import json
import os
from pathlib import Path
import re
import stat

from . import handoff
from .comparison import csv_cell,new_csv
from .shared_read import open_snapshot_source
from .store import ensure_plain,now,within

LIMIT=100
BYTE_LIMIT=256*1024**2
TITLE='历史版本交付'
READY='可打包，待验正文'
FIELDS=('rel','num','size','sha','stamp','version_id','name')
CSV_FIELDS=('rel','version_id','num','name','size','sha','stamp','source_state')
CSV_HEADER=('包内相对路径','版本编号','版本号','登记文件名','字节','SHA-256','保存时间','打包前检查')


def options(args):
    ids=args.get('ids')
    if (not isinstance(ids,list) or not 1<=len(ids)<=LIMIT or
            any(type(i) is not int or not 1<=i<=2**53-1 for i in ids)):
        raise ValueError('请选择 1 至 100 个有效的历史版本')
    if len(set(ids))!=len(ids):
        raise ValueError('交付篮包含重复版本')
    title=args.get('label','')
    if (not isinstance(title,str) or len(title)>80 or any(ord(c)<32 for c in title)):
        raise ValueError('交付名称须为不超过 80 字的单行文本')
    include=args.get('include_paths',False)
    if type(include) is not bool:
        raise ValueError('相对路径选项无效')
    return sorted(ids),title.strip() or TITLE,include


def member_name(vid,num,ext):
    suffix=ext if re.fullmatch(r'\.[a-zA-Z0-9][a-zA-Z0-9_-]{0,23}',ext) else ''
    return f'版本-{vid}/V{num}{suffix}'


def source_state(store,row):
    try:
        obj=store.obj(row['sha'])
        ensure_plain(obj,store.home)
        info=obj.stat()
        if not stat.S_ISREG(info.st_mode):
            return '归档副本不是普通文件'
        if info.st_size!=row['size']:
            return '归档副本长度不符'
        with open_snapshot_source(obj) as handle:
            opened=os.fstat(handle.fileno())
            if not stat.S_ISREG(opened.st_mode):
                return '归档副本不是普通文件'
            if opened.st_size!=row['size']:
                return '归档副本长度不符'
    except FileNotFoundError:
        return '归档副本缺失'
    except (OSError,ValueError):
        return '归档副本不可读取'
    return READY


def load(db,store,args,inspect=True):
    ids,label,include=options(args)
    rows={row['id']:row for row in db.execute(
        """SELECT v.id,v.num,v.sha,v.size,v.stamp,v.ext,f.rel,f.root_id,r.path
           FROM versions v JOIN files f ON f.id=v.file_id JOIN roots r ON r.id=f.root_id
           WHERE v.id IN ("""+','.join('?' for _ in ids)+')',ids)}
    items=[]
    counts=Counter()
    for vid in ids:
        row=rows.get(vid)
        if row is None:
            items.append(dict(version_id=vid,source_state='历史版本不存在'))
            counts['历史版本不存在']+=1
            continue
        valid=(row['size']>=0 and row['num']>=1 and re.fullmatch(r'[0-9a-f]{64}',row['sha']))
        state=(source_state(store,row) if inspect else READY) if valid else '版本索引无效'
        counts[state]+=1
        items.append(dict(version_id=vid,num=row['num'],size=row['size'],sha=row['sha'],stamp=row['stamp'],
                          name=row['rel'].rsplit('/',1)[-1],source_rel=row['rel'],root=row['path'],
                          rel=member_name(vid,row['num'],row['ext']),ext=row['ext'],source_state=state))
    total_bytes=sum(max(0,r['size']) for r in rows.values())
    reasons=[]
    if total_bytes>BYTE_LIMIT:
        reasons.append('所选原始文件合计超过 256 MiB')
    complete=len(rows)==len(ids) and not counts['版本索引无效']
    manifest=dict(format='FileGuard-delivery/1',label=label,selection='versions',
                  files=[{**{k:r[k] for k in FIELDS},**({'source_rel':r['source_rel']} if include else {})}
                         for r in items if 'rel' in r])
    token=''
    if complete:
        canonical=json.dumps(manifest,ensure_ascii=False,sort_keys=True,separators=(',',':'))
        token=sha256(canonical.encode('utf-8')).hexdigest()
    preview=dict(items=items,total=len(ids),bytes=total_bytes,objects=len({r['sha'] for r in rows.values()}),
                 roots=len({r['root_id'] for r in rows.values()}),label=label,include_paths=include,counts=dict(counts),
                 ready=complete and counts[READY]==len(ids) and not reasons,complete=complete,reasons=reasons,token=token)
    return preview,manifest


def destination(store,args,suffix):
    raw=args.get('path')
    if not isinstance(raw,str) or not raw or '\0' in raw:
        raise ValueError('请选择新文件')
    path=Path(raw)
    dest=path.parent.resolve()/path.name
    if within(dest,store.home) or dest.suffix.lower()!=suffix:
        raise ValueError(f'请选择仓库外的新 {suffix.upper()[1:]} 文件')
    return dest


def run(db,store,cmd,args):
    preview,manifest=load(db,store,args,inspect=cmd!='version_bundle_verify')
    if cmd=='version_bundle_preview':
        return preview
    if cmd=='version_bundle_verify':
        if not preview['complete']:
            raise ValueError('交付篮含无效或已不存在的版本')
        return handoff.verify(args['path'],manifest['files'])
    if not preview['complete'] or args.get('token')!=preview['token']:
        raise ValueError('交付范围已变化，请重新预览')
    csv=cmd=='version_bundle_csv'
    dest=destination(store,args,'.csv' if csv else '.zip')
    if csv:
        fields=(*CSV_FIELDS,'source_rel') if preview['include_paths'] else CSV_FIELDS
        with new_csv(dest) as out:
            out.writerow((*CSV_HEADER,'最近登记相对路径') if preview['include_paths'] else CSV_HEADER)
            for row in preview['items']:
                out.writerow(csv_cell(row[k]) for k in fields)
    else:
        if not preview['ready']:
            raise ValueError('交付篮有无法打包的成员或超出容量，请检查后重新预览')
        handoff.write_bundle(store,dest,dict(manifest,created=now()))
    store.audit(db,'导出历史版本交付明细' if csv else '生成历史版本交付包',
                f"{preview['label']} · {preview['total']} 项 · {preview['bytes']} 字节")
    return str(dest)
