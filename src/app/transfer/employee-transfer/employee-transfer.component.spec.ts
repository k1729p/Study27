import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EmployeeTransferComponent } from './employee-transfer.component';
/**
 * Unit tests for the EmployeeTransferComponent.
 * This file contains tests to ensure that the component compiles correctly.
 */
describe('EmployeeTransfer', () => {
  let component: EmployeeTransferComponent;
  let fixture: ComponentFixture<EmployeeTransferComponent>;
  /**
   * Setup the testing module for EmployeeTransferComponent.
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
   fixture = TestBed.createComponent(EmployeeTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  /**
   * Test to check if the EmployeeTransferComponent compiles successfully.
   * This test ensures that the component can be instantiated without errors.
   */
  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
