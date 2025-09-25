import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { HomeComponent } from './home.component';
import { RepositoryType } from 'home/repository-type';
import { InitializationService } from 'services/initialization-service/initialization.service';
/**
 * Unit tests for the HomeComponent.
 * This file contains tests to ensure that the component compiles correctly and behaves as expected.
 */
describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let initializationServiceSpy: jasmine.SpyObj<InitializationService>;
  /**
   * Set up the testing module for HomeComponent.
   * This function initializes the testing environment and compiles the component.
   */
  beforeEach(() => {
    initializationServiceSpy = jasmine.createSpyObj('InitializationService', [
      'loadDepartmentsFromBackend',
      'postInitialDataToBackend'
    ]);
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 1 }),
            snapshot: { paramMap: { get: () => 1 } },
          },
        },
        { provide: InitializationService, useValue: initializationServiceSpy }
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
    // GIVEN
    // WHEN
    // THEN
    expect(component).toBeTruthy();
  });
  /**
   * Test to check if the HomeComponent renders the page correctly.
   * This test ensures that key labels and options are present in the DOM.
   */
  it('should render page', () => {
    // GIVEN
    // WHEN
    fixture.detectChanges();
    // THEN
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Home');
    expect(compiled.textContent).toContain('Backend Repository');
    expect(compiled.textContent).toContain('Only local web storage');
    expect(compiled.textContent).toContain('PostgreSQL database');
    expect(compiled.textContent).toContain('MongoDB database');
  });
  /**
   * Test to check if the initialiseRepository method is called when the button is clicked.
   * This test simulates a click on the "Initialise Selected Repository" button and checks the spy.
   */
  it('should initialize default local repository', () => {
    // GIVEN
    fixture.detectChanges();
    const button = fixture.debugElement.queryAll(By.css('button')).find(btn =>
      btn.nativeElement.textContent.includes('Initialise Selected Repository')
    );
    expect(button).toBeTruthy();
    // WHEN
    button!.nativeElement.click();
    // THEN
    expect(initializationServiceSpy.postInitialDataToBackend).not.toHaveBeenCalled();
  });
  /**
   * Test to check if the initialiseRepository method is called when the button is clicked.
   * This test simulates a click on the "Initialise Selected Repository" button and checks the spy.
   */
  it('should initialize selected external repository', () => {
    // GIVEN
    fixture.detectChanges();
    const button = fixture.debugElement.queryAll(By.css('button')).find(btn =>
      btn.nativeElement.textContent.includes('Initialise Selected Repository')
    );
    expect(button).toBeTruthy();
    component.homeForm.controls['repositoryTypeSelect'].setValue(RepositoryType.PostgreSQL);
    window.localStorage.setItem('repositoryType', RepositoryType.PostgreSQL);
    fixture.detectChanges();
    // WHEN
    button!.nativeElement.click();
    // THEN
    expect(initializationServiceSpy.postInitialDataToBackend).toHaveBeenCalled();
    // reset storage
    window.localStorage.setItem('repositoryType', RepositoryType.WebStorage);
  });
});