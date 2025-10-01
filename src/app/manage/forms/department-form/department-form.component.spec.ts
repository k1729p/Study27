import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { of } from 'rxjs';

import { DepartmentFormComponent } from './department-form.component';
import { Department } from 'models/department';
import { DepartmentService } from 'services/department-service/department.service';
import * as testData from 'testing/test-data';

/**
 * Unit tests for the DepartmentFormComponent.
 * This component is part of the forms module and is used to manage department-related forms.
 */
describe('DepartmentFormComponent', () => {
  let component: DepartmentFormComponent;
  let departmentServiceSpy: jasmine.SpyObj<DepartmentService>;
  let fixture: ComponentFixture<DepartmentFormComponent>;
  /**
   * Sets up the testing module and compiles the component before each test.
   * The NoopAnimationsModule is imported to avoid issues with animations during testing.
   */
  beforeEach(waitForAsync(() => {
    departmentServiceSpy = jasmine.createSpyObj('DepartmentService', [
      'getDepartments', 'getDepartment', 'createDepartment', 'updateDepartment', 'deleteDepartment'
    ]);
    departmentServiceSpy.getDepartments.and
      .callFake((): Department[] => {
        return [...testData.TEST_DEPARTMENTS];
      });
    departmentServiceSpy.getDepartment.and
      .callFake((id: number): Department | undefined => {
        return testData.TEST_DEPARTMENTS.find(dep => dep.id === id);
      });

    TestBed.configureTestingModule({
      providers: [
        provideNativeDateAdapter(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: { paramMap: { get: () => null } },
          },
        },
        { provide: DepartmentService, useValue: departmentServiceSpy }
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(DepartmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
  /**
   * Tests that the component is created successfully.
   * This is a basic test to ensure that the component can be instantiated without errors.
   */
  it('should compile', () => {
    expect(component).toBeTruthy();
  });
  /**
   * Tests the initialization of the form for the CREATE operation.
   * This test checks that the form is set up with default values
   * when the operation is set to 'CREATE'.
   */
  it('should initialize form with default values for CREATE operation', () => {
    // GIVEN
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.paramMap, 'get').and.callFake((key: string) => {
      if (key === 'operation') return 'CREATE';
      if (key === 'id') return null;
      return null;
    });
    // WHEN
    component.ngOnInit();
    // THEN
    expect(component.formTitle).toBe('Create Department');
    expect(component.buttonLabel).toBe('Create');
    expect(component.departmentForm.value.name).toBe('');
  });
  /**
   * Tests the submission of the form for the CREATE operation.
   * This test checks that the createDepartment method is called with the correct parameters.
   */
  it('should call departmentService.createDepartment on CREATE submit', () => {
    // GIVEN
    const departmentService = (component as DepartmentFormComponent)
      .departmentService;
    component.operation = 'CREATE';
    component.departmentForm.controls['name'].setValue(
      testData.TEST_DEPARTMENTS[0].name
    );
    component.departmentForm.controls['startDate'].setValue(
      testData.TEST_DEPARTMENTS[0].startDate ?? null
    );
    component.departmentForm.controls['endDate'].setValue(
      testData.TEST_DEPARTMENTS[0].endDate ?? null
    );
    component.departmentForm.controls['notes'].setValue(
      testData.TEST_DEPARTMENTS[0].notes ?? null
    );
    const KEYWORD = testData.TEST_DEPARTMENTS[0].keywords ?? [];
    component.keywordsSignal.set(KEYWORD);
    // WHEN
    component.onSubmit();
    // THEN
    expect(departmentService.createDepartment).toHaveBeenCalledWith({
      id: -1,
      name: testData.TEST_DEPARTMENTS[0].name,
      employees: [],
      startDate: testData.TEST_DEPARTMENTS[0].startDate,
      endDate: testData.TEST_DEPARTMENTS[0].endDate,
      notes: testData.TEST_DEPARTMENTS[0].notes,
      keywords: KEYWORD,
    });
  });

  /**
   * Tests the submission of the form for the UPDATE operation.
   * This test checks that the updateDepartment method is called with the correct parameters.
   */
  it('should call departmentService.updateDepartment on UPDATE submit', () => {
    // GIVEN
    const departmentService = (component as DepartmentFormComponent)
      .departmentService;
    component.operation = 'UPDATE';
    component.id = testData.TEST_DEPARTMENT_ID.toString();
    component.departmentForm.controls['name'].setValue(
      testData.TEST_DEPARTMENTS[0].name
    );
    component.departmentForm.controls['startDate'].setValue(
      testData.TEST_DEPARTMENTS[0].startDate ?? null
    );
    component.departmentForm.controls['endDate'].setValue(
      testData.TEST_DEPARTMENTS[0].endDate ?? null
    );
    component.departmentForm.controls['notes'].setValue(
      testData.TEST_DEPARTMENTS[0].notes ?? null
    );
    const KEYWORD = testData.TEST_DEPARTMENTS[0].keywords ?? [];
    component.keywordsSignal.set(KEYWORD);
    // WHEN
    component.onSubmit();
    // THEN
    expect(departmentService.updateDepartment).toHaveBeenCalledWith({
      id: testData.TEST_DEPARTMENT_ID,
      name: testData.TEST_DEPARTMENTS[0].name,
      employees: [],
      startDate: testData.TEST_DEPARTMENTS[0].startDate,
      endDate: testData.TEST_DEPARTMENTS[0].endDate,
      notes: testData.TEST_DEPARTMENTS[0].notes,
      keywords: KEYWORD,
    });
  });
  /**
   * Tests the submission of the form for the DELETE operation.
   * This test checks that the deleteDepartment method is called with the correct parameters.
   */
  it('should call departmentService.deleteDepartment on DELETE submit', () => {
    // GIVEN
    const departmentService = (component as DepartmentFormComponent)
      .departmentService;
    component.operation = 'DELETE';
    component.id = testData.TEST_DEPARTMENT_ID.toString();
    // WHEN
    component.onSubmit();
    // THEN
    expect(departmentService.deleteDepartment).toHaveBeenCalledWith(
      testData.TEST_DEPARTMENT_ID
    );
  });
  /**
   * Tests the addition of a keyword.
   * This test checks that a keyword is added to the keywordsSignal if it is not already present.
   */
  it('should add a keyword if not present', () => {
    // GIVEN
    component.keywordsSignal.set([testData.SUGGESTION_KEYWORDS[0]]);
    // WHEN
    component.addKeyword({
      value: testData.SUGGESTION_KEYWORDS[1],
      input: null,
    } as never);
    // THEN
    expect(component.keywordsSignal()).toContain(testData.SUGGESTION_KEYWORDS[1]);
  });
  /**
   * Tests that duplicate keywords are not added.
   * This test checks that if a keyword is already present in the keywordsSignal,
   * it is not added again.
   */
  it('should not add duplicate keywords', () => {
    // GIVEN
    component.keywordsSignal.set([testData.SUGGESTION_KEYWORDS[0]]);
    // WHEN
    component.addKeyword({
      value: testData.SUGGESTION_KEYWORDS[0],
      input: null,
    } as never);
    // THEN
    expect(
      component.keywordsSignal().filter((k) => k === testData.SUGGESTION_KEYWORDS[0])
        .length
    ).toBe(1);
  });
  /**
   * Tests the removal of a keyword.
   * This test checks that a keyword can be removed from the keywordsSignal.
   * It verifies that the keyword is no longer present after removal.
   */
  it('should remove a keyword', () => {
    // GIVEN
    component.keywordsSignal.set([...testData.SUGGESTION_KEYWORDS]);
    // WHEN
    component.removeKeyword(testData.SUGGESTION_KEYWORDS[0]);
    // THEN
    expect(component.keywordsSignal()).not.toContain(testData.SUGGESTION_KEYWORDS[0]);
    expect(component.keywordsSignal()).toContain(testData.SUGGESTION_KEYWORDS[1]);
  });
  /**
   * Tests the addition of a selected keyword from autocomplete.
   */
  it('should add selected keyword from autocomplete', () => {
    // GIVEN
    component.keywordsSignal.set([testData.SUGGESTION_KEYWORDS[0]]);
    const event = {
      option: {
        viewValue: testData.SUGGESTION_KEYWORDS[1],
        deselect: jasmine.createSpy('deselect'),
      },
      source: {}, // minimal mock to satisfy MatAutocompleteSelectedEvent interface
    } as unknown as import('@angular/material/autocomplete').MatAutocompleteSelectedEvent;
    // WHEN
    component.addSelectedKeyword(event);
    // THEN
    expect(component.keywordsSignal()).toContain(testData.SUGGESTION_KEYWORDS[0]);
    expect(component.keywordsSignal()).toContain(testData.SUGGESTION_KEYWORDS[1]);
    expect(component.keywordsSignal().length).toBe(2);
    expect(event.option.deselect).toHaveBeenCalled();
  });
  /**
   * Tests the filtering of workdays.
   */
  it('should filter workdays correctly', () => {
    // Saturday
    expect(component.workdaysFilter(testData.TEST_DAYS[0])).toBeFalse();
    // Sunday
    expect(component.workdaysFilter(testData.TEST_DAYS[1])).toBeFalse();
    // Monday
    expect(component.workdaysFilter(testData.TEST_DAYS[2])).toBeTrue();
  });
  /**
   * Tests the cancellation of the form.
   * This test checks that the form is reset and the router
   * navigates to the department list when the cancel button is clicked.
   */
  it('should reset form and navigate on cancel', () => {
    // GIVEN
    const router: import('@angular/router').Router = (
      component as DepartmentFormComponent
    )['router'];
    spyOn(router, 'navigate');
    spyOn(component.departmentForm, 'reset');
    // WHEN
    component.onCancel();
    // THEN
    expect(component.departmentForm.reset).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalled();
  });
});
