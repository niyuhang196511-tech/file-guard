"""目录排除规则和只读路径预演共用的判定。"""
import fnmatch
from pathlib import PurePosixPath, PureWindowsPath
import re


def exclusion_patterns(text):
    parts = re.split(r'[,，;；、\r\n]+', text)
    return list(dict.fromkeys(p.strip().replace('\\','/') for p in parts if p.strip()))


def match(rel, patterns):
    if patterns:
        path = PurePosixPath(rel)
        for part in (path, *path.parents):
            if part == PurePosixPath('.'):
                break
            for pattern in patterns:
                if fnmatch.fnmatch(part.name, pattern) or fnmatch.fnmatch(part.as_posix(), pattern):
                    return pattern, part.as_posix()
    return '', ''


def temporary(name):
    return name.startswith(('~$', '.fileguard-')) or (name.startswith('.~lock.') and name.endswith('#'))


def preview(args):
    paths = args.get('paths','').splitlines()
    if not 1 <= len(paths) <= 100:
        raise ValueError('每次可预演 1 至 100 行相对路径')
    patterns = exclusion_patterns(args.get('patterns',''))
    maximum = int(args.get('max_mb') or 0)
    size = args.get('bytes')
    size = None if size in ('', None) else int(size)
    if not 0 <= maximum <= 1048576 or (size is not None and size < 0):
        raise ValueError('请检查文件大小与规则上限')
    rows = []
    for raw in paths:
        rel = raw.strip().replace('\\','/')
        if not rel:
            continue
        path = PurePosixPath(rel)
        if PureWindowsPath(rel).anchor or '..' in path.parts or not path.parts:
            raise ValueError('请输入目录内相对路径：'+rel)
        rel = path.as_posix()
        # A pruned ancestor wins before any filename test during enumeration.
        parents = list(path.parents)[:-1]
        pattern, part = ('','')
        for parent in reversed(parents):
            pattern, part = match(parent.as_posix(), patterns)
            if pattern:
                break
        if pattern:
            reason = '规则排除目录'
        elif temporary(path.name):
            reason = '临时文件'
        else:
            pattern, part = match(rel,patterns)
            if pattern:
                reason = '规则排除文件'
            elif maximum and size is None:
                reason = '待核对大小'
            elif maximum and size > maximum * 1024**2:
                reason = '超出大小上限'
            else:
                reason = '允许采集'
        rows.append(dict(rel=rel,reason=reason,pattern=pattern,part=part))
    if not rows:
        raise ValueError('请输入至少一个文件路径')
    return rows
