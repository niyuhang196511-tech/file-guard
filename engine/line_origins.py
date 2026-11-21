"""从指定文本快照向前逐版映射当前仍存在的物理行。"""
from collections import Counter, defaultdict
from difflib import SequenceMatcher
from pathlib import Path

from .comparison import csv_cell, new_csv
from .store import within
from .text_history import EXTENSIONS, snapshot

FILE_BYTES = 512 * 1024
TOTAL_BYTES = 8 * 1024**2
MAX_LINES = 2500
COMPARE_BUDGET = 8_000_000
DEPTHS = (5, 10, 20, 40)
SIZES = (20, 50, 100)
WIDTH = 360
KINDS = ('', 'target', 'earlier', 'initial', 'unknown', 'moved')
COLUMNS = ('文件登记路径','目标版本','目标保存时间','目标行号','判断',
           '来源或最早可见版本','来源保存时间','来源行号','已识别移位次数','原文')


def number(args, key, default=0):
    value = args.get(key, default)
    if type(value) is not int or not 0 <= value <= 2**53-1:
        raise ValueError('无效的数字条件：'+key)
    return value


def toggle(args, key):
    value = args.get(key, False)
    if type(value) is not bool:
        raise ValueError('无效的开关条件：'+key)
    return value


def parameters(args):
    opts = {key:number(args,key,default) for key,default in (
        ('id',0),('depth',20),('page',1),('size',50),('low',0),('high',0),('origin',0),
    )}
    opts.update({key:toggle(args,key) for key in ('moves','exact','sensitive')})
    query, kind = args.get('q',''), args.get('kind','')
    if not isinstance(query,str) or len(query)>160 or any(c in query for c in '\r\n\0'):
        raise ValueError('正文筛选最多 160 字，须为单行')
    if kind not in KINDS:
        raise ValueError('无效的来源筛选')
    if opts['depth'] not in DEPTHS or opts['size'] not in SIZES:
        raise ValueError('无效的追溯深度或每页行数')
    if opts['high'] and opts['low']>opts['high']:
        raise ValueError('起始行须小于或等于结束行')
    opts.update(q=query,kind=kind)
    return opts


def version(db, vid):
    return db.execute("""SELECT v.id,v.file_id,v.num,v.parent_id,v.sha,v.size,v.ext,v.stamp,
                          f.rel,r.path AS root FROM versions v JOIN files f ON f.id=v.file_id
                          JOIN roots r ON r.id=f.root_id WHERE v.id=?""",(vid,)).fetchone()


def info(row):
    return {k:row[k] for k in ('id','num','parent_id','stamp','ext')}


def lines_of(store, row):
    if row['ext'] not in EXTENSIONS:
        return None, '', '不支持的历史文件格式'
    if not 0 <= row['size'] <= FILE_BYTES:
        return None, '', '历史文本超过 512 KiB'
    decoded, error = snapshot(store,row)
    if error:
        return None, '', error
    text, encoding = decoded
    text = text.replace('\r\n','\n').replace('\r','\n')
    lines = text.removesuffix('\n').split('\n',MAX_LINES) if text else []
    if len(lines)>MAX_LINES:
        return None, '', '历史文本超过 2500 行'
    return lines, encoding, ''


def alignment(older, newer, budget, moves):
    """优先保留前后共同部分，再匹配中间的连续等值区域。"""
    start = 0
    shared = min(len(older),len(newer))
    while start<shared and older[start]==newer[start]:
        start += 1
    tail = 0
    while tail<shared-start and older[-1-tail]==newer[-1-tail]:
        tail += 1
    old_end,new_end = len(older)-tail,len(newer)-tail
    cost = (old_end-start)*(new_end-start)
    if cost>budget:
        return None, None, budget
    pairs = {i:i for i in range(start)}
    pairs.update((new_end+i,old_end+i) for i in range(tail))
    left,right = older[start:old_end],newer[start:new_end]
    for x,y,length in SequenceMatcher(None,left,right,autojunk=False).get_matching_blocks():
        pairs.update((start+y+i,start+x+i) for i in range(length))
    moved = set()
    if moves:
        old_counts,new_counts = Counter(older),Counter(newer)
        used = set(pairs.values())
        candidates = {text:i for i,text in enumerate(older) if old_counts[text]==1 and i not in used and text.strip()}
        for i,text in enumerate(newer):
            if i not in pairs and new_counts[text]==1 and text in candidates:
                pairs[i]=candidates[text]
                moved.add(i)
    return pairs,moved,budget-cost


def trace(db, store, opts):
    db.execute('BEGIN')
    target = version(db,opts['id'])
    if not target:
        raise ValueError('目标版本不存在')
    original,encoding,error = lines_of(store,target)
    if error:
        raise ValueError('无法追溯目标版本：'+error)
    rows = [dict(line=i+1,text=text,moves=0) for i,text in enumerate(original)]
    active = dict(enumerate(rows))
    chain = [info(target)]
    current,lines = target,original
    used,budget = target['size'],COMPARE_BUDGET
    boundary = dict(reason='目标版本为空',num=target['num'])
    while active:
        parent = current['parent_id']
        if parent is None and current['num']==1:
            boundary = dict(reason='已到首次建档',num=current['num'])
            for index,row in active.items():
                row.update(kind='initial',origin=info(current),source_line=index+1)
            active = {}
            break
        if len(chain)>=opts['depth']:
            boundary = dict(reason='达到所选追溯深度',num=current['num'])
            break
        previous = version(db,parent)
        if not previous or previous['file_id']!=target['file_id'] or previous['num']!=current['num']-1:
            boundary = dict(reason='版本链缺失或不连续',num=current['num'])
            break
        if (previous['sha'],previous['size'])==(current['sha'],current['size']) and previous['ext'] in EXTENSIONS:
            # 已核验同一对象，逻辑行完全相同。
            older,pairs,moved = lines,dict(enumerate(range(len(lines)))),set()
        else:
            if 0 <= previous['size'] <= FILE_BYTES and used+previous['size']>TOTAL_BYTES:
                boundary = dict(reason='达到累计读取上限',num=previous['num'])
                break
            older,_,error = lines_of(store,previous)
            if error:
                boundary = dict(reason=error,num=previous['num'])
                break
            used += previous['size']
            pairs,moved,budget = alignment(older,lines,budget,opts['moves'])
            if pairs is None:
                boundary = dict(reason='达到逐行比较上限',num=previous['num'])
                break
        following = {}
        for index,row in active.items():
            if index in pairs:
                row['moves'] += index in moved
                following[pairs[index]]=row
            else:
                row.update(kind='introduced',origin=info(current),source_line=index+1)
        active = following
        current,lines = previous,older
        chain.append(info(current))
        if not active:
            boundary = dict(reason='已定位全部目标行',num=current['num'])
    for index,row in active.items():
        row.update(kind='unknown',origin=info(current),source_line=index+1)
    return dict(target={**info(target),'file_id':target['file_id'],'rel':target['rel'],'root':target['root'],
                        'sha':target['sha'],'size':target['size'],'encoding':encoding},
                rows=rows,chain=chain,boundary=boundary)


def select(report, opts):
    counts = Counter(row['kind'] for row in report['rows'])
    counts['moved'] = sum(bool(r['moves']) for r in report['rows'])
    sources = defaultdict(lambda:dict(lines=0,unknown=0,moved=0))
    target = report['target']['id']
    selected = []
    needle = opts['q'] if opts['sensitive'] else opts['q'].casefold()
    for row in report['rows']:
        origin = row['origin']
        stats = sources[origin['id']]
        stats['lines'] += 1
        stats['unknown'] += row['kind']=='unknown'
        stats['moved'] += row['moves']>0
        if opts['origin'] and origin['id']!=opts['origin']:
            continue
        if (opts['low'] and row['line']<opts['low']) or (opts['high'] and row['line']>opts['high']):
            continue
        checks = {'target':row['kind']=='introduced' and origin['id']==target,
                  'earlier':row['kind']!='unknown' and origin['id']!=target,
                  'initial':row['kind']=='initial','unknown':row['kind']=='unknown','moved':row['moves']>0}
        if opts['kind'] and not checks[opts['kind']]:
            continue
        if needle:
            content = row['text'] if opts['sensitive'] else row['text'].casefold()
            if (content!=needle if opts['exact'] else needle not in content):
                continue
        selected.append(row)
    summary = [dict(v,**sources[v['id']]) for v in report['chain'] if v['id'] in sources]
    return counts,summary,selected


def label(row):
    return {'initial':'首次建档可见','unknown':'来源未确认','introduced':'此保存中出现'}[row['kind']]


def csv_values(report, row):
    target,origin = report['target'],row['origin']
    return (target['rel'],target['num'],target['stamp'],row['line'],label(row),origin['num'],
            origin['stamp'],row['source_line'],row['moves'],row['text'])


def query(db, store, args, export=False):
    opts = parameters(args)
    report = trace(db,store,opts)
    counts,sources,selected = select(report,opts)
    if export:
        raw = args.get('path')
        if not isinstance(raw,str) or not raw or '\0' in raw:
            raise ValueError('请选择仓库外的新 CSV 文件')
        path = Path(raw)
        dest = path.parent.resolve()/path.name
        if within(dest,store.home) or dest.suffix.lower()!='.csv':
            raise ValueError('请选择仓库外的新 CSV 文件')
        if not selected:
            raise ValueError('当前条件没有可导出的行')
        db.commit()
        with new_csv(dest) as out:
            out.writerow(COLUMNS)
            for row in selected:
                out.writerow(map(csv_cell,csv_values(report,row)))
        store.audit(db,'导出逐行来源',f"V{report['target']['num']} · {len(selected)} 行")
        return str(dest)
    pages = max(1,(len(selected)+opts['size']-1)//opts['size'])
    page = min(pages,max(1,opts['page']))
    start = (page-1)*opts['size']
    items = [dict(row,text=row['text'][:WIDTH],truncated=len(row['text'])>WIDTH)
             for row in selected[start:start+opts['size']]]
    return dict(target=report['target'],chain=report['chain'],boundary=report['boundary'],
                counts=counts,sources=sources,lines=len(report['rows']),items=items,total=len(selected),
                page=page,pages=pages,size=opts['size'])
