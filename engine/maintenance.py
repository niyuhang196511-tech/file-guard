"""持有工作区锁后离线还原。每个历史对象均按数据库摘要校验。"""
from contextlib import contextmanager
from .backup_check import validate
import datetime
import os
from pathlib import Path
import tempfile


@contextmanager
def workspace_lock(home):
    folder=Path(home).resolve()
    folder.parent.mkdir(parents=True,exist_ok=True)
    guard=folder.parent/('.'+folder.name+'.fileguard.lock')
    with guard.open('a+b') as stream:
        if guard.stat().st_size==0:
            stream.write(b'0')
            stream.flush()
        stream.seek(0)
        try:
            if os.name=='nt':
                import msvcrt
                msvcrt.locking(stream.fileno(),msvcrt.LK_NBLCK,1)
            else:
                import fcntl
                fcntl.flock(stream,fcntl.LOCK_EX|fcntl.LOCK_NB)
        except OSError as exc:
            raise ValueError('当前仓库正在被使用，请从托盘退出程序后再试') from exc
        try:
            yield
        finally:
            stream.seek(0)
            if os.name=='nt':
                msvcrt.locking(stream.fileno(),msvcrt.LK_UNLCK,1)
            else:
                fcntl.flock(stream,fcntl.LOCK_UN)


def restore_backup(archive_path,home):
    home=Path(home).resolve()
    with workspace_lock(home),tempfile.TemporaryDirectory(dir=home.parent) as scratch:
        stage=Path(scratch)/'Data'
        stage.mkdir()
        validate(archive_path,stage,True)
        retained=home.with_name(home.name+'-还原前-'+datetime.datetime.now().strftime('%Y%m%d-%H%M%S-%f'))
        if home.exists():
            home.rename(retained)
        try:
            stage.rename(home)
        except BaseException:
            if retained.exists():
                retained.rename(home)
            raise
        return str(retained) if retained.exists() else ''

