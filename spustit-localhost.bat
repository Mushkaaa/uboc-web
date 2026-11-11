@echo off
cd /d "%~dp0"
rem Explorer moze mat stary PATH - doplnime bezne cesty k Node.js a VS Code
if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%ProgramFiles%\nodejs;%APPDATA%\npm;%PATH%"
if exist "%LOCALAPPDATA%\Programs\Microsoft VS Code\bin\code.cmd" set "PATH=%LOCALAPPDATA%\Programs\Microsoft VS Code\bin;%PATH%"
where code 1>NUL 2>NUL && start "" code .
where node 1>NUL 2>NUL || (echo Node.js nie je nainstalovany - stiahni ho z https://nodejs.org & pause & exit /b 1)
if not exist node_modules (
  echo Instalujem zavislosti...
  call npm install
)
echo Spustam localhost...
call npm run dev -- --open
pause
