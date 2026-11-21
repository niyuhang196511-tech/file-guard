"""CSV/TSV 用唯一业务编号对齐。字段或记录有歧义时交回原坐标比较。"""
import re
from .excel_diff import ID_HEADERS

POSITION=re.compile(r'第 (\d+) 行 · 第 (\d+) 列')


def index(entries):
    rows={}
    for (_,location),value in entries.items():
        match=POSITION.fullmatch(location)
        if not match:return None
        r,c=map(int,match.groups())
        rows.setdefault(r,{})[c]=value
    header=rows.get(1,{})
    if not header or any(not name.strip() for name in header.values()) or len(set(header.values()))!=len(header):
        return None
    candidates=[c for c,name in header.items() if name.strip().casefold() in ID_HEADERS]
    if len(candidates)!=1:return None
    col=candidates[0];records={}
    for n,data in rows.items():
        if n==1:continue
        identity=data.get(col,'')
        if not identity.strip() or identity in records or not data.keys()<=header.keys():return None
        records[identity]=(n,{header[c]:v for c,v in data.items()})
    return header[col],list(header.values()),records


def compare(left,right,make):
    a,b=index(left),index(right)
    if not a or not b or a[0]!=b[0]:return None
    _,cols,old=a
    key,newcols,new=b
    result=[]
    def add(loc,before,after,category,record='',field=''):
        item=make('数据表',loc,before,after)
        result.append(dict(item,record_key=record,field=field,category=category,key_header=key))
    for field in dict.fromkeys(cols+newcols):
        if field not in cols or field not in newcols:
            add('表头 · '+field,field if field in cols else None,field if field in newcols else None,'字段结构',field=field)
    common=[f for f in cols if f in newcols]
    reordered=[f for f in newcols if f in cols]
    if common!=reordered:add('表头 · 字段顺序','、'.join(common),'、'.join(reordered),'字段结构')
    old_order=[i for i in old if i in new];new_order=[i for i in new if i in old]
    ranks={v:i for i,v in enumerate(old_order)}
    moves={v for i,v in enumerate(new_order) if ranks[v]!=i}
    for identity in dict.fromkeys([*new,*old]):
        first,values=old.get(identity,(None,{}))
        last,latest=new.get(identity,(None,{}))
        if not first or not last:
            summary='\n'.join(f'{k}：{v}' for k,v in (values or latest).items())
            add(f'第 {first or last} 行',summary if first else None,summary if last else None,'记录行',identity)
            continue
        label=f'第 {last} 行' if first==last else f'旧 {first} 行 → 新 {last} 行'
        if identity in moves:add(label+' · 记录顺序',str(first),str(last),'记录顺序',identity)
        for field in dict.fromkeys(newcols+cols):
            if values.get(field)!=latest.get(field):
                add(label+' · '+field,values.get(field),latest.get(field),'字段值',identity,field)
    return result
