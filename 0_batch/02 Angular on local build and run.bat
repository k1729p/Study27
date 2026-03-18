@echo off
cd ..
::goto :serve

:build_and_start
call ng build
start "Study 27" /D dist\Study27\browser /MAX http-server . -p 8027
pause
goto :eof

:serve
call ng serve
pause