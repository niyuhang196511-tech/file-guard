"""按配置键、笔记单元和字幕编号建立稳定位置。"""
import configparser
import hashlib
import json
import re
import tomllib
from .file_properties import decode_text, json_object


def encode(value):
    return json.dumps(value,ensure_ascii=False,sort_keys=True,default=str,separators=(',',':'))


def toml(path):
    data = tomllib.loads(decode_text(path)[0])
    def walk(value, pointer):
        if isinstance(value,dict):
            yield ('配置表',pointer or '/'),'表'
            for key,child in value.items():
                yield from walk(child,pointer+'/'+key.replace('~','~0').replace('/','~1'))
        elif isinstance(value,list):
            yield ('配置数组',pointer),str(len(value))
            for index,child in enumerate(value):
                yield from walk(child,pointer+'/'+str(index))
        else:
            kind = type(value).__name__
            yield ('配置值',pointer),kind+' '+encode(value)
    yield from walk(data,'')


def ini(path):
    parser = configparser.ConfigParser(interpolation=None,strict=True)
    parser.optionxform = str
    parser.read_string(decode_text(path)[0])
    for name,entries in parser._sections.items():
        yield ('配置节',name),'节'
        for key,value in entries.items():
            yield ('节 '+name,key),value
    for key,value in parser.defaults().items():
        yield ('默认值',key),value


def notebook(path):
    data = json.loads(decode_text(path)[0],object_pairs_hook=json_object)
    yield ('笔记本','格式版本'),f"{data['nbformat']}.{data['nbformat_minor']}"
    yield ('笔记本','元数据'),encode(data.get('metadata',{}))
    cells = data['cells']
    if not isinstance(cells,list):
        raise ValueError('笔记本单元列表无效')
    seen = set()
    for position,cell in enumerate(cells,1):
        label = 'ID '+str(cell['id']) if cell.get('id') else f'位置 {position}'
        if label in seen:
            raise ValueError('笔记本单元编号重复：'+label)
        seen.add(label)
        yield (label,'顺序'),str(position)
        yield (label,'类型'),cell['cell_type']
        yield (label,'内容'),''.join(cell['source'])
        yield (label,'元数据'),encode(cell.get('metadata',{}))
        if 'execution_count' in cell:
            yield (label,'执行次数'),encode(cell['execution_count'])
        for index,output in enumerate(cell.get('outputs',[]),1):
            digest = hashlib.sha256(encode(output).encode()).hexdigest()
            yield (label,f'输出 {index}'),output['output_type']+' '+digest
        for name,value in cell.get('attachments',{}).items():
            yield (label,'附件 '+name),hashlib.sha256(encode(value).encode()).hexdigest()


def subtitles(path):
    seen = set()
    for block in re.split(r'\n[ \t]*\n',decode_text(path)[0].replace('\r\n','\n').replace('\r','\n').strip()):
        lines = block.splitlines()
        if len(lines)<2 or not lines[0].strip().isdigit() or '-->' not in lines[1]:
            raise ValueError('字幕编号或时间轴无效')
        label = '字幕 '+lines[0].strip()
        if label in seen:
            raise ValueError('字幕编号重复：'+label)
        seen.add(label)
        start,end = lines[1].split('-->',1)
        yield (label,'开始'),start.strip()
        yield (label,'结束'),end.strip()
        yield (label,'字幕文字'),'\n'.join(lines[2:])
