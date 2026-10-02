@echo off
cd ..
call ng version
call ng lint
call ng build --base-href /Study27/
start /MAX ng test
pause