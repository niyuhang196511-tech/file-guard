"""管理员更正和撤回。原事件和逐次处置记录分开存放。"""
import getpass
import hashlib
import hmac
import secrets
import threading
import time

ITERATIONS=600_000


def derive(password,salt):
    return hashlib.pbkdf2_hmac('sha256',password.encode('utf-8'),salt,ITERATIONS)


def initialize(store):
    with store.db() as db:
        old=db.execute('SELECT salt,verifier FROM record_admin').fetchone()
        if old and not hmac.compare_digest(derive(getpass.getpass('当前管理口令：'),old[0]),old[1]):
            raise ValueError('当前管理口令不正确')
        new=getpass.getpass('新管理口令（至少 12 个字符）：')
        if not 12<=len(new)<=256 or new!=getpass.getpass('确认新口令：'):
            raise ValueError('口令长度无效或两次输入不一致')
        salt=secrets.token_bytes(16)
        db.execute('BEGIN IMMEDIATE')
        current=db.execute('SELECT salt,verifier FROM record_admin').fetchone()
        if (tuple(current) if current else None)!=(tuple(old) if old else None):
            raise ValueError('管理口令已在其他窗口更新，请重新配置')
        db.execute('INSERT OR REPLACE INTO record_admin VALUES (1,?,?)',(salt,derive(new,salt)))
        store.audit(db,'配置记录管理权限','已更新本机仓库的管理口令')


class Gate:
    def __init__(self):
        self.lock=threading.Lock()
        self.attempts=0
        self.until=0

    def require(self,db,password):
        entry=db.execute('SELECT salt,verifier FROM record_admin').fetchone()
        if not entry:raise ValueError('请仓库负责人先在本机初始化记录管理口令')
        with self.lock:
            if time.monotonic()<self.until:raise ValueError('尝试次数过多，请稍后再试')
            if not isinstance(password,str) or not 1<=len(password)<=256 or not hmac.compare_digest(derive(password,entry[0]),entry[1]):
                self.attempts+=1
                if self.attempts>=5:
                    self.until=time.monotonic()+30
                    self.attempts=0
                raise ValueError('管理口令无效')
            self.attempts=0


def detail(db,eid):
    event=db.execute('SELECT * FROM events WHERE id=?',(eid,)).fetchone()
    if not event:raise ValueError('记录不存在')
    changes=[dict(r) for r in db.execute('SELECT revision,stamp,action,reason,caption,hidden FROM event_edits WHERE event_id=? ORDER BY revision DESC',(eid,))]
    return dict(original=dict(event),changes=changes,revision=changes[0]['revision'] if changes else 0)


def private_records(db,before):
    sql='''SELECT m.event_id AS id,m.revision,m.stamp,'已撤回' AS kind FROM event_edits m
           WHERE m.hidden=2 AND NOT EXISTS(SELECT 1 FROM event_edits newer
           WHERE newer.event_id=m.event_id AND newer.revision>m.revision)'''
    params=[]
    if before is not None:
        sql+=' AND m.event_id<?'
        params.append(int(before))
    rows=[dict(r) for r in db.execute(sql+' ORDER BY m.event_id DESC LIMIT 26',params)]
    return dict(items=rows[:25],before=rows[24]['id'] if len(rows)>25 else None)


def amend(db,store,args,stamp):
    eid=int(args['id'])
    action=args.get('action')
    reason=args.get('reason','').strip()
    caption=args.get('caption','').strip()
    if action not in ('更正','撤回','移出普通日志','恢复展示'):raise ValueError('无效的记录操作')
    if not 1<=len(reason)<=1000:raise ValueError('请填写 1 至 1000 字的操作原因')
    if action=='更正' and not 1<=len(caption)<=1000:raise ValueError('请填写 1 至 1000 字的公开更正说明')
    info=detail(db,eid)
    if info['revision']!=int(args['revision']):raise ValueError('记录已更新，请重新查看后再操作')
    last=info['changes'][0] if info['changes'] else {}
    hidden=bool(last.get('hidden'))
    if (action=='恢复展示')!=hidden:raise ValueError('此操作与当前展示状态不符')
    if action!='更正':caption=last.get('caption','')
    db.execute('INSERT INTO event_edits VALUES (?,?,?,?,?,?,?)',
               (eid,info['revision']+1,stamp,action,reason,caption,2 if action=='移出普通日志' else int(action=='撤回')))
    store.audit(db,'记录'+action,f'事件 #{eid} · 第 {info["revision"]+1} 次处置')
    return '记录已'+action
