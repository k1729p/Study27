import { Component, ViewChild, inject, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute } from '@angular/router';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';

import { Employee } from '../../models/employee';
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
  sourceEmployees: Employee[] = [];
  targetEmployees: Employee[] = [];
  srcDisplayedColumns = ['select', 'id', 'firstName', 'lastName'];
  trgDisplayedColumns = ['id', 'firstName', 'lastName'];
  selection = new SelectionModel<Employee>(true, []);

  /**
   * ActivatedRoute injected via inject() function.
   */
  private route = inject(ActivatedRoute);

  /**
   * A component lifecycle hook method.
   * Runs once after Angular has initialized all the component's inputs.
   *
   * https://angular.dev/guide/components/lifecycle#ngoninit
   * @returns void
   */
  ngOnInit() {
    this.sourceDepartmentId =
      this.route.snapshot.paramMap.get('sourceDepartmentId') ?? '';
    const sourceDepartment = this.departmentService.getDepartment(
      +this.sourceDepartmentId
    );
    this.sourceDepartmentName = sourceDepartment?.name ?? '';
    this.sourceEmployees =
      this.employeeService.getEmployeeArray()[+this.sourceDepartmentId - 1];

    this.targetDepartmentId =
      this.route.snapshot.paramMap.get('targetDepartmentId') ?? '';
    const targetDepartment = this.departmentService.getDepartment(
      +this.targetDepartmentId
    );
    this.targetDepartmentName = targetDepartment?.name ?? '';
    this.targetEmployees =
      this.employeeService.getEmployeeArray()[+this.targetDepartmentId - 1];
    console.log(
      'EmployeeTransferComponent.ngOnInit(): sourceDepartmentId[%s], targetDepartmentId[%s]',
      this.sourceDepartmentId,
      this.targetDepartmentId
    );
  }

  /**
   * Transfers the employees.
   *
   * @returns void
   */
  transferEmployees() {
    this.employeeService.transferEmployees(
      +this.sourceDepartmentId,
      +this.targetDepartmentId,
      this.selection.selected
    );
    this.selection.clear();
    this.sourceEmployees =
      this.employeeService.getEmployeeArray()[+this.sourceDepartmentId - 1];
    this.targetEmployees =
      this.employeeService.getEmployeeArray()[+this.targetDepartmentId - 1];
    console.log(
      'transferEmployees(): source department id[%d], target department id[%d]',
      this.sourceDepartmentId,
      this.targetDepartmentId
    );
  }
  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   *
   * @returns void
   */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.sourceEmployees);
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
  /**
   * Whether the number of selected elements matches the total number of rows.
   *
   * @returns the flag
   */
  isAllSelected(): boolean {
    return this.selection.selected.length === this.sourceEmployees.length;
  }
}
