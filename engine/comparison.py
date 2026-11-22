"""一次版本比较的查询与 CSV 导出。分页与导出共享同一筛选结果。"""
from contextlib import contextmanager
import csv
import os
from pathlib import Path
import tempfile

from .word_diff import highlight

FIELDS = ('sheet','location','record_key','field','old','new')
HEADER = ('文件','旧版本','新版本','分组','位置','记录编号','变化','旧值','新值')


EXCEL_HEADER = ('字段','差异类别','旧类型','新类型')


def page_integer(args, key, default):
    value = args.get(key, default)
    if type(value) is str:
        raw = value.strip()
        digits = raw[1:] if raw[:1] in ('+', '-') else raw
        if not digits or any(char < '0' or char > '9' for char in digits):
            raise ValueError('分页条件无效')
        return int(raw)
    if type(value) is int:
        return value
    raise ValueError('分页条件无效')


class Comparison:
    def __init__(self, details, **metadata):
        self.details = details
        self.metadata = dict(metadata,
                             categories=list(dict.fromkeys(r['category'] for r in details if r.get('category'))),
                             fields=list(dict.fromkeys(r['field'] for r in details if r.get('field'))),
                             sheets=list(dict.fromkeys(r['sheet'] for r in details)),
                             aligned={r['sheet']:r['key_header'] for r in details if 'key_header' in r})
        self._last_selection = None

    def select(self, args):
        sheet = args.get('sheet','')
        kind = args.get('kind','')
        case=bool(args.get('case_sensitive'))
        exact=bool(args.get('exact'))
        scope=args.get('search_in','')
        columns={'':FIELDS,'old':('old',),'new':('new',),'location':('location',)}[scope]
        query=args.get('q','').strip()
        if not case:
            query=query.casefold()
        field=args.get('field','')
        record=args.get('record','').strip()
        def matches(value):
            text=str(value) if case else str(value).casefold()
            return text==query if exact else query in text
        category=args.get('category','')
        key = (sheet,kind,query,category,scope,case,exact,field,record)
        cached = self._last_selection
        if cached is not None and cached[0] == key:
            return cached[1],cached[2]
        counts = {'新增':0,'修改':0,'删除':0}
        selected = []
        for row in self.details:
            if sheet and row['sheet'] != sheet:
                continue
            if category and row.get('category')!=category:
                continue
            if field and row.get('field')!=field or record and row.get('record_key')!=record:
                continue
            if query and not any(matches(row[k]) for k in columns if row.get(k) is not None):
                continue
            counts[row['kind']] += 1
            if not kind or row['kind'] == kind:
                selected.append(row)
        self._last_selection = (key,counts,selected)
        return counts,selected

    def page(self,args):
        counts,selected = self.select(args)
        size = min(100,max(1,page_integer(args,'size',40)))
        page = max(1,page_integer(args,'page',1))
        page=min(page,max(1,(len(selected)+size-1)//size))
        items=selected[(page-1)*size:page*size]
        if self.metadata.get('is_word'):
            items=[highlight(row) for row in items]
        return dict(self.metadata,counts=counts,items=items,
                    total=len(selected),page=page,size=size)


def csv_cell(value):
    # Preserve potentially executable spreadsheet expressions as literal text.
    if isinstance(value,str) and (value.startswith(('\r','\n','\t')) or value.lstrip().startswith(('=','+','-','@'))):
        return "'"+value
    return value


@contextmanager
def new_csv(destination):
    """只在写完后公开目标，不覆盖已有文件。"""
    dst=Path(destination)
    fd,name=tempfile.mkstemp(prefix='.fileguard-export-',dir=dst.parent)
    tmp=Path(name)
    try:
        with os.fdopen(fd,'w',encoding='utf-8-sig',newline='') as out:
            yield csv.writer(out)
            out.flush()
            os.fsync(out.fileno())
        if os.name=='nt':
            os.rename(tmp,dst)
        else:
            os.link(tmp,dst)
    finally:
        tmp.unlink(missing_ok=True)
