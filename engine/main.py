"""桌面端私有行协议进程，无网络监听。"""
import json
import os
import sys
from pathlib import Path

if __package__ in (None,''):
    sys.path.insert(0,str(Path(__file__).resolve().parent.parent))
from engine.store import Store
from engine.maintenance import workspace_lock,restore_backup,restore_lock
from engine.service import Service


def data_dir():
    if d:=os.getenv('FILEGUARD_DATA'):
        return Path(d)
    if getattr(sys,'frozen',False) and (Path(sys.executable).parent/'portable.flag').exists():
        return Path(sys.executable).parent/'Data'
    return Path(os.getenv('LOCALAPPDATA',Path.home()/'.local/share'))/'FileGuard'/'Data'


def main():
    sys.stdin.reconfigure(encoding='utf-8')
    sys.stdout.reconfigure(encoding='utf-8',line_buffering=True)
    service=Service(Store(data_dir()))
    cause=os.getenv('FILEGUARD_START_CAUSE','')
    if cause in ('后台启动','桌面启动','界面请求恢复','后台自动恢复'):
        with service.s.db() as db:
            service.s.audit(db,'引擎启动',cause)
    service.start()
    for line in sys.stdin:
        try:
            call=json.loads(line)
            result={'ok':True,'data':service.dispatch(call['cmd'],call.get('args',{}))}
        except Exception as e:
            result={'ok':False,'error':str(e)}
        print(json.dumps(result,ensure_ascii=False))
    service.stopping.set()
    # Give active short tasks a chance to finish before interpreter teardown.
    import time
    deadline=time.monotonic()+4
    for thread in service._threads:
        thread.join(max(0,deadline-time.monotonic()))


if __name__=='__main__':
    if sys.argv[1:]==['--record-admin']:
        from engine.record_admin import initialize
        with restore_lock(data_dir()):
            initialize(Store(data_dir()))
        print('已配置本机仓库的记录管理口令。')
    elif len(sys.argv)==3 and sys.argv[1]=='--inspect-backup':
        from engine.backup_check import inspect
        print(json.dumps(inspect(sys.argv[2]),ensure_ascii=False,indent=2))
    elif len(sys.argv)>1 and sys.argv[1]=='--restore-backup':
        if len(sys.argv)!=3:
            sys.exit('用法：fileguard-engine --restore-backup 备份.zip')
        print('还原完成。原仓库保留在：',restore_backup(sys.argv[2],data_dir()))
    else:
        with workspace_lock(data_dir()):
            main()

