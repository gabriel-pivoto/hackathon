@echo off
REM Build de producao do ObraCheck.
cd /d "%~dp0"
call npm.cmd run build
pause
