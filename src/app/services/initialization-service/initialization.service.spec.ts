import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
  RequestMatch,
  TestRequest
} from '@angular/common/http/testing';

import { DepartmentService } from '../department-service/department.service';
import { InitializationService, BROWSER_STORAGE } from './initialization.service';
import { RepositoryType } from 'home/repository-type';
import { ENDPOINTS } from 'services/backend-endpoints.constants';
import { TEST_REPOSITORY_TYPE, TEST_DEPARTMENTS } from 'testing/test-data';
/**
 * Unit tests for the {@link InitializationService}.
 *
 * This test suite sets up the Angular testing environment and verifies
 * that the {@link InitializationService} can be instantiated and functions correctly.
 */
describe('InitializationService', () => {
  let storage: Storage;
  let httpTesting: HttpTestingController;
  let departmentService: DepartmentService;
  let initializationService: InitializationService;
  /**
   * Sets up the testing module for the InitializationService.
   * This is necessary to provide the service and any dependencies it may have.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    storage = TestBed.inject<Storage>(BROWSER_STORAGE);
    storage.setItem('repositoryType', TEST_REPOSITORY_TYPE);
    httpTesting = TestBed.inject(HttpTestingController);
    initializationService = TestBed.inject(InitializationService);
    departmentService = TestBed.inject(DepartmentService);
  });
  /**
   * Resets the testing module.
   */
  afterEach(() => {
    // Verify that none of the tests make any extra HTTP requests.
    TestBed.inject(HttpTestingController).verify();
    storage.setItem('repositoryType', RepositoryType.WebStorage);
  });
  /**
   * Tests the creation of the InitializationService.
   * This test checks if the service is instantiated correctly
   * and is available for use in the application.
   */
  it('should be created', () => {
    expect(initializationService).toBeTruthy();
  });
  /**
   * Tests posting the initial data to the backend.
   */
  it('should post initial data to the backend', () => {
    // GIVEN
    const requestMatch: RequestMatch = {
      method: 'POST',
      url: ENDPOINTS.loadInitialData(TEST_REPOSITORY_TYPE)
    };
    // WHEN
    initializationService.postInitialDataToBackend();
    // THEN
    const testRequest: TestRequest = httpTesting.expectOne(requestMatch, 'Request to load initial data');
    expect(testRequest).toBeTruthy();
  });
  /**
   * Tests loading of the departments from the backend.
   */
  it('should load the departments from the backend', () => {
    // GIVEN
    const requestMatch: RequestMatch = {
      method: 'GET',
      url: ENDPOINTS.getDepartments(TEST_REPOSITORY_TYPE),
    };
    departmentService.setDepartments([]);
    // WHEN
    initializationService.loadDepartmentsFromBackend();
    const testRequest: TestRequest = httpTesting.expectOne(requestMatch, 'Request to load data from backend');
    testRequest.flush(TEST_DEPARTMENTS);
    // THEN
    checkDepartments();
  });
  /**
   * Checks that the actual departments matches the test departments.
   * Used for test assertions.
   */
  function checkDepartments() {
    const actualDepartments = departmentService.getDepartments();
    expect(Array.isArray(actualDepartments)).toBeTrue();
    expect(actualDepartments.length).toBe(TEST_DEPARTMENTS.length);
    TEST_DEPARTMENTS.forEach(expectedDep => {
      const actualDepartment = actualDepartments.find(
        (dep) => dep.name === expectedDep.name
      );
      expect(actualDepartment).toBeDefined();
      expect(actualDepartment?.id).toBe(expectedDep.id);
      expect(actualDepartment?.name).toBe(expectedDep.name);
    })
  }
});
