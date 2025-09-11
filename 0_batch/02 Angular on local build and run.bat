@echo off
cd ..
::goto :serve
::goto :build_and_start

call ng version
call ng lint
start /MAX ng test
pause

:serve
call ng serve
pause
goto :eof

:build_and_start
call ng build
cd dist\Study27\browser
start "Study 27" /MAX http-server . -p 8027
pause
