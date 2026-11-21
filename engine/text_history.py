"""按批检索仓库中的纯文本历史快照。"""
from collections import Counter
from datetime import date, timedelta
import hashlib
import os
from pathlib import Path
import re
import stat

from . import formats
from .comparison import csv_cell, new_csv
from .file_properties import decode_text_bytes
from .shared_read import open_snapshot_source
from .store import ensure_plain, within

EXTENSIONS = formats.TEXT | formats.SOURCE_FORMATS | {
    '.csv', '.tsv', '.json', '.jsonl', '.xml', '.yaml', '.yml', '.eml',
}
FILE_BYTES = 2 * 1024**2
BATCH_BYTES = 8 * 1024**2
BATCH_VERSIONS = 64
BATCH_RESULTS = 12
MATCH_PREVIEWS = 6
PREVIEW_CHARS = 320
CONTEXT_ROWS = (0, 1, 2)
SKIPS = ('超过大小上限', '副本缺失或不可读', '副本校验失败', '文本编码无法读取')
SCOPE_FILTERS = {
    'live': 'f.live AND f.tracked AND NOT r.removed',
    'history': 'NOT (f.live AND f.tracked AND NOT r.removed)',
    'deleted': 'NOT f.live',
    'removed': 'f.live AND r.removed',
    'excluded': 'f.live AND NOT r.removed AND NOT f.tracked',
}
CSV_HEADER = (
    '目录', '文件路径', '历史后缀', '文件状态', '版本', '保存时间', '文本编码',
    '匹配行数', '行号', '起始列', '行片段', '向前截断', '向后截断',
)


def number(args, key, maximum=2**53 - 1):
    value = args.get(key, 0)
    if isinstance(value, str) and re.fullmatch(r'[0-9]{1,16}', value):
        value = int(value)
    if type(value) is not int or not 0 <= value <= maximum:
        raise ValueError('无效的数字条件：' + key)
    return value


def options(args):
    a = {key: args.get(key, '') for key in ('q', 'filename', 'ext', 'start', 'end', 'scope')}
    if any(not isinstance(value, str) or len(value) > 512 or '\0' in value for value in a.values()):
        raise ValueError('每个文本条件最多 512 字，不能含空字符')
    if not a['q'].strip() or len(a['q']) > 160 or any(c in a['q'] for c in '\r\n'):
        raise ValueError('请输入 1 至 160 字的单行检索内容')
    a['filename'] = a['filename'].strip().replace('\\', '/').casefold()
    a['ext'] = {'.' + part.casefold().lstrip('.') for part in re.split(r'[,，;；\s]+', a['ext']) if part}
    if a['ext'] - EXTENSIONS:
        raise ValueError('扩展名中含有不支持的文本格式')
    if a['scope'] and a['scope'] not in SCOPE_FILTERS:
        raise ValueError('无效的文件范围')
    for key in ('start', 'end'):
        if a[key]:
            try:
                if date.fromisoformat(a[key]).isoformat() != a[key]:
                    raise ValueError
            except ValueError:
                raise ValueError('请选择有效的起止日期') from None
    if a['start'] and a['end'] and a['start'] > a['end']:
        raise ValueError('开始日期须早于或等于结束日期')
    for key in ('latest', 'starred', 'exact', 'sensitive', 'skip_initial'):
        a[key] = args.get(key, key == 'latest')
        if type(a[key]) is not bool:
            raise ValueError('无效的开关条件：' + key)
    a.update({key: number(args, key) for key in ('root', 'file', 'cap', 'before')})
    a['context'] = number(args, 'context', max(CONTEXT_ROWS))
    if a['before'] and (not a['cap'] or a['before'] > a['cap']):
        raise ValueError('继续位置无效，请重新检索')
    return a


def candidates(db, a, cap):
    db.create_function('fg_text_fold', 1, str.casefold, deterministic=True)
    exts = sorted(a['ext'] or EXTENSIONS)
    clauses = ['v.id<=?', 'v.ext IN (' + ','.join('?' for _ in exts) + ')']
    params = [cap, *exts]
    if a['before']:
        clauses.append('v.id<?')
        params.append(a['before'])
    for key, field in (('root', 'r.id'), ('file', 'f.id')):
        if a[key]:
            clauses.append(field + '=?')
            params.append(a[key])
    if a['filename']:
        clauses.append('instr(fg_text_fold(f.rel),?)>0')
        params.append(a['filename'])
    if a['start']:
        clauses.append('v.stamp>=?')
        params.append(a['start'])
    if a['end'] and a['end'] != date.max.isoformat():
        clauses.append('v.stamp<?')
        params.append((date.fromisoformat(a['end']) + timedelta(days=1)).isoformat())
    if a['scope']:
        clauses.append(SCOPE_FILTERS[a['scope']])
    if a['skip_initial']:
        clauses.append('v.parent_id IS NOT NULL')
    if a['starred']:
        clauses.append('EXISTS(SELECT 1 FROM file_stars s WHERE s.file_id=f.id)')
    if a['latest']:
        clauses.append('v.id=(SELECT x.id FROM versions x WHERE x.file_id=f.id AND x.id<=? ORDER BY x.num DESC LIMIT 1)')
        params.append(cap)
    return db.execute(
        """SELECT v.id,v.file_id,v.num,v.parent_id,v.stamp,v.ext,v.sha,v.size,
                  f.rel,r.id AS root_id,r.path AS root,
                  CASE WHEN NOT f.live THEN '已删除'
                       WHEN r.removed THEN '目录已移除'
                       WHEN NOT f.tracked THEN '规则已排除'
                       WHEN NOT r.active THEN '目录已暂停'
                       ELSE '当前在册' END AS state
           FROM versions v JOIN files f ON f.id=v.file_id JOIN roots r ON r.id=f.root_id
           WHERE """ + ' AND '.join(clauses) + ' ORDER BY v.id DESC LIMIT ?',
        (*params, BATCH_VERSIONS + 1),
    ).fetchall()


def snapshot_bytes(store, version):
    try:
        path = store.obj(version['sha'])
    except ValueError:
        return None, SKIPS[2]
    try:
        ensure_plain(path, store.objects)
        info = path.stat()
        if not stat.S_ISREG(info.st_mode):
            return None, SKIPS[1]
        if info.st_size != version['size']:
            return None, SKIPS[2]
        with open_snapshot_source(path) as stream:
            opened=os.fstat(stream.fileno())
            if not stat.S_ISREG(opened.st_mode):
                return None, SKIPS[1]
            if opened.st_size!=version['size']:
                return None, SKIPS[2]
            raw = stream.read(version['size'] + 1)
    except (OSError, ValueError):
        return None, SKIPS[1]
    if len(raw) != version['size'] or hashlib.sha256(raw).hexdigest() != version['sha']:
        return None, SKIPS[2]
    return raw, None


def snapshot(store, version):
    raw, error = snapshot_bytes(store, version)
    if error:
        return None, error
    try:
        return decode_text_bytes(raw), None
    except ValueError:
        return None, SKIPS[3]


def original_span(line, start, end):
    """将 Unicode 折叠后的位置映射回可显示的原文。"""
    offset = 0
    first = None
    for index, char in enumerate(line):
        offset += len(char.casefold())
        if first is None and offset > start:
            first = index
        if offset >= end:
            return first, index + 1
    return start, end


def excerpt(line, number, span=None):
    start, end = span or (0, 0)
    left = max(0, min(start - 64, len(line) - PREVIEW_CHARS))
    right = left + PREVIEW_CHARS
    return dict(line=number, column=start + 1 if span else None,
                prefix=line[left:start] if span else '',
                match=line[start:min(end, right)] if span else '',
                suffix=line[end:right] if span else line[:right],
                head=left > 0, tail=len(line) > right)


def find_lines(text, a):
    normalized = text.replace('\r\n', '\n').replace('\r', '\n')
    lines = normalized.removesuffix('\n').split('\n')
    needle = a['q'] if a['sensitive'] else a['q'].casefold()
    previews = []
    count = 0
    for index, line in enumerate(lines):
        value = line if a['sensitive'] else line.casefold()
        start = (0 if value == needle else -1) if a['exact'] else value.find(needle)
        if start < 0:
            continue
        count += 1
        if len(previews) >= MATCH_PREVIEWS:
            continue
        end = start + len(needle)
        span = (start, end) if a['sensitive'] or line.isascii() else original_span(line, start, end)
        block = [excerpt(lines[i], i + 1, span if i == index else None)
                 for i in range(max(0, index - a['context']), min(len(lines), index + a['context'] + 1))]
        previews.append(dict(line=index + 1, rows=block))
    return count, previews


def search(db, store, args):
    a = options(args)
    cap = a['cap'] or db.execute('SELECT coalesce(max(id),0) FROM versions').fetchone()[0]
    rows = candidates(db, a, cap)
    items = []
    skips = Counter()
    checked = read_bytes = processed = 0
    for version in rows:
        size = version['size']
        if (processed == BATCH_VERSIONS or len(items) == BATCH_RESULTS or
                0 <= size <= FILE_BYTES and read_bytes + size > BATCH_BYTES):
            break
        processed += 1
        if not 0 <= size <= FILE_BYTES:
            skips[SKIPS[0]] += 1
            continue
        read_bytes += size
        decoded, problem = snapshot(store, version)
        if problem:
            skips[problem] += 1
            continue
        checked += 1
        text, encoding = decoded
        count, previews = find_lines(text, a)
        if count:
            item = dict(version)
            del item['sha']
            items.append(dict(item, encoding=encoding, matches=count, previews=previews))
    return dict(items=items, checked=checked, skipped=dict(skips), scanned=processed,
                cap=cap, next=rows[processed - 1]['id'] if processed < len(rows) else None)


def export(db, store, args):
    requested = Path(args['path'])
    dest = requested.parent.resolve() / requested.name
    if within(dest, store.home) or dest.suffix.lower() != '.csv':
        raise ValueError('请选择仓库外的新 CSV 文件')
    result = search(db, store, args)
    if not result['items']:
        raise ValueError('此批没有可导出的命中')
    with new_csv(dest) as writer:
        writer.writerow(CSV_HEADER)
        for item in result['items']:
            for hit in item['previews']:
                row = next(r for r in hit['rows'] if r['column'] is not None)
                cells = (item['root'], item['rel'], item['ext'], item['state'],
                         item['num'], item['stamp'], item['encoding'], item['matches'], row['line'], row['column'],
                         row['prefix'] + row['match'] + row['suffix'],
                         '是' if row['head'] else '', '是' if row['tail'] else '')
                writer.writerow([csv_cell(cell) for cell in cells])
    store.audit(db, '导出历史正文命中', f'{len(result["items"])} 个版本')
    return str(dest)
