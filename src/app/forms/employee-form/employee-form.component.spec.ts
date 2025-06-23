import { EmployeeFormComponent } from './employee-form.component';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Employee } from '../../models/employee';
import { Title } from '../../models/title';
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
    // Mock ActivatedRoute for CREATE
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.paramMap, 'get').and.callFake((key: string) => {
      if (key === 'operation') return 'CREATE';
      if (key === 'departmentId') return '1';
      return null;
    });
    component.ngOnInit();
    expect(component.operation).toBe('CREATE');
    expect(component.formTitle).toBe('Create Employee');
    expect(component.buttonLabel).toBe('Create');
    expect(component.departmentId).toBe('1');
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
    const employeeService = (component as EmployeeFormComponent)
      .employeeService;
    spyOn(employeeService, 'createEmployee');
    component.operation = 'CREATE';
    component.departmentId = '1';
    component.employeeForm.controls['firstName'].setValue(
      TEST_DATA[0].firstName
    );
    component.employeeForm.controls['lastName'].setValue(TEST_DATA[0].lastName);
    component.employeeForm.controls['title'].setValue(TEST_DATA[0].title);
    component.employeeForm.controls['phone'].setValue(TEST_DATA[0].phone);
    component.employeeForm.controls['mail'].setValue(TEST_DATA[0].mail);
    component.employeeForm.controls['streetName'].setValue(
      TEST_DATA[0].streetName ?? ''
    );
    component.employeeForm.controls['houseNumber'].setValue(
      TEST_DATA[0].houseNumber ?? ''
    );
    component.employeeForm.controls['postalCode'].setValue(
      TEST_DATA[0].postalCode ?? ''
    );
    component.employeeForm.controls['locality'].setValue(
      TEST_DATA[0].locality ?? ''
    );
    component.employeeForm.controls['province'].setValue(
      TEST_DATA[0].province ?? ''
    );
    component.employeeForm.controls['country'].setValue(
      TEST_DATA[0].country ?? ''
    );
    component.onSubmit();
    const TEST_EMPLOYEE_CREATED = { ...TEST_DATA[0], id: -1 };
    expect(employeeService.createEmployee).toHaveBeenCalledWith(
      +component.departmentId,
      jasmine.objectContaining(TEST_EMPLOYEE_CREATED)
    );
  });
  /**
   * Test if the component initializes the form with existing employee data for UPDATE operation.
   */
  it('should initialize form with employee data for UPDATE operation', () => {
    // Mock ActivatedRoute for UPDATE
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.paramMap, 'get').and.callFake((key: string) => {
      if (key === 'operation') return 'UPDATE';
      if (key === 'departmentId') return '1';
      if (key === 'id') return '1';
      return null;
    });
    // Mock employeeService.getEmployee
    const employeeService = component.employeeService;
    spyOn(employeeService, 'getEmployee').and.returnValue(TEST_DATA[0]);
    component.ngOnInit();
    expect(component.operation).toBe('UPDATE');
    expect(component.formTitle).toBe('Update Employee');
    expect(component.buttonLabel).toBe('Update');
    expect(component.employeeForm.get('firstName')?.value).toBe(
      TEST_DATA[0].firstName
    );
    expect(component.employeeForm.get('lastName')?.value).toBe(
      TEST_DATA[0].lastName
    );
    expect(component.employeeForm.get('title')?.value).toBe(TEST_DATA[0].title);
    expect(component.employeeForm.get('phone')?.value).toBe(TEST_DATA[0].phone);
    expect(component.employeeForm.get('mail')?.value).toBe(TEST_DATA[0].mail);
    expect(component.employeeForm.get('streetName')?.value).toBe(
      TEST_DATA[0].streetName
    );
    expect(component.employeeForm.get('houseNumber')?.value).toBe(
      TEST_DATA[0].houseNumber
    );
    expect(component.employeeForm.get('postalCode')?.value).toBe(
      TEST_DATA[0].postalCode
    );
    expect(component.employeeForm.get('locality')?.value).toBe(
      TEST_DATA[0].locality
    );
    expect(component.employeeForm.get('province')?.value).toBe(
      TEST_DATA[0].province
    );
    expect(component.employeeForm.get('country')?.value).toBe(
      TEST_DATA[0].country
    );
  });

  /**
   * Test if the component calls updateEmployee on submit for UPDATE operation.
   */
  it('should call updateEmployee on submit for UPDATE operation', () => {
    const employeeService = component.employeeService;
    spyOn(employeeService, 'updateEmployee');
    component.operation = 'UPDATE';
    component.departmentId = '1';
    component.id = '1';
    component.employeeForm.patchValue(TEST_DATA[0]);
    component.onSubmit();
    expect(employeeService.updateEmployee).toHaveBeenCalledWith(
      +component.departmentId,
      jasmine.objectContaining(TEST_DATA[0])
    );
  });

  /**
   * Test if the component calls deleteEmployee on submit for DELETE operation.
   */
  it('should call deleteEmployee on submit for DELETE operation', () => {
    const employeeService = component.employeeService;
    spyOn(employeeService, 'deleteEmployee');
    component.operation = 'DELETE';
    component.departmentId = '1';
    component.id = '1';
    component.onSubmit();
    expect(employeeService.deleteEmployee).toHaveBeenCalledWith(
      +component.departmentId,
      +component.id
    );
  });

  /**
   * Test if the component resets the form and navigates on cancel.
   */
  it('should reset the form and navigate on cancel', () => {
    const router = component['router'];
    const route = TestBed.inject(ActivatedRoute);
    spyOn(component.employeeForm, 'reset');
    spyOn(router, 'navigate');
    component.departmentId = '1';
    component.onCancel();
    expect(component.employeeForm.reset).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(
      ['/employee-table', component.departmentId],
      { relativeTo: route }
    );
  });

  /**
   * Test form validation: should be invalid if required fields are missing.
   */
  it('should be invalid if required fields are missing', () => {
    component.employeeForm.reset();
    expect(component.employeeForm.valid).toBeFalse();
    component.employeeForm.controls['firstName'].setValue('John');
    component.employeeForm.controls['lastName'].setValue('');
    component.employeeForm.controls['title'].setValue(Title.Developer);
    component.employeeForm.controls['phone'].setValue('');
    component.employeeForm.controls['mail'].setValue('not-an-email');
    expect(component.employeeForm.valid).toBeFalse();
    component.employeeForm.controls['lastName'].setValue('Doe');
    component.employeeForm.controls['phone'].setValue('1234567890');
    component.employeeForm.controls['mail'].setValue('john.doe@email.com');
    expect(component.employeeForm.valid).toBeTrue();
  });

  /**
   * Test email validation: should be invalid if email is not valid.
   */
  it('should be invalid if email is not valid', () => {
    component.employeeForm.controls['mail'].setValue('invalid-email');
    expect(component.employeeForm.get('mail')?.valid).toBeFalse();
    component.employeeForm.controls['mail'].setValue('valid@email.com');
    expect(component.employeeForm.get('mail')?.valid).toBeTrue();
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
