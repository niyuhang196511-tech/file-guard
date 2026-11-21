"""Word 文档各区域独立对齐。保持原段号，表格等非段落位置单独比较。"""
from difflib import SequenceMatcher
import re
from .document_details import paragraph, WORD_GROUPS

HEADERS = (
    ('header', '页眉'), ('footer', '页脚'),
    ('first_page_header', '首页页眉'), ('first_page_footer', '首页页脚'),
    ('even_page_header', '偶数页页眉'), ('even_page_footer', '偶数页页脚'),
)
PARAGRAPH = re.compile(r'^第 (\d+) 段$')


def style_group(name):
    return '段落样式' if name=='正文' else name+' · 段落样式'


def table_entries(table, group):
    seen = set()
    for r, table_row in enumerate(table.rows,1):
        for c, cell in enumerate(table_row.cells,1):
            if cell._tc in seen:
                continue
            seen.add(cell._tc)
            loc=f'第 {r} 行 · 第 {c} 列'
            yield (group,loc), cell.text
            for n,para in enumerate(cell.paragraphs,1):
                for label,value in paragraph(para):
                    yield (group,loc+f' · 段 {n} · '+label),value
            for n, nested in enumerate(cell.tables,1):
                yield from table_entries(nested,f'{group} / {loc} / 表格 {n}')


def story_entries(story, name):
    for index,para in enumerate(story.paragraphs,1):
        loc=f'第 {index} 段'
        yield (name,loc),para.text
        for label,value in paragraph(para):
            yield (name+' · '+label,loc),value
        if para.style:
            yield (style_group(name),loc),para.style.name
    for n,table in enumerate(story.tables,1):
        group=f'表格 {n}' if name=='正文' else f'{name} / 表格 {n}'
        yield from table_entries(table,group)


def entries(document):
    yield from story_entries(document,'正文')
    for number,section in enumerate(document.sections,1):
        for attr,label in HEADERS:
            story=getattr(section,attr)
            if not story.is_linked_to_previous:
                yield from story_entries(story,f'第 {number} 节 · {label}')


def paragraph_groups(snapshot):
    groups={}
    other={}
    for (group,loc),value in snapshot.items():
        match=PARAGRAPH.fullmatch(loc)
        if match:
            groups.setdefault(group,{})[int(match[1])]=value
        else:
            other[group,loc]=value
    return groups,other


def align(a,b):
    """相同段落为锚点。长度不等的未匹配区间按删除和新增展示。"""
    for tag,i,j,k,l in SequenceMatcher(None,a,b).get_opcodes():
        if tag=='equal' or j-i==l-k:
            yield from zip(range(i+1,j+1),range(k+1,l+1))
        else:
            yield from ((n,None) for n in range(i+1,j+1))
            yield from ((None,n) for n in range(k+1,l+1))


def compare(left,right,make_row):
    a,meta_a=paragraph_groups(left)
    b,meta_b=paragraph_groups(right)
    out=[]
    for group in dict.fromkeys([*a,*b]):
        if group.endswith(('段落样式',*WORD_GROUPS)):
            continue
        old=a.get(group,{})
        new=b.get(group,{})
        styles=style_group(group)
        old_styles=a.get(styles,{})
        new_styles=b.get(styles,{})
        for i,j in align(list(old.values()),list(new.values())):
            loc=f'第 {i or j} 段' if i==j or not (i and j) else f'旧第 {i} 段 → 新第 {j} 段'
            if old.get(i)!=new.get(j):
                out.append(make_row(group,loc,old.get(i),new.get(j)))
            for suffix in WORD_GROUPS:
                extra=group+' · '+suffix
                av=a.get(extra,{}).get(i);bv=b.get(extra,{}).get(j)
                if av!=bv:out.append(make_row(extra,loc,av,bv))
            if i and j and old_styles.get(i)!=new_styles.get(j):
                out.append(make_row(styles,loc,old_styles.get(i),new_styles.get(j)))
    for key in dict.fromkeys([*meta_a,*meta_b]):
        if meta_a.get(key)!=meta_b.get(key):
            out.append(make_row(*key,meta_a.get(key),meta_b.get(key)))
    return out


def highlight(item):
    left,right=item['old'],item['new']
    if item['kind']!='修改' or not isinstance(left,str) or not isinstance(right,str):
        return item
    if '段' not in item['location'] or item['sheet'].endswith('段落样式'):
        return item
    if max(len(left),len(right))>1500 or len(left)*len(right)>300_000:
        return item
    before,after=[],[]
    for tag,i,j,k,l in SequenceMatcher(None,left,right,autojunk=False).get_opcodes():
        if i<j:
            before.append([left[i:j],tag!='equal'])
        if k<l:
            after.append([right[k:l],tag!='equal'])
    return {**item,'old_parts':before,'new_parts':after}
