"""版本差异中的可比数值明细。使用十进制计算，避免用浮点比较阈值。"""
from collections import Counter
from decimal import Decimal,localcontext,ROUND_HALF_UP
from fractions import Fraction
from pathlib import Path
import re

from .comparison import csv_cell,new_csv
from .store import within

PATTERN=re.compile(r'[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d{1,3})?')
COLUMNS={'sheet':'分组','field':'字段','record':'业务编号','location':'位置','old':'旧值','new':'新值',
         'delta':'差额','percent':'变化率百分数','direction':'方向'}


def decimal_value(value):
    if not isinstance(value,(str,int)) or isinstance(value,bool):return None
    s=str(value).strip()
    if len(s)>128 or not PATTERN.fullmatch(s):return None
    number=Decimal(s)
    return number if not number or abs(number.adjusted())<=200 else None


def text(value):
    if value==0:return '0'
    return format(value.normalize(),'f')


def threshold(args,k):
    raw=args.get(k)
    if raw is None or raw=='':return None
    number=decimal_value(raw)
    if number is None or number<0:raise ValueError('阈值必须是非负的有限十进制数')
    return number


def query(store,db,comparison,args,export=False):
    meta=comparison.metadata
    if not (meta['is_excel'] or meta['is_tabular']):raise ValueError('数值核对适用于 Excel、CSV 和 TSV')
    if comparison.metadata['status']!='已解析':raise ValueError('请先完成版本解析')
    floor=threshold(args,'minimum');rate=threshold(args,'rate')
    direction=args.get('direction','');sort=args.get('sort','magnitude')
    if direction not in ('','上升','下降','等值') or sort not in ('magnitude','rate','up','down','position'):
        raise ValueError('无效的数值核对条件')
    data=[];groups={};counts=Counter();skips=Counter()
    with localcontext() as ctx:
        ctx.prec=1100
        for r in comparison.details:
            sheet,loc=r['sheet'],r['location']
            field=r.get('field') or ''
            if meta['is_excel']:
                if r.get('category') not in ('单元格值','数据类型','公式'):continue
                if not field:
                    m=re.search(r'([A-Z]{1,3})\d+$',loc);field=(m[1]+' 列') if m else '未识别字段'
            elif r.get('category')!='字段值':
                match=re.fullmatch(r'第 \d+ 行 · 第 (\d+) 列',loc)
                if not match:continue
                field='第 '+match[1]+' 列'
            if args.get('sheet') and sheet!=args['sheet'] or args.get('field') and field!=args['field']:continue
            record=r.get('record_key','')
            if args.get('record') and record!=args['record']:continue
            if r.get('old') is None or r.get('new') is None:skips['单侧缺值']+=1;continue
            if meta['is_excel'] and any(r.get(k)!='数字' for k in ('old_type','new_type')):
                skips['非数值类型']+=1;continue
            a,b=decimal_value(r['old']),decimal_value(r['new'])
            if a is None or b is None:skips['非可比数值']+=1;continue
            delta=b-a;side='上升' if delta>0 else '下降' if delta<0 else '等值'
            if floor is not None and abs(delta)<floor:continue
            if rate is not None and (not a or abs(delta)*100<rate*abs(a)):continue
            counts[side]+=1
            if direction and side!=direction:continue
            ratio=None if not a else Fraction(delta)/abs(Fraction(a))
            percent=None if not a else text((delta*100/abs(a)).quantize(Decimal('.0001'),rounding=ROUND_HALF_UP))
            data.append(dict(sheet=sheet,field=field,record=record,location=loc,old=r['old'],new=r['new'],
                             delta=text(delta),percent=percent,direction=side,_delta=delta,_ratio=ratio))
            stats=groups.setdefault((sheet,field),dict(sheet=sheet,field=field,old=Decimal(0),new=Decimal(0),count=0))
            stats['old']+=a;stats['new']+=b;stats['count']+=1
        for stats in groups.values():
            stats['delta']=text(stats['new']-stats['old']);stats['old']=text(stats['old']);stats['new']=text(stats['new'])
        if sort=='rate':data.sort(key=lambda r:(r['_ratio'] is not None,abs(r['_ratio'] or 0)),reverse=True)
        elif sort!='position':
            data.sort(key=lambda r:abs(r['_delta']) if sort=='magnitude' else r['_delta'],reverse=sort!='down')
    if export:
        path=Path(args['path']).resolve()
        if within(path,store.home):raise ValueError('请在仓库外保存')
        with new_csv(path) as out:
            out.writerow(['旧版本','新版本',*COLUMNS.values()])
            for row in data:
                out.writerow([meta['old_number'],meta['new_number'],*[csv_cell(row[k]) for k in COLUMNS]])
        store.audit(db,'导出数值差异',f"版本 #{args['old']} → #{args['new']} · {len(data)} 项")
        return str(path)
    pages=max(1,(len(data)+24)//25);p=min(pages,max(1,int(args.get('page',1))))
    items=[{k:r[k] for k in COLUMNS} for r in data[(p-1)*25:p*25]]
    return dict(items=items,total=len(data),counts=dict(counts),skips=dict(skips),groups=list(groups.values()),page=p,pages=pages)
