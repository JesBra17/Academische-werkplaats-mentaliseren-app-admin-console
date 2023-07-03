@echo off
where node.exe >nul 2>&1 && goto install || goto node
pause
:node
echo Node.js is not installed, downloading now...
powershell -command "wget -Uri 'https://nodejs.org/dist/v18.16.1/node-v18.16.1-x64.msi' -OutFile 'npm-installer.msi'"
echo Please follow the opened installer
start /W npm-installer.msi
goto install

:install
echo updating npm...
npm install npm@latest
echo Installing and updating packages...
npm install