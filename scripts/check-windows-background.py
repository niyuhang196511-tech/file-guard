"""在 Windows 交互式桌面验证已构建的便携程序，测试数据全部位于临时目录。"""
import argparse
import ctypes
from ctypes import wintypes
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import time

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))


def wait_for(read,label,timeout=45):
    end=time.monotonic()+timeout
    while time.monotonic()<end:
        result=read()
        if result:return result
        time.sleep(.3)
    raise RuntimeError('等待超时：'+label)


def powershell(code):
    return subprocess.check_output(['powershell','-NoProfile','-NonInteractive','-Command',code],text=True).strip()


def check(folder, missing_engine=False):
    if os.name!='nt':raise SystemExit('请在 Windows 交互式桌面运行。')
    from engine.store import Store
    from engine.service import Service
    if powershell("Get-Process -Name FileGuard -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Id; exit 0"):
        raise SystemExit('检测到正在使用的 FileGuard。请在单独的 Windows 测试会话运行。')
    user=ctypes.WinDLL('user32',use_last_error=True)
    callback_type=ctypes.WINFUNCTYPE(wintypes.BOOL,wintypes.HWND,wintypes.LPARAM)
    user.EnumWindows.argtypes=[callback_type,wintypes.LPARAM]
    user.GetWindowThreadProcessId.argtypes=[wintypes.HWND,ctypes.POINTER(wintypes.DWORD)]
    user.IsWindowVisible.argtypes=[wintypes.HWND]
    user.PostMessageW.argtypes=[wintypes.HWND,wintypes.UINT,wintypes.WPARAM,wintypes.LPARAM]
    user.GetWindowTextW.argtypes=[wintypes.HWND,wintypes.LPWSTR,ctypes.c_int]
    with tempfile.TemporaryDirectory(prefix='FileGuard-desktop-') as tmp:
        stage=Path(tmp);home=stage/'Data';target=stage/'监控';target.mkdir()
        exe=stage/'FileGuard.exe'
        engine=stage/'fileguard-engine.exe'
        staged_engine=engine.with_suffix('.pending') if missing_engine else engine
        shutil.copy2(folder/exe.name,exe)
        shutil.copy2(folder/engine.name,staged_engine)
        (stage/'portable.flag').touch()
        store=Store(home);service=Service(store);rid=store.configure(target)
        service.dispatch('settings',dict(interval=5,theme='浅色',autostart=False))
        document=target/'编辑中.txt';document.write_text('第一版',encoding='utf-8')
        store.scan(rid)
        def versions():
            with store.db() as db:return db.execute('SELECT count(*) FROM versions').fetchone()[0]
        app=subprocess.Popen([str(exe)],cwd=stage)
        def window():
            found=[]
            @callback_type
            def visit(handle,param):
                pid=wintypes.DWORD();user.GetWindowThreadProcessId(handle,ctypes.byref(pid))
                if pid.value==app.pid and user.IsWindowVisible(handle):
                    title=ctypes.create_unicode_buffer(256)
                    user.GetWindowTextW(handle,title,256)
                    if 'FileGuard' in title.value:found.append(handle)
                return True
            user.EnumWindows(visit,0)
            return found[0] if found else None
        def live_window():
            status=app.poll()
            if status is not None:
                raise RuntimeError(f'桌面进程提前退出（退出码 {status}）')
            return window()
        def child():
            result=powershell(f'Get-CimInstance Win32_Process -Filter "ParentProcessId={app.pid} AND Name=\'fileguard-engine.exe\'" | Select-Object -ExpandProperty ProcessId')
            return int(result) if result.isdigit() else None
        try:
            hwnd=wait_for(live_window,'主窗口')
            if missing_engine:
                if child() is not None:
                    raise RuntimeError('测试引擎在补回可执行文件之前已启动')
                document.write_text('引擎缺失期间保存的第二版',encoding='utf-8')
                os.replace(staged_engine,engine)

                def initial_recovery_logged():
                    with store.db() as db:
                        return db.execute(
                            "SELECT 1 FROM audit WHERE action='引擎启动' AND note IN ('后台自动恢复','界面请求恢复')"
                        ).fetchone()

                wait_for(initial_recovery_logged,'补回引擎后自动启动',70)
                wait_for(lambda:versions()>=2,'恢复后采集引擎缺失期间保存的文件')
                if live_window()!=hwnd:
                    raise RuntimeError('引擎恢复后未保留同一主窗口')
                print('通过：引擎缺失时可打开工作台，补回引擎后在同一工作台恢复采集。')
                return
            first=wait_for(child,'测试引擎')
            if not user.PostMessageW(hwnd,0x0010,0,0):raise ctypes.WinError(ctypes.get_last_error())
            wait_for(lambda:not user.IsWindowVisible(hwnd),'关闭后隐藏至托盘')
            with document.open('w',encoding='utf-8') as editor:
                editor.write('关闭窗口后的第二版');editor.flush();os.fsync(editor.fileno())
                wait_for(lambda:versions()>=2,'主窗口已关、编辑文件仍打开时记录已保存内容')
            def hidden_scan_logged():
                with store.db() as db:
                    return db.execute("SELECT count(*) FROM scan_runs WHERE root_id=? AND captured>0 AND status='完成' AND source!='手动扫描'",(rid,)).fetchone()[0]
            wait_for(hidden_scan_logged,'关窗采集已有已完成的后台扫描记录')
            if app.poll() is not None:raise RuntimeError('关闭窗口导致桌面进程结束')
            # Only the child of the isolated test process is stopped.
            subprocess.run(['taskkill','/PID',str(first),'/T','/F'],check=True,capture_output=True)
            wait_for(lambda:(current:=child()) and current!=first,'隐藏时自动重启引擎')
            def recovery_logged():
                with store.db() as db:
                    return db.execute("SELECT count(*) FROM audit WHERE action='引擎启动' AND note='后台自动恢复'").fetchone()[0]
            wait_for(recovery_logged,'后台恢复留下独立启动记录')
            document.write_text('引擎恢复后的第三版',encoding='utf-8')
            wait_for(lambda:versions()>=3,'重启后恢复记录')
            second=subprocess.Popen([str(exe)],cwd=stage)
            try:second.wait(timeout=15)
            finally:
                if second.poll() is None:second.terminate();second.wait()
            wait_for(window,'重新打开同一工作台')
            print('通过：关窗继续采集、后台引擎重启、版本续接、单实例唤回。')
        finally:
            if app.poll() is None:app.terminate();app.wait(timeout=10)
            wait_for(lambda:child() is None,'测试引擎退出',20)


if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('portable_dir',type=Path,help='已解压的便携包目录')
    parser.add_argument('--missing-engine',action='store_true',help='校验首次启动缺少引擎时的工作台和自动恢复')
    args=parser.parse_args()
    check(args.portable_dir.resolve(),args.missing_engine)
