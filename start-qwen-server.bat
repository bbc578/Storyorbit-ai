@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-qwen-server.ps1"
pause
