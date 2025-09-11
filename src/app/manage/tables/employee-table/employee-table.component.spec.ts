import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { EmployeeTableComponent } from './employee-table.component';
import { Employee } from 'models/employee';
import { TEST_DEPARTMENT_ID, TEST_EMPLOYEE_ID } from 'testing/test-data';
/**
 * EmployeeTableComponent is a component that displays a table of employees.
 * It uses Angular Material's table features to display, sort, and paginate the
 * employee data.
 * This component also provides methods to create, update, delete employees,
 * and read details of a specific employee.
 */
describe('EmployeeTableComponent', () => {
  let component: EmployeeTableComponent;
  let fixture: ComponentFixture<EmployeeTableComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  /**
   * Sets up the testing module for the EmployeeTableComponent.
   * This includes importing necessary modules and compiling the component.
   */
  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [EmployeeTableComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              departmentId: TEST_DEPARTMENT_ID,
            }),
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  if (key === 'departmentId') return TEST_DEPARTMENT_ID;
                  return null;
                },
              },
            },
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(EmployeeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  /**
   * Initializes the component and fixture before each test.
   * This is where the component instance is created and the initial change detection is run.
   */
  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  /**
   * Tests that the EmployeeTableComponent compiles successfully.
   * This is a basic test to ensure that the component can be created without errors.
   */
  it('should compile', () => {
    expect(component).toBeTruthy();
  });
  /**
   * Tests that the ngAfterViewInit method sets the dataSource.sort, dataSource.paginator,
   * and table.dataSource properties correctly.
   * This method is expected to be called after the view has been initialized.
   * It checks if the dataSource and table properties are set up correctly for the Angular Material table.
   */
  it('should set dataSource sort, paginator, and table dataSource on ngAfterViewInit', () => {
    // GIVEN
    const mockSort = {} as import('@angular/material/sort').MatSort;
    const mockPaginator =
      {} as import('@angular/material/paginator').MatPaginator;
    const mockTable = {
      dataSource: null,
    } as unknown as import('@angular/material/table').MatTable<Employee>;
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
      'firstName',
      'lastName',
      'actions',
    ]);
  });
  /**
   * Tests that the createEmployee method navigates to the create employee form.
   * This method is expected to navigate to the employee form for creating a new employee.
   * It checks if the router's navigate method is called with the correct route and parameters.
   */
  it('should navigate to create employee form on createEmployee', () => {
    // GIVEN
    // WHEN
    component.createEmployee();
    // THEN
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/employee-form', TEST_DEPARTMENT_ID, 'CREATE', '-1'],
      { relativeTo: jasmine.any(Object) }
    );
  });
  /**
   * Tests that the updateEmployee method navigates to the update employee form.
   * This method is expected to navigate to the employee form for updating an existing employee.
   * It checks if the router's navigate method is called with the correct route and parameters.
   */
  it('should navigate to update employee form on updateEmployee', () => {
    // GIVEN
    // WHEN
    component.updateEmployee(TEST_EMPLOYEE_ID);
    // THEN
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/employee-form', TEST_DEPARTMENT_ID, 'UPDATE', TEST_EMPLOYEE_ID],
      { relativeTo: jasmine.any(Object) }
    );
  });
  /**
   * Tests that the deleteEmployee method navigates to the delete employee form.
   * This method is expected to navigate to the employee form for deleting an existing employee.
   * It checks if the router's navigate method is called with the correct route and parameters.
   */
  it('should navigate to delete employee form on deleteEmployee', () => {
    // GIVEN
    // WHEN
    component.deleteEmployee(TEST_EMPLOYEE_ID);
    // THEN
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/employee-form', TEST_DEPARTMENT_ID, 'DELETE', TEST_EMPLOYEE_ID],
      { relativeTo: jasmine.any(Object) }
    );
  });
});
