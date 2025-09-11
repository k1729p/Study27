import { inject, Component, OnInit } from '@angular/core';
import { MatButtonModule, MatFabButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import { Department } from 'models/department';
import { DepartmentService } from 'services/department-service/department.service';
import { EmployeeService } from 'services/employee-service/employee.service';
/**
 * ReportComponent is an Angular component that creates reports.
 */
@Component({
  selector: 'app-report',
  templateUrl: 'report.component.html',
  styleUrl: './report.component.css',
  imports: [MatButtonModule, MatFabButton, MatCardModule, MatIconModule, MatTabsModule],
})
export class ReportComponent implements OnInit {
  private departmentService: DepartmentService = inject(DepartmentService);
  private employeeService: EmployeeService = inject(EmployeeService);
  departments: Department[] = [];
  venn01DataUrl: string | undefined;
  venn02DataUrl: string | undefined;
  private readonly PORTFOLIO_URL = 'https://github.com/k1729p/Portfolio';
  /**
   * A component lifecycle hook method.
   * Runs once after Angular has initialized all the component's inputs.
   * @returns void
   */
  async ngOnInit() {
    this.departments = this.departmentService.getDepartments();
    this.venn01DataUrl = await this.getBase64Image('/images/VennDiagram01.jpg');
    this.venn02DataUrl = await this.getBase64Image('/images/VennDiagram02.jpg');
    pdfMake.vfs = pdfFonts.vfs;
    console.log('🟨ReportComponent.ngOnInit():');
  }
  /**
   * Generates the PDF file.
   * @param content
   * @param action
   * @returns void
   */
  generatePdf(
    content: 'DEPARTMENTS-AND-EMPLOYEES' | 'QR-AND-IMAGES',
    action: string
  ): void {
    let documentDefinition;
    if (content === 'DEPARTMENTS-AND-EMPLOYEES') {
      documentDefinition =
        this.createDocumentDefinitionForDepartmentsAndEmployees() as import('pdfmake/interfaces').TDocumentDefinitions;
    } else {
      documentDefinition =
        this.createDocumentDefinitionforQrCodeAndImages() as import('pdfmake/interfaces').TDocumentDefinitions;
    }
    const tCreatedPdf = pdfMake.createPdf(documentDefinition);
    switch (action) {
      case 'open':
        tCreatedPdf.open();
        break;
      case 'print':
        tCreatedPdf.print();
        break;
      case 'download':
        tCreatedPdf.download();
        break;
      default:
        tCreatedPdf.open();
        break;
    }
    console.log('🟨ReportComponent.generatePdf(): action[%s]', action);
  }
  /**
   * Creates document definition for departments and employees.
   * @returns TDocumentDefinitions
   */
  private createDocumentDefinitionForDepartmentsAndEmployees() {
    return {
      content: [
        {
          text: 'Departments and Employees Report',
          style: 'header',
          margin: [0, 0, 0, 20],
          alignment: 'center',
        },
        {
          alignment: 'justify',
          columns: [
            {
              table: {
                body: [
                  [
                    {
                      ul: this.loadDepartmentList(),
                      fillColor: 'aliceblue',
                    },
                  ],
                ],
              },
            },
            {
              table: {
                body: this.loadDepartmentTable(),
              },
            },
          ],
        },
      ],
      info: {
        title: 'Departments and Employees Report',
        author: 'k1729p',
        subject: 'Departments and Employees',
        keywords: 'report',
      },
      styles: {
        header: {
          fontSize: 20,
          bold: true,
        },
        tableHeader: {
          bold: true,
        },
      },
    };
  }
  /**
   * Loads the list with the deparments
   * @returns deparmentList
   */
  private loadDepartmentList(): (string | { ol: string[] })[] {
    const deparmentList: (string | { ol: string[] })[] = [];
    for (const department of this.departments) {
      deparmentList.push(department.name);
      const employeeOrderedList: string[] = this.employeeService.getEmployees(department.id)
        .map((employee) => `${employee.firstName} ${employee.lastName}`);
      if (employeeOrderedList.length > 0) {
        deparmentList.push({ ol: employeeOrderedList });
      }
    }
    return deparmentList;
  }
  /**
   * Loads the table with the deparments
   * @returns deparmentTable
   */
  private loadDepartmentTable(): (
    | string
    | number
    | boolean
    | Record<string, unknown>
  )[][] {
    type TableCell = string | number | boolean | Record<string, unknown>;
    const deparmentTable: TableCell[][] = [];
    deparmentTable.push([
      {
        text: 'Department',
        style: 'tableHeader',
        alignment: 'center',
        fillColor: 'lavenderblush',
      },
      {
        text: 'Employee',
        style: 'tableHeader',
        alignment: 'center',
        fillColor: 'lightcyan',
      },
    ]);
    for (const department of this.departments) {
      const employees = this.employeeService.getEmployees(department.id);
      if (employees.length === 0) {
        deparmentTable.push([{ text: department.name }, { text: '-' }]);
      } else {
        employees.forEach((employee, idx) => {
          if (idx === 0) {
            deparmentTable.push([
              {
                text: department.name,
                rowSpan: employees.length,
              },
              `${employee.firstName} ${employee.lastName}`,
            ]);
          } else {
            deparmentTable.push([
              '',
              `${employee.firstName} ${employee.lastName}`,
            ]);
          }
        });
      }
    }
    return deparmentTable;
  }
  /**
   * Creates document definition for departments and employees.
   * @returns TDocumentDefinitions
   */
  private createDocumentDefinitionforQrCodeAndImages() {
    const docDefinition = {
      content: [
        {
          text: 'Comprehensive Report',
          style: 'header',
          margin: [0, 0, 0, 10],
        },
        {
          text: 'Direct Access QR Code to Java Technologies Portfolio',
          style: 'subHeader',
          margin: [0, 0, 0, 10],
        },
        {
          qr: this.PORTFOLIO_URL,
        },
        {
          text: 'Visual Representation: Four-Ellipse Venn Diagrams',
          style: 'subHeader',
          margin: [0, 30, 0, 10],
        },
        {
          columns: [
            {
              image: 'venn01',
              width: 325,
              height: 227,
              margin: [0, 0, 0, 3],
            },
            {
              image: 'venn02',
              width: 200,
              height: 100,
              margin: [3, 0, 0, 0],
            },
          ],
        },
      ],
      images: {
        venn01: this.venn01DataUrl,
        venn02: this.venn02DataUrl,
      },
      info: {
        title: 'Comprehensive Report',
        author: 'k1729p',
        subject: 'QR Code and Visual Representation',
        keywords: 'qr-code,venn-diagram',
      },
      styles: {
        header: {
          fontSize: 20,
          bold: true,
        },
        subHeader: {
          fontSize: 15,
          bold: true,
        },
      },
    };
    return docDefinition;
  }
  /**
   * Loads the image file and converts it into a dataURL (base64 string).
   * @param imagePath the image path
   * @returns the image
   */
  private getBase64Image(imagePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'Anonymous';
      image.src = imagePath;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');
        context?.drawImage(image, 0, 0);
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve(dataURL);
      };
      image.onerror = error => reject(error);
    });
  }
}
