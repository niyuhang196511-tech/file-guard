"""Read interchange formats as data. Every comparison reads only the saved object."""
from collections import Counter
import hashlib
import json
import re
import struct
import tarfile

from .file_properties import decode_text, json_object

TEXT_EXTENSIONS = {'.vcf', '.ics', '.vtt', '.geojson'}
EXTENSIONS = TEXT_EXTENSIONS | {'.wav', '.tar'}


def literal(value):
    return json.dumps(value, ensure_ascii=False, separators=(',', ':'), sort_keys=True)


def occurrence(counts, name):
    counts[name] += 1
    return f'{name} #{counts[name]}'


def content_tree(path):
    # Unfold continuation lines before interpreting component boundaries.
    lines = []
    for raw in decode_text(path)[0].splitlines():
        if raw.startswith((' ', '\t')) and lines:
            lines[-1].append(raw[1:])
        else:
            lines.append([raw])
    roots, stack = [], []
    for parts in lines:
        line = ''.join(parts)
        if not line.strip():
            continue
        # A colon inside a quoted parameter belongs to the parameter.
        match = re.match(r'^((?:[^":]|"[^"]*")*):(.*)$', line)
        if not match:
            raise ValueError('属性行缺少分隔符，可以切换原文核对')
        head, value = match.groups()
        field, _, params = head.partition(';')
        if field.upper() == 'BEGIN':
            node = {'type': value.upper(), 'fields': [], 'children': []}
            (stack[-1]['children'] if stack else roots).append(node)
            stack.append(node)
        elif field.upper() == 'END':
            if not stack or stack.pop()['type'] != value.upper():
                raise ValueError('组件起止标记不匹配')
        elif stack:
            stack[-1]['fields'].append((field.upper(), params, value))
        else:
            raise ValueError('属性不在组件内')
    if stack or not roots:
        raise ValueError('组件不完整')
    return roots


def components(path, root_type):
    def visit(nodes, parent):
        counts = Counter()
        for node in nodes:
            fields = node['fields']
            ids = {k: v for k, _, v in fields if k in ('UID', 'RECURRENCE-ID', 'TZID')}
            ident = [node['type'], ids.get('UID', ids.get('TZID', '')), ids.get('RECURRENCE-ID', '')]
            area = parent + occurrence(counts, literal(ident))
            yield (area, '组件'), node['type']
            properties = Counter()
            for key, params, value in fields:
                loc = occurrence(properties, key)
                yield (area, loc), value
                if params:
                    yield (area, loc + ' · 参数'), params
            yield from visit(node['children'], area + ' / ')
    roots = content_tree(path)
    if any(node['type'] != root_type for node in roots):
        raise ValueError('文件组件类型无效')
    yield from visit(roots, '')


def contacts(path):
    yield from components(path, 'VCARD')


def calendars(path):
    yield from components(path, 'VCALENDAR')


def geojson(path):
    doc = json.loads(decode_text(path)[0], object_pairs_hook=json_object)
    def fields(value, pointer):
        if isinstance(value, (list, dict)):
            yield pointer, ('数组' if isinstance(value, list) else '对象')
            for name, child in (enumerate(value) if isinstance(value, list) else value.items()):
                segment = str(name).replace('~', '~0').replace('/', '~1')
                yield from fields(child, pointer + '/' + segment)
        else:
            yield pointer, literal(value)
    def geometry(node, pointer):
        if node is None:
            yield pointer, 'null'
            return
        typ = node['type']
        yield pointer + '/type', typ
        if 'bbox' in node:
            yield pointer + '/bbox', literal(node['bbox'])
        if typ == 'GeometryCollection':
            for i, member in enumerate(node['geometries']):
                yield from geometry(member, f'{pointer}/geometries/{i}')
        elif typ in ('Point','MultiPoint','LineString','MultiLineString','Polygon','MultiPolygon'):
            def positions(coords, loc):
                if not isinstance(coords,list):
                    raise ValueError('坐标必须为数组')
                if not coords or not isinstance(coords[0],list):
                    yield loc,literal(coords)
                else:
                    for i,item in enumerate(coords):
                        yield from positions(item,loc+'/'+str(i))
            yield from positions(node['coordinates'],pointer+'/coordinates')
        else:
            raise ValueError('未识别的几何类型')
    if not isinstance(doc,dict) or not isinstance(doc.get('type'),str):raise ValueError('地理数据缺少类型')
    typ = doc['type']
    yield ('地理数据','类型'),typ
    if 'bbox' in doc:
        yield ('地理数据','边界框'), literal(doc['bbox'])
    if typ not in ('FeatureCollection','Feature'):
        for k,v in geometry(doc,'geometry'):
            yield ('几何',k),v
        return
    counts = Counter()
    for i, feature in enumerate(doc['features'] if typ=='FeatureCollection' else [doc]):
        if feature.get('type')!='Feature':raise ValueError('无效的地理要素')
        label = 'ID '+literal(feature['id']) if 'id' in feature else '序号 '+str(i+1)
        area = occurrence(counts, label)
        yield (area,'顺序'),str(i+1)
        if 'bbox' in feature:yield (area,'边界框'),literal(feature['bbox'])
        for k,v in fields(feature['properties'],'properties'):
            yield (area,k),v
        for k,v in geometry(feature['geometry'],'geometry'):
            yield (area,k),v


def subtitles(path):
    lines = decode_text(path)[0].splitlines()
    if not lines or not re.fullmatch(r'WEBVTT(?:[ \t].*)?', lines[0].lstrip('\ufeff')):
        raise ValueError('缺少 WEBVTT 文件头')
    yield ('字幕头','标题'),lines[0].lstrip('\ufeff')[6:].strip()
    blocks=re.split(r'\n[ \t]*\n','\n'.join(lines))
    for i,line in enumerate(blocks[0].splitlines()[1:],1):
        yield ('字幕头',f'元数据 {i}'),line
    counts=Counter()
    index=0
    for block in blocks[1:]:
        rows=block.strip('\n').splitlines()
        if not rows:continue
        first=rows[0]
        group=first.split(maxsplit=1)[0] if first.strip() else ''
        if group in ('NOTE','STYLE','REGION'):
            yield ('字幕附属块',occurrence(counts,group)),'\n'.join(rows)
            continue
        index+=1
        named='-->' not in first
        timing=rows[1] if named and len(rows)>1 else first
        match=re.fullmatch(r'(\S+)\s+-->\s+(\S+)(?:[ \t]+(.*))?',timing)
        if not match:raise ValueError('字幕缺少时间范围')
        start,end,settings=match.groups()
        area=occurrence(counts,'提示 '+literal(first)) if named else '未命名提示 '+str(index)
        for field,value in [('顺序',str(index)),('开始',start),('结束',end),('显示设置',settings or ''),('字幕','\n'.join(rows[2 if named else 1:]))]:
            yield (area,field),value


def wave_audio(path):
    with path.open('rb') as f:
        header=f.read(12)
        if len(header)!=12 or header[:4]!=b'RIFF' or header[8:]!=b'WAVE':raise ValueError('仅支持 RIFF/WAVE 音频')
        limit=8+struct.unpack_from('<I',header,4)[0]
        if limit<12 or limit>path.stat().st_size:raise ValueError('音频容器长度无效')
        counts=Counter();sample_bytes=0;align=rate=0;has_data=False
        while f.tell()<limit:
            chunk=f.read(8)
            if len(chunk)!=8:raise ValueError('音频块头不完整')
            name=chunk[:4];size=struct.unpack_from('<I',chunk,4)[0]
            if f.tell()+size>limit:raise ValueError('音频块超出容器长度')
            block=f.read(size)
            if size%2 and f.tell()<limit:f.read(1)
            if name==b'fmt ':
                if size<16 or align:raise ValueError('音频格式块无效')
                typ,channels,rate,byte_rate,align,bits=struct.unpack_from('<HHIIHH',block)
                if not align or not rate:raise ValueError('音频采样参数无效')
                for key,value in [('编码标识',typ),('声道数',channels),('采样率',rate),('每秒字节',byte_rate),('帧对齐字节',align),('位深',bits)]:
                    yield ('音频格式',key),str(value)
                if size>16:yield ('音频格式','扩展参数'),hashlib.sha256(block[16:]).hexdigest()
            else:
                area=occurrence(counts,name.decode('latin1'))
                yield (area,'字节数'),str(size)
                yield (area,'内容摘要'),hashlib.sha256(block).hexdigest()
                if name==b'data':sample_bytes+=size;has_data=True
        if not align or not has_data:raise ValueError('缺少格式块或音频数据')
        if typ in (1,3):
            if sample_bytes%align:raise ValueError('音频帧不完整')
            yield ('采样','帧数'),str(sample_bytes//align)
            yield ('采样','时长（微秒）'),str(round(sample_bytes*1_000_000/(align*rate)))


def tar_archive(path):
    counts=Counter(); logical=0
    with tarfile.open(path,mode='r:') as archive:
        for i,entry in enumerate(archive,1):
            logical+=entry.size
            if logical>128*1024**2:raise ValueError('归档逻辑内容超过 128 MiB')
            area=occurrence(counts,literal(entry.name))
            kind={tarfile.REGTYPE:'文件',tarfile.AREGTYPE:'文件',tarfile.DIRTYPE:'目录',tarfile.SYMTYPE:'符号链接',tarfile.LNKTYPE:'硬链接'}.get(entry.type,repr(entry.type))
            for field,value in [('顺序',i),('类型',kind),('长度',entry.size),('权限',oct(entry.mode)),('用户 ID',entry.uid),('组 ID',entry.gid),('用户名',entry.uname),('组名',entry.gname),('修改时间',entry.mtime)]:
                yield (area,field),str(value)
            if entry.issym() or entry.islnk():
                yield (area,'链接目标'),entry.linkname
            if entry.isfile():
                with archive.extractfile(entry) as stream:
                    yield (area,'内容摘要'),hashlib.file_digest(stream,'sha256').hexdigest()
