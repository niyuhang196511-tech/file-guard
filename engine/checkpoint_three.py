"""以早期目录清单为参照，分析两个保存结果及潜在路径争用。"""
from collections import Counter,defaultdict
from heapq import nsmallest
from pathlib import Path
import re
import unicodedata

from .comparison import csv_cell,new_csv
from .store import within

LIMIT=100_000
SIDES=('base','left','right')
KINDS=('相同','仅左侧变动','仅右侧变动','两侧结果相同','两侧互补','两侧内容冲突','两侧路径冲突','两侧路径与内容冲突','移出与变动冲突')
CONFLICTS=frozenset(KINDS[5:])
SORTS=('review','path','left','right','impact')
CSV_HEADER=('基准清单','左侧清单','右侧清单','文件身份','三方结果','需复核','争用路径','其他争用身份数',
            '基准路径','基准版本','基准字节','基准SHA-256','左侧路径','左侧版本','左侧字节','左侧SHA-256',
            '右侧路径','右侧版本','右侧字节','右侧SHA-256','左侧变化','右侧变化','左侧字节差','右侧字节差',
            '候选路径','候选SHA-256')


def text(args,key,limit=512):
    value=args.get(key,'')
    if not isinstance(value,str) or len(value)>limit or '\0' in value:
        raise ValueError('无效的文本条件：'+key)
    return value.strip()


def number(args,key,default=0):
    value=args.get(key,default)
    if type(value) is not int or not 0<=value<=2**53-1:
        raise ValueError('无效的数字条件：'+key)
    return value


def flag(args,key):
    value=args.get(key,False)
    if type(value) is not bool:
        raise ValueError('无效的开关：'+key)
    return value


def selections(args):
    ids=tuple(number(args,key) for key in SIDES)
    if not all(ids) or len(set(ids))!=3:
        raise ValueError('请选择三份不同的目录清单')
    if ids[0]>=min(ids[1:]):
        raise ValueError('基准清单须早于左右两份清单')
    return ids


def load(db,args):
    ids=selections(args)
    marks=','.join('?' for _ in ids)
    metadata={row['id']:dict(row) for row in db.execute(
        'SELECT id,root_id,label,stamp,last_scan FROM checkpoints WHERE id IN ('+marks+')',ids)}
    if len(metadata)!=3 or len({row['root_id'] for row in metadata.values()})!=1:
        raise ValueError('请选择同一监控目录的三份清单')
    if db.execute('SELECT count(*) FROM checkpoint_files WHERE checkpoint IN ('+marks+')',ids).fetchone()[0]>LIMIT:
        raise ValueError('三份清单合计超过 10 万项，请选择较小的目录清单')
    rows=defaultdict(dict)
    sides={cid:key for cid,key in zip(ids,SIDES)}
    for row in db.execute("""SELECT c.checkpoint,c.file_id,c.rel,v.id,v.num,v.size,v.sha,v.stamp
                             FROM checkpoint_files c JOIN versions v ON v.id=c.version
                             WHERE c.checkpoint IN ("""+marks+')',ids):
        rows[row['file_id']][sides[row['checkpoint']]]={k:row[k] for k in ('rel','id','num','size','sha','stamp')}
    return dict(zip(SIDES,(metadata[cid] for cid in ids))),rows


def fingerprint(row):
    return (row['rel'],row['sha']) if row else None


def delta(base,side):
    if base is None:
        return '新增' if side else '相同'
    if side is None:
        return '移出'
    path=base['rel']!=side['rel']
    body=base['sha']!=side['sha']
    if path and body:
        return '路径与内容变更'
    if path:
        return '路径变更'
    return '内容修改' if body else '相同'


def classify(b,l,r):
    if b==l==r:
        return '相同',b
    if b==r:
        return '仅左侧变动',l
    if b==l:
        return '仅右侧变动',r
    if l==r:
        return '两侧结果相同',l
    if l is None or r is None:
        return '移出与变动冲突',None
    conflicts=[i for i in (0,1) if l[i]!=r[i] and (b is None or (l[i]!=b[i] and r[i]!=b[i]))]
    if conflicts:
        return { (0,):'两侧路径冲突',(1,):'两侧内容冲突',(0,1):'两侧路径与内容冲突'}[tuple(conflicts)],None
    return '两侧互补',tuple(l[i] if b is None or l[i]!=b[i] else r[i] for i in (0,1))


def portable_key(path):
    return unicodedata.normalize('NFC',path).casefold()


def assemble(db,args):
    meta,rows=load(db,args)
    output=[]
    occupancies=defaultdict(list)
    for fid,group in rows.items():
        base,left,right=(group.get(side) for side in SIDES)
        mode,candidate=classify(*(fingerprint(row) for row in (base,left,right)))
        path,sha=candidate or ('','')
        size=(base or {}).get('size',0)
        result=dict(file_id=fid,base=base,left=left,right=right,kind=mode,review=mode in CONFLICTS,
                    left_kind=delta(base,left),right_kind=delta(base,right),candidate_path=path,candidate_sha=sha,
                    left_delta=(left or {}).get('size',0)-size,right_delta=(right or {}).get('size',0)-size,
                    collision='',others=[],other_count=0)
        output.append(result)
        if path:
            occupancies[portable_key(path)].append(result)
    overlaps=defaultdict(set)
    for key,items in occupancies.items():
        if len(items)>1:
            overlaps[key].add(key)
        parent=key.rpartition('/')[0]
        while parent:
            if parent in occupancies:
                overlaps[key].add(parent)
                overlaps[parent].add(key)
            parent=parent.rpartition('/')[0]
    for key,groups in overlaps.items():
        if not groups:
            continue
        other_count=sum(len(occupancies[p]) for p in groups)-(key in groups)
        sample=nsmallest(9,(row['file_id'] for p in groups for row in occupancies[p]))
        for row in occupancies[key]:
            row.update(review=True,collision=row['candidate_path'],other_count=other_count,
                       others=[i for i in sample if i!=row['file_id']][:8])
    return meta,output


def paths(row):
    return [row[key]['rel'] for key in SIDES if row[key]]


def order(rows,mode):
    rows.sort(key=lambda r:(portable_key(r['candidate_path'] or paths(r)[-1]),r['file_id']))
    if mode=='review':
        rows.sort(key=lambda r:r['review'],reverse=True)
    elif mode in ('left','right'):
        rows.sort(key=lambda r:abs(r[mode+'_delta']),reverse=True)
    elif mode=='impact':
        rows.sort(key=lambda r:max(abs(r['left_delta']),abs(r['right_delta'])),reverse=True)


def report(db,store,args,export=False):
    query=text(args,'q').casefold().replace('\\','/')
    exts={'.'+s.lstrip('.').casefold() for s in re.split(r'[,，;；\s]+',text(args,'ext')) if s.lstrip('.')}
    if len(exts)>32:
        raise ValueError('一次最多选择 32 种后缀')
    kind,sort=text(args,'kind'),text(args,'sort') or 'review'
    if (kind and kind not in KINDS) or sort not in SORTS:
        raise ValueError('无效的三方结果或排序')
    include,issues,collision=(flag(args,key) for key in ('unchanged','issues','collision'))
    size=number(args,'size',25)
    if size not in (10,25,50,100):
        raise ValueError('无效的每页行数')
    db.execute('BEGIN')
    meta,rows=assemble(db,args)
    selected=[]
    for row in rows:
        entries=paths(row)
        if query and not any(query in path.casefold() for path in entries):
            continue
        if exts and not any(Path(p).suffix.casefold() in exts for p in entries):
            continue
        if (kind and kind!=row['kind']) or (not kind and not include and row['kind']=='相同' and not row['review']):
            continue
        if (issues and not row['review']) or (collision and not row['collision']):
            continue
        selected.append(row)
    order(selected,sort)
    if export:
        return write_csv(db,store,args,meta,selected)
    total=len(selected)
    pages=max(1,(total+size-1)//size)
    page=min(pages,max(1,number(args,'page',1)))
    start=(page-1)*size
    return dict(meta=meta,total=total,page=page,pages=pages,size=size,items=selected[start:start+size],
                counts=dict(Counter(row['kind'] for row in selected)),
                review=sum(row['review'] for row in selected),collisions=sum(bool(row['collision']) for row in selected),
                left_delta=sum(row['left_delta'] for row in selected),right_delta=sum(row['right_delta'] for row in selected))


def write_csv(db,store,args,meta,selected):
    raw=args.get('path')
    if not isinstance(raw,str) or not raw or '\0' in raw:
        raise ValueError('请选择仓库外的新 CSV 文件')
    path=Path(raw)
    dest=path.parent.resolve()/path.name
    if within(dest,store.home) or dest.suffix.lower()!='.csv':
        raise ValueError('请选择仓库外的新 CSV 文件')
    if not selected:
        raise ValueError('当前范围没有可导出的项目')
    with new_csv(dest) as out:
        out.writerow(CSV_HEADER)
        for row in selected:
            values=[meta[key]['label'] for key in SIDES]+[row['file_id'],row['kind'],'是' if row['review'] else '否',
                 row['collision'],row['other_count']]
            values.extend((row[key] or {}).get(field) for key in SIDES for field in ('rel','num','size','sha'))
            values.extend(row[key] for key in ('left_kind','right_kind','left_delta','right_delta','candidate_path','candidate_sha'))
            out.writerow(map(csv_cell,values))
    db.commit()
    store.audit(db,'导出目录清单三方对照',f"清单 {meta['base']['id']} / {meta['left']['id']} / {meta['right']['id']} · {len(selected)} 项")
    return str(dest)
