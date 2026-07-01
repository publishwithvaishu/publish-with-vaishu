@echo off
setlocal
title Publish With Vaishu - Restart
cd /d "%~dp0"

echo ============================================================
echo    Publish With Vaishu  -  RESTART
echo ============================================================
echo.
echo Stopping any running server on port 3000...

for /f "tokens=5" %%P in ('netstat -aon ^| findstr /C:":3000 " ^| findstr /C:"LISTENING"') do (
    echo Stopping PID %%P...
    taskkill /F /PID %%P >nul 2>&1
)

echo Waiting 3 seconds...
%SystemRoot%\System32\ping.exe -n 4 127.0.0.1 >nul

echo Starting the server again...
echo.
call "%~dp0START.bat"
