import {
  ComponentFixture,
  TestBed,
//  fakeAsync,
//  tick,
} from '@angular/core/testing';
//import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { EmployeeTransferComponent } from './employee-transfer.component';

import * as testData from 'testing/test-data';
import { Department } from 'models/department';
import { Employee } from 'models/employee';
// import { DepartmentService } from 'services/department-service/department.service';
// import { EmployeeService } from 'services/employee-service/employee.service';
// import { Title } from 'models/title';

class MockDepartmentService {
  getDepartmentArray(): Department[] {
    return testData.TEST_DEPARTMENTS;
  }
}
class MockEmployeeService {
  private employeeArray: Employee[][] = testData.TEST_EMPLOYEES.map((group) => [
    ...group,
  ]);
  getEmployeeArray() {
    return this.employeeArray;
  }
  setEmployeeArray(employeeArray: Employee[][]) {
    this.employeeArray = employeeArray;;
  }
  transferEmployees(fromId: number, toId: number, employees: Employee[]) {
    // Remove employees from source
    const fromIdx = fromId - 1;
    const toIdx = toId - 1;
    this.employeeArray[fromIdx] = this.employeeArray[fromIdx].filter(
      (e) => !employees.some((emp) => emp.id === e.id)
    );
    this.employeeArray[toIdx] = [...this.employeeArray[toIdx], ...employees];
  }
}

describe('EmployeeTransferComponent', () => {
  let component: EmployeeTransferComponent;
  let fixture: ComponentFixture<EmployeeTransferComponent>;
  // let departmentService: MockDepartmentService;
  // let employeeService: MockEmployeeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EmployeeTransferComponent,
        ReactiveFormsModule,
        MatTableModule,
        MatGridListModule,
        MatCardModule,
        MatButtonModule,
        MatCheckboxModule,
        MatSelectModule,
        MatListModule,
        MatIconModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: 'DepartmentService', useClass: MockDepartmentService },
        { provide: 'EmployeeService', useClass: MockEmployeeService },
      ],
    })
      .overrideComponent(EmployeeTransferComponent, {
        set: {
          providers: [
            { provide: 'DepartmentService', useClass: MockDepartmentService },
            { provide: 'EmployeeService', useClass: MockEmployeeService },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(EmployeeTransferComponent);
    component = fixture.componentInstance;
    // // inject mocks
    // departmentService = TestBed.inject(DepartmentService);
    // employeeService = TestBed.inject(EmployeeService);
    // fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  // it('should populate department dropdowns', () => {
  //   fixture.detectChanges();
  //   const matSelects = fixture.debugElement.queryAll(By.css('mat-select'));
  //   expect(matSelects.length).toBe(2, 'Should have 2 department selects');
  //   // Open left select to check options
  //   matSelects[0].nativeElement.click();
  //   fixture.detectChanges();
  //   const options = fixture.debugElement.queryAll(By.css('mat-option'));
  //   expect(options.length).toBe(testData.TEST_DEPARTMENTS.length);
  //   expect(options[0].nativeElement.textContent).toContain(
  //     testData.TEST_DEPARTMENTS[0].name
  //   );
  // });

  // it('should render left and right employee tables', () => {
  //   fixture.detectChanges();
  //   const tables = fixture.debugElement.queryAll(
  //     By.css('table.employee-table')
  //   );
  //   expect(tables.length).toBe(2);
  //   // Only left table has employees by default in test-data
  //   const leftRows = tables[0].queryAll(By.css('tr.mat-row'));
  //   expect(leftRows.length).toBe(testData.TEST_EMPLOYEES[0].length);
  //   const rightRows = tables[1].queryAll(By.css('tr.mat-row'));
  //   expect(rightRows.length).toBe(testData.TEST_EMPLOYEES[1].length);
  // });

  // it('should toggle selection for a row and update checkbox', () => {
  //   fixture.detectChanges();
  //   const leftTable = fixture.debugElement.queryAll(
  //     By.css('table.employee-table')
  //   )[0];
  //   const row = leftTable.query(By.css('tr.mat-row'));
  //   const checkbox = row.query(By.css('mat-checkbox input'));
  //   expect(component.leftSideSelection.selected.length).toBe(0);
  //   checkbox.nativeElement.click();
  //   fixture.detectChanges();
  //   expect(component.leftSideSelection.selected.length).toBe(1);
  //   // Unselect
  //   checkbox.nativeElement.click();
  //   fixture.detectChanges();
  //   expect(component.leftSideSelection.selected.length).toBe(0);
  // });

  // it('should toggle all rows when header checkbox is clicked', () => {
  //   fixture.detectChanges();
  //   const leftTable = fixture.debugElement.queryAll(
  //     By.css('table.employee-table')
  //   )[0];
  //   const headerCheckbox = leftTable.query(By.css('th mat-checkbox input'));
  //   headerCheckbox.nativeElement.click();
  //   fixture.detectChanges();
  //   expect(component.leftSideSelection.selected.length).toBe(
  //     testData.TEST_EMPLOYEES[0].length
  //   );
  //   // Unselect all
  //   headerCheckbox.nativeElement.click();
  //   fixture.detectChanges();
  //   expect(component.leftSideSelection.selected.length).toBe(0);
  // });

  // it('should enable transfer button only when selection and different departments', () => {
  //   fixture.detectChanges();
  //   // Select a row
  //   component.leftSideSelection.select(testData.TEST_EMPLOYEES[0][0]);
  //   fixture.detectChanges();
  //   // Button should be enabled
  //   const leftButton = fixture.debugElement.queryAll(
  //     By.css('button[mat-stroked-button]')
  //   )[0];
  //   expect(leftButton.nativeElement.disabled).toBeFalse();
  //   // Set both departments the same
  //   component.rightSideDepartmentId = component.leftSideDepartmentId;
  //   fixture.detectChanges();
  //   expect(component.disableTransferButton('LEFT-SIDE')).toBeTrue();
  // });

  // it('should transfer employee from left to right', () => {
  //   fixture.detectChanges();
  //   // Select employee
  //   const employee = testData.TEST_EMPLOYEES[0][0];
  //   component.leftSideSelection.select(employee);
  //   fixture.detectChanges();
  //   // Click transfer
  //   component.transferEmployees('LEFT-SIDE');
  //   fixture.detectChanges();
  //   // After transfer, employee should be in right department
  //   expect(
  //     component.leftSideEmployees.find((e) => e.id === employee.id)
  //   ).toBeUndefined();
  //   expect(
  //     component.rightSideEmployees.find((e) => e.id === employee.id)
  //   ).toBeDefined();
  // });

  // it('should update employees when department selection changes', fakeAsync(() => {
  //   // Add a second department and employees to test data
  //   (departmentService.getDepartmentArray) = () => [
  //     ...testData.TEST_DEPARTMENTS,
  //     { id: 2, name: 'Second Department' },
  //   ];
  //   (employeeService.getEmployeeArray) = () => [
  //     ...testData.TEST_EMPLOYEES,
  //     [
  //       {
  //         id: 2,
  //         firstName: 'Bob',
  //         lastName: 'Smith',
  //         title: Title.Manager,
  //         phone: '1112223333',
  //         mail: 'bob.smith@company.com',
  //       },
  //     ],
  //   ];
  //   component.departmentArray = departmentService.getDepartmentArray();
  //   fixture.detectChanges();
  //   // Select right side department to 2
  //   component.selectDepartment('RIGHT-SIDE', 2);
  //   fixture.detectChanges();
  //   tick();
  //   expect(component.rightSideEmployees.length).toBe(1);
  //   expect(component.rightSideEmployees[0].firstName).toBe('Bob');
  // }));

  // it('should provide correct checkbox labels', () => {
  //   fixture.detectChanges();
  //   const employee = testData.TEST_EMPLOYEES[0][0];
  //   expect(component.checkboxLabel('LEFT-SIDE')).toContain('select');
  //   component.leftSideSelection.select(employee);
  //   expect(component.checkboxLabel('LEFT-SIDE', employee)).toContain(
  //     'deselect'
  //   );
  //   component.leftSideSelection.clear();
  //   expect(component.checkboxLabel('LEFT-SIDE', employee)).toContain('select');
  // });

  // it('should correctly report if all rows are selected', () => {
  //   fixture.detectChanges();
  //   const employees = testData.TEST_EMPLOYEES[0];
  //   expect(component.isAllSelected('LEFT-SIDE')).toBeFalse();
  //   employees.forEach((e) => component.leftSideSelection.select(e));
  //   expect(component.isAllSelected('LEFT-SIDE')).toBeTrue();
  // });
});
