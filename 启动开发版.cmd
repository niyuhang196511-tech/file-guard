@echo off
setlocal DisableDelayedExpansion
pushd "%~dp0" || exit /b 1
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\windows-python.ps1" -Mode Venv
if errorlevel 1 goto :error
".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 goto :error
".venv\Scripts\python.exe" scripts\dev.py
if errorlevel 1 goto :error
popd
exit /b 0
:error
pause
popd
exit /b 1

