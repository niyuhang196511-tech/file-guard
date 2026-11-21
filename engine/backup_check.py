"""核查备份与提取待恢复仓库共用同一套检查。"""
from contextlib import closing,nullcontext
import hashlib
import json
from pathlib import Path
import sqlite3
import tempfile
import zipfile

MANIFEST='fileguard-backup.json'
CORE={'roots','files','versions','events','settings','tasks','audit','restores'}
V6={'version_reviews','file_stars','record_admin','event_edits'}


def validate(path,scratch,materialize,reference=None):
    target=Path(scratch)/'fileguard.db'
    with zipfile.ZipFile(path) as archive:
        names=archive.namelist()
        if len(names)!=len(set(names)):raise ValueError('备份包含重复条目')
        if 'fileguard.db' not in names:raise ValueError('缺少备份数据库')
        manifest={}
        if MANIFEST in names:
            if archive.getinfo(MANIFEST).file_size>16384:raise ValueError('备份清单异常')
            manifest=json.loads(archive.read(MANIFEST))
            if not isinstance(manifest,dict) or manifest.get('format')!=1:raise ValueError('备份清单版本不兼容')
        h=hashlib.sha256()
        with archive.open('fileguard.db') as src,target.open('xb') as out:
            while block:=src.read(1048576):
                out.write(block);h.update(block)
        if manifest and h.hexdigest()!=manifest.get('database_sha256'):raise ValueError('备份数据库摘要不匹配')
        with closing(sqlite3.connect(target)) as db:
            db.execute('PRAGMA trusted_schema=OFF')
            schema=db.execute('PRAGMA user_version').fetchone()[0]
            if schema not in range(1,12) or db.execute('PRAGMA integrity_check').fetchone()[0]!='ok' or db.execute('PRAGMA foreign_key_check').fetchone():
                raise ValueError('备份数据库校验失败或版本不兼容')
            tables={r[0] for r in db.execute("SELECT name FROM sqlite_master WHERE type='table'")}
            if schema>=11 and 'ledger_templates' not in tables:raise ValueError('对账模板表缺失')
            if schema>=9 and not {'health_reports','health_findings'}<=tables:raise ValueError('仓库体检表缺失')
            if schema>=8 and not {'scan_runs','finder_presets','capture_policy','waiting_files'}<=tables:raise ValueError('扫描记录或检索条件表缺失')
            if not (CORE|(V6 if schema>=6 else set())|({'rule_changes','checkpoints','checkpoint_files'} if schema>=7 else set()))<=tables:raise ValueError('备份数据表不完整')
            versions=db.execute('SELECT count(*) FROM versions').fetchone()[0]
            checks=dict(shared=0,only_backup=0,only_backup_bytes=0)
            objects=0;size=0
            missing=dict(reference) if reference is not None else {}
            declared={'fileguard.db',MANIFEST}
            for sha,lo,hi in db.execute('SELECT sha,min(size),max(size) FROM versions GROUP BY sha'):
                if not isinstance(sha,str) or len(sha)!=64 or any(c not in '0123456789abcdef' for c in sha):
                    raise ValueError('备份对象索引异常')
                rel=f'objects/{sha[:2]}/{sha}'
                declared.add(rel)
                if rel not in archive.NameToInfo:raise ValueError('备份缺少对象：'+sha)
                if lo!=hi or archive.getinfo(rel).file_size!=hi:raise ValueError('备份对象长度不匹配：'+sha)
                dest=Path(scratch)/rel
                if materialize:dest.parent.mkdir(exist_ok=True,parents=True)
                h=hashlib.sha256()
                with archive.open(rel) as src,(dest.open('xb') if materialize else nullcontext(None)) as out:
                    while block:=src.read(1048576):
                        h.update(block)
                        if out is not None:out.write(block)
                if h.hexdigest()!=sha:raise ValueError('备份对象摘要不匹配：'+sha)
                size+=hi;objects+=1
                if reference is not None:
                    if sha in missing:
                        missing.pop(sha)
                        checks['shared']+=1
                    else:
                        checks['only_backup']+=1;checks['only_backup_bytes']+=hi
            if manifest and (manifest.get('objects'),manifest.get('bytes'),manifest.get('versions'),manifest.get('schema'))!=(objects,size,versions,schema):
                raise ValueError('备份清单与数据库统计不一致')
            stats=db.execute('SELECT coalesce(sum(size),0),min(stamp),max(stamp) FROM versions').fetchone()
            coverage=None
            if reference is not None:
                coverage=dict(checks,missing=len(missing),missing_bytes=sum(v[0] for v in missing.values()),
                              affected_versions=sum(v[1] for v in missing.values()))
            return dict(schema=schema,versions=versions,objects=objects,bytes=size,created=manifest.get('created',''),
                        manifest=bool(manifest),logical=stats[0],saved=stats[0]-size,oldest=stats[1],latest=stats[2],
                        roots=db.execute('SELECT count(*) FROM roots').fetchone()[0],
                        files=db.execute('SELECT count(*) FROM files').fetchone()[0],
                        pending_restores=db.execute('SELECT count(*) FROM restores').fetchone()[0],
                        coverage=coverage,extra_entries=sum(n not in declared for n in names))


def inspect(path,live=None):
    reference={r[0]:(r[1],r[2]) for r in live.execute('SELECT sha,max(size),count(*) FROM versions GROUP BY sha')} if live is not None else None
    with tempfile.TemporaryDirectory() as scratch:
        return validate(path,scratch,False,reference)
