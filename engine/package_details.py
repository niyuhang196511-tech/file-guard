"""读取文档包中的声明、媒体和图表，仅访问包内成员。"""
from collections import Counter
import hashlib
import json
import posixpath
from urllib.parse import unquote
import zipfile
from xml.etree import ElementTree as ET


def local(tag):
    return tag.rsplit('}',1)[-1]


def children(node,name):
    return [x for x in node if local(x.tag)==name]


def target(base,href):
    value=unquote(href.split('#',1)[0])
    path=posixpath.normpath(posixpath.join(posixpath.dirname(base),value)) if not value.startswith('/') else value[1:]
    if path.startswith('../') or path=='..' or '\\' in path:raise ValueError('包内引用路径无效')
    return path


def relationships(pack,src):
    folder,name=posixpath.split(src)
    rel=posixpath.join(folder,'_rels',name+'.rels')
    if rel not in pack.NameToInfo:return {}
    return {n.get('Id'):target(src,n.attrib['Target']) for n in ET.fromstring(pack.read(rel))
            if n.get('TargetMode')!='External'}


def linked(el):
    return next((v for k,v in el.attrib.items() if local(k) in ('id','embed') and k.startswith('{')),None)


def digest(data):return hashlib.sha256(data).hexdigest()


def workbook(path):
    with zipfile.ZipFile(path) as z:
        if 'xl/vbaProject.bin' in z.NameToInfo:
            yield ('工作簿附件','VBA 项目摘要'),digest(z.read('xl/vbaProject.bin'))
        wb='xl/workbook.xml';links=relationships(z,wb)
        for sheet in ET.fromstring(z.read(wb)).iter():
            if local(sheet.tag)!='sheet':continue
            src=links.get(linked(sheet))
            if not src:continue
            group=sheet.attrib['name']
            # Worksheet XML can be very large. Follow sheet relationships directly.
            for draw in relationships(z,src).values():
                if not draw.startswith('xl/drawings/') or not draw.endswith('.xml'):continue
                refs=relationships(z,draw);counts=Counter()
                for anchor in ET.fromstring(z.read(draw)):
                    for kind in ('pic','graphicFrame'):
                        for el in children(anchor,kind):
                            label='图片' if kind=='pic' else '图表'
                            counts[label]+=1
                            prefix=f'{label} {counts[label]} · '
                            for node in el.iter():
                                tag=local(node.tag)
                                if tag=='cNvPr':
                                    for k,title in [('name','名称'),('descr','替代文字')]:
                                        if node.get(k):yield (group,prefix+title),node.get(k)
                                if tag=='blip':
                                    dest=refs.get(linked(node))
                                    if dest:yield (group,prefix+'内容摘要'),digest(z.read(dest))
                                if tag=='chart':
                                    dest=refs.get(linked(node))
                                    if dest:yield from chart(z.read(dest),group,prefix)
                            for marker in anchor:
                                tag=local(marker.tag)
                                if tag in ('from','to','ext','pos'):
                                    info={local(x.tag):x.text for x in marker};info.update(marker.attrib)
                                    yield (group,prefix+'锚点 '+tag),json.dumps(info,sort_keys=True)


def chart(raw,group,prefix):
    root=ET.fromstring(raw);series=0;titles=0
    for node in root.iter():
        tag=local(node.tag)
        if tag=='title':
            label=''.join(t.text or '' for t in node.iter() if local(t.tag)=='t')
            if label:
                # Chart and axis titles may coexist.
                titles+=1
                yield (group,prefix+f'标题 {titles}'),label
        if tag=='plotArea':
            names=[local(c.tag) for c in node if local(c.tag).endswith('Chart')]
            yield (group,prefix+'图形类型'),', '.join(names)
        if tag=='legendPos':yield (group,prefix+'图例位置'),node.get('val','')
        if tag=='ser':
            series+=1
            for child in node:
                section=local(child.tag)
                if section not in ('tx','cat','val','xVal','yVal','bubbleSize'):continue
                values=[(local(x.tag),x.text) for x in child.iter() if local(x.tag) in ('f','v') and x.text is not None]
                if values:yield (group,prefix+f'系列 {series} · '+section),json.dumps(values,ensure_ascii=False)


def epub(path):
    with zipfile.ZipFile(path) as z:
        container=ET.fromstring(z.read('META-INF/container.xml'))
        src=next(x.attrib['full-path'] for x in container.iter() if local(x.tag)=='rootfile')
        root=ET.fromstring(z.read(src))
        counts=Counter()
        for metadata in children(root,'metadata'):
            for el in metadata:
                key=local(el.tag)
                if key not in ('title','creator','language','identifier','publisher','description','subject','date'):continue
                counts[key]+=1
                yield ('出版信息',f'{key} {counts[key]}'),''.join(el.itertext())
        manifest={}
        for m in children(root,'manifest'):
            for item in children(m,'item'):
                href=item.attrib['href'];entry=target(src,href);mime=item.get('media-type','')
                if item.attrib['id'] in manifest:raise ValueError('电子书资源编号重复')
                manifest[item.attrib['id']]=href
                yield ('资源类型',href),mime
                if '://' in href:continue
                if entry not in z.NameToInfo:raise ValueError('电子书包内资源缺失：'+href)
                raw=z.read(entry)
                if mime=='application/xhtml+xml':
                    page=ET.fromstring(raw)
                    for i,el in enumerate((x for x in page.iter() if local(x.tag) in ('p','h1','h2','h3','li')),1):
                        yield ('章节 '+href,f'段落 {i}'),' '.join(''.join(el.itertext()).split())
                else:
                    yield ('资源摘要',href),digest(raw)
        for spine in children(root,'spine'):
            for i,item in enumerate(children(spine,'itemref'),1):
                key=item.attrib['idref']
                yield ('阅读顺序',f'位置 {i}'),manifest.get(key,key)
