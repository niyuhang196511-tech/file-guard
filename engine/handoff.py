"""从已保存的目录清单选择历史副本，生成和核查可携带的交付包。"""
from collections import Counter
import hashlib
import json
import os
from pathlib import Path,PureWindowsPath
import re
import stat
import unicodedata
import zipfile

from .comparison import new_csv,csv_cell,page_integer
from .publication import new_path
from .store import ensure_plain,within,now
from .shared_read import open_snapshot_source,resolved_windows_relative_path

MANIFEST='fileguard-delivery.json'
MANIFEST_MAX=16*1024*1024
HEADERS=('相对路径','版本号','大小字节','SHA-256','保存时间')
KEYS=('rel','num','size','sha','stamp')
RESERVED=re.compile(r'^(CON|PRN|AUX|NUL|COM[1-9¹²³]|LPT[1-9¹²³])(?:\.|$)',re.I)


def catalogue(db,args):
    meta=db.execute('SELECT id,label,stamp,last_scan FROM checkpoints WHERE id=?',(int(args['id']),)).fetchone()
    if not meta:raise ValueError('目录清单不存在')
    prefix=str(args.get('folder','')).strip().replace('\\','/').strip('/')
    term=str(args.get('q','')).strip().replace('\\','/').casefold()
    exts={'.'+s.lstrip('.').casefold() for s in re.split(r'[,，;；\s]+',args.get('ext','')) if s.lstrip('.')}
    sha=str(args.get('sha','')).strip().lower()
    if sha and not re.fullmatch('[0-9a-f]{1,64}',sha):raise ValueError('摘要前缀应为 1 至 64 位十六进制')
    items=[]
    for row in db.execute("""SELECT f.rel,f.file_id,v.id AS vid,v.num,v.size,v.sha,v.stamp,v.ext,
              unixepoch(v.stamp) AS saved_epoch FROM checkpoint_files f
              JOIN versions v ON v.id=f.version WHERE f.checkpoint=?""",(meta['id'],)):
        rel=row['rel']
        if prefix and not rel.startswith(prefix+'/'):continue
        if term and term not in rel.casefold():continue
        if exts and Path(rel).suffix.casefold() not in exts:continue
        if not row['sha'].startswith(sha):continue
        items.append(dict(row))
    mode=args.get('sort','')
    if mode not in ('','size','updated','version'):raise ValueError('无效的清单顺序')
    items.sort(key=lambda r:(r['rel'].casefold(),r['rel']))
    if mode=='updated':
        items.sort(key=lambda r:(r['saved_epoch'] is not None,r['saved_epoch']),reverse=True)
    elif mode:
        items.sort(key=lambda r:r[{'size':'size','version':'num'}[mode]],reverse=True)
    for item in items:
        del item['saved_epoch']
    return dict(meta),items


def page(meta,items,args):
    total=len(items);pages=max(1,(total+24)//25);p=max(1,min(pages,page_integer(args,'page',1)))
    return dict(meta=meta,total=total,pages=pages,page=p,bytes=sum(r['size'] for r in items),
                objects=len({r['sha'] for r in items}),items=items[(p-1)*25:p*25])


def portable(rel,seen):
    if not isinstance(rel,str) or not rel:raise ValueError('缺少包内路径')
    parts=rel.split('/');ancestor=''
    for index,part in enumerate(parts):
        if (part in ('','.','..') or part[-1] in '. ' or RESERVED.match(part)
            or any(ord(c)<32 or c in '<>:"\\|?*' for c in part)):
            raise ValueError('路径无法作为 Windows 交付文件名：'+rel)
        ancestor=(ancestor+'/' if ancestor else '')+part
        kind='file' if index==len(parts)-1 else 'dir'
        key=unicodedata.normalize('NFC',ancestor).casefold()
        old=seen.get(key)
        if old and (old!=(ancestor,kind) or kind=='file'):
            raise ValueError('包内名称重复或文件与目录冲突：'+rel)
        seen[key]=(ancestor,kind)


def destination(store,args):
    p=Path(args['path']).resolve()
    if within(p,store.home):raise ValueError('请在仓库外保存')
    return p


def export(db,store,args):
    meta,items=catalogue(db,args)
    dest=destination(store,args)
    if not items:raise ValueError('所选范围为空')
    if args.get('csv'):
        with new_csv(dest) as out:
            out.writerow(HEADERS)
            for r in items:out.writerow([csv_cell(r[k]) for k in KEYS])
        store.audit(db,'导出清单目录',f"清单 #{meta['id']} · {len(items)} 项")
        return str(dest)
    manifest=dict(format='FileGuard-delivery/1',label=meta['label'],scanned=meta['last_scan'],
                  created=now(),files=[{k:r[k] for k in KEYS} for r in items])
    write_bundle(store,dest,manifest)
    store.audit(db,'导出清单交付包',f"清单 #{meta['id']} · {len(items)} 项")
    return str(dest)


def write_bundle(store,dest,manifest):
    seen={}
    for row in manifest['files']:
        portable(row['rel'],seen)
    content=json.dumps(manifest,ensure_ascii=False,separators=(',',':')).encode()
    if len(content)>MANIFEST_MAX:raise ValueError('交付清单过大，请缩小范围')
    with new_path(dest) as tmp:
        with zipfile.ZipFile(tmp,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=1) as pack:
            pack.writestr(MANIFEST,content)
            for row in manifest['files']:
                copy_member(store,pack,row)


def copy_member(store,pack,row):
    obj=store.obj(row['sha'])
    ensure_plain(obj,store.home)
    expected=row['size']
    before=obj.stat()
    error='源版本校验失败：'+row['rel']
    if not stat.S_ISREG(before.st_mode) or before.st_size!=expected:
        raise ValueError(error)
    digest=hashlib.sha256()
    remaining=expected
    with open_snapshot_source(obj) as src,pack.open('files/'+row['rel'],'w',force_zip64=True) as out:
        info=os.fstat(src.fileno())
        if not stat.S_ISREG(info.st_mode) or info.st_size!=expected:
            raise ValueError(error)
        while remaining:
            block=src.read(min(remaining,1024*1024))
            if not block:
                raise ValueError(error)
            digest.update(block)
            out.write(block)
            remaining-=len(block)
        if src.read(1) or digest.hexdigest()!=row['sha']:
            raise ValueError(error)


def verify(path,reference=None):
    counts=Counter();issues=[];inspected=0;size=0
    def issue(kind,rel):
        counts[kind]+=1
        if len(issues)<100:issues.append(dict(kind=kind,rel=rel))
    with zipfile.ZipFile(path) as z:
        entries=z.infolist()
        if len(entries)!=len(z.NameToInfo):raise ValueError('ZIP 包含重名条目')
        if MANIFEST not in z.NameToInfo:raise ValueError('缺少 FileGuard 交付清单')
        if z.getinfo(MANIFEST).file_size>MANIFEST_MAX:raise ValueError('交付清单过大')
        data=json.loads(z.read(MANIFEST))
        if not isinstance(data,dict) or data.get('format')!='FileGuard-delivery/1' or not isinstance(data.get('files'),list):
            raise ValueError('无法识别交付清单版本')
        seen={};expected={}
        for r in data['files']:
            if not isinstance(r,dict):raise ValueError('交付条目格式无效')
            rel=r.get('rel');portable(rel,seen)
            if (not isinstance(r.get('sha'),str) or not re.fullmatch('[0-9a-f]{64}',r['sha'])
                or type(r.get('size')) is not int or r['size']<0 or type(r.get('num')) is not int or r['num']<1):
                raise ValueError('清单摘要、版本号或长度无效')
            expected[rel]=r
            key='files/'+rel
            if key not in z.NameToInfo:issue('缺少文件',rel);continue
            entry=z.getinfo(key)
            entry_type=stat.S_IFMT(entry.external_attr>>16)
            if entry.is_dir() or entry_type not in (0,stat.S_IFREG):
                issue('非普通文件',rel);continue
            if entry.file_size!=r['size']:issue('长度不符',rel);continue
            try:
                with z.open(entry) as src:h=hashlib.file_digest(src,'sha256').hexdigest()
            except (zipfile.BadZipFile,RuntimeError,NotImplementedError):
                issue('条目不可读取',rel);continue
            if h!=r['sha']:issue('摘要不符',rel);continue
            inspected+=1;size+=entry.file_size
        for entry in entries:
            if entry.filename!=MANIFEST and not (entry.filename.startswith('files/') and entry.filename[6:] in expected):
                issue('额外条目',entry.filename)
        if reference is not None:
            ref={r['rel']:r for r in reference}
            for rel in sorted(ref.keys()|expected.keys()):
                if rel not in ref:issue('当前清单未选择',rel)
                elif rel not in expected:issue('当前清单条目未交付',rel)
                elif any(ref[rel][k]!=expected[rel][k] for k in ('sha','size','num')):issue('与当前清单版本不符',rel)
    return dict(label=data.get('label',''),created=data.get('created',''),scanned=data.get('scanned',''),
                total=len(expected),verified=inspected,bytes=size,ok=not counts,counts=dict(counts),
                issue_count=sum(counts.values()),issues=issues,compared=reference is not None)


def disk_page(db,store,args):
    from .store import digest,signature
    meta,items=catalogue(db,args)
    result=page(meta,items,args)
    root=db.execute("""SELECT r.id,r.path,r.removed FROM roots r JOIN checkpoints c ON c.root_id=r.id
                     WHERE c.id=?""",(meta['id'],)).fetchone()
    base=Path(root['path'])
    if root['removed'] or not base.is_dir():raise ValueError('原监控目录当前不可用')
    windows=os.name=='nt'
    physical_base=base.resolve().parts if windows else ()
    quick=bool(args.get('quick'));counts=Counter()
    for row in result['items']:
        rel=row['rel'];target=base/rel;actual=None;sha=None;occupant=None
        if any(p in ('','.','..') for p in rel.replace('\\','/').split('/')) or PureWindowsPath(rel).anchor:
            raise ValueError('清单相对路径无效')
        try:
            ensure_plain(target,base);before=target.stat();actual=before.st_size
            regular=stat.S_ISREG(before.st_mode)
            if not regular:status='非普通文件'
            elif actual!=row['size']:status='大小不同'
            elif quick:status='大小一致，待验内容'
            else:
                sha=digest(target)
                status='内容一致' if sha==row['sha'] else '内容不同'
            checked_rel=rel
            if regular:
                if windows:
                    checked_rel=resolved_windows_relative_path(target,physical_base)
                ensure_plain(target,base)
            if signature(before)!=signature(target.stat()):
                status='读取期间变化';sha=None
            elif regular and checked_rel is not None and (key:=store.fkey(before)):
                occupant=db.execute('SELECT id FROM files WHERE root_id=? AND rel=? AND fkey=? AND live=1',
                                    (root['id'],checked_rel,key)).fetchone()
        except FileNotFoundError:
            status='原路径缺失' if actual is None else '读取期间变化'
            sha=None
        except ValueError:status='链接路径，已跳过';sha=None
        except OSError:status='不可读取';sha=None
        current=db.execute('SELECT rel FROM files WHERE id=? AND live=1',(row['file_id'],)).fetchone()
        row.update(state=status,actual=actual,disk_sha=sha,current_rel=current[0] if current else None,
                   replaced=bool(occupant and occupant[0]!=row['file_id']))
        counts[status]+=1
    return dict(result,checked=now(),quick=quick,counts=dict(counts))
