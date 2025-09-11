import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
/**
 * Unit tests for the AppComponent.
 * This file contains tests to ensure that the component compiles correctly,
 * has the correct title, and renders the title in the template.
 *
 * @returns void
 */
describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: { paramMap: { get: () => null } },
          },
        },
      ],
    }).compileComponents();
  });
  /**
   * Test to check if the AppComponent compiles successfully.
   * This test ensures that the component can be instantiated without errors.
   *
   * @returns void
   */
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
  /**
   * Test to check if the AppComponent has the correct title.
   * This test verifies that the title property of the component is set to 'Study27'.
   *
   * @returns void
   */
  it(`should have the 'Study27' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Study27');
  });
  /**
   * Test to check if the AppComponent renders the title in the template.
   * This test verifies that the rendered HTML contains the expected title text.
   *
   * @returns void
   */
  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(
      compiled.querySelector('span.mdc-button__label')?.textContent
    ).toContain('Menu');
  });
});
