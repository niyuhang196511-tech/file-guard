"""Bounded, typed spreadsheet snapshot for the cross-ledger review screen."""
from datetime import date, datetime, time, timedelta
from pathlib import Path
import re
import zipfile

from . import formats
from .comparison import csv_cell,new_csv
from .store import within

EXTENSIONS=formats.excel_diff.EXTENSIONS | {'.csv','.tsv'}
MAX_ROWS=20000
MAX_COLUMNS=256
MAX_SLOTS=300000
MAX_TEXT=3*1024*1024


def cell(value,kind=None):
    if value is None:return None
    if kind=='f':return ['公式',str(getattr(value,'text',value))]
    if kind=='e':return ['错误',str(value)]
    if isinstance(value,bool):return ['布尔','TRUE' if value else 'FALSE']
    if isinstance(value,(date,datetime,time)):return ['日期时间',value.isoformat()]
    if isinstance(value,timedelta):return ['时长',str(value)]
    if isinstance(value,(int,float)):return ['数值',str(value)]
    return ['文本',str(value)]


def delimited_rows(path,ext):
    current=0;data=[]
    for (_,loc),value in formats.tabular(path,ext):
        row=int(loc.split(' ')[1])
        if row!=current:
            if current:yield data
            data=[];current=row
        if loc.endswith('空记录'):continue
        data.append(cell(value))
        if len(data)>MAX_COLUMNS:raise ValueError('超过 256 列的台账对账上限')
    if current:yield data


def collect(rows):
    result=[];text_bytes=slots=width=0
    for row in rows:
        if len(row)>MAX_COLUMNS or len(result)>=MAX_ROWS:raise ValueError('台账超过 20000 行或 256 列，请选择较小的工作表')
        while row and row[-1] is None:row.pop()
        width=max(width,len(row))
        slots+=len(row)
        text_bytes+=sum(len(v[1].encode('utf-8')) for v in row if v is not None)
        if slots>MAX_SLOTS or text_bytes>MAX_TEXT:raise ValueError('台账超过 30 万格或 3 MiB 文本的对账上限')
        result.append(row)
    return result,width


def read(db,store,args):
    row=db.execute("""SELECT v.id,v.num,v.ext,v.sha,v.size,v.stamp,f.rel,r.path root
          FROM versions v JOIN files f ON f.id=v.file_id JOIN roots r ON f.root_id=r.id WHERE v.id=?""",(int(args['id']),)).fetchone()
    if not row or row['ext'] not in EXTENSIONS:raise ValueError('请选择 XLSX 系列、CSV 或 TSV 的历史版本')
    if row['size']>formats.PARSE_BYTES:raise ValueError('版本超过 32 MiB 解析上限')
    with store.parsing_paths(row) as (path,):
        return read_table(path,row,args)


def read_table(path,row,args):
    result=dict(row)
    if row['ext'] in ('.csv','.tsv'):
        result.update(sheets=['数据表'],sheet='数据表')
        if args.get('sheet') not in ('',None,'数据表'):raise ValueError('数据表不存在')
        data,width=collect(delimited_rows(path,row['ext']))
    else:
        from openpyxl import load_workbook
        with zipfile.ZipFile(path) as z:
            if sum(i.file_size for i in z.infolist())>128*1024**2:raise ValueError('工作簿展开后超过 128 MiB')
        with path.open('rb') as stream:
            book=load_workbook(stream,read_only=True,data_only=False,keep_links=False)
            try:
                sheets=[s.title for s in book.worksheets]
                name=args.get('sheet') or next((s.title for s in book.worksheets if s.sheet_state=='visible'),sheets[0] if sheets else '')
                if name not in sheets:raise ValueError('工作表不存在')
                sheet=book[name];sheet.reset_dimensions()
                result.update(sheets=sheets,sheet=name)
                try:
                    data,width=collect(([cell(c.value,c.data_type) for c in line] for line in sheet.iter_rows()))
                except ValueError as exc:
                    if not args.get('report_problem'):raise
                    return dict(result,problem=str(exc),rows=[],width=0)
            finally:book.close()
    return dict(result,rows=data,width=width)


def save_csv(store,db,args):
    dest=Path(args['path']).resolve()
    if within(dest,store.home) or dest.suffix.lower()!='.csv':raise ValueError('请选择仓库外的新 CSV 文件')
    rows=args.get('rows')
    if not isinstance(rows,list) or not rows:raise ValueError('没有可导出的报表行')
    with new_csv(dest) as writer:
        for row in rows:
            if not isinstance(row,list) or any(v is not None and not isinstance(v,(int,float,str)) for v in row):
                raise ValueError('报表行格式错误')
            writer.writerow([csv_cell(v) for v in row])
    store.audit(db,'导出台账核对报表',f'{len(rows)-1} 行')
    return str(dest)


def templates(db,store,cmd,args):
    import json
    from .store import now
    if cmd=='ledger_templates':
        return [dict(id=r[0],name=r[1],stamp=r[2],config=json.loads(r[3])) for r in
                db.execute('SELECT id,name,stamp,config FROM ledger_templates ORDER BY name,id')]
    db.execute('BEGIN IMMEDIATE')
    if cmd=='ledger_remove':
        if not db.execute('DELETE FROM ledger_templates WHERE id=?',(int(args['id']),)).rowcount:
            raise ValueError('模板已经移除')
        store.audit(db,'移除台账对账模板',f"模板 #{int(args['id'])}")
        return '已移除模板'
    name=str(args.get('name','')).strip()
    cfg=args.get('config')
    if not 1<=len(name)<=60 or not isinstance(cfg,dict):raise ValueError('请输入 1 至 60 字的模板名称')
    shape={}
    for side in ('left','right'):
        headers=cfg.get(side)
        if not isinstance(headers,list) or not 1<=len(headers)<=MAX_COLUMNS or not all(isinstance(x,str) for x in headers):
            raise ValueError('模板表头格式无效')
        shape[side]=headers
    for field_name in ('keys','pairs'):
        items=cfg.get(field_name)
        if not isinstance(items,list) or len(items)>(3 if field_name=='keys' else MAX_COLUMNS*2) or (field_name=='keys' and not items):
            raise ValueError('模板字段数量无效')
        saved=[];used_left=set();used_right=set()
        for item in items:
            if not isinstance(item,dict):raise ValueError('模板字段无效')
            l,r=item.get('l'),item.get('r')
            start=0 if field_name=='keys' else -1
            if type(l)!=int or type(r)!=int or not start<=l<len(shape['left']) or not start<=r<len(shape['right']):
                raise ValueError('模板字段越界')
            use=field_name=='keys' or bool(item.get('use'))
            if use:
                if (l<0 and r<0) or (l>=0 and l in used_left) or (r>=0 and r in used_right):
                    raise ValueError('模板字段重复或为空')
                used_left.add(l);used_right.add(r)
            saved.append(dict(l=l,r=r) if field_name=='keys' else dict(l=l,r=r,use=use))
        shape[field_name]=saved
    for k in ('keyTrim','trim','fold','width','typed','numeric','empty'):shape[k]=bool(cfg.get(k))
    tolerance=str(cfg.get('tolerance') or '0')
    if len(tolerance)>128:raise ValueError('容差过长')
    if shape['numeric']:
        from decimal import Decimal
        match=re.fullmatch(r'[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE]([+-]?\d{1,3}))?',tolerance,re.ASCII)
        if not match or abs(int(match[1] or 0))>200 or Decimal(tolerance)<0:raise ValueError('模板数值容差无效')
    shape['tolerance']=tolerance
    payload=json.dumps(shape,ensure_ascii=False,separators=(',',':'))
    if len(payload.encode())>48000:raise ValueError('模板表头和规则超过 48 KB')
    if db.execute('SELECT 1 FROM ledger_templates WHERE name=?',(name,)).fetchone():raise ValueError('已存在同名模板，请换一个名称')
    if db.execute('SELECT count(*) FROM ledger_templates').fetchone()[0]>=50:raise ValueError('最多保留 50 份对账模板')
    tid=db.execute('INSERT INTO ledger_templates(name,stamp,config) VALUES (?,?,?)',(name,now(),payload)).lastrowid
    store.audit(db,'保存台账对账模板',f'模板 #{tid}')
    return tid
