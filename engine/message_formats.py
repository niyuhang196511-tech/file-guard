from collections import Counter
from email import policy
from email.parser import BytesParser
import hashlib
from xml.etree import ElementTree as ET


def mail(path):
    message=BytesParser(policy=policy.default).parsebytes(path.read_bytes())
    for header in ('From','To','Cc','Bcc','Reply-To','Subject','Date','Message-ID','In-Reply-To','References'):
        for i,value in enumerate(message.get_all(header,[]),1):
            yield ('邮件头',f'{header} {i}'),str(value)
    counts=Counter()
    for part in message.walk():
        if part.is_multipart():continue
        mime=part.get_content_type()
        filename=part.get_filename()
        if filename or part.get_content_disposition()=='attachment' or part.get_content_maintype()!='text':
            name=filename or str(part.get('Content-ID') or mime)
            counts['attachment',name]+=1
            loc=f'{name} #{counts["attachment",name]}'
            data=part.get_payload(decode=True) or b''
            for field,value in [('类型',mime),('字节',str(len(data))),('内容摘要',hashlib.sha256(data).hexdigest())]:
                yield ('附件',loc+' · '+field),value
        else:
            counts['body',mime]+=1
            text=part.get_content().replace('\r\n','\n').rstrip('\n')
            yield ('邮件正文',f'{mime} #{counts["body",mime]}'),text


def gpx(path):
    root=ET.parse(path).getroot()
    def tag(n):return n.tag.rsplit('}',1)[-1]
    def walk(node,group):
        counts=Counter()
        for el in node:
            name=tag(el);counts[name]+=1
            if name in ('wpt','trk','trkseg','trkpt','rte','rtept'):
                loc=f'{group}/{name}[{counts[name]}]'
                for field in ('lat','lon'):
                    if field in el.attrib:yield (loc,field),el.get(field)
                yield from walk(el,loc)
            elif name=='metadata':
                yield from walk(el,'元数据')
            elif name in ('name','desc','time','ele','sym','type','cmt','number'):
                yield (group,name),el.text or ''
    if tag(root)!='gpx':raise ValueError('缺少 GPX 根节点')
    yield from walk(root,'路线')
