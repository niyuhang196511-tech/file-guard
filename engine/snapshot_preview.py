"""校验指定历史对象后分页查看文本原文或原始字节。"""
from bisect import bisect_left
from pathlib import Path
import re

from .comparison import csv_cell,new_csv
from .file_properties import decode_text_bytes
from .store import within
from .text_history import EXTENSIONS,original_span,snapshot_bytes

MAX_BYTES=2*1024**2
MAX_LINES=200_000
MAX_CSV=10_000
SIZES=(20,50,100)
WIDTHS=(16,32)
SCREEN=360
TEXT_HEADER=('文件登记路径','版本','行号','匹配起始列','换行','原文')
HEX_HEADER=('文件登记路径','版本','起始字节偏移','结束字节偏移','匹配字节偏移','十六进制','ASCII')
LINE=re.compile(r'([^\r\n]*)(\r\n|\r|\n|$)')
ENDINGS={'\r\n':'CRLF','\r':'CR','\n':'LF','':'无'}


def integral(args,key,default=None):
    value=args.get(key,default)
    if value is None and default is None:
        return None
    if type(value) is not int or not 0<=value<=2**53-1:
        raise ValueError('无效的数字条件：'+key)
    return value


def params(args):
    a={k:integral(args,k,v) for k,v in (('id',0),('page',1),('size',50),('width',16),('at',None),('low',None),('high',None))}
    for key in ('exact','sensitive'):
        a[key]=args.get(key,False)
        if type(a[key]) is not bool:
            raise ValueError('无效的开关：'+key)
    a['mode']=args.get('mode','auto')
    a['q']=args.get('q','')
    if a['mode'] not in ('auto','text','hex') or a['size'] not in SIZES or a['width'] not in WIDTHS:
        raise ValueError('无效的查看方式、每页行数或字节宽度')
    if not isinstance(a['q'],str) or len(a['q'])>160 or any(c in a['q'] for c in '\r\n\0'):
        raise ValueError('检索内容须为不超过 160 字的单行文本')
    if a['high'] is not None and a['low'] is not None and a['high']<a['low']:
        raise ValueError('起始位置须小于或等于结束位置')
    return a


def load(db,store,vid):
    row=db.execute("""SELECT v.id,v.file_id,v.num,v.parent_id,v.sha,v.size,v.ext,v.stamp,v.status,
                             f.rel,r.path AS root FROM versions v JOIN files f ON f.id=v.file_id
                             JOIN roots r ON r.id=f.root_id WHERE v.id=?""",(vid,)).fetchone()
    if not row:
        raise ValueError('历史版本不存在')
    if not 0<=row['size']<=MAX_BYTES:
        raise ValueError('历史原件超过 2 MiB 预览上限，请使用另存副本')
    raw,error=snapshot_bytes(store,row)
    if error:
        raise ValueError('无法预览：'+error)
    return dict(row),raw


def text_info(raw):
    content,encoding=decode_text_bytes(raw)
    rows=[]
    counts=dict.fromkeys(ENDINGS.values(),0)
    for m in LINE.finditer(content):
        if m.start()==len(content):
            break
        value,end=m.groups()
        ending=ENDINGS[end]
        rows.append((value,ending))
        counts[ending]+=1
        if len(rows)>MAX_LINES:
            raise ValueError('文本超过 20 万物理行')
    return rows,encoding,counts


def byte_pattern(q):
    compact=re.sub(r'\s+','',q)
    if not compact:
        return b''
    if not re.fullmatch(r'(?:[0-9a-fA-F]{2}){1,64}',compact):
        raise ValueError('字节检索请输入 1 至 64 组两位十六进制数字')
    return bytes.fromhex(compact)


def text_selection(rows,a):
    if 0 in (a['low'],a['high'],a['at']):
        raise ValueError('文本行号从 1 开始')
    needle=a['q'] if a['sensitive'] else a['q'].casefold()
    result=[]
    start=(a['low'] or 1)-1
    stop=a['high'] if a['high'] is not None else len(rows)
    for i in range(start,min(stop,len(rows))):
        value=rows[i][0]
        span=None
        if needle:
            hay=value if a['sensitive'] else value.casefold()
            matched=(0 if hay==needle else -1) if a['exact'] else hay.find(needle)
            if matched<0:
                continue
            end=matched+len(needle)
            span=(matched,end) if a['sensitive'] or value.isascii() else original_span(value,matched,end)
        result.append((i+1,span))
    return result


def byte_selection(raw,a):
    pattern=byte_pattern(a['q'])
    lo=a['low'] or 0
    hi=min(len(raw),a['high']+1) if a['high'] is not None else len(raw)
    width=a['width']
    if lo>=hi:
        return []
    rows=[]
    for pos in range(lo//width*width,hi,width):
        start=max(pos,lo)
        end=min(pos+width,hi)
        match=raw.find(pattern,start,min(hi,end+len(pattern)-1)) if pattern else -1
        if not pattern or match>=0:
            rows.append((start,end,match if match>=0 else None,len(pattern)))
    return rows


def text_row(info,entry,clipped):
    line,span=entry
    value,ending=info[line-1]
    if not clipped:
        return dict(pos=line,text=value,ending=ending,match=span[0]+1 if span else None)
    start,stop=span or (0,0)
    low=max(0,min(start-64,len(value)-SCREEN))
    high=low+SCREEN
    return dict(pos=line,ending=ending,match=start+1 if span else None,left=value[low:start],
                hit=value[start:min(stop,high)],right=value[stop:high],before=low>0,after=high<len(value))


def hex_row(raw,entry):
    start,end,match,length=entry
    chunk=raw[start:end]
    return dict(pos=start,end=end-1,match=match,match_size=length,cells=[f'{byte:02X}' for byte in chunk],
                ascii=''.join(chr(byte) if 32<=byte<=126 else '.' for byte in chunk))


def view(db,store,args,export=False):
    a=params(args)
    meta,raw=load(db,store,a['id'])
    mode=a['mode']
    encoding=''
    endings={}
    fallback=''
    if mode=='auto' and meta['ext'] not in EXTENSIONS:
        mode='hex'
        fallback='此格式按原始字节查看'
    if mode!='hex':
        try:
            info,encoding,endings=text_info(raw)
            mode='text'
        except ValueError as exc:
            if a['mode']=='text':
                raise ValueError('无法按文本查看：'+str(exc)) from exc
            mode='hex'
            fallback='自动改按原始字节查看：'+str(exc)
    if mode=='text':
        selected=text_selection(info,a)
        make=lambda entry: text_row(info,entry,not export)
        units=len(info)
    else:
        selected=byte_selection(raw,a)
        make=lambda entry: hex_row(raw,entry)
        units=len(raw)
    if export:
        return write_csv(db,store,args,mode,meta,selected,make)
    total=len(selected)
    size=a['size']
    pages=max(1,(total+size-1)//size)
    at=a['at']
    if at is not None and selected:
        index=min(total-1,bisect_left(selected,at,key=lambda item:item[0]))
        if mode=='hex' and index>0 and selected[index-1][1]>at and selected[index][0]>at:
            index-=1
        page=index//size+1
    else:
        page=min(pages,max(1,a['page']))
    start=(page-1)*size
    return dict(meta=meta,mode=mode,encoding=encoding,endings=endings,fallback=fallback,
                units=units,total=total,page=page,pages=pages,size=size,at=at,
                items=[make(row) for row in selected[start:start+size]])


def write_csv(db,store,args,mode,meta,selected,make):
    raw=args.get('path')
    if not isinstance(raw,str) or not raw or '\0' in raw:
        raise ValueError('请选择仓库外的新 CSV 文件')
    path=Path(raw)
    dest=path.parent.resolve()/path.name
    if within(dest,store.home) or dest.suffix.lower()!='.csv':
        raise ValueError('请选择仓库外的新 CSV 文件')
    if not selected or len(selected)>MAX_CSV:
        raise ValueError('当前没有可导出的记录' if not selected else '超过 1 万行，请缩小预览范围')
    with new_csv(dest) as out:
        out.writerow(TEXT_HEADER if mode=='text' else HEX_HEADER)
        for item in selected:
            row=make(item)
            fields=(row['pos'],row['match'],row['ending'],row['text']) if mode=='text' else (
                row['pos'],row['end'],row['match'],' '.join(row['cells']),row['ascii'])
            out.writerow(map(csv_cell,(meta['rel'],meta['num'],*fields)))
    store.audit(db,'导出历史原件预览',f"版本 #{meta['id']} · {len(selected)} 行")
    return str(dest)
