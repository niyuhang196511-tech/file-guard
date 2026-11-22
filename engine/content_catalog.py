"""按已保存字节的 SHA-256 汇总引用与存储用量。"""
from datetime import date, timedelta
from pathlib import Path
import re

from . import health
from .comparison import csv_cell, new_csv
from .store import now, within

PAGE_SIZES = (10, 25, 50)
EXPORT_LIMIT = 100_000
VERIFY_LIMIT = 256 * 1024**2
VALID_SHA = "length(v.sha)=64 AND v.sha NOT GLOB '*[^0-9a-f]*'"
STATE = """CASE WHEN NOT f.live THEN '已删除' WHEN r.removed THEN '目录已移除'
                  WHEN NOT f.tracked THEN '规则已排除' WHEN NOT r.active THEN '目录已暂停'
                  ELSE '当前在册' END"""
LATEST = 'v.num=(SELECT max(x.num) FROM versions x WHERE x.file_id=f.id)'
BASE = ' FROM versions v JOIN files f ON f.id=v.file_id JOIN roots r ON r.id=f.root_id'
GROUP_MODES = {
    'cross': 'files>1',
    'repeat': 'versions>files',
    'shared': 'versions>1',
    'all': '1',
}
GROUP_ORDER = {
    'saved': 'saved DESC,versions DESC,sha',
    'versions': 'versions DESC,files DESC,sha',
    'files': 'files DESC,versions DESC,sha',
    'bytes': 'size DESC,sha',
    'recent': 'last_epoch DESC,sha',
}
REF_ORDER = {
    'recent': 'unixepoch(v.stamp) DESC,v.id DESC',
    'oldest': 'unixepoch(v.stamp),v.id',
    'path': 'fg_catalog_fold(f.rel),v.file_id,v.num DESC,v.id DESC',
}
STATES = ('当前在册', '目录已暂停', '规则已排除', '目录已移除', '已删除')
GROUP_FIELDS = ('sha', 'size', 'versions', 'files', 'roots', 'formats', 'latest',
                'first_stamp', 'last_stamp', 'logical', 'saved', 'conflict')
GROUP_HEADER = ('SHA-256', '正文大小（字节）', '版本引用', '文件身份', '监控目录', '历史后缀种类', '最新版引用',
                '最早保存', '最近保存', '引用字节合计', '复用字节', '长度冲突')
REF_FIELDS = ('sha', 'root', 'rel', 'ext', 'num', 'stamp', 'size', 'state', 'latest', 'status')
REF_HEADER = ('SHA-256', '监控目录', '最近登记路径', '历史后缀', '版本号', '保存时间', '版本字节', '文件状态', '是否最新版', '解析状态')


def string(args, key, default=''):
    raw = args.get(key, default)
    if not isinstance(raw, str) or len(raw) > 512 or '\0' in raw:
        raise ValueError('无效的查询条件：' + key)
    return raw.strip()


def integer(args, key, default=0, maximum=2**53 - 1):
    raw = args.get(key, default)
    if isinstance(raw, str) and re.fullmatch(r'[0-9]{1,16}', raw):
        raw = int(raw)
    if type(raw) is not int or not 0 <= raw <= maximum:
        raise ValueError('无效的数字条件：' + key)
    return raw


def flag(args, key, default=False):
    value = args.get(key, default)
    if type(value) is not bool:
        raise ValueError('无效的开关条件：' + key)
    return value


def day(args, key):
    raw = string(args, key)
    if not raw:
        return None
    try:
        result = date.fromisoformat(raw)
        if result.isoformat() == raw:
            return result
    except ValueError:
        pass
    raise ValueError('请选择有效的起止日期')


def digest_filter(args, exact=False):
    sha = string(args, 'sha').lower()
    low = 64 if exact else 6
    if not sha and not exact:
        return sha
    if not re.fullmatch(r'[0-9a-f]{%d,64}' % low, sha):
        raise ValueError('请选择完整的 SHA-256' if exact else 'SHA-256 前缀须包含 6 至 64 个十六进制字符')
    return sha


def references_sql(db, args, exact):
    terms, params = [VALID_SHA], []
    db.create_function('fg_catalog_fold', 1, str.casefold, deterministic=True)
    sha = digest_filter(args, exact)
    if sha:
        if len(sha) == 64:
            terms.append('v.sha=?')
            params.append(sha)
        else:
            terms.append('v.sha>=? AND v.sha<?')
            params.extend((sha, sha+'g'))
    root = integer(args, 'root')
    if root:
        terms.append('r.id=?')
        params.append(root)
    keyword = string(args, 'q').casefold().replace('\\', '/')
    if keyword:
        terms.append('instr(fg_catalog_fold(f.rel),?)>0')
        params.append(keyword)
    exts = sorted({'.'+s.lower().lstrip('.') for s in re.split(r'[,，;；\s]+', string(args, 'ext')) if s.lstrip('.')})
    if len(exts) > 32:
        raise ValueError('一次最多筛选 32 种历史后缀')
    if exts:
        terms.append('v.ext IN ('+','.join('?' for _ in exts)+')')
        params.extend(exts)
    state = string(args, 'state')
    if state:
        if state not in STATES:
            raise ValueError('无效的文件状态')
        terms.append('('+STATE+')=?')
        params.append(state)
    if flag(args, 'latest'):
        terms.append(LATEST)
    if flag(args, 'starred'):
        terms.append('EXISTS(SELECT 1 FROM file_stars s WHERE s.file_id=f.id)')
    if not flag(args, 'empty', exact):
        terms.append('v.size<>0')
    low = None if args.get('minimum', '') == '' else integer(args, 'minimum')
    high = None if args.get('maximum', '') == '' else integer(args, 'maximum')
    if low is not None and high is not None and low > high:
        raise ValueError('最小字节数须小于或等于最大字节数')
    for limit, operator in ((low, '>='), (high, '<=')):
        if limit is not None:
            terms.append('v.size'+operator+'?')
            params.append(limit)
    start, end = day(args, 'start'), day(args, 'end')
    if start and end and start > end:
        raise ValueError('开始日期须早于或等于结束日期')
    if start:
        terms.append('v.stamp>=?')
        params.append(start.isoformat())
    if end and end != date.max:
        terms.append('v.stamp<?')
        params.append((end+timedelta(days=1)).isoformat())
    return BASE+' WHERE '+' AND '.join(terms), params


def groups_sql(source):
    filtered = "SELECT v.id AS vid,v.sha,v.size,v.file_id,r.id AS root_id,v.ext,v.stamp,"+LATEST+" AS latest"+source
    return """WITH filtered AS ("""+filtered+"""), grouped AS (
        SELECT sha, min(size) low, max(size) high,
               count(*) versions, count(DISTINCT file_id) files, count(DISTINCT root_id) roots,
               count(DISTINCT ext) formats, sum(latest) latest,
               (SELECT stamp FROM filtered first WHERE first.sha=filtered.sha
                  ORDER BY unixepoch(first.stamp),first.vid LIMIT 1) first_stamp,
               (SELECT stamp FROM filtered last WHERE last.sha=filtered.sha
                  ORDER BY unixepoch(last.stamp) DESC,last.vid DESC LIMIT 1) last_stamp,
               min(unixepoch(stamp)) first_epoch,max(unixepoch(stamp)) last_epoch
        FROM filtered GROUP BY sha
    ), catalog AS (
        SELECT *, low<>high OR low<0 AS conflict,
               CASE WHEN low=high AND low>=0 THEN low END size,
               CASE WHEN low=high AND low>=0 THEN low*versions END logical,
               CASE WHEN low=high AND low>=0 THEN low*(versions-1) END saved
        FROM grouped
    ) """


def catalog(db, store, cmd, args):
    refs = cmd in ('content_refs', 'content_refs_csv')
    export = cmd.endswith('_csv')
    db.execute('BEGIN')
    source, params = references_sql(db, args, refs)
    order_key = string(args, 'sort', 'recent' if refs else 'saved')
    order = (REF_ORDER if refs else GROUP_ORDER).get(order_key)
    if order is None:
        raise ValueError('无效的排序方式')
    if refs:
        if not db.execute('SELECT 1 FROM versions WHERE sha=? LIMIT 1',(digest_filter(args, True),)).fetchone():
            raise ValueError('没有引用该摘要的版本')
        values = ['v.id','v.file_id','v.parent_id','v.sha','v.num','v.ext','v.stamp','v.size','v.status',
                  'f.rel','r.path AS root','r.id AS root_id',STATE+' AS state',LATEST+' AS latest']
        select = 'SELECT '+','.join(values)+source
        total = db.execute('SELECT count(*)'+source,params).fetchone()[0]
        summary = {}
    else:
        mode = GROUP_MODES.get(string(args, 'mode', 'cross'))
        if mode is None:
            raise ValueError('无效的正文分组方式')
        cte = groups_sql(source)
        select = cte+'SELECT '+','.join(GROUP_FIELDS)+' FROM catalog WHERE '+mode
        summary = dict(db.execute(cte+"""SELECT count(*) AS total,coalesce(sum(versions),0) AS versions,
              coalesce(sum(size),0) AS unique_bytes,coalesce(sum(logical),0) AS logical,
              coalesce(sum(saved),0) AS saved,coalesce(sum(conflict),0) AS conflicts
              FROM catalog WHERE """+mode,params).fetchone())
        total = summary['total']
    select += ' ORDER BY '+order
    if export:
        return export_rows(db, store, args, refs, select, params, total)
    size = integer(args, 'size', 25)
    if size not in PAGE_SIZES:
        raise ValueError('每页可显示 10、25 或 50 项')
    pages = max(1, (total+size-1)//size)
    page = min(pages, max(1, integer(args, 'page', 1)))
    items = [dict(row) for row in db.execute(select+' LIMIT ? OFFSET ?', (*params,size,(page-1)*size))]
    return dict(items=items, total=total, page=page, pages=pages, size=size, summary=summary)


def export_rows(db, store, args, refs, select, params, total):
    raw = args.get('path')
    if not isinstance(raw, str) or not raw or '\0' in raw:
        raise ValueError('请选择仓库外的新 CSV 文件')
    path = Path(raw)
    dest = path.parent.resolve()/path.name
    if within(dest, store.home) or dest.suffix.lower() != '.csv':
        raise ValueError('请选择仓库外的新 CSV 文件')
    if not total or total > EXPORT_LIMIT:
        raise ValueError('当前范围没有可导出的结果' if not total else '导出超过 10 万行，请缩小筛选范围')
    fields, header = (REF_FIELDS, REF_HEADER) if refs else (GROUP_FIELDS, GROUP_HEADER)
    marker = 'latest' if refs else 'conflict'
    with new_csv(dest) as writer:
        writer.writerow(header)
        for row in db.execute(select, params):
            writer.writerow([('是' if row[key] else '否') if key == marker else csv_cell(row[key]) for key in fields])
    db.commit()
    store.audit(db, '导出正文引用明细' if refs else '导出相同正文分组', f'{total} 行')
    return str(dest)


def verify(db, store, args):
    sha = digest_filter(args, True)
    low, high, refs = db.execute('SELECT min(size),max(size),count(*) FROM versions WHERE sha=?',(sha,)).fetchone()
    if not refs:
        raise ValueError('没有引用该摘要的版本')
    if low == high and low > VERIFY_LIMIT:
        status, actual = '超过单对象校验上限', None
    else:
        status, actual = health.assess(store,sha,low,high)
    return dict(sha=sha, status=status, expected=low if low==high else None, actual=actual, checked=now())
