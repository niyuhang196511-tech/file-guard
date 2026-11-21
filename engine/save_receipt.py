"""Read the file on disk and compare it to the version catalogue without capturing it."""
from datetime import datetime
import hashlib
import os
from pathlib import Path, PureWindowsPath
import stat

from . import rules
from .shared_read import open_snapshot_source
from .store import ensure_plain, matches_open_file, now, signature


def read_digest(target, before):
    if os.name=='nt':
        source=open_snapshot_source(target)
    else:
        fd=os.open(target,os.O_RDONLY|os.O_NONBLOCK|getattr(os,'O_NOFOLLOW',0))
        source=os.fdopen(fd,'rb')
    with source as stream:
        opened = os.fstat(stream.fileno())
        if not matches_open_file(before, opened):
            raise ValueError('读取期间变化')
        sha = hashlib.file_digest(stream, 'sha256').hexdigest()
        if signature(os.fstat(stream.fileno())) != signature(opened):
            raise ValueError('读取期间变化')
    return sha


def receipt(db, store, args):
    fid = int(args['id'])
    sql = """SELECT f.id,f.root_id,f.rel,f.live,f.tracked,r.path,r.removed,r.active,r.patterns,r.max_mb,
             r.last_scan,r.error,coalesce(c.settle_ms,1500) settle_ms,coalesce(c.all_types,0) all_types,
             v.id vid,v.num,v.size,v.sha,v.status,v.stamp
             FROM files f JOIN roots r ON r.id=f.root_id LEFT JOIN capture_policy c ON c.root_id=r.id
             JOIN versions v ON v.id=(SELECT id FROM versions WHERE file_id=f.id ORDER BY num DESC LIMIT 1)
             WHERE f.id=?"""
    db.execute('BEGIN')
    f = db.execute(sql, (fid,)).fetchone()
    if not f:raise ValueError('文件没有在册版本')
    base = Path(f['path'])
    rel = f['rel']
    if PureWindowsPath(rel).anchor or any(p in ('','.','..') for p in rel.replace('\\','/').split('/')):
        raise ValueError('无效的在册相对路径')
    target = base / rel
    wait = db.execute('SELECT first_seen,last_seen,attempts,reason FROM waiting_files WHERE root_id=? AND rel=?',(f['root_id'],rel)).fetchone()
    task = db.execute('SELECT source,due FROM tasks WHERE root_id=?',(f['root_id'],)).fetchone()
    mode = args.get('mode','quick')
    if mode not in ('quick','full'):raise ValueError('核对模式无效')
    state = dict(file_id=fid,root_id=f['root_id'],rel=rel,root=str(base),checked=now(),mode=mode,
                 vid=f['vid'],version=f['num'],size=f['size'],sha=f['sha'],stamp=f['stamp'],parse=f['status'],
                 disk_size=None,disk_sha=None,mtime=None,delta=None,matches=0,matched_version=None,
                 tracked=bool(f['tracked']),active=bool(f['active'] and not f['removed']),last_scan=f['last_scan'],
                 root_error=f['error'],settle_ms=f['settle_ms'],all_types=bool(f['all_types']),
                 waiting=dict(wait) if wait else None,queued=task['source'] if task else '',rule='',result='',object_state='')
    owner = db.execute('SELECT id FROM files WHERE live=1 AND root_id=? AND rel=?',(f['root_id'],rel)).fetchone()
    if args.get('object'):
        try:
            store.checked_version(db,f['vid'])
            state['object_state']='历史副本校验通过'
        except (ValueError,OSError):
            state['object_state']='历史副本损坏或不可读'
    if f['removed']:state['result']='目录已移除'
    elif owner and owner[0]!=fid:state['result']='同名路径已由其他文件占用'
    else:
        try:
            ensure_plain(target,base)
            if not base.is_dir():state['result']='监控目录离线'
            else:
                before=target.stat()
                if not stat.S_ISREG(before.st_mode):state['result']='原路径不是普通文件'
                elif not f['live']:state['result']='旧路径出现尚未确认身份的文件'
                else:
                    size=before.st_size
                    state.update(disk_size=size,delta=size-f['size'],mtime=datetime.fromtimestamp(before.st_mtime).astimezone().isoformat(timespec='seconds'))
                    state['rule']=rules.preview(dict(paths=rel,max_mb=f['max_mb'],patterns=f['patterns'],bytes=size))[0]['reason']
                    if mode=='quick':
                        state['result']='大小相同，尚未核对内容' if size==f['size'] else '大小已变化'
                    else:
                        sha=read_digest(target,before)
                        state['disk_sha']=sha
                        count,latest=db.execute('SELECT count(*),max(num) FROM versions WHERE file_id=? AND sha=?',(fid,sha)).fetchone()
                        state.update(matches=count,matched_version=latest)
                        state['result']='已记入最新版本' if sha==f['sha'] else '与较早历史版本相同' if count else '磁盘内容尚未入库'
                    if signature(target.stat())!=signature(before):raise ValueError('读取期间变化')
        except FileNotFoundError:state['result']='读取期间变化' if state['disk_size'] is not None else '原路径缺失'
        except ValueError as exc:state['result']='读取期间变化' if str(exc)=='读取期间变化' else '已跳过链接路径'
        except PermissionError:state['result']='文件被占用或无读取权限'
        except OSError:state['result']='文件暂时不可读'
    db.commit()
    latest=db.execute(sql,(fid,)).fetchone()
    if not latest or any(latest[k]!=f[k] for k in ('vid','rel','root_id','live','removed','path')):
        state['result']='在册状态已更新，请重新核对'
    if state['result'] not in ('已记入最新版本','与较早历史版本相同','磁盘内容尚未入库'):
        state.update(disk_sha=None,matches=0,matched_version=None)
    return state
