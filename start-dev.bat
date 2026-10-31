@echo off
REM Starts the XYZ website at http://localhost:5173 and opens it in your browser.
REM Close this window to stop it.
cd /d "%~dp0frontend"

if not exist "node_modules" (
  echo Installing packages...
  call npm install
)

call npm run dev -- --open
