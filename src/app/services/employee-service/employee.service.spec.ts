import { TestBed } from '@angular/core/testing';

import { EmployeeService } from './employee.service';
import {
  TEST_EMPLOYEES,
  TEST_DEPARTMENT_ID,
  TEST_EMPLOYEE_ID,
} from 'testing/test-data';
/**
 * Unit tests for the {@link EmployeeService}.
 *
 * This test suite sets up the Angular testing environment and verifies
 * that the {@link EmployeeService} can be instantiated and functions correctly.
 */
describe('EmployeeService', () => {
  let service: EmployeeService;

  /**
   * Sets up the testing module for EmployeeService.
   * This function is called before each test to ensure a fresh instance of the service.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeService);
    // reseting data for tests
    service.setEmployeeArray([[]]);
  });

  /**
   * Checks that the EmployeeService is instantiated successfully.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Verifies that the initial employee array is returned correctly.
   * Checks that the result is an array, contains elements, and the first employee has the expected first name.
   */
  it('should return initial employee array', () => {
    // GIVEN
    service.setEmployeeArray(TEST_EMPLOYEES);
    // WHEN
    const actualEmployees = service.getEmployeeArray();
    // THEN
    expect(Array.isArray(actualEmployees)).toBeTrue();
    expect(actualEmployees.length).toBeGreaterThan(0);
    expect(actualEmployees).toEqual(TEST_EMPLOYEES);
  });

  /**
   * Ensures that employees are retrieved for a specific department.
   * Checks that the result is an array, contains employees, and the first employee has the expected ID.
   */
  it('should get employees for a specific department', () => {
    // GIVEN
    service.setEmployeeArray(TEST_EMPLOYEES);
    // WHEN
    const actualEmployees = service.getEmployees(TEST_DEPARTMENT_ID);
    // THEN
    expect(Array.isArray(actualEmployees)).toBeTrue();
    expect(actualEmployees.length).toBeGreaterThan(0);
    expect(actualEmployees).toEqual(TEST_EMPLOYEES[0]);
  });

  /**
   * Checks if a specific employee can be retrieved by department and employee ID.
   * Verifies that the returned employee exists and has the expected first name.
   */
  it('should get a specific employee by id', () => {
    // GIVEN
    service.setEmployeeArray(TEST_EMPLOYEES);
    // WHEN
    const actualEmployee = service.getEmployee(
      TEST_DEPARTMENT_ID,
      TEST_EMPLOYEE_ID
    );
    // THEN
    expect(actualEmployee).toBeTruthy();
    expect(actualEmployee).toEqual(TEST_EMPLOYEES[0][0]);
  });

  /**
   * Tests the creation of a new employee in a department.
   * Ensures the created employee is added and matches the test data.
   */
  it('should create a new employee in a department', () => {
    // GIVEN
    // WHEN
    service.createEmployee(TEST_DEPARTMENT_ID, { ...TEST_EMPLOYEES[0][0] });
    // THEN
    const actualEmployees = service.getEmployees(TEST_DEPARTMENT_ID);
    const actualEmployee = actualEmployees.find(
      (emp) => emp.lastName === TEST_EMPLOYEES[0][0].lastName
    );
    expect(actualEmployee?.id).toBeGreaterThan(0);
    const expectedEmployee = { ...TEST_EMPLOYEES[0][0] };
    expectedEmployee.id = actualEmployee?.id ?? -1;
    expect(actualEmployee).toEqual(expectedEmployee);
  });

  /**
   * Tests updating an employee's information.
   * Verifies that the employee's data is updated by checking the new first name.
   */
  it('should update an employee', () => {
    // GIVEN
    service.setEmployeeArray(TEST_EMPLOYEES);
    const updatedEmployee = {
      ...TEST_EMPLOYEES[0][0],
      firstName: 'UpdatedName',
    };
    // WHEN
    service.updateEmployee(TEST_DEPARTMENT_ID, updatedEmployee);
    // THEN
    const actualEmployee = service.getEmployee(
      TEST_DEPARTMENT_ID,
      TEST_EMPLOYEE_ID
    );
    expect(actualEmployee?.firstName).toBe('UpdatedName');
  });

  /**
   * Tests deleting an employee from a department.
   * Ensures the employee is removed and cannot be retrieved.
   */
  it('should delete an employee', () => {
    // GIVEN
    service.setEmployeeArray(TEST_EMPLOYEES);
    // WHEN
    service.deleteEmployee(TEST_DEPARTMENT_ID, TEST_EMPLOYEE_ID);
    // THEN
    const actualEmployee = service.getEmployee(
      TEST_DEPARTMENT_ID,
      TEST_EMPLOYEE_ID
    );
    expect(actualEmployee).toBeUndefined();
  });

  /**
   * Tests transferring an employee between departments.
   * Ensures the employee is removed from the source department and added to the target department.
   */
  it('should transfer an employee between departments', () => {
    // GIVEN
    service.setEmployeeArray(TEST_EMPLOYEES);
    const sourceDepartmentId = TEST_DEPARTMENT_ID;
    const targetDepartmentId = TEST_DEPARTMENT_ID + 1;
    const transferedEmployee = TEST_EMPLOYEES[0][0];
    // WHEN
    service.transferEmployee(
      sourceDepartmentId,
      targetDepartmentId,
      transferedEmployee
    );
    // THEN
    const actualInSource = service.getEmployee(
      sourceDepartmentId,
      transferedEmployee.id
    );
    expect(actualInSource).toBeUndefined();
    const actualInTarget = service.getEmployee(
      targetDepartmentId,
      transferedEmployee.id
    );
    expect(actualInTarget).toEqual(transferedEmployee);
  });
});
