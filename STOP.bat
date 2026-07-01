@echo off
setlocal
title Publish With Vaishu - Stop
cd /d "%~dp0"

echo ============================================================
echo    Publish With Vaishu  -  STOP
echo ============================================================
echo.
echo Looking for the development server on port 3000...

set "FOUND="
for /f "tokens=5" %%P in ('netstat -aon ^| findstr /C:":3000 " ^| findstr /C:"LISTENING"') do (
    echo Stopping server process ^(PID %%P^)...
    taskkill /F /PID %%P >nul 2>&1
    set "FOUND=1"
)

if defined FOUND (
    echo.
    echo Server stopped. Port 3000 is now free.
) else (
    echo.
    echo No development server was running on port 3000.
)

echo.
pause
