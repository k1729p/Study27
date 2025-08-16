import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import { Department } from 'models/department';
import { Employee } from 'models/employee';
import { DepartmentService } from 'services/department-service/department.service';
import { EmployeeService } from 'services/employee-service/employee.service';
import { EmployeeTransferComponent } from './employee-transfer.component';
import * as testData from 'testing/test-data';
/**
 * The mock department service.
 */
class MockDepartmentService {
  getDepartments(): Department[] {
    return testData.TEST_DEPARTMENTS;
  }
}
/**
 * The mock employee service.
 */
class MockEmployeeService {
  getEmployees(departmentId: number): Employee[] {
    console.log(
      'MockEmployeeService.getEmployeeArray(): doneTransferFromLeftToRight[%s], doneTransferFromRightToLeft[%s]',
      doneTransferFromLeftToRight,
      doneTransferFromRightToLeft
    );
    if (doneTransferFromLeftToRight) {
      if(departmentId == testData.TEST_DEPARTMENTS[0].id) {
        return [];
      } else {
        return testData.TEST_EMPLOYEES_TRANSFERRED;
      }
    } else if (doneTransferFromRightToLeft) {
      if(departmentId == testData.TEST_DEPARTMENTS[0].id) {
        return testData.TEST_EMPLOYEES_TRANSFERRED;
      } else {
        return [];
      }
    } else {
      if(departmentId == testData.TEST_DEPARTMENTS[0].id) {
        return testData.TEST_DEPARTMENTS[0].employees;
      } else {
        return testData.TEST_DEPARTMENTS[1].employees;
      }
    }
  }
  transferEmployees(
    sourceDepartmentId: number,
    targetDepartmentId: number,
    employees: Employee[]
  ) {
    console.debug(sourceDepartmentId, targetDepartmentId, employees);
  }
}
let doneTransferFromLeftToRight = false;
let doneTransferFromRightToLeft = false;

/**
 * Unit tests for the EmployeeTransferComponent.
 * This component is used to manage reports.
 */
describe('EmployeeTransferComponent', () => {
  let component: EmployeeTransferComponent;
  let fixture: ComponentFixture<EmployeeTransferComponent>;
  let departmentService: MockDepartmentService;
  let employeeService: MockEmployeeService;
  /**
   * Initializes the component and fixture before each test.
   * This is necessary to ensure that the component is ready
   * for testing and that any changes are detected
   */
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
        { provide: DepartmentService, useClass: MockDepartmentService },
        { provide: EmployeeService, useClass: MockEmployeeService },
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
    // inject mocks
    departmentService = TestBed.inject(DepartmentService);
    employeeService = TestBed.inject(EmployeeService);
    fixture.detectChanges();
    doneTransferFromLeftToRight = false;
    doneTransferFromRightToLeft = false;
  });
  /**
   * Tests that the component is created successfully.
   * This is a basic test to ensure that the component can be instantiated without errors.
   */
  it('should compile', () => {
    // GIVEN
    console.debug(departmentService.getDepartments);
    console.debug(employeeService.getEmployees);
    // WHEN
    // THEN
    expect(component).toBeTruthy();
  });
  /**
   * Tests department dropdowns.
   */
  it('should populate department dropdowns', () => {
    // GIVEN
    fixture.detectChanges();
    // WHEN
    const matSelects = fixture.debugElement.queryAll(By.css('mat-select'));
    // THEN
    expect(matSelects.length).toBe(2, 'Should have 2 department selects');
    // GIVEN
    // Open left select to check options
    matSelects[0].nativeElement.click();
    fixture.detectChanges();
    // WHEN
    const options = fixture.debugElement.queryAll(By.css('mat-option'));
    // THEN
    expect(options.length).toBe(testData.TEST_DEPARTMENTS.length);
    expect(options[0].nativeElement.textContent).toContain(
      testData.TEST_DEPARTMENTS[0].name
    );
  });
  /**
   * Tests left employee tables.
   */
  it('should render left employee tables', () => {
    // GIVEN
    fixture.detectChanges();
    // WHEN
    const tables = fixture.debugElement.queryAll(
      By.css('table.employee-table')
    );
    // THEN
    expect(tables.length).toBe(2);
    // GIVEN
    // WHEN
    const leftRows = tables[0].queryAll(By.css('td'));
    expect(leftRows.length).toBe(4);
    const testEmployee = testData.TEST_DEPARTMENTS[0].employees[0];
    expect(leftRows[1].nativeElement.textContent).toContain(testEmployee.id);
    expect(leftRows[2].nativeElement.textContent).toContain(testEmployee.firstName);
    expect(leftRows[3].nativeElement.textContent).toContain(testEmployee.lastName);
  });
  /**
   * Tests right employee tables.
   */
  it('should render right employee tables', () => {
    // GIVEN
    fixture.detectChanges();
    // WHEN
    const tables = fixture.debugElement.queryAll(
      By.css('table.employee-table')
    );
    // THEN
    expect(tables.length).toBe(2);
    // GIVEN
    // WHEN
    const rightRows = tables[1].queryAll(By.css('td'));
    // THEN
    expect(rightRows.length).toBe(4);
    const testEmployee = testData.TEST_DEPARTMENTS[1].employees[0];
    expect(rightRows[1].nativeElement.textContent).toContain(testEmployee.id);
    expect(rightRows[2].nativeElement.textContent).toContain(testEmployee.firstName);
    expect(rightRows[3].nativeElement.textContent).toContain(testEmployee.lastName);
  });
  /**
   * Tests selection for a row in the left side table.
   */
  it('should toggle selection for a left side row and update checkbox', () => {
    // GIVEN
    fixture.detectChanges();
    const tables = fixture.debugElement.queryAll(
      By.css('table.employee-table')
    );
    // WHEN
    const checkbox = tables[0].query(By.css('td'));
    // THEN
    expect(component.leftSideSelection.selected.length).toBe(0);
    // WHEN
    checkbox.nativeElement.click();
    // THEN
    fixture.detectChanges();
    expect(component.leftSideSelection.selected.length).toBe(1);
    // WHEN
    // Unselect
    checkbox.nativeElement.click();
    // THEN
    fixture.detectChanges();
    expect(component.leftSideSelection.selected.length).toBe(0);
  });
  /**
   * Tests selection for a row in the right side table.
   */
  it('should toggle selection for a right side row and update checkbox', () => {
    // GIVEN
    fixture.detectChanges();
    const tables = fixture.debugElement.queryAll(
      By.css('table.employee-table')
    );
    // THEN
    fixture.detectChanges();
    expect(component.rightSideSelection.selected.length).toBe(0);
    // WHEN
    const checkbox = tables[1].query(By.css('td'));
    // THEN
    expect(component.rightSideSelection.selected.length).toBe(0);
    // WHEN
    checkbox.nativeElement.click();
    // THEN
    fixture.detectChanges();
    expect(component.rightSideSelection.selected.length).toBe(1);
    // WHEN
    // Unselect
    checkbox.nativeElement.click();
    // THEN
    fixture.detectChanges();
    expect(component.rightSideSelection.selected.length).toBe(0);
  });
  /**
   * Tests selection for all rows on the left side .
   */
  it('should toggle all rows on the left side when header checkbox is clicked', () => {
    // GIVEN
    fixture.detectChanges();
    const tables = fixture.debugElement.queryAll(
      By.css('table.employee-table')
    );
    // WHEN
    const headerCheckbox = tables[0].query(By.css('th'));
    headerCheckbox.nativeElement.click();
    // THEN
    fixture.detectChanges();
    expect(component.leftSideSelection.selected.length).toBe(0);
    // WHEN
    // Unselect all
    headerCheckbox.nativeElement.click();
    // THEN
    fixture.detectChanges();
    expect(component.leftSideSelection.selected.length).toBe(0);
  });
  /**
   * Tests selection for all rows on the right side .
   */
  it('should toggle all rows on the right side when header checkbox is clicked', () => {
    // GIVEN
    fixture.detectChanges();
    const tables = fixture.debugElement.queryAll(
      By.css('table.employee-table')
    );
    // WHEN
    const headerCheckbox = tables[1].query(By.css('th'));
    headerCheckbox.nativeElement.click();
    // THEN
    fixture.detectChanges();
    expect(component.rightSideSelection.selected.length).toBe(0);
    // WHEN
    // Unselect all
    headerCheckbox.nativeElement.click();
    // THEN
    fixture.detectChanges();
    expect(component.rightSideSelection.selected.length).toBe(0);
  });
  /**
   * Tests transfer button enabling.
   */
  it('should enable transfer button only when selection and different departments', () => {
    // GIVEN
    fixture.detectChanges();
    // WHEN
    // Select a row
    component.leftSideSelection.select(testData.TEST_DEPARTMENTS[0].employees[0]);
    // THEN
    fixture.detectChanges();
    // WHEN
    // Button should be enabled
    const leftButton = fixture.debugElement.queryAll(
      By.css('button[matFab]')
    )[0];
    // THEN
    expect(leftButton.nativeElement.disabled).toBeFalse();
    // WHEN
    // Set both departments the same
    component.rightSideDepartmentId = component.leftSideDepartmentId;
    // THEN
    fixture.detectChanges();
    expect(component.disableTransferButton('LEFT-SIDE')).toBeTrue();
  });
  /**
   * Tests employee transfer from left to right.
   */
  it('should transfer employee from left to right', () => {
    // GIVEN
    fixture.detectChanges();
    const testEmployee = testData.TEST_DEPARTMENTS[0].employees[0];
    // WHEN
    component.leftSideSelection.select(testEmployee);
    // THEN
    fixture.detectChanges();
    // GIVEN
    doneTransferFromLeftToRight = true;
    // WHEN
    component.transferEmployees('LEFT-SIDE');
    // THEN
    fixture.detectChanges();
    expect(
      component.leftSideEmployees.find(emp => emp.id === testEmployee.id)
    ).toBeUndefined();
    expect(
      component.rightSideEmployees.find(emp => emp.id === testEmployee.id)
    ).toBeDefined();
  });
  /**
   * Tests employee transfer from right to left.
   */
  it('should transfer employee from right to left', () => {
    // GIVEN
    fixture.detectChanges();
    const testEmployee = testData.TEST_DEPARTMENTS[0].employees[0];
    // WHEN
    component.rightSideSelection.select(testEmployee);
    // THEN
    fixture.detectChanges();
    // GIVEN
    doneTransferFromRightToLeft = true;
    // WHEN
    component.transferEmployees('RIGHT-SIDE');
    // THEN
    fixture.detectChanges();
    expect(
      component.leftSideEmployees.find(emp => emp.id === testEmployee.id)
    ).toBeDefined();
    expect(
      component.rightSideEmployees.find(emp => emp.id === testEmployee.id)
    ).toBeUndefined();
  });
  /**
   * Tests employees update for changed department on the left side.
   */
  it('should update employees when department selection changes on the left side', fakeAsync(() => {
    // GIVEN
    component.departments = departmentService.getDepartments();
    fixture.detectChanges();
    expect(component.leftSideEmployees.length).toBe(1);
                console.log('--------------------------------------------------------------------------- LEFT');
                console.log(component.rightSideEmployees);
                console.log(testData.TEST_DEPARTMENTS[1].employees[0]);
    const testEmployeeBefore = testData.TEST_DEPARTMENTS[0].employees[0];
    expect(component.leftSideEmployees[0].id).toBe(testEmployeeBefore.id);
    // WHEN
    component.selectDepartment('LEFT-SIDE', testData.TEST_DEPARTMENTS[1].id);
    // THEN
    fixture.detectChanges();
    tick();
    expect(component.leftSideEmployees.length).toBe(1);
    const testEmployeeAfter = testData.TEST_DEPARTMENTS[1].employees[0];
    expect(component.leftSideEmployees[0].id).toBe(testEmployeeAfter.id);
    expect(component.leftSideEmployees[0].lastName).toBe(testEmployeeAfter.lastName);
  }));
  /**
   * Tests employees update for changed department on the right side.
   */
  it('should update employees when department selection changes on the right side', fakeAsync(() => {
    // GIVEN
    component.departments = departmentService.getDepartments();
    fixture.detectChanges();
    expect(component.rightSideEmployees.length).toBe(1);
                console.log('--------------------------------------------------------------------------- RIGHT');
                console.log(component.rightSideEmployees);
                console.log(testData.TEST_DEPARTMENTS[1].employees[0]);
    const testEmployeeBefore = testData.TEST_DEPARTMENTS[1].employees[0];
    expect(component.rightSideEmployees[0].id).toBe(testEmployeeBefore.id);
    // WHEN
    component.selectDepartment('RIGHT-SIDE',  testData.TEST_DEPARTMENTS[0].id);
    // THEN
    fixture.detectChanges();
    tick();
    expect(component.rightSideEmployees.length).toBe(1);
    const testEmployeeAfter = testData.TEST_DEPARTMENTS[0].employees[0];
    expect(component.rightSideEmployees[0].id).toBe(testEmployeeAfter.id);
    expect(component.rightSideEmployees[0].lastName).toBe(testEmployeeAfter.lastName);
  }));
  /**
   * Tests checkbox labels on the left side.
   */
  it('should provide correct checkbox labels on the left side', () => {
    // GIVEN
    fixture.detectChanges();
    const testEmployee = testData.TEST_DEPARTMENTS[0].employees[0];
    expect(component.checkboxLabel('LEFT-SIDE')).toContain('select');
    // WHEN
    component.leftSideSelection.select(testEmployee);
    // THEN
    expect(component.checkboxLabel('LEFT-SIDE', testEmployee)).toContain(
      'deselect'
    );
    component.leftSideSelection.clear();
    // THEN
    expect(component.checkboxLabel('LEFT-SIDE', testEmployee)).toContain('select');
  });
  /**
   * Tests checkbox labels on the right side.
   */
  it('should provide correct checkbox labels on the right side', () => {
    // GIVEN
    fixture.detectChanges();
    const testEmployee = testData.TEST_DEPARTMENTS[0].employees[0];
    expect(component.checkboxLabel('RIGHT-SIDE')).toContain('select');
    // WHEN
    component.rightSideSelection.select(testEmployee);
    // THEN
    expect(component.checkboxLabel('RIGHT-SIDE', testEmployee)).toContain(
      'deselect'
    );
    // WHEN
    component.rightSideSelection.clear();
    // THEN
    expect(component.checkboxLabel('RIGHT-SIDE', testEmployee)).toContain('select');
  });
  /**
   * Tests all rows selection on the left side.
   */
  it('should correctly report if all rows are selected on the left side', () => {
    // GIVEN
    fixture.detectChanges();
    const employees = testData.TEST_DEPARTMENTS[0].employees;
    expect(component.isAllSelected('LEFT-SIDE')).toBeFalse();
    // WHEN
    employees.forEach(emp => component.leftSideSelection.select(emp));
    // THEN
    expect(component.isAllSelected('LEFT-SIDE')).toBeTrue();
  });
  /**
   * Tests all rows selection on the right side.
   */
  it('should correctly report if all rows are selected on the right side', () => {
    // GIVEN
    fixture.detectChanges();
    const employees = testData.TEST_DEPARTMENTS[0].employees;
    expect(component.isAllSelected('RIGHT-SIDE')).toBeFalse();
    // WHEN
    employees.forEach(e => component.rightSideSelection.select(e));
    // THEN
    expect(component.isAllSelected('RIGHT-SIDE')).toBeTrue();
  });
});
