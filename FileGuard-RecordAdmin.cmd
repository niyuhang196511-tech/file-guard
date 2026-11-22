@echo off
setlocal DisableDelayedExpansion
pushd "%~dp0" || exit /b 1
if exist "fileguard-engine.exe" (
  "fileguard-engine.exe" --record-admin
) else (
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\windows-python.ps1" -Mode RecordAdmin
)
set "result=%errorlevel%"
pause
popd
exit /b %result%
