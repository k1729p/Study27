import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EmployeeFormComponent } from './employee-form.component';
import { Employee } from 'models/employee';
import { EmployeeService } from 'services/employee-service/employee.service';
import * as testData from 'testing/test-data';

/**
 * Unit tests for the EmployeeFormComponent.
 * This component is part of the forms module and is used to manage employee-related forms.
 * The component uses Angular Material components for UI elements and Reactive Forms for form handling.
 * It is designed to create, update, or delete employee records.
 */
describe('EmployeeFormComponent', () => {
  let component: EmployeeFormComponent;
  let employeeServiceSpy: jasmine.SpyObj<EmployeeService>;
  let fixture: ComponentFixture<EmployeeFormComponent>;
  /**
   * Sets up the testing module and compiles the component before each test.
   */
  beforeEach(async () => {
    employeeServiceSpy = jasmine.createSpyObj('EmployeeService', [
      'getEmployees', 'getEmployee', 'createEmployee', 'updateEmployee', 'deleteEmployee'
    ]);
    employeeServiceSpy.getEmployees.and
      .callFake((departmentId: number): Employee[] => {
        const department = testData.TEST_DEPARTMENTS.find(dep => dep.id === departmentId);
        return department ? department.employees : [];
      });
    employeeServiceSpy.getEmployee.and
      .callFake((departmentId: number, employeeId: number): Employee | undefined => {
        return employeeServiceSpy.getEmployees(departmentId)
          .find((emp: { id: number; }) => emp.id === employeeId);
      });

    await TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: { paramMap: { get: () => null } },
          },
        },
        { provide: EmployeeService, useValue: employeeServiceSpy }
      ],
    }).compileComponents();

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
      if (key === 'departmentId') return testData.TEST_DEPARTMENT_ID.toString();
      return null;
    });
    // WHEN
    component.ngOnInit();
    // THEN
    expect(component.operation).toBe('CREATE');
    expect(component.formTitle).toBe('Create Employee');
    expect(component.buttonLabel).toBe('Create');
    expect(component.departmentId).toBe(testData.TEST_DEPARTMENT_ID.toString());
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
    const employeeService = component.employeeService;
    component.operation = 'CREATE';
    component.departmentId = testData.TEST_DEPARTMENT_ID.toString();
    const testEmployee = testData.TEST_DEPARTMENTS[0].employees[0];
    component.employeeForm.controls['firstName'].setValue(testEmployee.firstName);
    component.employeeForm.controls['lastName'].setValue(testEmployee.lastName);
    component.employeeForm.controls['title'].setValue(testEmployee.title);
    component.employeeForm.controls['phone'].setValue(testEmployee.phone);
    component.employeeForm.controls['mail'].setValue(testEmployee.mail);
    component.employeeForm.controls['streetName'].setValue(testEmployee.streetName ?? '');
    component.employeeForm.controls['houseNumber'].setValue(testEmployee.houseNumber ?? '');
    component.employeeForm.controls['postalCode'].setValue(testEmployee.postalCode ?? '');
    component.employeeForm.controls['locality'].setValue(testEmployee.locality ?? '');
    component.employeeForm.controls['province'].setValue(testEmployee.province ?? '');
    component.employeeForm.controls['country'].setValue(testEmployee.country ?? '');
    // WHEN
    component.onSubmit();
    // THEN
    const actualCreatedEmployee = { ...testEmployee, id: -1, departmentId: testData.TEST_DEPARTMENT_ID };
    expect(employeeService.createEmployee).toHaveBeenCalledWith(
      testData.TEST_DEPARTMENT_ID,
      jasmine.objectContaining(actualCreatedEmployee)
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
      if (key === 'departmentId') return testData.TEST_DEPARTMENT_ID.toString();
      if (key === 'id') return testData.TEST_EMPLOYEE_ID.toString();
      return null;
    });
    const testEmployee = testData.TEST_DEPARTMENTS[0].employees[0];
    // WHEN
    component.ngOnInit();
    // THEN
    expect(component.operation).toBe('UPDATE');
    expect(component.formTitle).toBe('Update Employee');
    expect(component.buttonLabel).toBe('Update');
    expect(component.employeeForm.get('firstName')?.value).toBe(testEmployee.firstName);
    expect(component.employeeForm.get('lastName')?.value).toBe(testEmployee.lastName);
    expect(component.employeeForm.get('title')?.value).toBe(testEmployee.title);
    expect(component.employeeForm.get('phone')?.value).toBe(testEmployee.phone);
    expect(component.employeeForm.get('mail')?.value).toBe(testEmployee.mail);
    expect(component.employeeForm.get('streetName')?.value).toBe(testEmployee.streetName);
    expect(component.employeeForm.get('houseNumber')?.value).toBe(testEmployee.houseNumber);
    expect(component.employeeForm.get('postalCode')?.value).toBe(testEmployee.postalCode);
    expect(component.employeeForm.get('locality')?.value).toBe(testEmployee.locality);
    expect(component.employeeForm.get('province')?.value).toBe(testEmployee.province);
    expect(component.employeeForm.get('country')?.value).toBe(testEmployee.country);
  });

  /**
   * Test if the component calls updateEmployee on submit for UPDATE operation.
   */
  it('should call updateEmployee on submit for UPDATE operation', () => {
    // GIVEN
    const employeeService = component.employeeService;
    component.operation = 'UPDATE';
    component.departmentId = testData.TEST_DEPARTMENT_ID.toString();
    component.id = testData.TEST_EMPLOYEE_ID.toString();
    const testEmployee = testData.TEST_DEPARTMENTS[0].employees[0];
    component.employeeForm.controls.departmentId.setValue(testEmployee.departmentId.toString());
    component.employeeForm.controls.firstName.setValue(testEmployee.firstName);
    component.employeeForm.controls.lastName.setValue(testEmployee.lastName);
    component.employeeForm.controls.title.setValue(testEmployee.title);
    component.employeeForm.controls.phone.setValue(testEmployee.phone);
    component.employeeForm.controls.mail.setValue(testEmployee.mail);
    component.employeeForm.controls.streetName.setValue(testEmployee.streetName ? testEmployee.streetName : '');
    component.employeeForm.controls.houseNumber.setValue(testEmployee.houseNumber ? testEmployee.houseNumber : '');
    component.employeeForm.controls.postalCode.setValue(testEmployee.postalCode ? testEmployee.postalCode : '');
    component.employeeForm.controls.locality.setValue(testEmployee.locality ? testEmployee.locality : '');
    component.employeeForm.controls.province.setValue(testEmployee.province ? testEmployee.province : '');
    component.employeeForm.controls.country.setValue(testEmployee.country ? testEmployee.country : '');
    // WHEN
    component.onSubmit();
    // THEN
    const actualUpdatedEmployee = { ...testEmployee, departmentId: testData.TEST_DEPARTMENT_ID };
    expect(employeeService.updateEmployee).toHaveBeenCalledWith(
      testData.TEST_DEPARTMENT_ID,
      jasmine.objectContaining(actualUpdatedEmployee)
    );
  });

  /**
   * Test if the component calls deleteEmployee on submit for DELETE operation.
   */
  it('should call deleteEmployee on submit for DELETE operation', () => {
    // GIVEN
    const employeeService = component.employeeService;
    component.operation = 'DELETE';
    component.departmentId = testData.TEST_DEPARTMENT_ID.toString();
    component.id = testData.TEST_EMPLOYEE_ID.toString();
    // WHEN
    component.onSubmit();
    // THEN
    expect(employeeService.deleteEmployee).toHaveBeenCalledWith(
      testData.TEST_DEPARTMENT_ID,
      testData.TEST_EMPLOYEE_ID
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
    component.departmentId = testData.TEST_DEPARTMENT_ID.toString();
    // WHEN
    component.onCancel();
    // THEN
    expect(component.employeeForm.reset).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(
      ['/employee-table', testData.TEST_DEPARTMENT_ID.toString()],
      { relativeTo: route }
    );
  });

  /**
   * Test form validation: should be valid if required fields are present.
   */
  it('should be valid if required fields are present', () => {
    // GIVEN
    component.employeeForm.reset();
    // WHEN
    const testEmployee = testData.TEST_DEPARTMENTS[0].employees[0];
    component.employeeForm.controls['firstName'].setValue(testEmployee.firstName);
    component.employeeForm.controls['lastName'].setValue(testEmployee.lastName);
    component.employeeForm.controls['title'].setValue(testEmployee.title);
    component.employeeForm.controls['phone'].setValue(testEmployee.phone);
    component.employeeForm.controls['mail'].setValue(testEmployee.mail);
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
   * Test email validation: should be valid if email is valid.
   */
  it('should be valid if email is valid', () => {
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
