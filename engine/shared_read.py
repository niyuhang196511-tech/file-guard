"""Windows 监控读句柄允许编辑程序继续读写及替换原路径。"""
import os


def open_snapshot_source(path):
    if os.name != 'nt':
        return path.open('rb')
    import ctypes
    import msvcrt
    from ctypes import wintypes
    kernel=ctypes.WinDLL('kernel32',use_last_error=True)
    create=kernel.CreateFileW
    create.argtypes=[wintypes.LPCWSTR,wintypes.DWORD,wintypes.DWORD,wintypes.LPVOID,
                     wintypes.DWORD,wintypes.DWORD,wintypes.HANDLE]
    create.restype=wintypes.HANDLE
    handle=create(str(path),0x80000000,1|2|4,None,3,0x08000000,None)
    if handle==ctypes.c_void_p(-1).value:
        raise ctypes.WinError(ctypes.get_last_error())
    try:
        fd=msvcrt.open_osfhandle(handle,os.O_RDONLY|os.O_BINARY)
    except BaseException:
        kernel.CloseHandle.argtypes=[wintypes.HANDLE]
        kernel.CloseHandle(handle)
        raise
    return os.fdopen(fd,'rb')
