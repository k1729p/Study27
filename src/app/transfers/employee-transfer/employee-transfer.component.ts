import { Component, ViewChild, inject, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute } from '@angular/router';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule, MatListOption } from '@angular/material/list';

import { Employee } from '../../models/employee';
import { EmployeeTransferDataSource } from './employee-transfer-datasource';
import { DepartmentService } from '../../services/department-service/department.service';
import { EmployeeService } from '../../services/employee-service/employee.service';
/**
 * A component for transferring employees between departments.
 */
@Component({
  selector: 'app-employee-transfer',
  templateUrl: './employee-transfer.component.html',
  styleUrl: './employee-transfer.component.css',
  standalone: true,
  imports: [
    MatTableModule,
    MatTable,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatListModule,
  ],
})
export class EmployeeTransferComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<Employee>;
  private departmentService: DepartmentService = inject(DepartmentService);
  private employeeService: EmployeeService = inject(EmployeeService);
  sourceDepartmentId = '';
  sourceDepartmentName = '';
  targetDepartmentId = '';
  targetDepartmentName = '';
  sourceDataSource = new EmployeeTransferDataSource();
  targetDataSource = new EmployeeTransferDataSource();
  srcDisplayedColumns = ['select', 'id', 'firstName', 'lastName'];
  trgDisplayedColumns = ['id', 'firstName', 'lastName'];
  selection = new SelectionModel<Employee>(true, []);

  sourceEmployeesArray: Employee[] = [];
  targetEmployeesArray: Employee[] = [];

  /**
   * ActivatedRoute injected via inject() function.
   */
  private route = inject(ActivatedRoute);

  /**
   * A component lifecycle hook method.
   * Runs once after Angular has initialized all the component's inputs.
   *
   * https://angular.dev/guide/components/lifecycle#ngoninit
   */
  ngOnInit() {
    this.sourceDepartmentId =
      this.route.snapshot.paramMap.get('sourceDepartmentId') ?? '';
    const sourceDepartment = this.departmentService.getDepartment(
      +this.sourceDepartmentId
    );
    this.sourceDepartmentName = sourceDepartment?.name ?? '';
    this.sourceDataSource.setDepartmentId(+this.sourceDepartmentId);

    this.targetDepartmentId =
      this.route.snapshot.paramMap.get('targetDepartmentId') ?? '';
    const targetDepartment = this.departmentService.getDepartment(
      +this.targetDepartmentId
    );
    this.targetDepartmentName = targetDepartment?.name ?? '';
    this.targetDataSource.setDepartmentId(+this.targetDepartmentId);
    console.log(
      'EmployeeTransferComponent.ngOnInit(): sourceDepartmentId[%s], targetDepartmentId[%s]',
      this.sourceDepartmentId, this.targetDepartmentId
    );

    this.sourceEmployeesArray = [...this.sourceDataSource.employeeArr]; // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  }

  /**
   * Transfer the employees.
   *
   */
  transferEmployees() {
    console.group(
      'transferEmployees(): source department id[%d], target department id[%d]',
      this.sourceDepartmentId,
      this.targetDepartmentId
    );
    this.sourceDataSource.employeeArr.forEach((employee) => {
      if (this.selection.isSelected(employee)) {
        this.employeeService.transferEmployee(
          +this.sourceDepartmentId,
          +this.targetDepartmentId,
          employee
        );
        console.log(
          'EmployeeTransferComponent.transferEmployees(): employee id[%d], first name[%s], last name[%s]',
          employee.id, employee.firstName, employee.lastName
        );
      }
    });
    console.groupEnd();
  }
  /**
   * Transfer the employees.
   *
   */
  transferEmployeesALT(listOptionArr: MatListOption[]) {
    listOptionArr.forEach((listOption) => {
      const id = listOption.value;
      console.log('employee id[%d]', id);
      //this.targetEmployeesArray.push(this.sourceDataSource.employeeArr[id]);
      //this.sourceEmployeesArray.splice(id, 1);
    });
  }

  /**
   * Whether the number of selected elements matches the total number of rows.
   *
   * @returns the flag
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.sourceDataSource.employeeArr.length;
    return numSelected === numRows;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.sourceDataSource.employeeArr);
    }
  }

  /**
   * The label for the checkbox on the passed row
   *
   * @param row the row
   * @returns the checkbox label
   */
  checkboxLabel(row?: Employee): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    } else {
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
        row.id + 1
      }`;
    }
  }
}
