import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { DepartmentTableComponent } from './department-table.component';
import { Department } from 'models/department';
import { DepartmentService } from 'services/department-service/department.service';
import * as testData from 'testing/test-data';

const departmentServiceSpy = jasmine.createSpyObj('DepartmentService', ['getDepartments']);
departmentServiceSpy.getDepartments.and
  .callFake((): Department[] => {
    return [...testData.TEST_DEPARTMENTS];
  });
/**
 * DepartmentTableComponent is a component that displays a table of departments.
 * It uses Angular Material's table features to display, sort, and paginate the
 * department data.
 * This component also provides methods to create, update, delete departments,
 * and read employees associated with a specific department.
 * It is part of the tables module and is used to manage department-related data.
 */
describe('DepartmentTableComponent', () => {
  let component: DepartmentTableComponent;
  let fixture: ComponentFixture<DepartmentTableComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let routeStub: Partial<ActivatedRoute>;
  /**
   * Sets up the testing module for the DepartmentTableComponent.
   * This includes importing necessary modules and compiling the component.
   * @returns void
   */
  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routeStub = {};
    await TestBed.configureTestingModule({
      imports: [DepartmentTableComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: DepartmentService, useValue: departmentServiceSpy },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(DepartmentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  /**
   * Tests that the DepartmentTableComponent compiles successfully.
   * This is a basic test to ensure that the component can be created without errors.
   */
  it('should compile', () => {
    expect(component).toBeTruthy();
  });
  /**
   * Tests that the ngAfterViewInit method sets the dataSource.sort, dataSource.paginator, and table.dataSource properties correctly.
   * This method is expected to be called after the view has been initialized.
   * It checks if the dataSource and table properties are set up correctly for the Angular Material table.
   */
  it('should set dataSource.sort, dataSource.paginator, and table.dataSource in ngAfterViewInit', () => {
    // GIVEN
    const mockSort = {} as import('@angular/material/sort').MatSort;
    const mockPaginator =
      {} as import('@angular/material/paginator').MatPaginator;
    const mockTable = {
      dataSource: null,
    } as unknown as import('@angular/material/table').MatTable<Department>;
    component.sort = mockSort;
    component.paginator = mockPaginator;
    component.table = mockTable;
    // WHEN
    component.ngAfterViewInit();
    // THEN
    expect(component.dataSource.sort).toBe(mockSort);
    expect(component.dataSource.paginator).toBe(mockPaginator);
    expect(component.table.dataSource).toBe(component.dataSource);
  });
  /**
   * Tests that the displayedColumns property is set correctly.
   * This property defines the columns that will be displayed in the department table.
   * It checks if the displayedColumns array matches the expected column names.
   */
  it('should have displayedColumns set correctly', () => {
    // GIVEN
    // WHEN
    // THEN
    expect(component.displayedColumns).toEqual([
      'id',
      'name',
      'actions',
    ]);
  });
  /**
   * Tests that the createDepartment method calls router.navigate with the correct parameters.
   * This method is expected to navigate to the department form for creating a new department.
   * It checks if the router's navigate method is called with the correct route and parameters.
   */
  it('should call router.navigate with correct params when createDepartment is called', () => {
    // GIVEN
    // WHEN
    component.createDepartment();
    // THEN
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/department-form', 'CREATE', '-1'],
      { relativeTo: TestBed.inject(ActivatedRoute) }
    );
  });
  /**
   * Tests that the updateDepartment method calls router.navigate with the correct parameters.
   * This method is expected to navigate to the department form for updating an existing department.
   * It checks if the router's navigate method is called with the correct route and parameters.
   */
  it('should call router.navigate with correct params when updateDepartment is called', () => {
    // GIVEN
    // WHEN
    component.updateDepartment(testData.TEST_DEPARTMENT_ID);
    // THEN
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/department-form', 'UPDATE', testData.TEST_DEPARTMENT_ID],
      { relativeTo: TestBed.inject(ActivatedRoute) }
    );
  });
  /**
   * Tests that the deleteDepartment method calls router.navigate with the correct parameters.
   * This method is expected to navigate to the department form for deleting an existing department.
   * It checks if the router's navigate method is called with the correct route and parameters.
   */
  it('should call router.navigate with correct params when deleteDepartment is called', () => {
    // GIVEN
    // WHEN
    component.deleteDepartment(testData.TEST_DEPARTMENT_ID);
    // THEN
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/department-form', 'DELETE', testData.TEST_DEPARTMENT_ID],
      { relativeTo: TestBed.inject(ActivatedRoute) }
    );
  });
  /**
   * Tests that the viewEmployees method calls router.navigate with the correct parameters.
   * This method is expected to navigate to the employee table for a specific department.
   * It checks if the router's navigate method is called with the correct route and parameters.
   */
  it('should call router.navigate with correct params when viewEmployees is called', () => {
    // GIVEN
    // WHEN
    component.manageEmployees(testData.TEST_DEPARTMENT_ID);
    // THEN
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/employee-table', testData.TEST_DEPARTMENT_ID],
      {
        relativeTo: TestBed.inject(ActivatedRoute),
      }
    );
  });
});
