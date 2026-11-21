"""每个目录保留最近 200 次扫描运行，不保存文件名或差异正文。"""
from collections import Counter
from datetime import date
import json
from pathlib import Path
from .comparison import csv_cell, new_csv
from .store import within

STATES=('进行中','完成','等待保存','有异常','中断')
COLUMNS={'started':'开始','ended':'结束','status':'结果','source':'触发来源','elapsed_ms':'耗时毫秒',
         'candidates':'候选数','captured':'快照读取数','read_bytes':'快照读取字节','reused':'内容复用数',
         'waiting':'等待数','skipped':'跳过数','problem':'异常类别'}
DETAIL_COLUMNS = {'id': '扫描编号', 'skip_reasons': '跳过原因明细'}
TOTALS = ('candidates', 'captured', 'read_bytes', 'reused', 'waiting', 'skipped')
RUN_ORDERS = {
    'recent': lambda r: -r['id'],
    'oldest': lambda r: r['id'],
    'slowest': lambda r: (not r['ended'], -r['elapsed_ms'] if r['ended'] else 0, -r['id']),
    'waiting': lambda r: (-r['waiting'], -r['id']),
}


def _text(args, key):
    value = args.get(key, '')
    if not isinstance(value, str):
        raise ValueError(f'无效的文本条件：{key}')
    return value


def _integer(args, key, default=None):
    value = args.get(key, default)
    if type(value) not in (int, str):
        raise ValueError(f'无效的整数条件：{key}')
    try:
        number = int(value)
    except ValueError as exc:
        raise ValueError(f'无效的整数条件：{key}') from exc
    if not -(2**63) <= number < 2**63:
        raise ValueError(f'无效的整数条件：{key}')
    return number


def _flag(args, key):
    value = args.get(key, False)
    if type(value) is not bool:
        raise ValueError(f'无效的开关：{key}')
    return value


def _date(args, key):
    value = _text(args, key)
    if value:
        try:
            parsed = date.fromisoformat(value)
        except ValueError as exc:
            raise ValueError(f'日期须为有效的 YYYY-MM-DD：{key}') from exc
        if parsed.isoformat() != value:
            raise ValueError(f'日期须为有效的 YYYY-MM-DD：{key}')
    return value


def _skip_reasons(raw):
    try:
        counts = json.loads(raw)
    except (ValueError, TypeError, RecursionError):
        return {}
    if not isinstance(counts, dict):
        return {}
    return {key: count for key, count in counts.items() if key and type(count) is int and count > 0}


def _run_summary(rows, durations):
    skips = Counter()
    for row in rows:
        skips.update(row['skip_reasons'])
    count = len(durations)
    # Nearest rank uses a one-based rank and keeps each percentile on a recorded run.
    return {
        **{key: sum(row[key] for row in rows) for key in TOTALS},
        'finished': count,
        'p50': durations[(count * 50 + 99) // 100 - 1] if count else 0,
        'p95': durations[(count * 95 + 99) // 100 - 1] if count else 0,
        'states': dict(Counter(row['status'] for row in rows)),
        'skip_reasons': dict(skips),
        'problems': dict(Counter(row['problem'] for row in rows if row['problem'])),
    }


def query(db,store,args,export=False):
    root = _integer(args, 'root')
    state, source = (_text(args, key) for key in ('state', 'source'))
    problem, skip_reason = (_text(args, key) for key in ('problem', 'skip_reason'))
    start, end = (_date(args, key) for key in ('start', 'end'))
    skips, waiting, detail = (_flag(args, key) for key in ('skips', 'waiting', 'detail'))
    sort = _text(args, 'sort') if 'sort' in args else 'recent'
    size = _integer(args, 'size', 20)
    requested_page = _integer(args, 'page', 1)
    if state and state not in STATES:
        raise ValueError('无效的扫描状态')
    if start and end and start > end:
        raise ValueError('开始日期须早于或等于结束日期')
    if sort not in RUN_ORDERS:
        raise ValueError('无效的扫描顺序')
    if size not in (20, 50, 100):
        raise ValueError('无效的每页扫描条数')

    db.execute('BEGIN')
    runs = [dict(row) for row in db.execute('SELECT * FROM scan_runs WHERE root_id=?', (root,))]
    selected = []
    for row in runs:
        row['skip_reasons'] = _skip_reasons(row.get('skip_reasons'))
        day = row['started'][:10]
        if ((not state or row['status'] == state) and (not source or row['source'] == source)
                and (not problem or row['problem'] == problem)
                and (not skip_reason or skip_reason in row['skip_reasons'])
                and (not start or day >= start) and (not end or day <= end)
                and (not skips or row['skipped'] > 0) and (not waiting or row['waiting'] > 0)):
            selected.append(row)
    selected.sort(key=RUN_ORDERS[sort])

    if export:
        dest = Path(args['path']).resolve()
        if within(dest, store.home):
            raise ValueError('请在仓库外保存')
        columns = COLUMNS | DETAIL_COLUMNS if detail else COLUMNS
        with new_csv(dest) as writer:
            writer.writerow(columns.values())
            for row in selected:
                if detail:
                    row = dict(row, skip_reasons=json.dumps(row['skip_reasons'], ensure_ascii=False, sort_keys=True))
                writer.writerow([csv_cell(row[key]) for key in columns])
        db.commit()
        store.audit(db, '导出扫描运行记录', f'目录 #{root}')
        return str(dest)

    total = len(selected)
    pages = max(1, (total + size - 1) // size)
    page = max(1, min(pages, requested_page))
    durations = sorted(row['elapsed_ms'] for row in selected if row['ended'])
    return dict(items=selected[(page-1)*size:page*size], total=total, pages=pages, page=page, size=size,
                sources=sorted({row['source'] for row in runs}),
                average=round(sum(durations)/len(durations)) if durations else 0,
                longest=durations[-1] if durations else 0,
                facets=dict(problems=sorted({row['problem'] for row in runs if row['problem']}),
                            skip_reasons=sorted({reason for row in runs for reason in row['skip_reasons']})),
                summary=_run_summary(selected, durations))


def set_policy(db,store,args):
    window=int(args.get('settle_ms',1500))
    if window not in (500,1500,3000,5000,10000):raise ValueError('无效的稳定等待时长')
    all_types=int(bool(args.get('all_types')))
    rid=int(args['root'])
    with store.lock:
        db.execute('BEGIN IMMEDIATE')
        if not db.execute('SELECT 1 FROM roots WHERE id=? AND NOT removed',(rid,)).fetchone():raise ValueError('目录已移除')
        prior=db.execute('SELECT settle_ms,all_types FROM capture_policy WHERE root_id=?',(rid,)).fetchone()
        if (tuple(prior) if prior else (1500,0))!=(window,all_types):
            db.execute('INSERT OR REPLACE INTO capture_policy VALUES(?,?,?)',(rid,window,all_types))
            store.audit(db,'设置文件稳定等待',f"目录 #{rid} · {window} ms · "+('所有文件' if all_types else '指定格式'))
    return '已保存监听采集策略'


def waits(db,args):
    root = _integer(args, 'root')
    q = _text(args, 'q').strip().replace('\\', '/')
    reason = _text(args, 'reason')
    sort = _text(args, 'sort')
    requested_page = _integer(args, 'page', 1)
    orders = {'': 'first_seen,rel', 'attempts': 'attempts DESC,first_seen,rel',
              'path': 'rel COLLATE NOCASE,rel', 'recent': 'last_seen DESC,rel'}
    if sort not in orders:
        raise ValueError('无效的等待队列排序')
    db.execute('BEGIN')
    sql = ' FROM waiting_files WHERE root_id=?'
    params = [root]
    if q:
        sql += ' AND instr(lower(rel),lower(?))>0'
        params.append(q)
    counts = dict(db.execute('SELECT reason,count(*)'+sql+' GROUP BY reason ORDER BY reason', params))
    total = counts.get(reason, 0) if reason else sum(counts.values())
    if reason:
        sql += ' AND reason=?'
        params.append(reason)
    pages = max(1, (total + 24) // 25)
    page = max(1, min(pages, requested_page))
    rows = [dict(row) for row in db.execute('SELECT *'+sql+' ORDER BY '+orders[sort]+' LIMIT 25 OFFSET ?',
                                           params+[(page-1)*25])]
    reasons = [row[0] for row in db.execute('SELECT DISTINCT reason FROM waiting_files WHERE root_id=? ORDER BY reason', (root,))]
    return dict(items=rows,total=total,pages=pages,page=page,reasons=reasons,counts=counts)
