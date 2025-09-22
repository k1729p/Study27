import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import pdfMake from 'pdfmake/build/pdfmake';

import { ReportComponent } from './report.component';
import * as testData from 'testing/test-data';
import { DepartmentService } from 'services/department-service/department.service';
import { EmployeeService } from 'services/employee-service/employee.service';
/**
 * Unit tests for the ReportComponent.
 * This file contains tests to ensure that the component compiles correctly.
 */
describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;
  let departmentServiceSpy: jasmine.SpyObj<DepartmentService>;
  let employeeServiceSpy: jasmine.SpyObj<EmployeeService>;

  /**
   * Set up the testing module for ReportComponent.
   * This function initializes the testing environment and compiles the component.
   */
  beforeEach(async () => {
    departmentServiceSpy = jasmine.createSpyObj('DepartmentService', ['getDepartments']);
    employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['getEmployees']);

    departmentServiceSpy.getDepartments.and.callFake(() => [...testData.TEST_DEPARTMENTS]);
    employeeServiceSpy.getEmployees.and.callFake((departmentId: number) => {
      const department = testData.TEST_DEPARTMENTS.find(dep => dep.id === departmentId);
      return department ? department.employees : [];
    });

    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 1 }),
            snapshot: { paramMap: { get: () => 1 } },
          },
        },
        { provide: DepartmentService, useValue: departmentServiceSpy },
        { provide: EmployeeService, useValue: employeeServiceSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Test to check if the ReportComponent compiles successfully.
   * This test ensures that the component can be instantiated without errors.
   */
  it('should compile', () => {
    // GIVEN
    // WHEN
    // THEN
    expect(component).toBeTruthy();
  });
  /**
   * Test to check if the reports page is rendered.
   */
  it('should render page', () => {
    // GIVEN
    // WHEN
    fixture.detectChanges();
    // THEN
    const compiled = fixture.nativeElement as HTMLElement;
    // Title
    expect(compiled.textContent).toContain('Reports');
    // Tab labels
    expect(compiled.textContent).toContain('Departments and Employees');
    expect(compiled.textContent).toContain('QR Code and Images');
    // Buttons
    const openBtn = Array.from(compiled.querySelectorAll('button')).find(btn => btn.textContent?.includes('Open PDF'));
    expect(openBtn).toBeTruthy();
    const printBtn = Array.from(compiled.querySelectorAll('button')).find(btn => btn.textContent?.includes('Print PDF'));
    expect(printBtn).toBeTruthy();
    const downloadBtn = Array.from(compiled.querySelectorAll('button')).find(btn => btn.textContent?.includes('Download PDF'));
    expect(downloadBtn).toBeTruthy();
  });
  /**
   * Test to check if the report is created.
   */
  it('should create PDF', () => {
    // GIVEN
    const openSpy = jasmine.createSpy('open');
    const document: PDFKit.PDFDocument = {} as PDFKit.PDFDocument;
    spyOn(pdfMake, 'createPdf').and.returnValue({
      open: openSpy,
      print: () => undefined,
      download: () => undefined,
      getBlob: () => undefined,
      getBase64: () => undefined,
      getBuffer: () => undefined,
      getDataUrl: () => undefined,
      getStream: () => document
    });
    fixture.detectChanges();
    const openBtn = fixture.debugElement.queryAll(By.css('button')).find(btn =>
      btn.nativeElement.textContent.includes('Open PDF')
    );
    expect(openBtn).toBeTruthy();
    // WHEN
    openBtn!.nativeElement.click();
    // THEN
    expect(pdfMake.createPdf).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalled();

    const docDef = (pdfMake.createPdf as jasmine.Spy).calls.mostRecent().args[0];
    const reportTitleActual = docDef.content[0].text;
    expect(reportTitleActual).toBe('Departments and Employees Report');

    const leftSideListActual = docDef.content[1].columns[0].table.body[0][0].ul;
    const rightSideTableActual = docDef.content[1].columns[1].table.body;
    expect(rightSideTableActual[0][0].text).toBe('Department');
    expect(rightSideTableActual[0][1].text).toBe('Employee');

    for (let i = 0; i < 2; i++) {
      const departmentNameExpected = testData.TEST_DEPARTMENTS[i].name;
      const employeeNameExpected = testData.TEST_DEPARTMENTS[i].employees[0].firstName + ' ' +
        testData.TEST_DEPARTMENTS[i].employees[0].lastName;
      let departmentNameActual = leftSideListActual[2 * i];
      expect(departmentNameActual).toBe(departmentNameExpected);
      let employeeNameActual = leftSideListActual[2 * i + 1].ol[0];
      expect(employeeNameActual).toBe(employeeNameExpected);

      departmentNameActual = rightSideTableActual[i + 1][0].text;
      expect(departmentNameActual).toBe(departmentNameExpected);
      employeeNameActual = rightSideTableActual[i + 1][1];
      expect(employeeNameActual).toBe(employeeNameExpected);
    }
  });
});