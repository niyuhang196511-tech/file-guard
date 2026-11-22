"""整行核对。行分页和列分页均在引擎端完成。"""
import re
from openpyxl.utils.cell import column_index_from_string
from . import excel_diff as excel
from .comparison import page_integer
from .formats import extract

ROW_PAGE=30
COL_PAGE=12


def normalized(data, col, default):
    if col is None:
        return (None,None,None,None)
    return (data.get((col,'')),data.get((col,' · 批注')),data.get((col,' · 格式'),default),
            data.get((col,' · 超链接')))


def cell_content(data,col,index,changed):
    val,comment,style,link=normalized(data,col,None)
    return dict(value=excel.render_value(val),address=f'{col}{index}' if col and index else '',
                type=excel.TYPES.get(val[0],'') if isinstance(val,tuple) else '',
                note='、'.join(changed))


def keyed_rows(a,b):
    ca,cb=excel.key_column(a),excel.key_column(b)
    if not ca or not cb or a[1][ca,'']!=b[1][cb,'']:
        return None,set()
    old,new=excel.row_ids(a,ca),excel.row_ids(b,cb)
    if old is None or new is None or not (old or new):
        return None,set()
    old_order=[v for v in old if v in new]
    new_order=[v for v in new if v in old]
    ranks={v:n for n,v in enumerate(old_order)}
    moved={new[v] for n,v in enumerate(new_order) if ranks[v]!=n}
    # Insert deleted records before the next surviving record in their original order.
    deleted={}
    next_id=None
    for identity in reversed(old):
        if identity in new:
            next_id=identity
        else:
            deleted.setdefault(next_id,[]).append(old[identity])
    pairs=[(1,1)]
    for identity,index in new.items():
        pairs.extend((i,None) for i in reversed(deleted.get(identity,[])))
        pairs.append((old.get(identity),index))
    pairs.extend((i,None) for i in reversed(deleted.get(None,[])))
    return pairs,moved


class Sheet:
    def __init__(self, left, right, mode):
        self.a,self.b=left['rows'],right['rows']
        self.defaults=(left['meta'].get(excel.DEFAULT),right['meta'].get(excel.DEFAULT))
        aligned,self.moved=keyed_rows(self.a,self.b) if mode=='aligned' else (None,set())
        old=excel.columns_by_field(self.a) if aligned else None
        new=excel.columns_by_field(self.b) if aligned else None
        if aligned and not(old and new) and excel.key_column(self.a)!=excel.key_column(self.b):
            aligned=None
            self.moved=set()
        self.id_cols=(excel.key_column(self.a),excel.key_column(self.b)) if aligned else (None,None)
        self.key=excel.render_value(self.b[1][excel.key_column(self.b),'']) if aligned else ''
        old_labels,new_labels=excel.header_labels(self.a),excel.header_labels(self.b)
        self.same_headers=old_labels==new_labels
        if aligned and old and new:
            ordered=excel.ordered_fields(new)+[n for n in excel.ordered_fields(old) if n not in new]
            self.cols=[(name,old.get(name),new.get(name)) for name in ordered]
        else:
            columns={c for rows in (self.a,self.b) for data in rows.values() for c,_ in data}
            self.cols=[(new_labels.get(c) or old_labels.get(c) or c,c,c) for c in sorted(columns,key=column_index_from_string)]
        self.pairs=aligned or [(i if i in self.a else None,i if i in self.b else None) for i in sorted(self.a.keys()|self.b.keys())]
        self.compact=[]
        # Inspect populated cells only, including sparse sheets with distant columns.
        self.old_index={c:i for i,(_,c,_) in enumerate(self.cols) if c}
        self.new_index={c:i for i,(_,_,c) in enumerate(self.cols) if c}
        self.changes=[]
        for n,(i,j) in enumerate(self.pairs):
            a,b=self.a.get(i,{}),self.b.get(j,{})
            touched={self.old_index[c] for c,_ in a}|{self.new_index[c] for c,_ in b}
            changes={}
            for ix in touched:
                _,ca,cb=self.cols[ix]
                va=normalized(a,ca,self.defaults[0])
                vb=normalized(b,cb,self.defaults[1])
                labels=[label for label,x,y in zip(('内容','批注','格式','超链接'),va,vb) if x!=y]
                if i and j and i!=j and self.same_headers and '内容' in labels and excel.translated_formula(va[0],vb[0],f'{ca}{i}',f'{cb}{j}'):
                    labels.remove('内容')
                if labels:
                    changes[ix]=labels
            self.changes.append(changes)
            if i and j and not changes and j not in self.moved:
                if self.compact and self.compact[-1][0]=='gap':
                    self.compact[-1][2]+=1
                else:
                    self.compact.append(['gap',n,1])
            else:
                self.compact.append(['row',n,1])

        self.row_filters={}
        self.tags=[]
        for idx,((i,j),changes) in enumerate(zip(self.pairs,self.changes)):
            tags=set(tag for meta in changes.values() for tag in meta)
            if not i:tags.add('新增行')
            elif not j:tags.add('删除行')
            elif changes:tags.add('修改行')
            if j in self.moved:tags.add('调序行')
            self.tags.append(sorted(tags))
            for tag in tags:self.row_filters.setdefault(tag,[]).append(idx)
        self.summary={'旧表记录行':len(self.a),'新表记录行':len(self.b),'新增行':0,'删除行':0,'修改行':0,'调序行':len(self.moved)}
        for (i,j),changes in zip(self.pairs,self.changes):
            if not i:self.summary['新增行']+=1
            elif not j:self.summary['删除行']+=1
            elif changes:self.summary['修改行']+=1

    def cell_entries(self):
        for index,(left,right) in enumerate(self.pairs):
            for side,num,table,colmap in [('old',left,self.a,self.old_index),('new',right,self.b,self.new_index)]:
                if num is None:continue
                data=table[num]
                for col in sorted((col for col,attr in data if not attr),key=column_index_from_string):
                    value=data[col,'']
                    ix=colmap[col]
                    yield dict(side=side,address=f'{col}{num}',value=excel.render_value(value),
                               field=self.cols[ix][0],type=excel.TYPES.get(value[0],''),changed=ix in self.changes[index])

    def search(self,args):
        from itertools import islice
        q=str(args.get('q','')).strip()
        if not q or len(q)>512:raise ValueError('请输入 1 至 512 字的单元格内容')
        side=args.get('side','')
        if side not in ('','old','new'):raise ValueError('请选择旧表或新表')
        if not args.get('sensitive'):q=q.casefold()
        def matches(row):
            if side and row['side']!=side:return False
            if args.get('changed') and not row['changed']:return False
            if args.get('type') and row['type']!=args['type']:return False
            if args.get('field') and row['field']!=args['field']:return False
            value=row['value'] or ''
            if not args.get('sensitive'):value=value.casefold()
            return q==value if args.get('exact') else q in value
        offset=max(0,page_integer(args,'offset',0))
        selected=islice((r for r in self.cell_entries() if matches(r)),offset,offset+21)
        hits=list(selected)
        return dict(items=hits[:20],offset=offset,more=len(hits)>20)

    def locate(self,kind,query):
        query=str(query).strip()
        if kind=='key':
            if not self.key:raise ValueError('当前表按坐标配对，请按地址定位')
            hits=[]
            for n,(i,j) in enumerate(self.pairs[1:],1):
                rows,index=(self.b,j) if j else (self.a,i)
                keycol=self.id_cols[1 if j else 0]
                if excel.render_value(rows[index][keycol,''])==query:hits.append(n)
            if len(hits)!=1:raise ValueError('记录编号不存在或显示值不唯一')
            return hits[0],None
        if kind not in ('old','new'):raise ValueError('无效的定位方式')
        match=re.fullmatch(r'([a-zA-Z]{1,3})?([1-9]\d{0,6})',query)
        if not match:raise ValueError('请输入行号或单元格地址，例如 C24')
        col,number=match.groups()
        side=0 if kind=='old' else 1
        row=next((n for n,pair in enumerate(self.pairs) if pair[side]==int(number)),None)
        colmap=self.old_index if kind=='old' else self.new_index
        if row is None or (col and col.upper() not in colmap):raise ValueError('该行或列没有已记录的内容')
        return row,colmap[col.upper()] if col else None

    def page(self,args):
        expanded=bool(args.get('expand'))
        focus=args.get('row_filter','') if not args.get('target') else ''
        if focus and focus not in ('新增行','删除行','修改行','调序行','内容','格式','批注','超链接'):
            raise ValueError('整行筛选无效')
        selected=self.row_filters.get(focus,[])
        if focus:expanded=False
        count=len(selected) if focus else len(self.pairs) if expanded else len(self.compact)
        pages=max(1,(count+ROW_PAGE-1)//ROW_PAGE)
        page=max(1,min(pages,page_integer(args,'page',1)))
        colpages=max(1,(len(self.cols)+COL_PAGE-1)//COL_PAGE)
        cp=max(1,min(colpages,page_integer(args,'col_page',1)))
        target=None
        if args.get('target'):
            target,column=self.locate(args.get('locate','new'),args['target'])
            expanded=True
            pages=max(1,(len(self.pairs)+ROW_PAGE-1)//ROW_PAGE)
            page=target//ROW_PAGE+1
            if column is not None:cp=column//COL_PAGE+1
            count=len(self.pairs)
        cstart=(cp-1)*COL_PAGE
        cols=self.cols[cstart:cstart+COL_PAGE]
        start=(page-1)*ROW_PAGE
        rows=[]
        for k in range(start,min(count,start+ROW_PAGE)):
            if focus:
                kind,index,length='row',selected[k],1
            else:
                kind,index,length=('row',k,1) if expanded else self.compact[k]
            i,j=self.pairs[index]
            if kind=='gap':
                rows.append(dict(kind='gap',count=length,old=i,new=j,expand_page=index//ROW_PAGE+1))
                continue
            changes=self.changes[index]
            sides=[('上下文',j,self.b,2)] if i and j and not changes and j not in self.moved else [
                (label,num,data,pos) for label,num,data,pos in [('删除',i,self.a,1),('新增',j,self.b,2)] if num]
            for label,num,data,pos in sides:
                cells=[cell_content(data[num],col[pos],num,changes.get(cstart+n,())) for n,col in enumerate(cols)]
                for n,cell in enumerate(cells):
                    ix=cstart+n
                    if ix not in changes:continue
                    _,ca,cb=self.cols[ix]
                    before=normalized(self.a.get(i,{}),ca,self.defaults[0])
                    after=normalized(self.b.get(j,{}),cb,self.defaults[1])
                    own=before if label=='删除' else after
                    more=[]
                    for attr,idx in [('批注',1),('超链接',3)]:
                        if attr in changes[ix] and own[idx]:more.append(attr+'：'+str(own[idx]))
                    if '格式' in changes[ix] and (before[2] or after[2]):
                        desc=excel.style_change(before[2],after[2])[0 if label=='删除' else 1]
                        more.append('格式：'+desc)
                    cell['detail']='\n'.join(more)
                record=excel.render_value(data[num].get((self.id_cols[0 if pos==1 else 1],''))) if self.key and num!=1 else ''
                rows.append(dict(kind=label,index=index,filters=self.tags[index],record=record,paired_old=i,paired_new=j,target=index==target,old=i if label!='新增' else None,
                                 new=j if label!='删除' else None,moved=j in self.moved,cells=cells))
        return dict(key=self.key,summary=self.summary,row_filter=focus,matches=count if focus else None,expanded=expanded,columns=[dict(title=t,old=c,new=d) for t,c,d in cols],
                    rows=rows,page=page,pages=pages,col_page=cp,col_pages=colpages)


class WorkbookView:
    def __init__(self,a,b,ext,mode):
        self.books=[excel.split_cells(extract(path,ext)) for path in (a,b)]
        self.names=list(dict.fromkeys(name for book in self.books for name,group in book.items()
                                      if excel.DEFAULT in group['meta']))
        self.current=(None,None)
        self.mode=mode

    def sheet(self,args):
        name=args.get('sheet') or next(iter(self.names),'')
        if name not in self.names:
            raise ValueError('找不到对应工作表')
        if self.current[0]!=name:
            empty={'rows':{},'meta':{}}
            left,right=(book.get(name,empty) for book in self.books)
            self.current=(name,Sheet(left,right,self.mode))
        return self.current

    def page(self,args):
        name,sheet=self.sheet(args)
        return dict(sheets=self.names,sheet=name,**sheet.page(args))
