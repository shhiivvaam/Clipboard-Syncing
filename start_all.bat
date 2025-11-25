@echo off
echo Starting Clipboard Sync System...

:: Start Server (New Window)
start "Sync Server" cmd /k "node server/index.js"

:: Start Web Client (New Window)
start "Web Client" cmd /k "npx http-server client -p 8081"

:: Wait for server to initialize
timeout /t 2 /nobreak >nul

:: Start Electron Client (New Window)
:: Using the existing start.bat logic directly here to avoid nesting issues
set ELECTRON_RUN_AS_NODE=
start "Electron Client" .\node_modules\electron\dist\electron.exe electron/main.js

echo.
echo All components started!
echo Server: Port 8080 (or 8082 if configured)
echo Web Client: http://localhost:8081
echo Electron: Launched
echo.
pause
