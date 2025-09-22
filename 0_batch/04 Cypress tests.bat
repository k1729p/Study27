@echo off
set SPEC_DIR=cypress/e2e/
set SPEC_1=%SPEC_DIR%/11_read_department_and_employee.cy.ts
set SPEC_2=%SPEC_DIR%/12_create_department_and_employee.cy.ts
set SPEC_3=%SPEC_DIR%/13_update_department_and_employee.cy.ts
set SPEC_4=%SPEC_DIR%/14_delete_department_and_employee.cy.ts
set SPEC_5=%SPEC_DIR%/21_transfer_employees.cy.ts
set SPEC_6=%SPEC_DIR%/31_locate_employee.cy.ts
set SPEC_7=%SPEC_DIR%/41_open_report.cy.ts
set SPECS=%SPEC_1%,%SPEC_2%,%SPEC_3%,%SPEC_4%,%SPEC_5%,%SPEC_6%,%SPEC_7%

cd ..
set KEY=N
set /P KEY="Start HTTP server? Y [N]"
if /i "%KEY:~0,1%"=="Y" (
  cd dist\Study27\browser
  start "Study 27" /MAX http-server . -p 8027
  cd ..\..\..
  pause
)
call npx cypress run --browser chrome --spec "%SPECS%"
pause