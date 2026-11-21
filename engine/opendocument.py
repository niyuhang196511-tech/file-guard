"""从 OpenDocument 包内读取文字、表格和演示稿，不依赖 Office 桌面程序。"""
import hashlib
import zipfile
from xml.etree import ElementTree as ET

NS={key:'urn:oasis:names:tc:opendocument:xmlns:'+key+':1.0' for key in ('office','text','table','draw','presentation','style','meta')}
NS['xlink']='http://www.w3.org/1999/xlink'
NS['dc']='http://purl.org/dc/elements/1.1/'


def tag(key):
    prefix,name=key.split(':')
    return '{'+NS[prefix]+'}'+name


def attr(node,key,default=''):
    return node.get(tag(key),default)


def count(node,key):
    n=int(attr(node,key,'1'))
    if n<1 or n>1_048_576:raise ValueError('OpenDocument 重复数超出范围')
    return n


def content(node):
    pieces=[]
    remaining=1_000_000
    def append(value):
        nonlocal remaining
        remaining-=len(value)
        if remaining<0:raise ValueError('段落文本超出解析范围')
        pieces.append(value)
    def walk(item):
        if item.text:append(item.text)
        for child in item:
            if child.tag==tag('text:s'):
                n=count(child,'text:c')
                if n>remaining:raise ValueError('空格展开超出解析范围')
                append(' '*n)
            elif child.tag==tag('text:tab'):append('\t')
            elif child.tag==tag('text:line-break'):append('\n')
            else:walk(child)
            if child.tail:append(child.tail)
    walk(node)
    return ''.join(pieces)


def worksheet(sheet,name):
    row_number=1
    remaining=250_000
    def row_nodes(parent):
        for child in parent:
            if child.tag==tag('table:table-row'):yield child
            elif child.tag in (tag('table:table-row-group'),tag('table:table-header-rows'),tag('table:table-rows')):
                yield from row_nodes(child)
    for row in row_nodes(sheet):
        repeats=count(row,'table:number-rows-repeated')
        cells=[];column=1
        for cell in row:
            if cell.tag not in (tag('table:table-cell'),tag('table:covered-table-cell')):continue
            copies=count(cell,'table:number-columns-repeated')
            data={}
            text='\n'.join(content(p) for p in cell.findall('text:p',NS))
            if text:data['显示文本']=text
            for key,label in [('office:value-type','类型'),('office:value','数值'),('office:date-value','日期'),
                              ('office:time-value','时间'),('office:boolean-value','布尔值'),('office:string-value','文本值'),
                              ('table:formula','公式'),('table:number-columns-spanned','跨列'),('table:number-rows-spanned','跨行')]:
                if attr(cell,key):data[label]=attr(cell,key)
            remaining-=len(data)*copies*repeats
            if remaining<0:raise ValueError('OpenDocument 表格展开超过 25 万个位置')
            if data:cells.append((column,copies,data))
            column+=copies
        if cells:
            for r in range(row_number,row_number+repeats):
                for first,copies,values in cells:
                    for c in range(first,first+copies):
                        for label,value in values.items():
                            yield (name,f'第 {r} 行 · 第 {c} 列 · {label}'),value
        row_number+=repeats


def document(path):
    with zipfile.ZipFile(path) as z:
        root=ET.fromstring(z.read('content.xml'))
        body=root.find('office:body',NS)
        if body is None:raise ValueError('OpenDocument 缺少正文')
        story=body.find('office:text',NS)
        if story is not None:
            # Table cells have their own addresses. Walk surrounding paragraphs in reading order.
            number=0;tables=0
            def visit(parent):
                nonlocal number,tables
                for child in parent:
                    if child.tag==tag('table:table'):
                        tables+=1
                        yield from worksheet(child,attr(child,'table:name') or f'表格 {tables}')
                    elif child.tag in (tag('text:p'),tag('text:h')):
                        number+=1;loc=f'第 {number} 段'
                        yield ('正文',loc),content(child)
                        if child.tag==tag('text:h'):yield ('标题层级',loc),attr(child,'text:outline-level','1')
                        if attr(child,'text:style-name'):yield ('段落样式',loc),attr(child,'text:style-name')
                        for i,link in enumerate(child.iter(tag('text:a')),1):
                            yield ('段落链接',f'{loc} · {i}'),attr(link,'xlink:href')
                    else:yield from visit(child)
            yield from visit(story)
        sheet=body.find('office:spreadsheet',NS)
        if sheet is not None:
            for n,table in enumerate(sheet.findall('table:table',NS),1):
                name=attr(table,'table:name') or f'数据表 {n}'
                yield (name,'工作表顺序'),str(n)
                yield from worksheet(table,name)
        slides=body.find('office:presentation',NS)
        if slides is not None:
            for n,page in enumerate(slides.findall('draw:page',NS),1):
                group=f'幻灯片 {n}'
                yield (group,'名称'),attr(page,'draw:name')
                def slide_frames(parent):
                    for ch in parent:
                        if ch.tag==tag('presentation:notes'):continue
                        if ch.tag==tag('draw:frame'):yield ch
                        yield from slide_frames(ch)
                for i,frame in enumerate(slide_frames(page),1):
                    lines=[content(p) for p in frame.findall('draw:text-box/text:p',NS)]
                    if lines:yield (group,f'文本框 {i}'),'\n'.join(lines)
                notes=page.find('presentation:notes',NS)
                if notes is not None:yield (group,'演讲者备注'),'\n'.join(content(p) for p in notes.iter(tag('text:p')))
        if 'meta.xml' in z.namelist():
            meta=ET.fromstring(z.read('meta.xml'))
            for key,label in [('dc:title','标题'),('dc:subject','主题'),('dc:creator','作者'),('meta:keyword','关键词')]:
                vals=[node.text or '' for node in meta.iter(tag(key))]
                if vals:yield ('文档属性',label),'、'.join(vals)
        for info in z.infolist():
            if info.filename.startswith('Pictures/') and not info.is_dir():
                with z.open(info) as stream:
                    yield ('内嵌图片',info.filename),hashlib.file_digest(stream,'sha256').hexdigest()
