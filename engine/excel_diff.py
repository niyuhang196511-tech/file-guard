"""在编号足以确认行身份时对齐 Excel 台账，保留原始坐标作为独立视图。"""
from collections import defaultdict
from copy import copy
from dataclasses import dataclass
import re

from openpyxl.formula.translate import Translator, TranslatorError
from openpyxl.formula.tokenizer import TokenizerError
from openpyxl.utils.cell import column_index_from_string

EXTENSIONS = {'.xlsx', '.xlsm', '.xltx', '.xltm'}
ID_HEADERS = {'编码', '编号', '物料编码', '物料编号', '商品编码', '产品编码', '产品编号', '订单编号', '序列号', 'sku', 'id'}
CELL = re.compile(r'^([A-Z]{1,3})([1-9]\d*)( · (?:批注|格式|超链接))?$')
DEFAULT = '工作表默认格式'

LABEL = {
    'name':'名称', 'sz':'字号', 'b':'加粗', 'i':'斜体', 'u':'下划线', 'strike':'删除线',
    'color':'颜色', 'rgb':'色值', 'theme':'主题色', 'indexed':'索引色', 'tint':'色调',
    'charset':'字符集', 'family':'字族', 'scheme':'字体方案', 'vertAlign':'上下标',
    'patternFill':'填充图案', 'patternType':'类型', 'fgColor':'前景色', 'bgColor':'背景色',
    'horizontal':'水平对齐', 'vertical':'垂直对齐', 'wrapText':'自动换行', 'textRotation':'文字角度',
    'shrinkToFit':'缩小填充', 'indent':'缩进', 'left':'左边框', 'right':'右边框',
    'top':'上边框', 'bottom':'下边框', 'diagonal':'对角线', 'style':'线型',
    'locked':'锁定', 'hidden':'隐藏', 'val':'值'
}
ENUM = {'center':'居中', 'left':'靠左', 'right':'靠右', 'top':'靠上', 'bottom':'靠下',
        'solid':'纯色', 'thin':'细线', 'double':'双线', 'General':'常规'}
BOOL = {'b','i','strike','wrapText','shrinkToFit','locked','hidden'}


@dataclass(frozen=True)
class Style:
    properties: tuple


def describe_style(cell):
    fields = {'数字格式': ENUM.get(cell.number_format, cell.number_format)}
    def visit(node, prefix):
        children = list(node)
        if not node.attrib and not children:
            fields[prefix] = '是'
        for key, value in node.attrib.items():
            name = prefix if key=='val' else prefix + ' / ' + LABEL.get(key, key)
            if key in BOOL or (key=='val' and node.tag in BOOL):
                value = '是' if value in ('1','true') else '否'
            elif key=='rgb':
                value = '#' + value
            else:
                value = ENUM.get(value, value)
            fields[name] = value
        seen = defaultdict(int)
        for child in children:
            tag = child.tag
            seen[tag] += 1
            label = LABEL.get(tag, tag)
            suffix = '' if seen[tag]==1 else f' [{seen[tag]}]'
            visit(child, prefix + ' / ' + label + suffix)
    for prop, label in [('font','字体'),('fill','填充'),('border','边框'),('alignment','对齐'),('protection','保护')]:
        visit(copy(getattr(cell, prop)).to_tree(), label)
    return Style(tuple(sorted(fields.items())))


def style_change(left, right):
    first = dict(left.properties) if left else {}
    last = dict(right.properties) if right else {}
    changed = sorted(k for k in first.keys() | last.keys() if first.get(k)!=last.get(k))
    def describe(props):
        lines = []
        for k in changed:
            missing = '否' if k.rsplit(' / ',1)[-1] in ('加粗','斜体','删除线','自动换行') else '未设置'
            lines.append(f'{k}：{props.get(k, missing)}')
        return '\n'.join(lines)
    return describe(first), describe(last)


def split_cells(entries):
    by_sheet = defaultdict(lambda: {'rows':defaultdict(dict), 'meta':{}})
    for (sheet, location), value in entries.items():
        group = by_sheet[sheet]
        cell = CELL.fullmatch(location)
        if cell:
            column, number, suffix = cell.groups()
            group['rows'][int(number)][(column,suffix or '')] = value
        else:
            group['meta'][location] = value
    return by_sheet


def key_column(rows):
    header = rows.get(1,{})
    candidates = [col for (col,suffix),v in header.items()
                  if not suffix and isinstance(v,tuple) and v[0]=='s' and v[1].strip().lower() in ID_HEADERS]
    return candidates[0] if len(candidates)==1 else None


def row_ids(rows, column):
    ids = {}
    for index in sorted(rows):
        if index==1:
            continue
        value = rows[index].get((column,''))
        if not value or value[0] not in ('n','s') or not value[1].strip() or value in ids:
            return None
        ids[value] = index
    return ids


def align(before, after):
    col = key_column(before)
    other = key_column(after)
    if not col or not other or before[1][col,'']!=after[1][other,'']:
        return None
    if any(max(rows)!=len(rows) for rows in (before,after)):
        return None
    old, new = row_ids(before,col), row_ids(after,other)
    if not old or not new:
        return None
    if not (old.keys() <= new.keys() or new.keys() <= old.keys()):
        return None
    if [v for v in old if v in new]!=[v for v in new if v in old]:
        if old.keys()==new.keys():
            return [(1,1)]+[(old[v],new[v]) for v in new]
        return None
    ordered = new if len(new)>len(old) else old
    return [(1,1)]+[(old.get(v),new.get(v)) for v in ordered]


def render_value(value):
    return value[1] if isinstance(value, tuple) else value


def row_summary(data, number, header, default):
    result = []
    for (col, suffix), val in sorted(data.items(),key=lambda p:(column_index_from_string(p[0][0]),p[0][1])):
        field = render_value(header.get((col,''))) or col
        if isinstance(val,Style):
            _, val = style_change(default,val)
        result.append(f'{col}{number} · {field}{suffix}：{render_value(val)}')
    return '\n'.join(result)


def translated_formula(old, new, origin, destination):
    if not (isinstance(old,tuple) and isinstance(new,tuple) and old[0]==new[0]=='f' and old[1].startswith('=')):
        return False
    try:
        return Translator(old[1], origin=origin).translate_formula(destination)==new[1]
    except (TranslatorError, TokenizerError, ValueError, IndexError, TypeError):
        return False


TYPES = {'s':'文本','inlineStr':'文本','n':'数字','b':'布尔值','d':'日期时间','e':'错误值','f':'公式'}


def columns_by_field(rows):
    fields = {}
    for (col,suffix),value in rows.get(1,{}).items():
        if suffix:
            continue
        if not isinstance(value,tuple) or value[0]!='s' or not value[1].strip() or value[1] in fields:
            return None
        fields[value[1]]=col
    named=set(fields.values())
    if any(col not in named for row in rows.values() for col,_ in row):
        return None
    return fields


def append_change(out, sheet, location, old, new, category='工作表属性', field=''):
    if old==new:
        return
    kind = '新增' if old is None else '删除' if new is None else '修改'
    types = {}
    if isinstance(old,tuple) or isinstance(new,tuple):
        for name,value in [('old_type',old),('new_type',new)]:
            if isinstance(value,tuple):
                types[name]=TYPES.get(value[0],value[0])
        if category=='单元格值':
            if '公式' in types.values():
                category='公式'
            elif len(set(types.values()))>1:
                category='数据类型'
    if isinstance(old,Style) or isinstance(new,Style):
        old,new=style_change(old,new)
    out.append(dict(sheet=sheet,location=location,kind=kind,old=render_value(old),new=render_value(new),
                    category=category,field=field,**types))


def ordered_fields(fields):
    return sorted(fields,key=lambda name:column_index_from_string(fields[name]))


def header_labels(rows):
    return {col:value[1] for (col,suffix),value in rows.get(1,{}).items()
            if not suffix and isinstance(value,tuple) and value[0]=='s'}


def compare_sheet(name,a,b,default_a,default_b,mode,result):
    pairs=align(a,b) if mode=='aligned' else None
    left_key=key_column(a) if pairs else None
    right_key=key_column(b) if pairs else None
    left_fields=columns_by_field(a) if pairs else None
    right_fields=columns_by_field(b) if pairs else None
    use_fields=bool(left_fields and right_fields)
    if pairs and left_key!=right_key and not use_fields:
        pairs=None
    structural=use_fields and left_fields!=right_fields
    same_headers={col:v for (col,suffix),v in a.get(1,{}).items() if not suffix}=={
        col:v for (col,suffix),v in b.get(1,{}).items() if not suffix}
    left_labels,right_labels=header_labels(a),header_labels(b)
    left_to_right={}
    right_to_left={}
    if use_fields:
        left_to_right={col:right_fields.get(field) for field,col in left_fields.items()}
        right_to_left={col:left_fields.get(field) for field,col in right_fields.items()}
    start=len(result)
    if structural:
        shared=left_fields.keys() & right_fields.keys()
        old_order=[f for f in ordered_fields(left_fields) if f in shared]
        new_order=[f for f in ordered_fields(right_fields) if f in shared]
        if old_order!=new_order or (left_fields.keys()==right_fields.keys() and left_fields!=right_fields):
            def describe(order,fields):
                return '、'.join(f'{fields[f]} · {f}' for f in order)
            append_change(result,name,'字段顺序',describe(old_order,left_fields),describe(new_order,right_fields),'字段结构')
    permutation=bool(pairs and all(i is not None and j is not None for i,j in pairs))
    for i,j in pairs or [(n,n) for n in sorted(a.keys()|b.keys())]:
        if permutation and i!=j:
            append_change(result,name,f'第 {i} 行 → 第 {j} 行',str(i),str(j),'记录顺序')
            result[-1]['record_key']=render_value(b[j][right_key,''])
        if i is None or j is None:
            rows,number,column,default=(b,j,right_key,default_b) if i is None else (a,i,left_key,default_a)
            summary=row_summary(rows[number],number,rows[1],default)
            append_change(result,name,f'第 {number} 行',summary if j is None else None,summary if i is None else None,'记录行')
            result[-1]['record_key']=render_value(rows[number][column,''])
            continue
        first,last=a.get(i,{}),b.get(j,{})
        cells={(col,left_to_right.get(col) if use_fields else col,suffix) for col,suffix in first}
        cells.update((right_to_left.get(col) if use_fields else col,col,suffix) for col,suffix in last)
        for ca,cb,suffix in sorted(cells,key=lambda item:(column_index_from_string(item[1] or item[0]),item[1] is None,item[2])):
            old,new=first.get((ca,suffix)),last.get((cb,suffix))
            origin=f'{ca}{i}' if ca else ''
            dest=f'{cb}{j}' if cb else ''
            location=f'{origin} → {dest}' if origin and dest and origin!=dest else (dest or origin)
            before,after=left_labels.get(ca,''),right_labels.get(cb,'')
            field=f'{before} → {after}' if before and after and before!=after else (after or before)
            category='单元格值'
            if suffix==' · 格式':
                category='格式'
                old,new=old or default_a,new or default_b
            elif suffix==' · 超链接':
                category='超链接'
            elif suffix==' · 批注':
                category='批注'
            elif pairs and i==j==1:
                category='字段结构'
                if structural and (not ca or not cb):
                    location=f'第 {ca or cb} 列 · 字段'
            if i!=j and same_headers and translated_formula(old,new,origin,dest):
                continue
            previous=len(result)
            append_change(result,name,location+suffix,old,new,category,field)
            if len(result)>previous and pairs and i!=1:
                result[-1]['record_key']=render_value(last[right_key,''])
    if pairs:
        key_name=render_value(b[1][right_key,''])
        for record in result[start:]:
            record['key_header']=key_name


def compare_excel(left, right, mode):
    old_book,new_book=split_cells(left),split_cells(right)
    empty={'meta':{},'rows':{}}
    result=[]
    for name in dict.fromkeys([*old_book,*new_book]):
        a,b=old_book.get(name,empty),new_book.get(name,empty)
        meta_a,meta_b=a['meta'],b['meta']
        default_a,default_b=meta_a.get(DEFAULT),meta_b.get(DEFAULT)
        for loc in sorted(meta_a.keys()|meta_b.keys()):
            if loc!=DEFAULT or (default_a and default_b):
                append_change(result,name,loc,meta_a.get(loc),meta_b.get(loc))
        compare_sheet(name,a['rows'],b['rows'],default_a,default_b,mode,result)
    return result
