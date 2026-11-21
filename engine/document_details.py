"""Word 段落的显式排版和链接，PDF 交互式表单与导航。"""
from collections import defaultdict
from docx.oxml.ns import qn
from .office_properties import as_text,describe,local

WORD_GROUPS=('字符格式','段落排版','段落链接')
RUN={'b':'加粗','i':'斜体','u':'下划线','strike':'删除线','highlight':'高亮','color':'文字颜色',
     'rFonts':'字体','sz':'字号（半磅）','vertAlign':'上下标','rStyle':'字符样式','vanish':'隐藏文字'}
PARA={'jc':'对齐','spacing':'段落间距','ind':'缩进','numPr':'列表编号','tabs':'制表位',
      'keepNext':'与下段同页','keepLines':'段内不分页','pageBreakBefore':'段前分页','pBdr':'段落边框'}


def properties(node,labels):
    result={}
    if node is None:return result
    for child in node:
        label=labels.get(local(child.tag))
        if label:
            attrs=describe(child)
            result[label]=attrs['val'] if set(attrs)=={'val'} else (attrs or '启用')
    return result


def paragraph(para):
    styles=[]
    pos=0
    for run in para._p.xpath('./w:r|./w:hyperlink/w:r'):
        text=run.text or ''
        length=len(text)
        attrs=properties(run.find(qn('w:rPr')),RUN)
        if attrs and length:
            if styles and styles[-1][1]==pos and styles[-1][2]==attrs:
                styles[-1][1]+=length
            else:
                styles.append([pos,pos+length,attrs])
        pos+=length
    if styles:
        yield '字符格式','\n'.join(f'字符 {a+1}–{b}：{as_text(attrs)}' for a,b,attrs in styles)
    layout=properties(para._p.find(qn('w:pPr')),PARA)
    if layout:yield '段落排版',as_text(layout)
    links=[]
    for link in para._p.xpath('./w:hyperlink'):
        text=''.join(link.xpath('.//w:t/text()'))
        rid=link.get(qn('r:id'))
        rel=para.part.rels.get(rid)
        target=rel.target_ref if rel else ''
        anchor=link.get(qn('w:anchor'))
        links.append(f'{text} → {target}'+('#'+anchor if anchor else ''))
    if links:yield '段落链接','\n'.join(links)


def pdf_form(reader):
    root=reader.root_object
    form=root.get('/AcroForm')
    if not form:return
    fields=form.get_object().get('/Fields',[])
    seen=set()
    def walk(ref,prefix='',fieldtype=None):
        node=ref.get_object()
        if not hasattr(node,'get') or id(node) in seen:return
        seen.add(id(node))
        title=node.get('/T')
        name='.'.join(n for n in (prefix,str(title) if title is not None else '') if n)
        kind=node.get('/FT',fieldtype)
        if name and title is not None:
            group='表单 · '+name
            if kind:yield (group,'字段类型'),{'/Tx':'文本','/Btn':'按钮','/Ch':'选择','/Sig':'签名'}.get(str(kind),str(kind))
            for k,label in [('/V','当前值'),('/DV','默认值'),('/TU','填写提示'),('/Opt','可选项'),('/MaxLen','长度上限'),('/Ff','字段标志')]:
                if k in node:
                    val=node[k]
                    if isinstance(val,dict) and str(kind)=='/Sig':
                        val={k:str(val[k]) for k in ('/Name','/M','/Reason') if k in val}
                    yield (group,label),as_text(val) if isinstance(val,(list,dict)) else str(val)
        for child in node.get('/Kids',[]):yield from walk(child,name,kind)
    for ref in fields:yield from walk(ref)


def pdf_bookmarks(reader):
    def walk(nodes,prefix):
        number=0
        for item in nodes:
            if isinstance(item,list):
                yield from walk(item,prefix+str(number)+'.')
            else:
                number+=1
                page=reader.get_destination_page_number(item)
                label=f'第 {page+1} 页' if page is not None and page>=0 else '目标未解析'
                yield ('书签',prefix+str(number)),f'{item.title} → {label}'
    yield from walk(reader.outline,'')
