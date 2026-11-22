"""持有工作区锁后离线还原。每个历史对象均按数据库摘要校验。"""
from contextlib import contextmanager
from .backup_check import validate
from .publication import new_path
import datetime
import os
from pathlib import Path
import re
import tempfile


@contextmanager
def _exclusive_lock(guard, busy):
    guard.parent.mkdir(parents=True,exist_ok=True)
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
            raise ValueError(busy) from exc
        try:
            yield
        finally:
            stream.seek(0)
            if os.name=='nt':
                msvcrt.locking(stream.fileno(),msvcrt.LK_UNLCK,1)
            else:
                fcntl.flock(stream,fcntl.LOCK_UN)


def _restore_marker(home):
    return home.with_name('.'+home.name+'.fileguard-restore')


def _retained_path(home, stamp):
    return home.with_name(home.name+'-还原前-'+stamp)


def _recover_restore(home):
    marker=_restore_marker(home)
    try:
        stamp=marker.read_text(encoding='utf-8')
    except FileNotFoundError:
        return
    if not re.fullmatch(r'[0-9]{8}-[0-9]{6}-[0-9]{6}',stamp):
        raise ValueError('离线还原记录无效，请先核对仓库目录')
    if not home.exists():
        retained=_retained_path(home,stamp)
        if not retained.is_dir():
            raise ValueError('离线还原中断，找不到还原前的仓库目录')
        retained.rename(home)
    elif not home.is_dir():
        raise ValueError('离线还原记录未完成，仓库路径不是目录')
    marker.unlink()


@contextmanager
def restore_lock(home):
    """Exclude offline replacement while the separate admin command uses the repository."""
    folder=Path(home).resolve()
    guard=folder.with_name('.'+folder.name+'.fileguard-restore.lock')
    with _exclusive_lock(guard,'仓库正在还原或配置管理口令，请完成后再试'):
        _recover_restore(folder)
        yield


@contextmanager
def workspace_lock(home):
    folder=Path(home).resolve()
    guard=folder.with_name('.'+folder.name+'.fileguard.lock')
    with _exclusive_lock(guard,'当前仓库正在被使用，请从托盘退出程序后再试'):
        if _restore_marker(folder).exists():
            with restore_lock(folder):
                pass
        yield


def restore_backup(archive_path,home):
    home=Path(home).resolve()
    with workspace_lock(home),restore_lock(home),tempfile.TemporaryDirectory(dir=home.parent) as scratch:
        stage=Path(scratch)/'Data'
        stage.mkdir()
        validate(archive_path,stage,True)
        if not home.exists():
            stage.rename(home)
            return ''
        stamp=datetime.datetime.now().strftime('%Y%m%d-%H%M%S-%f')
        retained=_retained_path(home,stamp)
        if os.path.lexists(retained):
            raise FileExistsError('还原前的仓库目录已存在，请重试')
        marker=_restore_marker(home)
        with new_path(marker) as staged:
            staged.write_text(stamp,encoding='utf-8')
        try:
            home.rename(retained)
            stage.rename(home)
        except BaseException:
            _recover_restore(home)
            raise
        marker.unlink()
        return str(retained)

