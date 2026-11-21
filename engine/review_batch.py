"""预览与提交显式选择的版本，复用单版本复核记录与审计。"""
from hashlib import sha256
import json
import re

from . import review

LIMIT = 100
NOTE_LIMIT = 2000
REASON_LIMIT = 300
AUDIT_ACTION = '批量更新版本复核'
FIELDS = """v.id,v.file_id,v.num,v.stamp,f.rel,r.path AS root,
            coalesce(m.state,'待复核') AS review,coalesce(m.note,'') AS note,
            coalesce(m.revision,0) AS revision"""


def text(args,key,limit):
    value = args.get(key,'')
    if not isinstance(value,str) or len(value)>limit or '\0' in value:
        raise ValueError(f'{key} 须为不超过 {limit} 字的文本')
    return value.strip()


def options(args):
    entries = args.get('targets')
    if not isinstance(entries,list) or not 1<=len(entries)<=LIMIT:
        raise ValueError('请选择 1 至 100 个版本')
    targets = {}
    for row in entries:
        vid = row.get('id') if isinstance(row,dict) else None
        revision = row.get('revision') if isinstance(row,dict) else None
        if (type(vid) is not int or not 1<=vid<=2**53-1 or
                type(revision) is not int or not 0<=revision<=2**53-1):
            raise ValueError('所选版本编号或复核修订无效')
        if vid in targets:
            raise ValueError('批次中有重复的版本')
        targets[vid] = revision
    state = args.get('state','')
    mode = args.get('mode','keep')
    if not isinstance(state,str) or state not in ('',*review.STATES):
        raise ValueError('复核状态无效')
    if mode not in ('keep','replace','append'):
        raise ValueError('备注处理方式无效')
    note = text(args,'note',NOTE_LIMIT)
    reason = text(args,'reason',REASON_LIMIT)
    if mode=='append' and not note:
        raise ValueError('请输入追加的备注')
    if not state and mode=='keep':
        raise ValueError('请选择结论或备注变更')
    return targets,state,mode,note if mode!='keep' else '',reason


def proposal(db,opts):
    targets,state,mode,note,reason = opts
    markers = ','.join('?' for _ in targets)
    source = {row['id']:row for row in db.execute('SELECT '+FIELDS+review.BASE+
              ' WHERE v.id IN ('+markers+')',tuple(targets))}
    items = []
    for vid,expected in sorted(targets.items()):
        row = source.get(vid)
        if row is None:
            items.append(dict(id=vid,expected=expected,issue='版本不存在',status='missing'))
            continue
        current = row['note']
        new_note = {'keep':current,'replace':note,'append':current+'\n'+note if current else note}[mode]
        new_state = state or row['review']
        changed = (new_state,new_note)!=(row['review'],current)
        issue = status = ''
        if row['revision']!=expected:
            issue,status = '复核修订已更新','conflict'
        elif len(new_note)>NOTE_LIMIT:
            issue,status = '合并后的备注超过 2000 字','invalid'
        elif new_state=='需跟进' and not new_note.strip():
            issue,status = '需跟进版本须有备注','invalid'
        items.append(dict(id=vid,file_id=row['file_id'],rel=row['rel'],root=row['root'],num=row['num'],
                          stamp=row['stamp'],review=row['review'],note=current,revision=row['revision'],
                          expected=expected,new_state=new_state,new_note=new_note,issue=issue,
                          status=status or ('change' if changed else 'same')))
    counts = {status:sum(row['status']==status for row in items)
              for status in ('change','same','conflict','missing','invalid')}
    token = ''
    if counts['change'] and not (counts['conflict']+counts['missing']+counts['invalid']):
        canonical = json.dumps([state,mode,note,reason,items],ensure_ascii=False,sort_keys=True,separators=(',',':'))
        token = sha256(canonical.encode('utf-8')).hexdigest()
    return dict(items=items,counts=counts,total=len(items),token=token)


def run(db,store,args,stamp,apply=False):
    opts = options(args)
    db.execute('BEGIN IMMEDIATE' if apply else 'BEGIN')
    report = proposal(db,opts)
    if not apply:
        return report
    token = args.get('token')
    if not isinstance(token,str) or not re.fullmatch('[0-9a-f]{64}',token):
        raise ValueError('请先预览并确认本批变更')
    if not report['token'] or report['token']!=token:
        return dict(applied=False,preview=report)
    ref = token[:16]
    for row in report['items']:
        if row['status']=='change':
            review.write_review(db,store,row,row['new_state'],row['new_note'],stamp,ref)
    counts = report['counts']
    summary = f"批次 {ref} · 已更新 {counts['change']} 项 · 无变化 {counts['same']} 项"
    if reason := opts[-1]:
        summary += '\n批次说明：'+reason
    store.audit(db,AUDIT_ACTION,summary)
    return dict(applied=True,batch=ref,changed=counts['change'],unchanged=counts['same'],stamp=stamp)
