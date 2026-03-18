import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
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

let doneTransferFromLeftToRight = false;
let doneTransferFromRightToLeft = false;
const departmentServiceSpy = jasmine.createSpyObj('DepartmentService', ['getDepartments', 'transferEmployees']);
departmentServiceSpy.getDepartments.and
  .callFake((): Department[] => {
    return [...testData.TEST_DEPARTMENTS];
  });
const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['getEmployees']);
employeeServiceSpy.getEmployees.and
  .callFake((departmentId: number): Employee[] => {
    if (doneTransferFromLeftToRight) {
      if (departmentId == testData.TEST_DEPARTMENTS[0].id) {
        return [];
      } else {
        return testData.TEST_EMPLOYEES_TRANSFERRED;
      }
    } else if (doneTransferFromRightToLeft) {
      if (departmentId == testData.TEST_DEPARTMENTS[0].id) {
        return testData.TEST_EMPLOYEES_TRANSFERRED;
      } else {
        return [];
      }
    } else {
      if (departmentId == testData.TEST_DEPARTMENTS[0].id) {
        return [...testData.TEST_DEPARTMENTS[0].employees];
      } else {
        return [...testData.TEST_DEPARTMENTS[1].employees];
      }
    }
  });
/**
 * The tests of the EmployeeTransferComponent.
 */
describe('EmployeeTransferComponent', () => {
  let component: EmployeeTransferComponent;
  let fixture: ComponentFixture<EmployeeTransferComponent>;

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
      ],
      providers: [
        { provide: DepartmentService, useValue: departmentServiceSpy },
        { provide: EmployeeService, useValue: employeeServiceSpy },
      ],
    })
      .compileComponents();

    doneTransferFromLeftToRight = false;
    doneTransferFromRightToLeft = false;
    departmentServiceSpy.transferEmployees.calls.reset();
    fixture = TestBed.createComponent(EmployeeTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });
  /**
   * Tests that the EmployeeTransferComponent compiles successfully.
   * This is a basic test to ensure that the component can be created without errors.
   */
  it('should compile', () => {
    // GIVEN
    // WHEN
    // THEN
    expect(component).toBeTruthy();
    console.log('compile');
  });
  /**
   * Tests that  the department dropdowns are populated.
   */
  it('should populate department dropdowns', async () => {
    // GIVEN
    fixture.detectChanges();
    await fixture.whenStable();
    // WHEN
    const matSelects = fixture.debugElement.queryAll(By.css('mat-select'));
    // THEN
    expect(matSelects.length).toBe(2, 'Should have 2 department selects');
    matSelects[0].nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const options = fixture.debugElement.queryAll(By.css('mat-option'));
    expect(options.length).toBe(testData.TEST_DEPARTMENTS.length);
    expect(options[0].nativeElement.textContent).toContain(
      testData.TEST_DEPARTMENTS[0].name
    );
    console.log('should populate department dropdowns');
  });
  /**
   * Tests that the employee tables for left and right sides are rendered.
   */
  [
    {
      testName: 'should render left employee tables',
      tableIndex: 0,
      getEmployees: () => testData.TEST_DEPARTMENTS[0].employees,
    },
    {
      testName: 'should render right employee tables',
      tableIndex: 1,
      getEmployees: () => testData.TEST_DEPARTMENTS[1].employees,
    },
  ].forEach(({ testName, tableIndex, getEmployees }) =>
    it(testName, async () => {
      // GIVEN
      fixture.detectChanges();
      await fixture.whenStable();
      // WHEN
      const tables = fixture.debugElement.queryAll(By.css('table.employee-table'));
      // THEN
      expect(tables.length).toBe(2);
      // WHEN
      const rows = tables[tableIndex].queryAll(By.css('td'));
      // THEN
      expect(rows.length).toBe(4);
      const testEmployee = getEmployees()[0];
      expect(rows[1].nativeElement.textContent).toContain(testEmployee.id);
      expect(rows[2].nativeElement.textContent).toContain(testEmployee.firstName);
      expect(rows[3].nativeElement.textContent).toContain(testEmployee.lastName);
      console.log(testName);
    })
  );
  /**
   * Tests that the selection for a row and update checkbox are toggled.
   */
  [
    {
      testName: 'should toggle selection for a left side row and update checkbox',
      tableIndex: 0,
      getSelection: (component: EmployeeTransferComponent) => component.leftSideSelection,
    },
    {
      testName: 'should toggle selection for a right side row and update checkbox',
      tableIndex: 1,
      getSelection: (component: EmployeeTransferComponent) => component.rightSideSelection,
    },
  ].forEach(({ testName, tableIndex, getSelection }) =>
    it(testName, async () => {
      // GIVEN
      fixture.detectChanges();
      await fixture.whenStable();
      // WHEN
      const tables = fixture.debugElement.queryAll(By.css('table.employee-table'));
      const checkbox = tables[tableIndex].query(By.css('td'));
      const selection = getSelection(component);
      // THEN
      expect(selection.selected.length).toBe(0);
      // WHEN
      checkbox.nativeElement.click();
      fixture.detectChanges();
      await fixture.whenStable();
      // THEN
      expect(selection.selected.length).toBe(1);
      // WHEN
      checkbox.nativeElement.click();
      fixture.detectChanges();
      await fixture.whenStable();
      // THEN
      expect(selection.selected.length).toBe(0);
      console.log(testName);
    })
  );
  /**
   * Tests that all rows when header checkbox is clicked are toggled.
   */
  [
    {
      testName: 'should toggle all rows on the left side when header checkbox is clicked',
      tableIndex: 0,
      getSelection: (component: EmployeeTransferComponent) => component.leftSideSelection,
    },
    {
      testName: 'should toggle all rows on the right side when header checkbox is clicked',
      tableIndex: 1,
      getSelection: (component: EmployeeTransferComponent) => component.rightSideSelection,
    },
  ].forEach(({ testName, tableIndex, getSelection }) =>
    it(testName, async () => {
      // GIVEN
      fixture.detectChanges();
      await fixture.whenStable();
      // WHEN
      const tables = fixture.debugElement.queryAll(By.css('table.employee-table'));
      const headerCheckbox = tables[tableIndex].query(By.css('th'));
      const selection = getSelection(component);
      headerCheckbox.nativeElement.click();
      fixture.detectChanges();
      await fixture.whenStable();
      // THEN
      expect(selection.selected.length).toBe(0);
      // WHEN
      headerCheckbox.nativeElement.click();
      fixture.detectChanges();
      await fixture.whenStable();
      // THEN
      expect(selection.selected.length).toBe(0);
      console.log(testName);
    })
  );
  /**
   * Tests that employee from left to right and right to left is transfered.
   */
  [
    {
      testName: 'should transfer employee from left to right',
      setTransferDoneFlag: () => { doneTransferFromLeftToRight = true; },
      selectEmployee: (component: EmployeeTransferComponent, emp: Employee) => component.leftSideSelection.select(emp),
      transfer: (component: EmployeeTransferComponent) => component.transferEmployees('LEFT-SIDE'),
      sourceEmployees: (component: EmployeeTransferComponent) => component.leftSideEmployees,
      targetEmployees: (component: EmployeeTransferComponent) => component.rightSideEmployees,
    },
    {
      testName: 'should transfer employee from right to left',
      setTransferDoneFlag: () => { doneTransferFromRightToLeft = true; },
      selectEmployee: (component: EmployeeTransferComponent, emp: Employee) => component.rightSideSelection.select(emp),
      transfer: (component: EmployeeTransferComponent) => component.transferEmployees('RIGHT-SIDE'),
      sourceEmployees: (component: EmployeeTransferComponent) => component.rightSideEmployees,
      targetEmployees: (component: EmployeeTransferComponent) => component.leftSideEmployees,
    },
  ].forEach(
    ({
      testName,
      setTransferDoneFlag,
      selectEmployee,
      transfer,
      sourceEmployees,
      targetEmployees,
    }) =>
      it(testName, async () => {
        // GIVEN
        fixture.detectChanges();
        await fixture.whenStable();
        const employee = testData.TEST_DEPARTMENTS[0].employees[0];
        selectEmployee(component, employee);
        fixture.detectChanges();
        await fixture.whenStable();
        setTransferDoneFlag();
        // WHEN
        transfer(component);
        // THEN
        fixture.detectChanges();
        await fixture.whenStable();
        expect(sourceEmployees(component).find(emp => emp.id === employee.id)).toBeUndefined();
        expect(targetEmployees(component).find(emp => emp.id === employee.id)).toBeDefined();
        console.log(testName);
      })
  );
  /**
   * Tests that correct checkbox labels are provided.
   */
  [
    {
      testName: 'should provide correct checkbox labels on the left side',
      side: 'LEFT-SIDE',
      getSelection: (component: EmployeeTransferComponent) => component.leftSideSelection,
    },
    {
      testName: 'should provide correct checkbox labels on the right side',
      side: 'RIGHT-SIDE',
      getSelection: (component: EmployeeTransferComponent) => component.rightSideSelection,
    },
  ].forEach(({ testName, side, getSelection }) =>
    it(testName, async () => {
      // GIVEN
      fixture.detectChanges();
      await fixture.whenStable();
      const employee = testData.TEST_DEPARTMENTS[0].employees[0]
      expect(component.checkboxLabel(side === 'LEFT-SIDE' ? 'LEFT-SIDE' : 'RIGHT-SIDE')).toContain('select');
      // WHEN
      getSelection(component).select(employee);
      // THEN
      expect(component.checkboxLabel(side === 'LEFT-SIDE' ? 'LEFT-SIDE' : 'RIGHT-SIDE', employee)).toContain('deselect');
      // WHEN
      getSelection(component).clear();
      // THEN
      expect(component.checkboxLabel(side === 'LEFT-SIDE' ? 'LEFT-SIDE' : 'RIGHT-SIDE', employee)).toContain('select');
      console.log(testName);
    })
  );
  /**
   * Tests that it correctly reports if all rows are selected.
   */
  [
    {
      testName: 'should correctly report if all rows are selected on the left side',
      side: 'LEFT-SIDE',
      getSelection: (component: EmployeeTransferComponent) => component.leftSideSelection,
      getEmployees: () => testData.TEST_DEPARTMENTS[0].employees,
    },
    {
      testName: 'should correctly report if all rows are selected on the right side',
      side: 'RIGHT-SIDE',
      getSelection: (component: EmployeeTransferComponent) => component.rightSideSelection,
      getEmployees: () => testData.TEST_DEPARTMENTS[1].employees,
    },
  ].forEach(({ side, testName, getSelection, getEmployees }) =>
    it(testName, async () => {
      // GIVEN
      fixture.detectChanges();
      await fixture.whenStable();
      // WHEN
      // THEN
      expect(component.isAllSelected(side === 'LEFT-SIDE' ? 'LEFT-SIDE' : 'RIGHT-SIDE')).toBeFalse();
      // WHEN
      getEmployees().forEach(emp => getSelection(component).select(emp));
      // THEN
      expect(component.isAllSelected(side === 'LEFT-SIDE' ? 'LEFT-SIDE' : 'RIGHT-SIDE')).toBeTrue();
      console.log(testName);
    })
  );
  /**
   * Tests that employees when department selection changes (left/right) are updated.
   */
  [
    {
      testName: 'should update employees when department selection changes on the left side',
      side: 'LEFT-SIDE',
      selectDepartmentId: testData.TEST_DEPARTMENTS[1].id,
      getEmployees: () => testData.TEST_DEPARTMENTS[1].employees,
      getEmployeesBefore: () => testData.TEST_DEPARTMENTS[0].employees,
      targetProp: (component: EmployeeTransferComponent) => component.leftSideEmployees,
    },
    {
      testName: 'should update employees when department selection changes on the right side',
      side: 'RIGHT-SIDE',
      selectDepartmentId: testData.TEST_DEPARTMENTS[0].id,
      getEmployees: () => testData.TEST_DEPARTMENTS[0].employees,
      getEmployeesBefore: () => testData.TEST_DEPARTMENTS[1].employees,
      targetProp: (component: EmployeeTransferComponent) => component.rightSideEmployees,
    },
  ].forEach(
    ({
      testName,
      side,
      selectDepartmentId,
      getEmployees,
      getEmployeesBefore,
      targetProp,
    }) =>
      it(testName, fakeAsync(async () => {
        // GIVEN
        fixture.detectChanges();
        await fixture.whenStable();
        const beforeEmployee = getEmployeesBefore()[0];
        // WHEN
        // THEN
        expect(targetProp(component)[0].id).toBe(beforeEmployee.id);
        component.selectDepartment(side === 'LEFT-SIDE' ? 'LEFT-SIDE' : 'RIGHT-SIDE', selectDepartmentId);
        fixture.detectChanges();
        await fixture.whenStable();
        // WHEN
        tick();
        // THEN
        expect(targetProp(component).length).toBe(1);
        const afterEmployee = getEmployees()[0];
        expect(targetProp(component)[0].id).toBe(afterEmployee.id);
        expect(targetProp(component)[0].lastName).toBe(afterEmployee.lastName);
        console.log(testName);
      }))
  );
});