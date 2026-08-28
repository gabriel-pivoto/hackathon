@echo off
REM Sobe o servidor de desenvolvimento do ObraCheck.
REM Usa npm.cmd porque a ExecutionPolicy do PowerShell bloqueia o npm.ps1 do fnm.
cd /d "%~dp0"
if not exist node_modules (
  echo Instalando dependencias...
  call npm.cmd install || exit /b 1
)
echo.
echo ObraCheck subindo em http://localhost:5173
echo.
call npm.cmd run dev
