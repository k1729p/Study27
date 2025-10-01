import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of, skip, take } from 'rxjs';

import { Department } from 'models/department';
import { Employee } from 'models/employee';
import { DepartmentService } from 'services/department-service/department.service';
import { EmployeeService } from 'services/employee-service/employee.service';
import { EmployeeLocateComponent } from './employee-locate.component';
import * as testData from 'testing/test-data';

const departmentServiceSpy = jasmine.createSpyObj('DepartmentService', ['getDepartments']);
departmentServiceSpy.getDepartments.and
  .callFake((): Department[] => {
    return [...testData.TEST_DEPARTMENTS];
  });
const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['getEmployees', 'getEmployee']);
employeeServiceSpy.getEmployees.and
  .callFake((departmentId: number): Employee[] => {
    const department = testData.TEST_DEPARTMENTS.find(dep => dep.id === departmentId);
    return department ? department.employees : [];
  });
employeeServiceSpy.getEmployee.and
  .callFake((departmentId: number, employeeId: number): Employee | undefined => {
    return employeeServiceSpy.getEmployees(departmentId)
      .find((emp: { id: number; }) => emp.id === employeeId);
  });
/**
 * Unit tests for the EmployeeLocateComponent.
 * This file contains tests to ensure that the component compiles correctly.
 */
describe('EmployeeLocateComponent', () => {
  let component: EmployeeLocateComponent;
  let fixture: ComponentFixture<EmployeeLocateComponent>;
  let mockDialog: Partial<MatDialog>;

  /**
   * Sets up the testing module for EmployeeLocateComponent.
   * This function initializes the testing environment and compiles the component.
   */
  beforeEach(() => {
    mockDialog = {
      open: jasmine.createSpy('open'),
    };
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 1 }),
            snapshot: { paramMap: { get: () => 1 } },
          },
        },
        { provide: DepartmentService, useValue: departmentServiceSpy },
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: MatDialog, useValue: mockDialog },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(EmployeeLocateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Test to check if the EmployeeLocateComponent compiles successfully.
   * This test ensures that the component can be instantiated without errors.
   */
  it('should compile', () => {
    // GIVEN
    // WHEN
    // THEN
    expect(component).toBeTruthy();
  });

  /**
   * Test to verify that the dataSource is initialized correctly with department and employee data.
   * This test checks that departments are loaded and structured as expected.
   */
  it('should initialize dataSource with departments and employees', () => {
    // GIVEN
    // WHEN
    // THEN
    expect(component.dataSource.length).toBe(testData.TEST_DEPARTMENTS.length);
    expect(component.dataSource[0].name).toBe(testData.TEST_DEPARTMENTS[0].name);
    expect(component.dataSource[1].name).toBe(testData.TEST_DEPARTMENTS[1].name);
    // Each department should have children groups for employees
    for (const departmentNode of component.dataSource) {
      expect(departmentNode.children?.length).toBeGreaterThanOrEqual(1);
    }
  });

  /**
   * Test to verify that locateEmployee expands nodes when an employee is found.
   * This test simulates entering a valid employee name and expects tree.expand to be called.
   */
  it('should expand nodes when locateEmployee is called with a valid employee name', () => {
    // GIVEN
    // Spy on tree.expand
    component.tree = jasmine.createSpyObj('MatTree', ['expand']);
    component.formControl.setValue(testData.TEST_EMPLOYEE_FULL_NAME);
    // WHEN
    component.locateEmployee();
    // THEN
    // Should expand nodes for the found employee
    expect(component.tree.expand as jasmine.Spy).toHaveBeenCalled();
  });

  /**
   * Test to verify that locateEmployee opens the dialog when employee is not found.
   * This test simulates entering an invalid employee name and expects dialog.open to be called.
   */
  it('should open dialog when locateEmployee is called with an invalid employee name', () => {
    // GIVEN
    component.formControl.setValue('Non Existent Employee Name');
    component.tree = jasmine.createSpyObj('MatTree', ['expand']);
    // WHEN
    component.locateEmployee();
    // THEN
    expect(mockDialog.open as jasmine.Spy).toHaveBeenCalled();
  });

  /**
   * Test to verify that employeeNames observable emits correct values based on input.
   * This test checks that the autocomplete list contains correct employee names.
   */
  it('should filter employeeNames for autocomplete', (done) => {
    // GIVEN
    // WHEN
    component.employeeNames?.pipe(skip(1), take(1)).subscribe((names) => {
      expect(Array.isArray(names)).toBeTrue();
      expect(names.some((name) => name.startsWith(testData.TEST_EMPLOYEE_FULL_NAME)));
      done();
    });
    component.formControl.setValue('Cl');
  });

  /**
   * Test to ensure that the filterNames method returns matching employee names.
   * This test uses a substring and expects correct filtering.
   */
  it('should return filtered names with filterNames', () => {
    // GIVEN
    const namesArray = testData.TEST_DEPARTMENTS.map(dep => dep.employees).flat().map(
      emp => `${emp.firstName} ${emp.lastName}`
    );
    // WHEN
    const filtered = component.filterNames(namesArray, 'em');
    // THEN
    expect(
      filtered.some((name) => name.toLowerCase().includes('em'))
    ).toBeTrue();
  });

  /**
   * Test to verify that findPath returns the correct path to the employee node.
   * This test checks that the returned path includes the correct nodes for a given employee name.
   */
  it('should find path to an employee node', () => {
    // GIVEN
    // WHEN
    const path = component.findPath(
      component.dataSource,
      testData.TEST_EMPLOYEE_FULL_NAME,
      []
    );
    // THEN
    expect(path?.map((node) => node.name)).toContain(testData.TEST_EMPLOYEE_FULL_NAME);
  });

  /**
   * Test to verify that groupByTitle sorts titles according to custom order.
   * This test checks that Managers, Analysts, Developers are sorted in the correct sequence.
   */
  it('should group and sort employees by title in custom order', () => {
    // GIVEN
    // WHEN
    const grouped = component.groupByTitle({
      Manager: [],
      Analyst: [],
      Developer: [],
    });
    // THEN
    expect(grouped[0].name.startsWith('Manager')).toBeTrue();
    expect(grouped[1].name.startsWith('Analyst')).toBeTrue();
    expect(grouped[2].name.startsWith('Developer')).toBeTrue();
  });

  /**
   * Test to verify collectEmployeeNames gathers all employee names recursively from nodes.
   * This test ensures that all employee names are found in the tree structure.
   */
  it('should collect all employee names from dataSource', () => {
    // GIVEN
    // WHEN
    const names = component.collectEmployeeNames(component.dataSource, []);
    // THEN
    const expectedNames = testData.TEST_DEPARTMENTS.map(dep => dep.employees).flat().map(
      emp => `${emp.firstName} ${emp.lastName}`
    );
    expectedNames.forEach(name => expect(names).toContain(name));
  });
});
