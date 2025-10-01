@echo off
cd ..
::goto :serve

:build_and_start
call ng build
cd dist\Study27\browser
start "Study 27" /MAX http-server . -p 8027
pause
goto :eof

:serve
call ng serve
pause