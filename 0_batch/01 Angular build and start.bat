@echo off
cd ..
goto :serve
goto :build

ng version
ng lint
goto :eof

:serve
call ng serve
pause
goto :eof

:build
call ng build
pause
start "Study 27" /MAX http-server ./dist/Study27
pause
