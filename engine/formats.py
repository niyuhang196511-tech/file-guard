"""格式插件。所有解析都读取版本仓库中的快照。"""
import csv
import hashlib
import io
import json
import re
import zipfile
from collections import defaultdict
from difflib import SequenceMatcher
from pathlib import Path
from xml.etree import ElementTree as ET

from . import excel_diff, word_diff, office_properties, file_properties, tabular_diff, document_details, opendocument

from . import exchange_formats, semantic, package_details, message_formats

LIMIT = 250_000
PARSE_BYTES = 32 * 1024 * 1024
plugins = {}
SOURCE_FORMATS=exchange_formats.TEXT_EXTENSIONS | {'.gpx','.ini','.toml','.srt','.ipynb','.svg','.xsd','.xsl','.xslt','.csproj','.props','.targets'}
ITERATION_111={'.xlsx','.xlsm','.xltx','.xltm','.eml','.gpx','.epub'}
SETTLE_EXTENSIONS={'.xlsx','.xlsm','.xltx','.xltm','.docx','.pptx','.odt','.ods','.odp','.epub','.zip','.pdf','.ipynb'}
REVISED_FORMATS={'.docx','.pdf','.csv','.tsv','.ods','.odt','.odp','.gif','.webp','.png','.tif','.tiff'}


def supports(*extensions):
    def register(function):
        for ext in extensions:
            plugins[ext] = function
        return function
    return register


def display(value):
    if isinstance(value, str):
        return value
    return json.dumps(value, ensure_ascii=False, sort_keys=True, default=str)


def key(sheet, location):
    return (str(sheet), str(location))


def text_of(path):
    return file_properties.decode_text(path)[0]


def media(path):
    with zipfile.ZipFile(path) as archive:
        for name in archive.namelist():
            if '/media/' in name or '/embeddings/' in name:
                yield key('附件', name), hashlib.sha256(archive.read(name)).hexdigest()


@supports('.xlsx', '.xlsm', '.xltx','.xltm')
def excel(path):
    from openpyxl import load_workbook
    from openpyxl.xml.functions import tostring
    from openpyxl.cell.cell import Cell
    styles = {}
    with path.open('rb') as stream:
        book = load_workbook(stream, data_only=False)
        try:
            yield from package_details.workbook(path)
            yield from office_properties.workbook_names(book)
            for order, sheet in enumerate(book, 1):
                yield from office_properties.worksheet(sheet)
                name = sheet.title
                default_cell = Cell(sheet,row=1,column=1)
                default_cell._style = book._cell_styles[0]
                yield key(name,excel_diff.DEFAULT), excel_diff.describe_style(default_cell)
                yield key(name, '工作表顺序'), str(order)
                for cell in sheet._cells.values():
                    addr = cell.coordinate
                    if cell.value is not None:
                        value = cell.value
                        if cell.data_type == 'f' and not isinstance(value, str):
                            value = dict(value)
                        yield key(name, addr), (cell.data_type, display(value))
                    if cell.hyperlink:
                        link = cell.hyperlink
                        yield key(name, addr+' · 超链接'), display({k:getattr(link,k) for k in
                              ('target','location','tooltip','display') if getattr(link,k) is not None})
                    if cell.comment:
                        yield key(name, addr + ' · 批注'), cell.comment.author + ' | ' + cell.comment.text
                    if cell.has_style:
                        sid = cell.style_id
                        if sid not in styles:
                            styles[sid] = excel_diff.describe_style(cell)
                        yield key(name, addr + ' · 格式'), styles[sid]
                for cell_range in sheet.merged_cells.ranges:
                    yield key(name, '合并 ' + str(cell_range)), '合并单元格'
                for group, dims in [('行',sheet.row_dimensions),('列',sheet.column_dimensions)]:
                    for pos, dim in dims.items():
                        yield key(name, f'{group} {pos} · 属性'), display(dict(dim))
                for dv in sheet.data_validations.dataValidation:
                    yield key(name, '数据验证 ' + str(dv.sqref)), tostring(dv.to_tree()).decode()
                for title in sheet.tables:
                    yield key(name, '表格 ' + title), tostring(sheet.tables[title].to_tree()).decode()
        finally:
            book.close()


@supports('.docx')
def word(path):
    from docx import Document
    doc = Document(path)
    yield from word_diff.entries(doc)
    yield from office_properties.word_layout(doc)
    yield from media(path)


@supports('.pptx')
def slides(path):
    from pptx import Presentation
    prs = Presentation(path)
    yield from office_properties.presentation(prs)
    for i, slide in enumerate(prs.slides, 1):
        area = f'幻灯片 {i}'
        yield key(area, '页面标识'), str(slide.slide_id)
        for shape in slide.shapes:
            name = f'{shape.name} #{shape.shape_id}'
            if shape.has_text_frame:
                yield key(area, name), shape.text
            if shape.has_table:
                for r, row in enumerate(shape.table.rows, 1):
                    for c, cell in enumerate(row.cells, 1):
                        yield key(area, f'{name} · {r} 行 {c} 列'), cell.text
            yield key(area, name + ' · 对象结构'), hashlib.sha256(shape._element.xml.encode()).hexdigest()
    yield from media(path)


@supports('.pdf')
def pdf(path):
    from pypdf import PdfReader
    reader = PdfReader(path)
    if reader.is_encrypted:
        raise ValueError('文档受密码保护')
    yield from document_details.pdf_form(reader)
    yield from document_details.pdf_bookmarks(reader)
    for k, v in (reader.metadata or {}).items():
        yield key('文档属性', k), str(v)
    for i, page in enumerate(reader.pages, 1):
        area = f'第 {i} 页'
        yield from office_properties.pdf_page(page, area)
        yield key(area, '页面文字'), page.extract_text() or ''
        data = page.get_contents()
        yield key(area, '页面内容摘要'), hashlib.sha256(data.get_data() if data else b'').hexdigest()
        for img in page.images:
            yield key(area, '图像 ' + img.name), hashlib.sha256(img.data).hexdigest()


@supports('.json', '.yaml', '.yml', '.jsonl', '.ndjson')
def structured(path, ext=None):
    import yaml
    text = text_of(path)
    def walk(v, pointer, ancestors):
        if isinstance(v,(dict,list)):
            if id(v) in ancestors:
                raise ValueError('文件包含循环引用')
            yield key('字段', pointer or '（根）'), '对象' if isinstance(v,dict) else '数组'
            for k, item in (v.items() if isinstance(v,dict) else enumerate(v)):
                segment = str(k).replace('~','~0').replace('/','~1')
                yield from walk(item, pointer + '/' + segment, ancestors | {id(v)})
        else:
            yield key('字段',pointer or '（根）'), json.dumps(v,ensure_ascii=False,default=str)
    if ext in ('.jsonl','.ndjson'):
        for i,line in enumerate(text.splitlines(),1):
            if line.strip():
                try:
                    value=json.loads(line,object_pairs_hook=file_properties.json_object)
                except ValueError as exc:
                    raise ValueError(f'第 {i} 行：{exc}') from exc
                yield from walk(value,f'/行{i}',set())
    else:
        data=json.loads(text,object_pairs_hook=file_properties.json_object) if ext=='.json' else yaml.safe_load(text)
        yield from walk(data,'',set())


@supports('.xml')
def xml(path):
    def walk(el, pointer):
        yield key('节点', pointer), el.text or ''
        for k,v in el.attrib.items():
            yield key('属性', pointer + '/@' + k), v
        counts = defaultdict(int)
        for child in el:
            counts[child.tag] += 1
            yield from walk(child, f'{pointer}/{child.tag}[{counts[child.tag]}]')
            if child.tail and child.tail.strip():
                yield key('尾随文本', f'{pointer}/{child.tag}[{counts[child.tag]}]'), child.tail
    root = ET.parse(path).getroot()
    yield from walk(root,'/'+root.tag)


@supports('.csv', '.tsv')
def tabular(path, ext=None):
    text=text_of(path)
    stream=io.StringIO(text,newline='')
    delimiter='\t' if ext=='.tsv' else ','
    first=stream.readline().rstrip('\r\n')
    if ext=='.csv' and first.lower() in ('sep=;', 'sep=,', 'sep=\t', 'sep=|'):
        delimiter=first[-1]
    else:
        stream.seek(0)
        if ext=='.csv' and ';' in first:
            try:
                delimiter=csv.Sniffer().sniff(text[:8192],delimiters=',;').delimiter
            except csv.Error:
                pass
    for r,row in enumerate(csv.reader(stream,delimiter=delimiter),1):
        if not row:
            yield key('数据表',f'第 {r} 行 · 空记录'),'空记录'
        for c,v in enumerate(row,1):
            yield key('数据表', f'第 {r} 行 · 第 {c} 列'), v


supports('.odt','.ods','.odp')(opendocument.document)
supports('.toml')(semantic.toml)
supports('.ini')(semantic.ini)
supports('.ipynb')(semantic.notebook)
supports('.srt')(semantic.subtitles)
supports('.svg','.xsd','.xsl','.xslt','.csproj','.props','.targets')(xml)
supports('.eml')(message_formats.mail)
supports('.epub')(package_details.epub)
supports('.gpx')(message_formats.gpx)
supports('.vcf')(exchange_formats.contacts)
supports('.ics')(exchange_formats.calendars)
supports('.vtt')(exchange_formats.subtitles)
supports('.geojson')(exchange_formats.geojson)
supports('.wav')(exchange_formats.wave_audio)
supports('.tar')(exchange_formats.tar_archive)
supports('.zip')(file_properties.archive)
supports('.png','.jpg','.jpeg','.gif','.webp','.bmp','.tif','.tiff')(file_properties.image)

TEXT = {'.txt','.md','.sql','.log','.py','.js','.ts','.css','.html','.cfg','.ps1','.psm1','.bat','.cmd','.sh','.rs','.go','.c','.h','.cpp','.hpp','.java','.kt','.jsx','.tsx','.vue','.scss','.rst','.diff','.patch'}


def extract(path, ext):
    if path.stat().st_size > PARSE_BYTES:
        raise ValueError('超过 32 MiB 内容解析上限')
    plugin = plugins[ext]
    if zipfile.is_zipfile(path):
        with zipfile.ZipFile(path) as z:
            if sum(f.file_size for f in z.infolist()) > 128 * 1024**2:
                raise ValueError('解包后超过 128 MiB 内容解析上限')
    entries = plugin(path, ext) if plugin in (structured,tabular) else plugin(path)
    out = {}
    for k,v in entries:
        if len(out) >= LIMIT:
            raise ValueError('超过单文件解析位置上限')
        out[k] = v
    return out


def row(sheet, loc, old, new):
    def value(v):
        return v[1] if isinstance(v,tuple) else v
    return dict(sheet=sheet,location=loc,kind='新增' if old is None else '删除' if new is None else '修改',
                old=value(old),new=value(new))


def compare(a, b, ext, mode='aligned'):
    if ext in SOURCE_FORMATS and mode=='coordinate':
        return compare(a,b,'.txt')
    if ext not in plugins and ext not in TEXT:
        return '属性对比', []
    if ext in TEXT:
        if max(a.stat().st_size,b.stat().st_size)>PARSE_BYTES:
            raise ValueError('超过文本解析上限')
        atext,acode=file_properties.decode_text(a)
        btext,bcode=file_properties.decode_text(b)
        left,right = atext.splitlines(),btext.splitlines()
        if max(len(left),len(right))>LIMIT:
            raise ValueError('超过行数上限')
        out = []
        for tag,i,j,k,l in SequenceMatcher(None,left,right).get_opcodes():
            if tag == 'equal':
                continue
            for n in range(max(j-i,l-k)):
                loc = f'旧 {i+n+1 if i+n<j else "—"} 行 / 新 {k+n+1 if k+n<l else "—"} 行'
                out.append(row('文本',loc,left[i+n] if i+n<j else None,right[k+n] if k+n<l else None))
        before=file_properties.serialization(atext,acode)
        after=file_properties.serialization(btext,bcode)
        out.extend(row('文本属性',k,v,after[k]) for k,v in before.items() if v!=after[k])
        return '已解析',out
    try:
        left,right = extract(a,ext),extract(b,ext)
    except (semantic.configparser.Error,semantic.tomllib.TOMLDecodeError):
        status,lines=compare(a,b,'.txt')
        for line in lines:
            line['sheet']='配置原文 · '+line['sheet']
        return status,lines
    if ext in ('.csv','.tsv') and mode=='aligned':
        changes=tabular_diff.compare(left,right,row)
        if changes is not None:return '已解析',changes
    if ext in excel_diff.EXTENSIONS:
        return '已解析', excel_diff.compare_excel(left,right,mode)
    if ext=='.docx' and mode=='aligned':
        return '已解析', word_diff.compare(left,right,row)
    def natural(pair):
        return tuple((1,int(s)) if s.isdigit() else (0,s) for s in re.split(r'(\d+)',pair[0]+'\0'+pair[1]))
    out = [row(*k,left.get(k),right.get(k)) for k in sorted(left.keys()|right.keys(),key=natural) if left.get(k)!=right.get(k)]
    return '已解析',out

