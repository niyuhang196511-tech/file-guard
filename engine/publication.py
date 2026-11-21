"""将完整产物在同一文件系统内发布为新文件。"""
from contextlib import contextmanager
import os
from pathlib import Path
import tempfile


@contextmanager
def new_path(destination):
    dest=Path(destination)
    if os.path.lexists(dest):
        raise FileExistsError('目标已存在，请选择新文件：'+str(dest))
    fd,name=tempfile.mkstemp(prefix='.fileguard-export-',dir=dest.parent)
    os.close(fd)
    tmp=Path(name)
    try:
        yield tmp
        with tmp.open('rb+') as stream:
            os.fsync(stream.fileno())
        if os.name=='nt':os.rename(tmp,dest)
        else:os.link(tmp,dest)
    finally:
        tmp.unlink(missing_ok=True)
