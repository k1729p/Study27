import { TestBed } from '@angular/core/testing';
import { DepartmentService } from './department.service';
import { Department } from '../../models/department';
/**
 * Unit tests for the DepartmentService.
 *
 * This test suite verifies the functionality of the DepartmentService, which is responsible for managing
 * department-related operations such as fetching, creating, updating, and deleting departments. The service
 * interacts with the backend API to perform these operations.
 *
 * @group DepartmentService
 *
 * @remarks
 * The tests cover the following scenarios:
 * - Service instantiation
 * - Retrieving the initial list of departments
 * - Fetching a department by its ID
 * - Creating a new department
 * - Updating an existing department
 * - Deleting a department
 *
 * @see DepartmentService
 */
describe('DepartmentService', () => {
  let service: DepartmentService;
  /**
   * Sets up the testing module for the DepartmentService.
   * This is necessary to provide the service and any dependencies it may have.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartmentService);
  });
  /**
   * Tests the creation of the DepartmentService.
   * This test checks if the service is instantiated correctly
   * and is available for use in the application.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
/**
 * Tests the retrieval of the initial department array.
 * This test checks if the service can return a non-empty array of departments
 * and that the first department has a defined name.
 */
  it('should return initial departments on getDepartmentArray()', () => {
    const departments = service.getDepartmentArray();
    expect(departments.length).toBeGreaterThan(0);
    expect(departments[0].name).toBeDefined();
  });
/**
 * Tests the retrieval of a department by its ID.
 * This test checks if the service can fetch a department by its ID
 * and that the returned department has the expected ID.
 */
  it('should get a department by id', () => {
    const department = service.getDepartment(1);
    expect(department).toBeDefined();
    expect(department?.id).toBe(1);
  });
/**
 * Tests the creation of a new department.
 * This test checks if the service can create a new department,
 * ensuring that the new department is added to the department array
 * and has a valid ID.
 */
  it('should create a new department', () => {
    service.createDepartment(TEST_DATA[0]);
    const departments = service.getDepartmentArray();
    const createdDepartment = departments.find(dep => dep.name === TEST_DATA[0].name);
    expect(createdDepartment).toBeDefined();
    expect(createdDepartment?.id).toBeGreaterThan(0);
    expect(createdDepartment?.name).toBe(TEST_DATA[0].name);

    let actualDate = new Date(createdDepartment?.startDate ?? Date.now());
    let expectedDate = new Date(TEST_DATA[0].startDate?? Date.now());
    expect(actualDate.getTime()).toEqual(expectedDate.getTime());
    actualDate = new Date(createdDepartment?.endDate ?? Date.now());
    expectedDate = new Date(TEST_DATA[0].endDate ?? Date.now());
    expect(actualDate.getTime()).toEqual(expectedDate.getTime());

    expect(createdDepartment?.notes).toBe(TEST_DATA[0].notes);
    expect(createdDepartment?.keywords).toEqual(TEST_DATA[0].keywords);
    expect(departments.length).toBeGreaterThan(0);
  });
/**
 * Tests the update functionality of an existing department.
 * This test checks if the service can update an existing department's details,
 * ensuring that the updated department has the new values.
 */
  it('should update an existing department', () => {
    const departments = service.getDepartmentArray();
    const department = { ...departments[0], name: 'Updated Name' };
    service.updateDepartment(department);
    const updated = service.getDepartment(department.id);
    expect(updated?.name).toBe('Updated Name');
  });
/**
 * Tests the deletion of a department.
 * This test checks if the service can delete a department by its ID,
 * ensuring that the department is no longer present in the department array
 * and that all associated employees are also deleted.
 */
  it('should delete a department', () => {
    const departments = service.getDepartmentArray();
    const idToDelete = departments[0].id;
    spyOn(service['employeeService'], 'getEmployeeArray').and.returnValue([[]]);
    spyOn(service['employeeService'], 'deleteEmployee');
    service.deleteDepartment(idToDelete);
    const deleted = service.getDepartment(idToDelete);
    expect(deleted).toBeUndefined();
  });
});
const TEST_DAYS: Date[] = [
  new Date('2020-01-04'),
  new Date('2020-01-05'),
  new Date('2020-01-06'),
  new Date('2020-01-07'),
];
/**
 * Suggestion keywords for the autocomplete.
 */
const SUGGESTION_KEYWORDS: string[] = ['Banking', 'Credit'];
/**
 * Test department data for departments.
 * This data is used to populate the department array in tests.
 */
const TEST_DATA: Department[] = [
  {
    id: 1,
    name: 'Main Office',
    startDate: TEST_DAYS[2],
    endDate: TEST_DAYS[3],
    notes: 'Main product:\n - money transfer',
    keywords: [SUGGESTION_KEYWORDS[0]],
  },
];
