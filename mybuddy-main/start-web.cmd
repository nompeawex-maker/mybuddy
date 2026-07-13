@echo off
setlocal

set "RUNTIME=C:\Users\nompe\.cache\codex-runtimes\codex-primary-runtime\dependencies"
set "PATH=%RUNTIME%\node\bin;%RUNTIME%\bin\fallback;%PATH%"

cd /d "%~dp0"

if not exist "node_modules" (
  echo Installing project packages...
  call pnpm install
  if errorlevel 1 (
    echo.
    echo Installation failed. Please keep Codex installed and try again.
    pause
    exit /b 1
  )
)

echo.
echo MyBuddy+ is starting...
echo Open http://localhost:5173 in your browser.
echo Press Ctrl+C to stop.
echo.

call pnpm dev
pause
