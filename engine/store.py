import contextlib
import datetime as dt
from .rules import exclusion_patterns, match, temporary
import hashlib
import json
import os
import shutil
import sqlite3
import stat
import tempfile
import threading
import time
import zipfile
from collections import Counter
from pathlib import Path

from . import formats
from .backup_check import MANIFEST
from .publication import new_path
from .shared_read import open_snapshot_source, replace_guarded_file


class FileChanging(OSError):
    """文件仍在写入或替换，稍后重试。"""


def now():
    return dt.datetime.now().astimezone().isoformat(timespec='seconds')


def within(path, root):
    return path == root or root in path.parents


def signature(s):
    return (s.st_dev, s.st_ino, s.st_size, s.st_mtime_ns, s.st_ctime_ns)


def matches_open_file(path_info, handle_info):
    path_signature = signature(path_info)
    handle_signature = signature(handle_info)
    if os.name == 'nt':
        # On Windows, stat and fstat can report creation and change time respectively.
        return path_signature[:-1] == handle_signature[:-1]
    return path_signature == handle_signature


def linklike(p):
    s = p.lstat()
    return stat.S_ISLNK(s.st_mode) or bool(getattr(s,'st_file_attributes',0) & 1024)


def digest(path):
    with open_snapshot_source(path) as source:
        return hashlib.file_digest(source,'sha256').hexdigest()


def ensure_plain(path, root):
    if not within(path,root) or '..' in path.relative_to(root).parts:
        raise ValueError('目标超出监控目录')
    for part in [path,*path.parents]:
        if os.path.lexists(part) and linklike(part):
            raise ValueError('路径包含链接或重解析点')
        if part == root:
            break


@contextlib.contextmanager
def protect_overwrite(path):
    if os.name != 'nt' or not path.exists():
        yield
        return
    import ctypes
    from ctypes import wintypes
    kernel = ctypes.WinDLL('kernel32',use_last_error=True)
    op = kernel.CreateFileW
    op.argtypes = [wintypes.LPCWSTR,wintypes.DWORD,wintypes.DWORD,ctypes.c_void_p,wintypes.DWORD,wintypes.DWORD,wintypes.HANDLE]
    op.restype = wintypes.HANDLE
    kernel.CloseHandle.argtypes = [wintypes.HANDLE]
    # Share reads and deletion for atomic replacement while excluding writers.
    handle = op(str(path),0x80000000,1|4,None,3,0x80,None)
    if handle == ctypes.c_void_p(-1).value:
        raise OSError('文件被占用或权限不足，请关闭文件后重试')
    try:
        yield
    finally:
        kernel.CloseHandle(handle)


class Store:
    def __init__(self, home):
        self.home = Path(home).resolve()
        self.home.mkdir(parents=True,exist_ok=True)
        self.objects = self.home/'objects'
        self.temp = self.home/'temp'
        for folder in (self.objects,self.temp):
            folder.mkdir(exist_ok=True)
        self.dbfile = self.home/'fileguard.db'
        self.lock = threading.RLock()
        self.progress = {}
        self.observations = {}
        with self.db() as db:
            previous_schema = db.execute('PRAGMA user_version').fetchone()[0]
            if previous_schema>11:
                raise ValueError('数据库来自更新版本的软件')
            db.execute('PRAGMA journal_mode=WAL')
            db.executescript(Path(__file__).with_name('schema.sql').read_text(encoding='utf-8'))
            if previous_schema < 6:
                db.execute('BEGIN IMMEDIATE')
                if previous_schema:
                    changed = sorted(formats.TEXT | set(formats.plugins)) if previous_schema<5 else sorted(formats.REVISED_FORMATS)
                    marks = ','.join('?' for _ in changed)
                    db.execute(f"""UPDATE versions SET status='待解析' WHERE parent_id IS NOT NULL
                                   AND ext IN ({marks}) AND status IN ('已解析','属性对比','解析失败')""", changed)
            if previous_schema < 7:
                if not db.in_transaction:
                    db.execute('BEGIN IMMEDIATE')
                if previous_schema:
                    exts = sorted((formats.TEXT - {'.txt','.md','.sql','.log','.py','.js','.ts','.css','.html','.cfg'}) | formats.SOURCE_FORMATS)
                    marks = ','.join('?' for _ in exts)
                    db.execute(f"UPDATE versions SET status='待解析' WHERE parent_id IS NOT NULL AND ext IN ({marks}) AND status IN ('属性对比','已解析','解析失败')",exts)
                db.execute('INSERT INTO rule_changes(root_id,stamp,patterns,max_mb) SELECT id,?,patterns,max_mb FROM roots',(now(),))
                db.execute('PRAGMA user_version=7')
            if previous_schema<8:
                if not db.in_transaction:db.execute('BEGIN IMMEDIATE')
                changed=sorted(formats.ITERATION_111)
                if previous_schema:
                    marks=','.join('?' for _ in changed)
                    db.execute(f"UPDATE versions SET status='待解析' WHERE parent_id IS NOT NULL AND ext IN ({marks}) AND status IN ('属性对比','解析失败','已解析')",changed)
                db.execute('PRAGMA user_version=8')
            if previous_schema<10:
                if previous_schema:
                    changed=sorted(formats.exchange_formats.EXTENSIONS | formats.excel_diff.EXTENSIONS)
                    marks=','.join('?' for _ in changed)
                    db.execute(f"UPDATE versions SET status='待解析' WHERE parent_id IS NOT NULL AND ext IN ({marks})",changed)
            if previous_schema<11:db.execute('PRAGMA user_version=11')

    @contextlib.contextmanager
    def db(self):
        con = sqlite3.connect(self.dbfile,timeout=30)
        con.row_factory = sqlite3.Row
        con.execute('PRAGMA foreign_keys=ON')
        try:
            with con:
                yield con
        finally:
            con.close()

    @staticmethod
    def audit(db,action,note):
        db.execute('INSERT INTO audit(stamp,action,note) VALUES (?,?,?)',(now(),action,str(note)))

    def obj(self,sha):
        if len(sha)!=64 or any(c not in '0123456789abcdef' for c in sha):
            raise ValueError('版本摘要无效')
        return self.objects/sha[:2]/sha

    def capture(self,path):
        before = path.stat()
        if not stat.S_ISREG(before.st_mode):
            raise ValueError('只支持普通文件')
        fd,name = tempfile.mkstemp(dir=self.temp)
        tmp = Path(name)
        try:
            h = hashlib.sha256()
            with os.fdopen(fd,'wb') as out,open_snapshot_source(path) as src:
                opened = os.fstat(src.fileno())
                if not matches_open_file(before, opened):
                    raise FileChanging('文件正在替换')
                while block := src.read(1024*1024):
                    h.update(block)
                    out.write(block)
                if out.tell()!=before.st_size:
                    raise FileChanging('读取期间文件发生变化')
                out.flush()
                os.fsync(out.fileno())
                if signature(os.fstat(src.fileno()))!=signature(opened):
                    raise FileChanging('读取期间文件发生变化')
            if signature(path.stat())!=signature(before):
                raise FileChanging('文件写入中，将在下次扫描重试')
            sha = h.hexdigest()
            dest = self.obj(sha)
            dest.parent.mkdir(exist_ok=True)
            if not dest.exists():
                os.replace(tmp,dest)
            elif dest.stat().st_size!=before.st_size:
                raise ValueError('历史对象大小异常，请检查仓库')
            return sha,before
        finally:
            tmp.unlink(missing_ok=True)

    @staticmethod
    def _queue(db,root,source,delay):
        db.execute("""
            INSERT INTO tasks SELECT id,?,? FROM roots WHERE id=? AND active=1 AND removed=0
            ON CONFLICT(root_id) DO UPDATE SET
              due=min(tasks.due,excluded.due),
              source=CASE WHEN tasks.source='手动扫描' OR excluded.source='文件监听' THEN tasks.source ELSE excluded.source END
            WHERE excluded.due<tasks.due OR (excluded.source!='文件监听' AND excluded.source!=tasks.source)
        """,(time.time()+delay,source,root))

    def queue(self,root,source='文件监听',delay=.6):
        with self.db() as db:
            self._queue(db,root,source,delay)

    def request_scan(self,root=None):
        with self.db() as db:
            db.execute('BEGIN IMMEDIATE')
            rows=list(db.execute("""SELECT r.id,t.root_id AS queued FROM roots r
                         LEFT JOIN tasks t ON t.root_id=r.id WHERE r.active AND NOT r.removed
                         AND (? IS NULL OR r.id=?)""",(root,root)))
            if not rows:
                raise ValueError('该目录未启用或已移除' if root is not None else '没有启用的监控目录')
            merged=sum(r['queued'] is not None for r in rows)
            for r in rows:
                self._queue(db,r['id'],'手动扫描',0)
        result=f'已安排 {len(rows)} 个目录扫描'
        return result+(f'，其中 {merged} 个已合并到原队列' if merged else '')

    def configure(self,path,patterns='',max_mb=0,root_id=None):
        if not str(path).strip():
            raise ValueError('请选择目录')
        p = Path(path).expanduser().resolve(strict=True)
        if not p.is_dir() or within(p,self.home) or within(self.home,p):
            raise ValueError('请选择与版本仓库分开的目录')
        patterns = ", ".join(exclusion_patterns(patterns))
        max_mb = int(max_mb)
        if not 0<=max_mb<=1048576:
            raise ValueError('大小上限应在 0 到 1048576 MiB 之间')
        with self.lock,self.db() as db:
            previous = None
            for r in db.execute('SELECT * FROM roots'):
                other = Path(r['path'])
                if p==other and (r['removed'] or r['id']==root_id):
                    previous = r['id']
                    continue
                if not r['removed'] and (within(p,other) or within(other,p)):
                    raise ValueError('已存在相同或上下级监控目录')
            if root_id and previous!=root_id:
                raise ValueError('目录路径不能更换')
            if previous:
                db.execute('UPDATE roots SET active=CASE WHEN removed=1 THEN 1 ELSE active END,removed=0,patterns=?,max_mb=? WHERE id=?',(patterns,max_mb,previous))
                rid = previous
            else:
                rid = db.execute('INSERT INTO roots(path,patterns,max_mb) VALUES (?,?,?)',(str(p),patterns,max_mb)).lastrowid
            last=db.execute('SELECT patterns,max_mb FROM rule_changes WHERE root_id=? ORDER BY id DESC LIMIT 1',(rid,)).fetchone()
            if not last or tuple(last)!=(patterns,max_mb):
                db.execute('INSERT INTO rule_changes(root_id,stamp,patterns,max_mb) VALUES (?,?,?,?)',(rid,now(),patterns,max_mb))
            self.audit(db,'保存目录配置',p)
        self.queue(rid,'目录配置',0)
        return rid

    def root_action(self,rid,action):
        with self.lock,self.db() as db:
            r=db.execute('SELECT * FROM roots WHERE id=? AND removed=0',(rid,)).fetchone()
            if not r or action not in ('暂停','继续','移除'):
                raise ValueError('无效的目录操作')
            db.execute('UPDATE roots SET active=?,removed=? WHERE id=?',(int(action=='继续'),int(action=='移除'),rid))
            db.execute('DELETE FROM tasks WHERE root_id=?',(rid,))
            self.observations.pop(rid,None)
            db.execute('DELETE FROM waiting_files WHERE root_id=?',(rid,))
            db.execute('DELETE FROM scan_waits WHERE root_id=?',(rid,))
            self.audit(db,action+'监控',r['path'])
        if action=='继续':
            self.queue(rid,'恢复监控',0)

    def record(self,db,fid,rid,rel,kind,old=None,new=None,old_rel='',source='目录扫描'):
        db.execute('INSERT INTO events(file_id,root_id,rel,old_rel,ext,kind,old_v,new_v,stamp,source) VALUES (?,?,?,?,?,?,?,?,?,?)',
                   (fid,rid,rel,old_rel,Path(rel).suffix.lower(),kind,old,new,now(),source))

    def version(self,db,fid,rid,rel,sha,s,kind,source):
        prev=db.execute('SELECT * FROM versions WHERE file_id=? ORDER BY num DESC LIMIT 1',(fid,)).fetchone()
        ext=Path(rel).suffix.lower()
        status='待解析' if prev else '初始快照'
        if prev and ext not in formats.plugins and ext not in formats.TEXT:
            status='属性对比'
        vid=db.execute('INSERT INTO versions(file_id,num,parent_id,sha,size,ext,stamp,status) VALUES (?,?,?,?,?,?,?,?)',
                       (fid,prev['num']+1 if prev else 1,prev['id'] if prev else None,sha,s.st_size,ext,now(),status)).lastrowid
        db.execute('UPDATE files SET live=1,sha=?,mtime=?,size=?,ext=?,fkey=?,updated=? WHERE id=?',
                   (sha,s.st_mtime_ns,s.st_size,ext,self.fkey(s),now(),fid))
        self.record(db,fid,rid,rel,kind,prev['id'] if prev else None,vid,source=source)
        return vid

    @staticmethod
    def fkey(s):
        return f'{s.st_dev}:{s.st_ino}' if s.st_ino else ''

    def scan(self,rid,source='手动扫描'):
        with self.lock:
            with self.db() as db:
                run=db.execute("""INSERT INTO scan_runs(root_id,source,started,status)
                     SELECT id,?,?,'进行中' FROM roots WHERE id=? AND active AND NOT removed RETURNING id""",(source,now(),rid)).fetchone()
                if not run:return
            start=time.monotonic()
            stats=dict(candidates=0,captured=0,read_bytes=0,reused=0,waiting=0,skipped=0,skip_reasons='{}',problem='')
            state='中断'
            try:
                self._scan(rid,source,stats)
                state='有异常' if stats['problem'] else '等待保存' if stats['waiting'] else '完成'
            except (OSError,ValueError,sqlite3.Error) as exc:
                state='有异常'
                stats['problem']=type(exc).__name__
                with self.db() as db:
                    db.execute('UPDATE roots SET error=? WHERE id=?',(str(exc),rid))
            finally:
                self.progress.pop(rid,None)
                with self.db() as db:
                    db.execute("""UPDATE scan_runs SET ended=:ended,status=:status,elapsed_ms=:ms,
                           candidates=:candidates,captured=:captured,read_bytes=:read_bytes,reused=:reused,waiting=:waiting,
                           skipped=:skipped,skip_reasons=:skip_reasons,problem=:problem WHERE id=:id""",
                           dict(stats,ended=now(),status=state,ms=max(0,round((time.monotonic()-start)*1000)),id=run[0]))
                    db.execute("DELETE FROM scan_runs WHERE root_id=? AND id<=(SELECT id FROM scan_runs WHERE root_id=? ORDER BY id DESC LIMIT 1 OFFSET 200)",(rid,rid))

    def _scan(self,rid,source,stats):
        with self.db() as db:
            root=db.execute('SELECT r.*,coalesce(c.settle_ms,1500) AS settle_ms,coalesce(c.all_types,0) AS all_types FROM roots r LEFT JOIN capture_policy c ON c.root_id=r.id WHERE r.id=? AND r.active=1 AND r.removed=0',(rid,)).fetchone()
            if not root:
                return
            old={r['rel']:r for r in db.execute('SELECT * FROM files WHERE root_id=? AND live=1',(rid,))}
            pending=[r[0] for r in db.execute("SELECT rel FROM waiting_files WHERE root_id=? AND reason IN ('等待保存稳定','等待路径替换完成')",(rid,))]
        base=Path(root['path'])
        if not base.is_dir() or linklike(base):
            raise OSError('目录离线或不可访问')
        found,ignored={},set()
        errors=[]
        waiting={}
        unavailable=set()
        observed=self.observations.setdefault(rid,{})
        for rel in pending:observed.setdefault(rel,(None,0))
        active_observations=set()
        watch_scan=source in ('文件监听','保存复查')

        def settling(rel, token):
            active_observations.add(rel)
            old_token, since=observed.get(rel,(None,0))
            current=time.monotonic()
            if token!=old_token:
                observed[rel]=(token,current)
                return True
            return current-since<root['settle_ms']/1000

        patterns=exclusion_patterns(root['patterns'])
        reasons=Counter()
        pruned=set()

        def excluded(rel):
            return bool(match(rel,patterns)[0])

        def outside_scope(rel):
            return excluded(rel) or any(p.as_posix() in pruned for p in Path(rel).parents)

        self.progress[rid]=f'{source} · 正在枚举文件'
        for parent,dirs,names in os.walk(base,onerror=lambda e:errors.append(str(e))):
            parent=Path(parent)
            included_dirs=[]
            for name in dirs:
                path=parent/name
                rel=path.relative_to(base).as_posix()
                reason='链接目录' if linklike(path) else '规则排除目录' if excluded(rel) else ''
                if reason:
                    pruned.add(rel)
                    reasons[reason]+=1
                else:
                    included_dirs.append(name)
            dirs[:]=included_dirs
            for name in names:
                path=parent/name
                rel=path.relative_to(base).as_posix()
                if temporary(name):
                    reason='临时文件'
                elif excluded(rel):
                    reason='规则排除文件'
                else:
                    reason=''
                if reason:
                    reasons[reason]+=1
                    ignored.add(rel)
                    continue
                try:
                    if linklike(path):
                        pruned.add(rel)
                        ignored.add(rel)
                        reasons['链接文件']+=1
                        continue
                    s=path.stat()
                except FileNotFoundError:
                    continue
                except PermissionError:
                    unavailable.add(rel)
                    waiting[rel]='等待文件读取权限'
                    continue
                if not stat.S_ISREG(s.st_mode) or (root['max_mb'] and s.st_size>root['max_mb']*1024**2):
                    reasons['超出大小上限' if stat.S_ISREG(s.st_mode) else '非普通文件']+=1
                    ignored.add(rel)
                    continue
                found[rel]=s
        stats.update(candidates=len(found),skipped=sum(reasons.values()),skip_reasons=json.dumps(reasons,ensure_ascii=False))
        if errors:
            raise OSError('目录未完整读取：'+errors[0])
        old_keys=Counter(r['fkey'] for r in old.values())
        found_paths={}
        for rel,s in found.items():
            key=self.fkey(s)
            if key:
                found_paths.setdefault(key,[]).append(rel)
        missing,candidates={},{}
        for rel,row in old.items():
            # Excluded and unavailable paths are never evidence of deletion.
            if rel in found or rel in ignored or rel in unavailable or outside_scope(rel):
                continue
            path=base/rel
            absent=not os.path.lexists(path)
            if absent:
                missing[rel]=row
            key=row['fkey']
            matches=found_paths.get(key,())
            if old_keys[key]!=1 or len(matches)!=1 or matches[0] in old:
                continue
            new_rel=matches[0]
            if not absent:
                # A Windows lookup can still find a case-only rename by its old spelling.
                if os.name!='nt' or os.path.normcase(new_rel)!=os.path.normcase(rel):
                    continue
                try:
                    alias=path.lstat()
                except OSError:
                    continue
                if (not stat.S_ISREG(alias.st_mode) or self.fkey(alias)!=key
                    or alias.st_file_attributes & stat.FILE_ATTRIBUTE_REPARSE_POINT):
                    continue
            candidates[key]=(row, not absent)
        initially_missing=set(missing)
        full=source not in ('文件监听',)
        for i,(rel,s) in enumerate(found.items(),1):
            self.progress[rid]=f'{source} · 正在核对第 {i} / {len(found)} 个文件'
            previous=old.get(rel)
            moved,case_alias=(None,False) if previous else candidates.get(self.fkey(s),(None,False))
            unchanged=previous and s.st_size==previous['size'] and s.st_mtime_ns==previous['mtime'] and self.fkey(s)==previous['fkey']
            if (watch_scan or rel in observed) and not unchanged and (root['all_types'] or Path(rel).suffix.lower() in formats.SETTLE_EXTENSIONS) and settling(rel,signature(s)):
                waiting[rel]='等待保存稳定'
                continue
            if unchanged and not full:
                continue
            try:
                ensure_plain(base/rel,base)
                known = previous or moved
                # Coalesce pure touches and renames without writing a temporary copy.
                reuse = (known is not None and s.st_size==known['size']
                         and self.obj(known['sha']).is_file()
                         and self.obj(known['sha']).stat().st_size==s.st_size
                         and digest(base/rel)==known['sha']
                         and signature((base/rel).stat())==signature(s))
                if reuse:stats['reused']+=1
                if unchanged and reuse:
                    continue
                if reuse:
                    sha = known['sha']
                else:
                    sha,s = self.capture(base/rel)
                    stats['captured']+=1
                    stats['read_bytes']+=s.st_size
                with self.db() as db:
                    # A verified case alias still names the same file after a content edit.
                    if moved and (case_alias or moved['sha']==sha) and moved['fkey']==self.fkey(s):
                        previous=moved
                        old_rel=moved['rel']
                        missing.pop(old_rel,None)
                        old.pop(old_rel)
                        db.execute('UPDATE files SET rel=?,ext=?,tracked=1,updated=? WHERE id=?',(rel,Path(rel).suffix.lower(),now(),moved['id']))
                        latest=db.execute('SELECT max(id) FROM versions WHERE file_id=?',(moved['id'],)).fetchone()[0]
                        kind='重命名' if Path(rel).parent==Path(old_rel).parent else '移动'
                        self.record(db,moved['id'],rid,rel,kind,latest,latest,old_rel,source)
                    if not previous:
                        fid=db.execute('INSERT INTO files(root_id,rel,fkey,size,mtime,sha,ext,updated) VALUES (?,?,?,?,?,?,?,?)',
                                       (rid,rel,self.fkey(s),s.st_size,s.st_mtime_ns,sha,Path(rel).suffix.lower(),now())).lastrowid
                        self.version(db,fid,rid,rel,sha,s,'新增' if root['last_scan'] else '初始建档',source)
                    elif sha!=previous['sha']:
                        self.version(db,previous['id'],rid,rel,sha,s,'内容修改',source)
                    elif s.st_mtime_ns!=previous['mtime'] or self.fkey(s)!=previous['fkey']:
                        latest=db.execute('SELECT max(id) FROM versions WHERE file_id=?',(previous['id'],)).fetchone()[0]
                        db.execute('UPDATE files SET mtime=?,fkey=?,updated=? WHERE id=?',(s.st_mtime_ns,self.fkey(s),now(),previous['id']))
                        self.record(db,previous['id'],rid,rel,'属性修改',latest,latest,source=source)
            except (OSError,ValueError) as exc:
                # Windows sharing violations are also classified as PermissionError.
                if getattr(exc,'winerror',None) in (32,33):
                    waiting[rel]='等待文件解除占用'
                elif isinstance(exc,PermissionError):
                    waiting[rel]='等待文件可读'
                elif isinstance(exc,(FileChanging,FileNotFoundError)):
                    waiting[rel]='等待保存稳定'
                else:
                    errors.append(f'{rel}：{exc}')
        # An unavailable root must not turn every entry into a deletion.
        if not base.is_dir():
            raise OSError('扫描期间目录离线')
        with self.db() as db:
            excluded_ids=[(r['id'],) for rel,r in old.items() if rel not in found and rel not in initially_missing and rel not in unavailable]
            db.executemany('UPDATE files SET tracked=0 WHERE id=?',excluded_ids)
            db.executemany('UPDATE files SET tracked=1 WHERE id=?',[(old[k]['id'],) for k in found if k in old and not old[k]['tracked']])
            for rel,r in missing.items():
                if os.path.lexists(base/rel):
                    continue
                if (watch_scan or rel in observed) and settling(rel,'missing'):
                    waiting[rel]='等待路径替换完成'
                    continue
                db.execute('UPDATE files SET live=0,updated=? WHERE id=?',(now(),r['id']))
                latest=db.execute('SELECT max(id) FROM versions WHERE file_id=?',(r['id'],)).fetchone()[0]
                self.record(db,r['id'],rid,rel,'删除',latest,None,source=source)
            for rel in set(observed)-active_observations:
                del observed[rel]
            stamp=now()
            if waiting:
                previous_waits={r[0] for r in db.execute('SELECT rel FROM waiting_files WHERE root_id=?',(rid,))}
                db.executemany('DELETE FROM waiting_files WHERE root_id=? AND rel=?',((rid,k) for k in previous_waits-waiting.keys()))
                db.executemany("""INSERT INTO waiting_files VALUES (?,?,?,?,?,1) ON CONFLICT(root_id,rel) DO UPDATE SET
                    reason=excluded.reason,last_seen=excluded.last_seen,attempts=waiting_files.attempts+1""",
                    ((rid,k,reason,stamp,stamp) for k,reason in waiting.items()))
            else:
                db.execute('DELETE FROM waiting_files WHERE root_id=?',(rid,))
            stats.update(waiting=len(waiting),problem='文件读取异常' if errors else '')
            if waiting:
                prev=db.execute('SELECT delay FROM scan_waits WHERE root_id=?',(rid,)).fetchone()
                delay=max(1,(root['settle_ms']+999)//1000) if any('稳定' in reason or '替换' in reason for reason in waiting.values()) else min(60,2*prev[0] if prev else 2)
                db.execute('INSERT OR REPLACE INTO scan_waits VALUES (?,?,?,?)',
                           (rid,len(waiting),json.dumps(list(waiting.items())[:10],ensure_ascii=False),delay))
                self._queue(db,rid,'保存复查',delay)
            else:
                db.execute('DELETE FROM scan_waits WHERE root_id=?',(rid,))
            db.execute('UPDATE roots SET last_scan=?,error=?,skipped=? WHERE id=?',(now(),'；'.join(errors[:3]),sum(reasons.values()),rid))
            db.execute('INSERT OR REPLACE INTO scan_skips(root_id,counts) VALUES (?,?)',(rid,json.dumps(reasons,ensure_ascii=False)))

    def parse_one(self):
        with self.db() as db:
            v=db.execute("SELECT n.*,p.sha AS prior FROM versions n JOIN versions p ON n.parent_id=p.id WHERE n.status='待解析' ORDER BY n.id LIMIT 1").fetchone()
        if not v:
            return False
        error=''
        try:
            status,details=formats.compare(self.obj(v['prior']),self.obj(v['sha']),v['ext'])
        except Exception as exc:
            status,details,error='解析失败',[],str(exc)
        with self.db() as db:
            db.execute('UPDATE versions SET status=?,details=?,error=? WHERE id=?',(status,json.dumps(details,ensure_ascii=False),error,v['id']))
        return True

    def checked_version(self,db,vid):
        v=db.execute('SELECT id,file_id,num,size,sha FROM versions WHERE id=?',(vid,)).fetchone()
        if not v:raise ValueError('历史版本不存在或校验未通过')
        obj=self.obj(v['sha'])
        ensure_plain(obj,self.home)
        if not obj.is_file() or obj.stat().st_size!=v['size'] or digest(obj)!=v['sha']:
            raise ValueError('历史版本不存在或校验未通过')
        return v

    def restore_target(self,db,file_id):
        f=db.execute('SELECT f.*,r.path,r.removed FROM files f JOIN roots r ON r.id=f.root_id WHERE f.id=?',(file_id,)).fetchone()
        base=Path(f['path'])
        if f['removed'] or not base.is_dir():
            raise ValueError('请先重新接入原目录')
        target=base/f['rel']
        ensure_plain(target,base)
        other=db.execute('SELECT id FROM files WHERE root_id=? AND rel=? AND live=1 AND id!=?',(f['root_id'],f['rel'],f['id'])).fetchone()
        if other or (not f['live'] and os.path.lexists(target)):
            raise ValueError('原路径已出现同名文件，请另存历史副本')
        if target.exists() and not target.is_file():
            raise ValueError('原路径不是普通文件，请另存历史副本')
        return f,target

    @staticmethod
    def preview_key(vid,target,state,sha):
        payload=json.dumps([vid,str(target),state,sha],ensure_ascii=False,separators=(',',':')).encode()
        return hashlib.sha256(payload).hexdigest()

    def restore_info(self,vid):
        with self.lock,self.db() as db:
            v=self.checked_version(db,vid)
            f,target=self.restore_target(db,v['file_id'])
            last=db.execute('SELECT num FROM versions WHERE file_id=? ORDER BY num DESC LIMIT 1',(f['id'],)).fetchone()[0]
            sha=None;state=None;size=None
            if target.exists():
                before=target.stat()
                sha=digest(target)
                state=signature(before);size=before.st_size
                if state!=signature(target.stat()):
                    raise ValueError('预览期间文件发生变化，请重新预览')
            return dict(path=str(target),exists=state is not None,version=v['num'],size=v['size'],
                        sha=v['sha'],current_sha=sha,current_size=size,latest=last,
                        identical=sha==v['sha'],unrecorded=sha is not None and sha!=f['sha'],
                        delta=v['size']-(size or 0),preview=self.preview_key(v['id'],target,state,sha))

    def restore(self,vid,preview=None):
        with self.lock,self.db() as db:
            v=self.checked_version(db,vid)
            f,target=self.restore_target(db,v['file_id'])
            base=Path(f['path'])
            with protect_overwrite(target):
                original=None;sha=None
                if preview is not None:
                    before=target.stat() if target.exists() else None
                    state=signature(before) if before else None
                    current=digest(target) if before else None
                    if self.preview_key(v['id'],target,state,current)!=preview or (before and signature(target.stat())!=state):
                        raise ValueError('原路径或文件内容已变化，请重新预览后恢复')
                    if current==v['sha']==f['sha']:return '内容已经一致，无需恢复'
                if target.exists():
                    if not f['live']:
                        raise ValueError('原路径已出现同名文件，请另存历史副本')
                    sha,s=self.capture(target)
                    original=signature(s)
                if preview is not None and preview!=self.preview_key(v['id'],target,original,sha):
                    raise ValueError('原路径或文件内容已变化，请重新预览后恢复')
                if preview is not None and sha==v['sha'] and sha==f['sha']:
                    return '内容已经一致，无需恢复'
                target.parent.mkdir(parents=True,exist_ok=True)
                if original and (sha!=f['sha'] or not f['live']):
                    self.version(db,f['id'],f['root_id'],f['rel'],sha,s,'恢复前快照','用户恢复')
                intent=db.execute('INSERT INTO restores(file_id,version_id,prior_sha,stamp) VALUES (?,?,?,?)',
                                  (f['id'],vid,sha if original else None,now())).lastrowid
                db.commit()
                published=False
                tmp=None
                try:
                    fd,name=tempfile.mkstemp(prefix='.fileguard-',dir=target.parent)
                    os.close(fd)
                    tmp=Path(name)
                    shutil.copyfile(self.obj(v['sha']),tmp)
                    with tmp.open('rb+') as out:
                        out.flush()
                        os.fsync(out.fileno())
                    if digest(tmp)!=v['sha']:
                        raise ValueError('临时副本校验失败')
                    ensure_plain(target,base)
                    if original:
                        if signature(target.stat())!=original:
                            raise ValueError('文件已变化，请重试')
                        replace_guarded_file(tmp,target)
                    else:
                        if os.name=='nt':
                            os.rename(tmp,target)
                        else:
                            os.link(tmp,target)
                    published=True
                    if digest(target)!=v['sha']:
                        raise ValueError('写回校验失败，已保留历史版本')
                    self.version(db,f['id'],f['root_id'],f['rel'],v['sha'],target.stat(),'历史恢复','用户恢复')
                    db.execute('DELETE FROM restores WHERE id=?',(intent,))
                    self.audit(db,'恢复历史版本',f"{target} · 来源 V{v['num']}")
                except Exception:
                    if not published:
                        db.execute('DELETE FROM restores WHERE id=?',(intent,))
                        self.audit(db,'恢复未写回',target)
                        db.commit()
                    raise
                finally:
                    if tmp is not None:
                        tmp.unlink(missing_ok=True)
        return '恢复完成，已校验并建立新版本'

    def recover_intents(self):
        with self.lock:
            with self.db() as db:
                pending=[row[0] for row in db.execute('SELECT id FROM restores ORDER BY id')]
            for intent in pending:
                try:
                    with self.db() as db:
                        self.reconcile_restore(db,intent)
                except (OSError,ValueError):
                    # A busy, unstable or inaccessible path can be checked again later.
                    continue
            with self.db() as db:
                return db.execute('SELECT count(*) FROM restores').fetchone()[0]

    def reconcile_restore(self,db,intent):
        item=db.execute("""SELECT i.prior_sha,i.version_id,f.*,r.path,r.removed
                           FROM restores i JOIN files f ON f.id=i.file_id
                           JOIN roots r ON r.id=f.root_id WHERE i.id=?""",(intent,)).fetchone()
        if not item:
            return
        base=Path(item['path'])
        target=base/item['rel']
        other=db.execute('SELECT id FROM files WHERE root_id=? AND rel=? AND live AND id!=?',
                         (item['root_id'],item['rel'],item['id'])).fetchone()
        if item['removed'] or other:
            self.audit(db,'恢复核对终止',f'{target} · 目录已移除或路径已由另一文件使用')
        else:
            if not base.is_dir():
                return
            ensure_plain(target,base)
            try:
                before=target.stat()
            except FileNotFoundError:
                before=None
            sha=db.execute('SELECT sha FROM versions WHERE id=?',(item['version_id'],)).fetchone()[0]
            if before is None or not stat.S_ISREG(before.st_mode):
                self.audit(db,'恢复中断',target)
            else:
                observed=digest(target)
                after=target.stat()
                if signature(before)!=signature(after):
                    return
                if observed!=sha:
                    self.audit(db,'恢复中断',target)
                elif item['prior_sha']==sha:
                    self.audit(db,'恢复内容一致',f'{target} · 写回前后摘要相同，无法确认写回')
                else:
                    self.version(db,item['id'],item['root_id'],item['rel'],sha,after,'历史恢复','恢复任务核对')
                    self.audit(db,'核对恢复结果',target)
        db.execute('DELETE FROM restores WHERE id=?',(intent,))

    def export_copy(self,vid,target):
        dest=Path(target).resolve()
        with self.db() as db:
            v=self.checked_version(db,vid)
            if within(dest,self.home):
                raise ValueError('请在仓库之外另存副本')
            with new_path(dest) as tmp:
                with self.obj(v['sha']).open('rb') as src,tmp.open('wb') as out:
                    shutil.copyfileobj(src,out)
                if digest(tmp)!=v['sha']:
                    raise ValueError('导出副本校验失败')
            self.audit(db,'另存历史副本',dest)
        return str(dest)

    def verify(self):
        with self.lock,self.db() as db:
            if db.execute('PRAGMA integrity_check').fetchone()[0]!='ok':
                raise ValueError('数据库完整性检查失败')
            count=0
            for sha, in db.execute('SELECT DISTINCT sha FROM versions'):
                if digest(self.obj(sha))!=sha:
                    raise ValueError('对象校验失败：'+sha)
                count+=1
            msg=f'数据库与 {count} 个历史对象通过校验'
            self.audit(db,'完整性校验',msg)
            return msg

    def backup(self,dest,authorize=None):
        dst=Path(dest).resolve()
        if within(dst,self.home):
            raise ValueError('请将备份保存在仓库外')
        with self.lock,self.db() as db,tempfile.TemporaryDirectory(dir=self.temp) as scratch:
            for r in db.execute('SELECT path FROM roots WHERE removed=0'):
                if within(dst,Path(r[0])):
                    raise ValueError('备份应保存到监控目录外')
            snap=Path(scratch)/'fileguard.db'
            with contextlib.closing(sqlite3.connect(snap)) as out:
                db.backup(out)
                if out.execute('SELECT 1 FROM record_admin').fetchone():
                    if authorize is None:raise ValueError('完整备份需要管理口令')
                    authorize(out)
            fd,name=tempfile.mkstemp(dir=dst.parent)
            os.close(fd)
            tmp=Path(name)
            try:
                with zipfile.ZipFile(tmp,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=1) as archive:
                    archive.write(snap,'fileguard.db')
                    with contextlib.closing(sqlite3.connect(snap)) as check:
                        objects=size=0
                        for sha,minimum,expected in check.execute('SELECT sha,min(size),max(size) FROM versions GROUP BY sha'):
                            if minimum!=expected:raise ValueError('同一摘要的索引长度冲突')

                            obj=self.obj(sha)
                            ensure_plain(obj,self.home)
                            h=hashlib.sha256()
                            written=0
                            with obj.open('rb') as src,archive.open(obj.relative_to(self.home).as_posix(),'w',force_zip64=True) as out:
                                while block:=src.read(1048576):
                                    h.update(block);out.write(block);written+=len(block)
                            if h.hexdigest()!=sha or written!=expected:raise ValueError('仓库对象校验失败')
                            size+=written;objects+=1
                        manifest=dict(format=1,created=now(),database_sha256=digest(snap),
                            schema=check.execute('PRAGMA user_version').fetchone()[0],objects=objects,bytes=size,
                            versions=check.execute('SELECT count(*) FROM versions').fetchone()[0])
                        archive.writestr(MANIFEST,json.dumps(manifest,ensure_ascii=False))
                if os.name=='nt':
                    os.rename(tmp,dst)
                else:
                    os.link(tmp,dst)
            finally:
                tmp.unlink(missing_ok=True)
            self.audit(db,'创建数据备份',dst)
        return str(dst)

