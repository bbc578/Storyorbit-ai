@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-ai-server.ps1"
pause
