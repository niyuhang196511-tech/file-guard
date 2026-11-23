@echo off
setlocal DisableDelayedExpansion
pushd "%~dp0" || exit /b 1

where uv >nul 2>nul
if %errorlevel% equ 0 (
  uv run scripts\dev.py
  if errorlevel 1 goto :error
  popd
  exit /b 0
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\windows-python.ps1" -Mode Venv
if errorlevel 1 goto :error
if exist ".venv\Scripts\pip.exe" (
  ".venv\Scripts\python.exe" -m pip install -r requirements.txt
  if errorlevel 1 goto :error
)
".venv\Scripts\python.exe" scripts\dev.py
if errorlevel 1 goto :error
popd
exit /b 0
:error
pause
popd
exit /b 1

