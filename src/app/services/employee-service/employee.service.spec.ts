import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DepartmentService } from '../department-service/department.service';
import { EmployeeService } from './employee.service';
import { TEST_DEPARTMENTS, TEST_DEPARTMENT_ID, TEST_EMPLOYEE_ID } from 'testing/test-data';
/**
 * Unit tests for the {@link EmployeeService}.
 *
 * This test suite sets up the Angular testing environment and verifies
 * that the {@link EmployeeService} can be instantiated and functions correctly.
 */
describe('EmployeeService', () => {
  let employeeService: EmployeeService;
  /**
   * Sets up the testing module for EmployeeService.
   * This function is called before each test to ensure a fresh instance of the service.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    // reseting data for tests
    const departmentService = TestBed.inject(DepartmentService);
    departmentService.setDepartments(TEST_DEPARTMENTS);
    employeeService = TestBed.inject(EmployeeService);
    employeeService.setEmployees(TEST_DEPARTMENT_ID, []);
  });

  /**
   * Checks that the EmployeeService is instantiated successfully.
   */
  it('should be created', () => {
    expect(employeeService).toBeTruthy();
  });

  /**
   * Verifies that the initial employee array is returned correctly.
   * Checks that the result is an array, contains elements, and the first employee has the expected first name.
   */
  it('should return initial employee array', () => {
    // GIVEN
    employeeService.setEmployees(TEST_DEPARTMENT_ID, TEST_DEPARTMENTS[0].employees);
    // WHEN
    const actualEmployees = employeeService.getEmployees(TEST_DEPARTMENT_ID);
    // THEN
    expect(Array.isArray(actualEmployees)).toBeTrue();
    expect(actualEmployees.length).toBeGreaterThan(0);
    expect(actualEmployees).toEqual(TEST_DEPARTMENTS[0].employees);
  });

  /**
   * Ensures that employees are retrieved for a specific department.
   * Checks that the result is an array, contains employees, and the first employee has the expected ID.
   */
  it('should get employees for a specific department', () => {
    // GIVEN
    employeeService.setEmployees(TEST_DEPARTMENT_ID, TEST_DEPARTMENTS[0].employees);
    // WHEN
    const actualEmployees = employeeService.getEmployees(TEST_DEPARTMENT_ID);
    // THEN
    expect(Array.isArray(actualEmployees)).toBeTrue();
    expect(actualEmployees.length).toBeGreaterThan(0);
    expect(actualEmployees).toEqual(TEST_DEPARTMENTS[0].employees);
  });

  /**
   * Checks if a specific employee can be retrieved by department and employee ID.
   * Verifies that the returned employee exists and has the expected first name.
   */
  it('should get a specific employee by id', () => {
    // GIVEN
    employeeService.setEmployees(TEST_DEPARTMENT_ID, TEST_DEPARTMENTS[0].employees);
    // WHEN
    const actualEmployee = employeeService.getEmployee(
      TEST_DEPARTMENT_ID,
      TEST_EMPLOYEE_ID
    );
    // THEN
    expect(actualEmployee).toBeTruthy();
    expect(actualEmployee).toEqual(TEST_DEPARTMENTS[0].employees[0]);
  });

  /**
   * Tests the creation of a new employee in a department.
   * Ensures the created employee is added and matches the test data.
   */
  it('should create a new employee in a department', () => {
    // GIVEN
    // WHEN
    employeeService.createEmployee(TEST_DEPARTMENT_ID, { ...TEST_DEPARTMENTS[0].employees[0] });
    // THEN
    const actualEmployees = employeeService.getEmployees(TEST_DEPARTMENT_ID);
    const actualEmployee = actualEmployees.find(
      (emp) => emp.lastName === TEST_DEPARTMENTS[0].employees[0].lastName
    );
    expect(actualEmployee?.id).toBeGreaterThan(0);
    const expectedEmployee = { ...TEST_DEPARTMENTS[0].employees[0] };
    expectedEmployee.id = actualEmployee?.id ?? -1;
    expect(actualEmployee).toEqual(expectedEmployee);
  });

  /**
   * Tests updating an employee's information.
   * Verifies that the employee's data is updated by checking the new first name.
   */
  it('should update an employee', () => {
    // GIVEN
    employeeService.setEmployees(TEST_DEPARTMENT_ID, TEST_DEPARTMENTS[0].employees);
    const updatedEmployee = {
      ...TEST_DEPARTMENTS[0].employees[0],
      firstName: 'UpdatedName',
    };
    // WHEN
    employeeService.updateEmployee(TEST_DEPARTMENT_ID, updatedEmployee);
    // THEN
    const actualEmployee = employeeService.getEmployee(
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
    employeeService.setEmployees(TEST_DEPARTMENT_ID, TEST_DEPARTMENTS[0].employees);
    // WHEN
    employeeService.deleteEmployee(TEST_DEPARTMENT_ID, TEST_EMPLOYEE_ID);
    // THEN
    const actualEmployee = employeeService.getEmployee(
      TEST_DEPARTMENT_ID,
      TEST_EMPLOYEE_ID
    );
    expect(actualEmployee).toBeUndefined();
  });
});
