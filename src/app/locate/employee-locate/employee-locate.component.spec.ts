import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EmployeeLocateComponent } from './employee-locate.component';
/**
 * Unit tests for the EmployeeLocateComponent.
 * This file contains tests to ensure that the component compiles correctly.
 */
describe('EmployeeLocate', () => {
  let component: EmployeeLocateComponent;
  let fixture: ComponentFixture<EmployeeLocateComponent>;
  /**
   * Setup the testing module for EmployeeLocateComponent.
   * This function initializes the testing environment and compiles the component.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 1 }),
            snapshot: { paramMap: { get: () => 1 } },
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(EmployeeLocateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  /**
   * Test to check if the EmployeeLocateComponent compiles successfully.
   * This test ensures that the component can be instantiated without errors.
   */
  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
