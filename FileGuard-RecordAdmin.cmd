@echo off
cd /d "%~dp0"
if exist "fileguard-engine.exe" (
  "fileguard-engine.exe" --record-admin
) else if exist ".venv\Scripts\python.exe" (
  ".venv\Scripts\python.exe" -m engine.main --record-admin
) else (
  py -3.12 -m engine.main --record-admin
)
pause
