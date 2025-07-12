import { inject, Component, OnInit } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Department } from 'models/department';
import { Employee } from 'models/employee';
import { DepartmentService } from 'services/department-service/department.service';
import { EmployeeService } from 'services/employee-service/employee.service';

export class Resume {
  abc = 'aabbcc';
  def = 'ddeeff';
  ghi = 'gghhii';
}
@Component({
  selector: 'app-report',
  templateUrl: 'report.component.html',
})
export class ReportComponent implements OnInit {
  private departmentService: DepartmentService = inject(DepartmentService);
  private employeeService: EmployeeService = inject(EmployeeService);
  departmentArr: Department[] = this.departmentService.getDepartmentArray();
  employeeArr: Employee[][] = this.employeeService.getEmployeeArray();

  private readonly baseUrl = 'http://localhost:4200/images';
  resume = new Resume();
  ngOnInit() {
    pdfMake.vfs = pdfFonts.vfs;
    // pdfMake.fonts = {
    //   Roboto: {
    //     normal: 'Roboto-Regular.ttf',
    //     bold: 'Roboto-Medium.ttf',
    //     italics: 'Roboto-Italic.ttf',
    //     bolditalics: 'Roboto-MediumItalic.ttf',
    //   },
    // };

    this.aaaaa();
  }

  aaaaa() {
    for (const department of this.departmentArr) {
      console.log(department.name);
      for (const employee of this.employeeArr[department.id]) {
        console.log(employee.lastName);
      }
    }
  }

  generatePdf(action = 'open') {
    const documentDefinition =
      this.getDocumentDefinition() as import('pdfmake/interfaces').TDocumentDefinitions;
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
  }

  getDocumentDefinition() {
    return {
      content: [
        {
          text: 'C=O=N=T=E=N=T',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20] as [number, number, number, number],
        },
        {
          columns: [
            [
              {
                text: 'A=B=C : ' + this.resume.abc,
                style: 'abc',
              },
              {
                text: 'D=E=F : ' + this.resume.def,
                style: 'def',
              },
              {
                text: 'G=H=I : ' + this.resume.ghi,
                style: 'ghi',
              },
            ],
          ],
        },
        {
          image: 'venn1',
          width: 325,
          height: 227,
        },
        {
          image: 'venn2',
          width: 200,
          height: 100,
        },
        {
          image: 'venn3',
          width: 300,
          height: 240,
        },
      ],
      info: {
        title: 'T=I=T=L=E',
        author: 'A=U=T=H=O=R',
        subject: 'S=U=B=J=E=C=T',
        keywords: 'K=E=Y=W=O=R=D=1, k=e=y=w=o=r=d=2',
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10] as [number, number, number, number],
          decoration: 'underline',
        },
        abc: {
          fontSize: 18,
          bold: true,
        },
        def: {
          fontSize: 14,
          bold: true,
          italics: true,
        },
        ghi: {
          fontSize: 10,
        },
        sign: {
          margin: [0, 50, 0, 10] as [number, number, number, number],
          alignment: 'right',
          italics: true,
        },
        tableHeader: {
          bold: true,
        },
      },
      images: {
        venn1: 'http://localhost:4200/images/VennDiagram01.jpg',
        venn2: 'http://localhost:4200/images/VennDiagram02.jpg',
        venn3: 'http://localhost:4200/images/VennDiagram03.jpg',
        //        vennAlt:
        //          'https://raw.githubusercontent.com/k1729p/Study27/refs/heads/main/public/images/VennDiagram01.jpg',
      },
    };
  }
  //###############################################################################################
  //###############################################################################################
  //###############################################################################################
  generatePdfAlt(action = 'open') {
    const documentDefinition =
      this.getDocumentDefinitionAlt() as import('pdfmake/interfaces').TDocumentDefinitions;
    switch (action) {
      case 'open':
        pdfMake.createPdf(documentDefinition).open();
        break;
      case 'print':
        pdfMake.createPdf(documentDefinition).print();
        break;
      case 'download':
        pdfMake.createPdf(documentDefinition).download();
        break;
      default:
        pdfMake.createPdf(documentDefinition).open();
        break;
    }
  }

  getDocumentDefinitionAlt() {
    const docDefinition = {
      content: [
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ['*', 'auto', 100, '*'],
            body: [
              ['First', 'Second', 'Third', 'The last one'],
              ['Value 1', 'Value 2', 'Value 3', 'Value 4'],
              [{ text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4'],
            ],
          },
        },
        {
          // for numbered lists set the ol key
          ol: ['Item 1', 'Item 2', 'Item 3'],
        },
        {
          // to treat a paragraph as a bulleted list, set an array of items under the ul key
          ul: ['Item 1', 'Item 2', 'Item 3', { text: 'Item 4', bold: true }],
        },
        'This paragraph fills full width, as there are no columns. Next paragraph however consists of three columns',
        {
          columns: [
            {
              // auto-sized columns have their widths based on their content
              width: 'auto',
              text: 'First column',
            },
            {
              // star-sized columns fill the remaining space if there's more than one star-column, available width is divided equally
              width: '*',
              text: 'Second column',
            },
            {
              // fixed width
              width: 100,
              text: 'Third column',
            },
            {
              // % width
              width: '20%',
              text: 'Fourth column',
            },
          ], // optional space between columns
          columnGap: 10,
          pageBreak: 'after',
        },
        {
          qr: 'https://github.com/k1729p/Portfolio',
          pageBreak: 'after',
        },
      ],
    };
    return docDefinition;
  }
}
