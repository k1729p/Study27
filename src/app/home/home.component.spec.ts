import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { HomeComponent } from './home.component';
/**
 * Unit tests for the HomeComponent.
 * This file contains tests to ensure that the component compiles correctly.
 */
describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  //const httpTesting = TestBed.inject(HttpTestingController);

  /**
   * Set up the testing module for HomeComponent.
   * This function initializes the testing environment and compiles the component.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        //provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 1 }),
            snapshot: { paramMap: { get: () => 1 } },
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Test to check if the HomeComponent compiles successfully.
   * This test ensures that the component can be instantiated without errors.
   */
  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
