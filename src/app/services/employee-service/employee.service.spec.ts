import { TEST_EMPLOYEES } from '../../testing/test-data';
import { EmployeeService } from './employee.service';
import { TestBed } from '@angular/core/testing';

/**
 * Unit tests for the {@link EmployeeService}.
 *
 * This test suite sets up the Angular testing environment and verifies
 * that the {@link EmployeeService} can be instantiated and functions correctly.
 *
 * @group UnitTest
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
    const employees = service.getEmployeeArray();
    expect(Array.isArray(employees)).toBeTrue();
    expect(employees.length).toBeGreaterThan(0);
    expect(employees[0][0].firstName).toBe('John');
  });

  /**
   * Ensures that employees are retrieved for a specific department.
   * Checks that the result is an array, contains employees, and the first employee has the expected ID.
   */
  it('should get employees for a specific department', () => {
    const departmentId = 1;
    const employees = service.getEmployees(departmentId);
    expect(Array.isArray(employees)).toBeTrue();
    expect(employees.length).toBeGreaterThan(0);
    expect(employees[0].id).toBe(1);
  });

  /**
   * Checks if a specific employee can be retrieved by department and employee ID.
   * Verifies that the returned employee exists and has the expected first name.
   */
  it('should get a specific employee by id', () => {
    const employee = service.getEmployee(1, 1);
    expect(employee).toBeTruthy();
    expect(employee?.firstName).toBe('John');
  });

  /**
   * Tests the creation of a new employee in a department.
   * Ensures the created employee is added and matches the test data.
   */
  it('should create a new employee in a department', () => {
    const departmentId = 1;
    service.createEmployee(departmentId, { ...TEST_EMPLOYEES[0] });
    const employees = service.getEmployees(departmentId);
    const createdEmployee = employees.find(
      (emp) => emp.lastName === TEST_EMPLOYEES[0].lastName
    );
    expect(createdEmployee?.id).toBeGreaterThan(0);
    const TEST_EMPLOYEE_CREATED = { ...TEST_EMPLOYEES[0] };
    TEST_EMPLOYEE_CREATED.id = createdEmployee?.id ?? -1;
    expect(createdEmployee).toEqual(TEST_EMPLOYEE_CREATED);
  });

  /**
   * Tests updating an employee's information.
   * Verifies that the employee's data is updated by checking the new first name.
   */
  it('should update an employee', () => {
    const departmentId = 1;
    const employee = service.getEmployees(departmentId)[0];
    const updatedEmployee = { ...employee, firstName: 'UpdatedName' };
    service.updateEmployee(departmentId, updatedEmployee);
    const fetched = service.getEmployee(departmentId, employee.id);
    expect(fetched?.firstName).toBe('UpdatedName');
  });

  /**
   * Tests deleting an employee from a department.
   * Ensures the employee is removed and cannot be retrieved.
   */
  it('should delete an employee', () => {
    const departmentId = 1;
    const employee = service.getEmployees(departmentId)[0];
    service.deleteEmployee(departmentId, employee.id);
    const deleted = service.getEmployee(departmentId, employee.id);
    expect(deleted).toBeUndefined();
  });

  /**
   * Tests transferring an employee between departments.
   * Ensures the employee is removed from the source department and added to the target department.
   */
  it('should transfer an employee between departments', () => {
    const sourceDepartmentId = 2;
    const targetDepartmentId = 3;
    const employee = service.getEmployees(sourceDepartmentId)[0];
    service.transferEmployee(sourceDepartmentId, targetDepartmentId, employee);
    const inSource = service.getEmployee(sourceDepartmentId, employee.id);
    const inTarget = service.getEmployee(targetDepartmentId, employee.id);
    expect(inSource).toBeUndefined();
    expect(inTarget).toBeTruthy();
  });
});
