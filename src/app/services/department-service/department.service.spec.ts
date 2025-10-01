import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TEST_DEPARTMENTS, TEST_DEPARTMENT_ID } from 'testing/test-data';
import { Department } from 'models/department';
import { DepartmentService } from './department.service';
/**
 * Unit tests for the {@link DepartmentService}.
 *
 * This test suite sets up the Angular testing environment and verifies
 * that the {@link DepartmentService} can be instantiated and functions correctly.
 */
describe('DepartmentService', () => {
  let departmentService: DepartmentService;
  /**
   * Sets up the testing module for the DepartmentService.
   * This is necessary to provide the service and any dependencies it may have.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    departmentService = TestBed.inject(DepartmentService);
    // reseting data for tests
    departmentService.setDepartments([]);
  });
  /**
   * Tests the creation of the DepartmentService.
   * This test checks if the service is instantiated correctly
   * and is available for use in the application.
   */
  it('should be created', () => {
    expect(departmentService).toBeTruthy();
  });
  /**
   * Tests the retrieval of the initial department array.
   * This test checks if the service can return a non-empty array of departments
   * and that the first department has a defined name.
   */
  it('should return initial departments on getDepartmentArray()', () => {
    // GIVEN
    departmentService.setDepartments(TEST_DEPARTMENTS);
    // WHEN
    const actualDepartments = departmentService.getDepartments();
    // THEN
    checkDepartments(actualDepartments);
  });
  /**
   * Tests the retrieval of a department by its ID.
   * This test checks if the service can fetch a department by its ID
   * and that the returned department has the expected ID.
   */
  it('should get a department by id', () => {
    // GIVEN
    departmentService.setDepartments(TEST_DEPARTMENTS);
    // WHEN
    const department = departmentService.getDepartment(TEST_DEPARTMENT_ID);
    // THEN
    expect(department).toBeDefined();
    expect(department?.id).toBe(TEST_DEPARTMENT_ID);
  });
  /**
   * Tests the creation of a new department.
   * This test checks if the service can create a new department,
   * ensuring that the new department is added to the department array
   * and has a valid ID.
   */
  it('should create a new department', () => {
    // GIVEN
    // WHEN
    departmentService.createDepartment(TEST_DEPARTMENTS[0]);
    // THEN
    checkDepartments(departmentService.getDepartments());
  });
  /**
   * Tests the update functionality of an existing department.
   * This test checks if the service can update an existing department's details,
   * ensuring that the updated department has the new values.
   */
  it('should update an existing department', () => {
    // GIVEN
    departmentService.setDepartments(TEST_DEPARTMENTS);
    const updatedDepartment = { ...TEST_DEPARTMENTS[0], name: 'Updated Name' };
    // WHEN
    departmentService.updateDepartment(updatedDepartment);
    // THEN
    const actualUpdated = departmentService.getDepartment(TEST_DEPARTMENT_ID);
    expect(actualUpdated?.name).toBe('Updated Name');
  });
  /**
   * Tests the deletion of a department.
   * This test checks if the service can delete a department by its ID,
   * ensuring that the department is no longer present in the department array
   * and that all associated employees are also deleted.
   */
  it('should delete a department', () => {
    // GIVEN
    departmentService.setDepartments(TEST_DEPARTMENTS);
    // WHEN
    departmentService.deleteDepartment(TEST_DEPARTMENT_ID);
    // THEN
    const actualDepartment = departmentService.getDepartment(TEST_DEPARTMENT_ID);
    expect(actualDepartment).toBeUndefined();
  });
  /**
   * Tests transferring an employee between departments.
   * Ensures the employee is removed from the source department and added to the target department.
   */
  it('should transfer an employee between departments', () => {
    // GIVEN
    departmentService.setDepartments(TEST_DEPARTMENTS);
    const sourceDepartmentId = TEST_DEPARTMENT_ID;
    const targetDepartmentId = TEST_DEPARTMENT_ID + 1;
    const transferedEmployees = TEST_DEPARTMENTS[0].employees;
    // WHEN
    departmentService.transferEmployees(
      sourceDepartmentId,
      targetDepartmentId,
      transferedEmployees
    );
    // THEN
    const actualSourceDepartment = departmentService.getDepartment(sourceDepartmentId);
    transferedEmployees.forEach(employee => {
      expect(actualSourceDepartment?.employees.find(emp => emp.id === employee.id)).toBeUndefined();
    });
    const actualTargetDepartment = departmentService.getDepartment(targetDepartmentId);
    transferedEmployees.forEach(employee => {
      expect(actualTargetDepartment?.employees.find(emp => emp.id === employee.id)).toBeDefined();
    });
  });
  /**
   * Checks that the first department in actualDepartments matches the first in TEST_DEPARTMENTS.
   * Used for test assertions.
   */
  function checkDepartments(actualDepartments: Department[]) {
    expect(Array.isArray(actualDepartments)).toBeTrue();
    expect(actualDepartments.length).toBeGreaterThan(0);
    const actualDepartment = actualDepartments.find(
      (dep) => dep.name === TEST_DEPARTMENTS[0].name
    );
    expect(actualDepartment).toBeDefined();
    expect(actualDepartment?.id).toBeGreaterThan(0);
    expect(actualDepartment?.name).toBe(TEST_DEPARTMENTS[0].name);

    let actualDate = new Date(actualDepartment?.startDate ?? Date.now());
    let expectedDate = new Date(TEST_DEPARTMENTS[0].startDate ?? Date.now());
    expect(actualDate.getTime()).toEqual(expectedDate.getTime());
    actualDate = new Date(actualDepartment?.endDate ?? Date.now());
    expectedDate = new Date(TEST_DEPARTMENTS[0].endDate ?? Date.now());
    expect(actualDate.getTime()).toEqual(expectedDate.getTime());

    expect(actualDepartment?.notes).toBe(TEST_DEPARTMENTS[0].notes);
    expect(actualDepartment?.keywords).toEqual(TEST_DEPARTMENTS[0].keywords);
  }
});
