@echo off
cd ..
goto :serve
goto :build_and_start

ng version
ng lint
goto :eof

:serve
call ng serve
pause
goto :eof

:build_and_start
call ng build
::pause
cd dist\Study27\browser
start "Study 27" /MAX http-server . -p 8080
pause
