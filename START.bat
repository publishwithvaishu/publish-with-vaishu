@echo off
setlocal
title Publish With Vaishu - Server
cd /d "%~dp0"

echo ============================================================
echo    Publish With Vaishu  -  START
echo ============================================================
echo.

REM --- 1. Free port 3000 if something is already using it ---
echo Checking port 3000...
set "PORTPID="
for /f "tokens=5" %%P in ('netstat -aon ^| findstr /C:":3000 " ^| findstr /C:"LISTENING"') do set "PORTPID=%%P"
if defined PORTPID (
    echo Port 3000 is already in use by PID %PORTPID%. Stopping the old process...
    taskkill /F /PID %PORTPID% >nul 2>&1
    %SystemRoot%\System32\ping.exe -n 3 127.0.0.1 >nul
)

REM --- 2. Make sure Node.js is installed ---
where node >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Node.js was not found.
    echo Install it from https://nodejs.org and run this file again.
    echo.
    pause
    exit /b 1
)

REM --- 3. Install dependencies the first time ---
if not exist "node_modules" (
    echo Dependencies not found. Installing them now ^(npm install^)...
    echo This can take a couple of minutes the first time.
    call npm install
    if errorlevel 1 (
        echo.
        echo ERROR: npm install failed. See the messages above.
        pause
        exit /b 1
    )
)

REM --- 4. Open the website automatically once the server has booted ---
start "" cmd /c "%SystemRoot%\System32\ping.exe -n 8 127.0.0.1 >nul && start http://localhost:3000"

echo.
echo Starting server...
echo The site will open in your browser at http://localhost:3000
echo (give it a few seconds to compile the first time).
echo.
echo Server started successfully once you see the "Ready" line below.
echo Press Ctrl+C to stop the server, then close this window.
echo ============================================================
echo.

call npm run dev

echo.
echo Server stopped.
pause
