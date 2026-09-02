@echo off
echo ============================================================
echo   NexusOps - Open Source AI Automation Test Application
echo   Starting local development server...
echo ============================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/ to run locally.
    pause
    exit /b 1
)

call npx -y vite --open
pause
