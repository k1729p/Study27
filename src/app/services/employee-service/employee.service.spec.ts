/**
 * Unit tests for the {@link EmployeeService}.
 *
 * This test suite sets up the Angular testing environment and verifies
 * that the {@link EmployeeService} can be instantiated correctly.
 *
 * @group UnitTest
 */
import { TestBed } from '@angular/core/testing';
import { EmployeeService } from './employee.service';
import { Employee } from '../../models/employee';
import { Title } from '../../models/title';

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
   * Tests if the EmployeeService is created successfully.
   * This test checks if the service instance is truthy, indicating that it has been instantiated correctly.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return initial employee array', () => {
    const employees = service.getEmployeeArray();
    expect(Array.isArray(employees)).toBeTrue();
    expect(employees.length).toBeGreaterThan(0);
    expect(employees[0][0].firstName).toBe('John');
  });

  it('should get employees for a specific department', () => {
    const departmentId = 1;
    const employees = service.getEmployees(departmentId);
    expect(Array.isArray(employees)).toBeTrue();
    expect(employees.length).toBeGreaterThan(0);
    expect(employees[0].id).toBe(1);
  });

  it('should get a specific employee by id', () => {
    const employee = service.getEmployee(1, 1);
    expect(employee).toBeTruthy();
    expect(employee?.firstName).toBe('John');
  });

  it('should create a new employee in a department', () => {
    const departmentId = 1;
    service.createEmployee(departmentId, { ...TEST_DATA[0] });
    const employees = service.getEmployees(departmentId);
    const createdEmployee = employees.find(
      (emp) => emp.lastName === TEST_DATA[0].lastName
    );
    expect(createdEmployee?.id).toBeGreaterThan(0);
    const TEST_EMPLOYEE_CREATED = { ...TEST_DATA[0]};
    TEST_EMPLOYEE_CREATED.id = createdEmployee?.id?? -1;
    expect(createdEmployee).toEqual(TEST_EMPLOYEE_CREATED);
  });

  it('should update an employee', () => {
    const departmentId = 1;
    const employee = service.getEmployees(departmentId)[0];
    const updatedEmployee = { ...employee, firstName: 'UpdatedName' };
    service.updateEmployee(departmentId, updatedEmployee);
    const fetched = service.getEmployee(departmentId, employee.id);
    expect(fetched?.firstName).toBe('UpdatedName');
  });

  it('should delete an employee', () => {
    const departmentId = 1;
    const employee = service.getEmployees(departmentId)[0];
    service.deleteEmployee(departmentId, employee.id);
    const deleted = service.getEmployee(departmentId, employee.id);
    expect(deleted).toBeUndefined();
  });

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
/**
 * Test employee data for the application.
 * This data is used to simulate employee records for testing purposes.
 * It includes a single employee with various attributes such as id, name, title, contact information, and address.
 */
const TEST_DATA: Employee[] = [
  {
    id: 1,
    firstName: 'Emily',
    lastName: 'Clark',
    title: Title.Developer,
    phone: '2025550143',
    mail: 'emily.clark@company.com',
    streetName: 'Maple Street',
    houseNumber: '42B',
    postalCode: '30301',
    locality: 'Atlanta',
    province: 'GA',
    country: 'United States',
  },
];
