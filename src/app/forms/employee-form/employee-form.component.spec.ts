import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EmployeeFormComponent } from './employee-form.component';
import {
  TEST_EMPLOYEES,
  TEST_DEPARTMENT_ID,
  TEST_EMPLOYEE_ID,
} from '../../testing/test-data';
/**
 * Unit tests for the EmployeeFormComponent.
 * This component is part of the forms module and is used to manage employee-related forms.
 * The component uses Angular Material components for UI elements and Reactive Forms for form handling.
 * It is designed to create, update, or delete employee records.
 */
describe('EmployeeFormComponent', () => {
  let component: EmployeeFormComponent;
  let fixture: ComponentFixture<EmployeeFormComponent>;
  /**
   * Sets up the testing module and compiles the component before each test.
   * The NoopAnimationsModule is imported to avoid issues with animations during testing.
   */
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, EmployeeFormComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}), // mock route params as needed
            snapshot: { paramMap: { get: () => null } },
          },
        },
      ],
    }).compileComponents();
  }));
  /**
   * Initializes the component and its dependencies before each test.
   */
  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  /**
   * Test if the component compiles successfully.
   * This is a basic test to ensure that the component can be instantiated without errors.
   */
  it('should compile', () => {
    expect(component).toBeTruthy();
  });
  /**
   * Test if the component initializes the form with default values for CREATE operation.
   */
  it('should initialize form with default values for CREATE operation', () => {
    // GIVEN
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.paramMap, 'get').and.callFake((key: string) => {
      if (key === 'operation') return 'CREATE';
      if (key === 'departmentId') return TEST_DEPARTMENT_ID.toString();
      return null;
    });
    // WHEN
    component.ngOnInit();
    // THEN
    expect(component.operation).toBe('CREATE');
    expect(component.formTitle).toBe('Create Employee');
    expect(component.buttonLabel).toBe('Create');
    expect(component.departmentId).toBe(TEST_DEPARTMENT_ID.toString());
    expect(component.id).toBe('');
    expect(component.titles.length).toBe(3);
    expect(component.titles[0]).toBe('Manager');
    expect(component.titles[1]).toBe('Analyst');
    expect(component.titles[2]).toBe('Developer');
    expect(component.employeeForm).toBeDefined();
    expect(component.employeeForm.valid).toBeFalse();
    expect(component.employeeForm.get('firstName')?.value).toBe('');
    expect(component.employeeForm.get('lastName')?.value).toBe('');
    expect(component.employeeForm.get('title')?.value).toBeDefined();
    expect(component.employeeForm.get('title')?.value).toBe(
      component.titles[2]
    );
    expect(component.employeeForm.get('phone')?.value).toBe('');
    expect(component.employeeForm.get('mail')?.value).toBe('');
    expect(component.employeeForm.get('streetName')?.value).toBe('');
    expect(component.employeeForm.get('houseNumber')?.value).toBe('');
    expect(component.employeeForm.get('postalCode')?.value).toBe('');
    expect(component.employeeForm.get('locality')?.value).toBe('');
    expect(component.employeeForm.get('province')?.value).toBe('');
    expect(component.employeeForm.get('country')?.value).toBe('');
  });
  /**
   * Test if the component calls the createEmployee method on submit for CREATE operation.
   */
  it('should call createEmployee on submit for CREATE operation', () => {
    // GIVEN
    const employeeService = (component as EmployeeFormComponent)
      .employeeService;
    spyOn(employeeService, 'createEmployee');
    component.operation = 'CREATE';
    component.departmentId = TEST_DEPARTMENT_ID.toString();
    component.employeeForm.controls['firstName'].setValue(
      TEST_EMPLOYEES[0][0].firstName
    );
    component.employeeForm.controls['lastName'].setValue(
      TEST_EMPLOYEES[0][0].lastName
    );
    component.employeeForm.controls['title'].setValue(
      TEST_EMPLOYEES[0][0].title
    );
    component.employeeForm.controls['phone'].setValue(
      TEST_EMPLOYEES[0][0].phone
    );
    component.employeeForm.controls['mail'].setValue(
      TEST_EMPLOYEES[0][0].mail
    );
    component.employeeForm.controls['streetName'].setValue(
      TEST_EMPLOYEES[0][0].streetName ?? ''
    );
    component.employeeForm.controls['houseNumber'].setValue(
      TEST_EMPLOYEES[0][0].houseNumber ?? ''
    );
    component.employeeForm.controls['postalCode'].setValue(
      TEST_EMPLOYEES[0][0].postalCode ?? ''
    );
    component.employeeForm.controls['locality'].setValue(
      TEST_EMPLOYEES[0][0].locality ?? ''
    );
    component.employeeForm.controls['province'].setValue(
      TEST_EMPLOYEES[0][0].province ?? ''
    );
    component.employeeForm.controls['country'].setValue(
      TEST_EMPLOYEES[0][0].country ?? ''
    );
    // WHEN
    component.onSubmit();
    // THEN
    const TEST_EMPLOYEE_CREATED = { ...TEST_EMPLOYEES[0][0], id: -1 };
    expect(employeeService.createEmployee).toHaveBeenCalledWith(
      TEST_DEPARTMENT_ID,
      jasmine.objectContaining(TEST_EMPLOYEE_CREATED)
    );
  });
  /**
   * Test if the component initializes the form with existing employee data for UPDATE operation.
   */
  it('should initialize form with employee data for UPDATE operation', () => {
    // GIVEN
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.paramMap, 'get').and.callFake((key: string) => {
      if (key === 'operation') return 'UPDATE';
      if (key === 'departmentId') return TEST_DEPARTMENT_ID.toString();
      if (key === 'id') return TEST_EMPLOYEE_ID.toString();
      return null;
    });
    // Mock employeeService.getEmployee
    const employeeService = component.employeeService;
    spyOn(employeeService, 'getEmployee').and.returnValue(TEST_EMPLOYEES[0][0]);
    // WHEN
    component.ngOnInit();
    // THEN
    expect(component.operation).toBe('UPDATE');
    expect(component.formTitle).toBe('Update Employee');
    expect(component.buttonLabel).toBe('Update');
    expect(component.employeeForm.get('firstName')?.value).toBe(
      TEST_EMPLOYEES[0][0].firstName
    );
    expect(component.employeeForm.get('lastName')?.value).toBe(
      TEST_EMPLOYEES[0][0].lastName
    );
    expect(component.employeeForm.get('title')?.value).toBe(
      TEST_EMPLOYEES[0][0].title
    );
    expect(component.employeeForm.get('phone')?.value).toBe(
      TEST_EMPLOYEES[0][0].phone
    );
    expect(component.employeeForm.get('mail')?.value).toBe(
      TEST_EMPLOYEES[0][0].mail
    );
    expect(component.employeeForm.get('streetName')?.value).toBe(
      TEST_EMPLOYEES[0][0].streetName
    );
    expect(component.employeeForm.get('houseNumber')?.value).toBe(
      TEST_EMPLOYEES[0][0].houseNumber
    );
    expect(component.employeeForm.get('postalCode')?.value).toBe(
      TEST_EMPLOYEES[0][0].postalCode
    );
    expect(component.employeeForm.get('locality')?.value).toBe(
      TEST_EMPLOYEES[0][0].locality
    );
    expect(component.employeeForm.get('province')?.value).toBe(
      TEST_EMPLOYEES[0][0].province
    );
    expect(component.employeeForm.get('country')?.value).toBe(
      TEST_EMPLOYEES[0][0].country
    );
  });

  /**
   * Test if the component calls updateEmployee on submit for UPDATE operation.
   */
  it('should call updateEmployee on submit for UPDATE operation', () => {
    // GIVEN
    const employeeService = component.employeeService;
    spyOn(employeeService, 'updateEmployee');
    component.operation = 'UPDATE';
    component.departmentId = TEST_DEPARTMENT_ID.toString();
    component.id = TEST_EMPLOYEE_ID.toString();
    component.employeeForm.patchValue(TEST_EMPLOYEES[0][0]);
    // WHEN
    component.onSubmit();
    // THEN
    expect(employeeService.updateEmployee).toHaveBeenCalledWith(
      TEST_DEPARTMENT_ID,
      jasmine.objectContaining(TEST_EMPLOYEES[0][0])
    );
  });

  /**
   * Test if the component calls deleteEmployee on submit for DELETE operation.
   */
  it('should call deleteEmployee on submit for DELETE operation', () => {
    // GIVEN
    const employeeService = component.employeeService;
    spyOn(employeeService, 'deleteEmployee');
    component.operation = 'DELETE';
    component.departmentId = TEST_DEPARTMENT_ID.toString();
    component.id = TEST_EMPLOYEE_ID.toString();
    // WHEN
    component.onSubmit();
    // THEN
    expect(employeeService.deleteEmployee).toHaveBeenCalledWith(
      TEST_DEPARTMENT_ID,
      TEST_EMPLOYEE_ID
    );
  });

  /**
   * Test if the component resets the form and navigates on cancel.
   */
  it('should reset the form and navigate on cancel', () => {
    // GIVEN
    const router = component['router'];
    const route = TestBed.inject(ActivatedRoute);
    spyOn(component.employeeForm, 'reset');
    spyOn(router, 'navigate');
    component.departmentId = TEST_DEPARTMENT_ID.toString();
    // WHEN
    component.onCancel();
    // THEN
    expect(component.employeeForm.reset).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(
      ['/employee-table', TEST_DEPARTMENT_ID.toString()],
      { relativeTo: route }
    );
  });

  /**
   * Test form validation: should be valid if required fields are present.
   */
  it('should be invalid if required fields are missing', () => {
    // GIVEN
    component.employeeForm.reset();
    // WHEN
    component.employeeForm.controls['firstName'].setValue(
      TEST_EMPLOYEES[0][0].firstName
    );
    component.employeeForm.controls['lastName'].setValue(
      TEST_EMPLOYEES[0][0].lastName
    );
    component.employeeForm.controls['title'].setValue(
      TEST_EMPLOYEES[0][0].title
    );
    component.employeeForm.controls['phone'].setValue(
      TEST_EMPLOYEES[0][0].phone
    );
    component.employeeForm.controls['mail'].setValue(TEST_EMPLOYEES[0][0].mail);
    // THEN
    expect(component.employeeForm.valid).toBeTrue();
  });

  /**
   * Test form validation: should be invalid if required fields are missing.
   */
  it('should be invalid if required fields are missing', () => {
    // GIVEN
    component.employeeForm.reset();
    // WHEN
    component.employeeForm.controls['firstName'].setValue('');
    component.employeeForm.controls['lastName'].setValue('');
    component.employeeForm.controls['title'].setValue(null);
    component.employeeForm.controls['phone'].setValue('');
    component.employeeForm.controls['mail'].setValue('');
    // THEN
    expect(component.employeeForm.valid).toBeFalse();
  });

  /**
   * Test email validation: should valid if email is valid.
   */
  it('should be invalid if email is not valid', () => {
    // GIVEN
    // WHEN
    component.employeeForm.controls['mail'].setValue('valid@email.com');
    // THEN
    expect(component.employeeForm.get('mail')?.valid).toBeTrue();
  });
  /**
   * Test email validation: should be invalid if email is not valid.
   */
  it('should be invalid if email is not valid', () => {
    // GIVEN
    // WHEN
    component.employeeForm.controls['mail'].setValue('invalid-email');
    // THEN
    expect(component.employeeForm.get('mail')?.valid).toBeFalse();
  });
});
