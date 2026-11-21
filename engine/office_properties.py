"""可复核的 Office 排版、链接、打印及页面属性。"""
import json


def local(name):
    return name.rsplit('}', 1)[-1]


def describe(node):
    """Drop namespace prefixes and XML ordering noise while preserving child order."""
    values = {local(k): v for k, v in sorted(node.attrib.items())}
    if node.text:
        values['内容'] = node.text
    if len(node):
        values['子项'] = [{local(child.tag): describe(child)} for child in node]
    return values


def as_text(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(', ', ': '))


def workbook_names(book):
    for name, item in book.defined_names.items():
        yield ('工作簿 · 命名区域', name), item.attr_text or ''


def worksheet(sheet):
    group = sheet.title
    names = {'visible':'可见', 'hidden':'隐藏', 'veryHidden':'深度隐藏'}
    plain = [
        ('工作表可见性', names.get(sheet.sheet_state, sheet.sheet_state)),
        ('冻结窗格', sheet.freeze_panes),
        ('打印区域', str(sheet.print_area) if sheet.print_area else None),
        ('打印标题', sheet.print_titles),
        ('工作表保护', as_text(dict(sheet.protection)) if sheet.protection.sheet else None),
    ]
    for label, value in plain:
        if value is not None:
            yield (group, label), value
    for label, obj in [
        ('自动筛选',sheet.auto_filter), ('打印边距',sheet.page_margins),
        ('纸张与分页设置',sheet.page_setup), ('打印选项',sheet.print_options),
        ('标签颜色',sheet.sheet_properties.tabColor), ('手动横向分页',sheet.row_breaks),
        ('手动纵向分页',sheet.col_breaks),
    ]:
        if obj is not None:
            value = describe(obj.to_tree())
            if value:
                yield (group, label), as_text(value)
    view = sheet.sheet_view
    for label, attr, default in [('显示网格线','showGridLines',True), ('显示公式','showFormulas',False),
                                 ('视图缩放','zoomScale',100)]:
        value = getattr(view,attr)
        if value is not None and value != default:
            yield (group,label), str(value) if attr=='zoomScale' else ('是' if value else '否')
    for section in sheet.conditional_formatting:
        rules = [describe(rule.to_tree()) for rule in section.rules]
        for value,rule in zip(rules,section.rules):
            if rule.dxf is not None:
                value.pop('dxfId',None)
                value['差异格式']=describe(rule.dxf.to_tree())
        yield (group, '条件格式 '+str(section.sqref)), as_text(rules)
    for name, item in sheet.defined_names.items():
        yield (group,'局部名称 '+name), item.attr_text or ''


SECTION_ELEMENTS = {
    'pgSz':'纸张尺寸与方向', 'pgMar':'页面边距', 'type':'分节方式', 'cols':'分栏',
    'pgNumType':'页码编排', 'pgBorders':'页面边框', 'lnNumType':'行号设置',
    'vAlign':'页面垂直对齐', 'titlePg':'首页独立页眉页脚', 'textDirection':'页面文字方向',
}


def word_layout(document):
    for i, section in enumerate(document.sections,1):
        group = f'第 {i} 节 · 页面设置'
        for child in section._sectPr:
            tag = local(child.tag)
            if tag in SECTION_ELEMENTS:
                yield (group, SECTION_ELEMENTS[tag]), as_text(describe(child))
    for attr, label in [('title','标题'),('subject','主题'),('author','作者'),('keywords','关键词'),
                        ('category','类别'),('comments','说明')]:
        value = getattr(document.core_properties,attr)
        if value:
            yield ('文档属性',label),value


def presentation(prs):
    yield ('演示设置','幻灯片尺寸（EMU）'), f'{prs.slide_width} × {prs.slide_height}'
    for i, slide in enumerate(prs.slides,1):
        group = f'幻灯片 {i}'
        if slide._element.get('show','1') in ('0','false'):
            yield (group,'放映可见性'),'隐藏'
        if slide.has_notes_slide:
            notes = slide.notes_slide.notes_text_frame
            if notes and notes.text.strip():
                yield (group,'演讲者备注'),notes.text
        for shape in slide.shapes:
            name=f'{shape.name} #{shape.shape_id}'
            geometry = (shape.left,shape.top,shape.width,shape.height,shape.rotation)
            yield (group,name+' · 位置尺寸'), '左 %s / 上 %s / 宽 %s / 高 %s EMU / 旋转 %s°' % geometry
            elements=shape._element.xpath('./*/p:cNvPr')
            if elements and elements[0].get('descr'):
                yield (group,name+' · 替代文字'),elements[0].get('descr')


def pdf_page(page, group):
    for label, box in [('纸张边界',page.mediabox),('裁切边界',page.cropbox)]:
        yield (group,label), ', '.join(str(n) for n in box)
    yield (group,'页面旋转'), str(page.rotation)+'°'
    refs=page.get('/Annots')
    for index,ref in enumerate(refs.get_object() if refs else (),1):
        annotation=ref.get_object()
        if not hasattr(annotation,'get'):
            continue
        for label,value in [('批注',annotation.get('/Contents')),
                            ('链接目标',(annotation.get('/A') or {}).get_object().get('/URI') if annotation.get('/A') else None)]:
            if value is not None:
                yield (group,f'{label} {index}'),str(value)
