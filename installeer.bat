@echo off
where node.exe >nul 2>&1 && goto install || goto node
pause
:node
echo Node.js is not installed, downloading now...
:: powershell -command "wget -Uri 'https://nodejs.org/dist/v18.16.1/node-v18.16.1-x64.msi' -OutFile 'npm-installer.msi'"
echo Please follow the opened installer
start /W npm-installer.msi
endlocal
call RefreshEnv.cmd
goto install

:install
echo updating npm...
call npm install npm@latest
echo Installing and updating packages...
call npm install
cls
echo Done!
SET /P AREYOUSURE=Do you want to start the dashboard now (Y/[N])?
IF /I "%AREYOUSURE%" EQU "Y" npm run dev
IF /I "%AREYOUSURE%" EQU "y" npm run dev
pause