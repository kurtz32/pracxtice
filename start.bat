@echo off
echo 🚀 Starting Portfolio Admin Server...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    echo.
)

REM Start the server
echo 🌐 Starting server on http://localhost:3000
echo 📝 Admin Panel: http://localhost:3000/admin.html
echo 🎨 Portfolio: http://localhost:3000/index.html
echo.
echo Press Ctrl+C to stop the server
echo.

npm start

pause