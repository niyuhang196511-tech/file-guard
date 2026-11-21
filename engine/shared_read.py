"""Windows 文件读取共享和守护状态下的原子替换。"""
import os


def _open_windows_file(path, access, sharing, flags):
    import ctypes
    from ctypes import wintypes
    kernel=ctypes.WinDLL('kernel32',use_last_error=True)
    create=kernel.CreateFileW
    create.argtypes=[wintypes.LPCWSTR,wintypes.DWORD,wintypes.DWORD,wintypes.LPVOID,
                     wintypes.DWORD,wintypes.DWORD,wintypes.HANDLE]
    create.restype=wintypes.HANDLE
    handle=create(str(path),access,sharing,None,3,flags,None)
    if handle==ctypes.c_void_p(-1).value:
        raise ctypes.WinError(ctypes.get_last_error())
    kernel.CloseHandle.argtypes=[wintypes.HANDLE]
    kernel.CloseHandle.restype=wintypes.BOOL
    return kernel,handle


def open_snapshot_source(path):
    if os.name != 'nt':
        return path.open('rb')
    import msvcrt
    kernel,handle=_open_windows_file(path,0x80000000,1|2|4,0x08000000)
    try:
        fd=msvcrt.open_osfhandle(handle,os.O_RDONLY|os.O_BINARY)
    except BaseException:
        kernel.CloseHandle(handle)
        raise
    return os.fdopen(fd,'rb')


def replace_guarded_file(source, target):
    if os.name != 'nt':
        os.replace(source,target)
        return
    import ctypes
    from ctypes import wintypes

    target_name=os.path.abspath(target)
    name_bytes=len(target_name.encode('utf-16-le',errors='surrogatepass'))

    class RenameInfo(ctypes.Structure):
        _fields_=[('flags',wintypes.DWORD),('root_directory',wintypes.HANDLE),
                  ('name_length',wintypes.DWORD),('name',wintypes.WCHAR*(name_bytes//2+1))]

    replace_if_exists=0x1
    posix_semantics=0x2
    info=RenameInfo(replace_if_exists|posix_semantics,None,name_bytes,target_name)
    delete_access=0x00010000
    kernel,handle=_open_windows_file(source,delete_access,1|2|4,0x80)
    try:
        rename=kernel.SetFileInformationByHandle
        rename.argtypes=[wintypes.HANDLE,ctypes.c_int,wintypes.LPVOID,wintypes.DWORD]
        rename.restype=wintypes.BOOL
        # FileRenameInfoEx can replace a target whose guard shares deletion.
        file_rename_info_ex=22
        if not rename(handle,file_rename_info_ex,ctypes.byref(info),ctypes.sizeof(info)):
            raise ctypes.WinError(ctypes.get_last_error())
    finally:
        kernel.CloseHandle(handle)
