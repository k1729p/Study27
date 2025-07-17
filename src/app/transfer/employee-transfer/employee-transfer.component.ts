import { inject, OnInit, Component, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule, MatTable } from '@angular/material/table';

import { Department } from 'models/department';
import { Employee } from 'models/employee';
import { DepartmentService } from 'services/department-service/department.service';
import { EmployeeService } from 'services/employee-service/employee.service';

/**
 * A component for transferring employees between departments.
 */
@Component({
  selector: 'app-employee-transfer',
  templateUrl: './employee-transfer.component.html',
  styleUrl: './employee-transfer.component.css',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatGridListModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    MatTable,
    MatTableModule,
  ],
})
export class EmployeeTransferComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<Employee>;
  private departmentService: DepartmentService = inject(DepartmentService);
  private employeeService: EmployeeService = inject(EmployeeService);
  private formBuilder = inject(FormBuilder);
  private emptyDepartment = { id: 0, name: '' };
  leftSideForm = this.formBuilder.group({
    leftSideSelect: this.emptyDepartment,
  });
  rightSideForm = this.formBuilder.group({
    rightSideSelect: this.emptyDepartment,
  });
  leftSideDepartmentId = 0;
  rightSideDepartmentId = 0;
  departmentArray: Department[] = this.departmentService.getDepartmentArray();
  leftSideEmployees: Employee[] = [];
  rightSideEmployees: Employee[] = [];
  displayedColumns = ['select', 'id', 'firstName', 'lastName'];
  rightSideSelection = new SelectionModel<Employee>(true, []);
  leftSideSelection = new SelectionModel<Employee>(true, []);
  /**
   * A component lifecycle hook method.
   * Runs once after Angular has initialized all the component's inputs.
   *
   * https://angular.dev/guide/components/lifecycle#ngoninit
   * @returns void
   */
  ngOnInit() {
    this.selectDepartment('LEFT-SIDE', 1);
    this.selectDepartment('RIGHT-SIDE', 2);
    console.log('EmployeeTransferComponent.ngOnInit():');
  }

  /**
   * Selects the departments on the left side and on the right side.
   *
   * @returns void
   */
  selectDepartment(side: 'LEFT-SIDE' | 'RIGHT-SIDE', departmentId: number) {
    if (departmentId < 1 || departmentId > this.departmentArray.length) {
      console.error(
        'EmployeeTransferComponent.selectDepartment(): invalid department id[%d]',
        departmentId
      );
      return;
    }
    const index = this.departmentArray.findIndex(
      (dep) => dep.id === departmentId
    );
    if (side === 'LEFT-SIDE') {
      this.leftSideDepartmentId = departmentId;
      this.leftSideForm.controls.leftSideSelect.setValue(
        this.departmentArray[index]
      );
      this.leftSideEmployees = this.employeeService.getEmployeeArray()[index];
    } else {
      this.rightSideDepartmentId = departmentId;
      this.rightSideForm.controls.rightSideSelect.setValue(
        this.departmentArray[index]
      );
      this.rightSideEmployees = this.employeeService.getEmployeeArray()[index];
    }
    console.log(
      'EmployeeTransferComponent.selectDepartment(): left side department id[%d], right side department id[%d]',
      this.leftSideDepartmentId,
      this.rightSideDepartmentId
    );
  }
  /**
   * Transfers the employees.
   *
   * @param side the side
   * @returns void
   */
  transferEmployees(side: 'LEFT-SIDE' | 'RIGHT-SIDE') {
    if (side === 'LEFT-SIDE') {
      this.employeeService.transferEmployees(
        +this.leftSideDepartmentId,
        +this.rightSideDepartmentId,
        this.leftSideSelection.selected
      );
    } else {
      this.employeeService.transferEmployees(
        +this.rightSideDepartmentId,
        +this.leftSideDepartmentId,
        this.rightSideSelection.selected
      );
    }
    this.leftSideSelection.clear();
    this.rightSideSelection.clear();
    this.leftSideEmployees =
      this.employeeService.getEmployeeArray()[+this.leftSideDepartmentId - 1];
    this.rightSideEmployees =
      this.employeeService.getEmployeeArray()[+this.rightSideDepartmentId - 1];
    console.log(
      'transferEmployees(): side[%s], left side department id[%d], right side department id[%d]',
      side,
      this.leftSideDepartmentId,
      this.rightSideDepartmentId
    );
  }
  /**
   * Disables transfer button.
   *
   * @param side the side
   * @returns the flag
   */
  disableTransferButton(side: 'LEFT-SIDE' | 'RIGHT-SIDE'): boolean {
    if (side === 'LEFT-SIDE') {
      return (
        this.leftSideSelection.selected.length === 0 ||
        this.leftSideDepartmentId === this.rightSideDepartmentId
      );
    } else {
      return (
        this.rightSideSelection.selected.length === 0 ||
        this.leftSideDepartmentId === this.rightSideDepartmentId
      );
    }
  }
  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   *
   * @param side the side
   * @returns void
   */
  toggleAllRows(side: 'LEFT-SIDE' | 'RIGHT-SIDE') {
    if (side === 'LEFT-SIDE') {
      if (this.isAllSelected('LEFT-SIDE')) {
        this.leftSideSelection.clear();
      } else {
        this.leftSideSelection.select(...this.leftSideEmployees);
      }
    } else {
      if (this.isAllSelected('RIGHT-SIDE')) {
        this.rightSideSelection.clear();
      } else {
        this.rightSideSelection.select(...this.rightSideEmployees);
      }
    }
  }
  /**
   * The label for the checkbox on the passed row
   *
   * @param side the side
   * @param row the row
   * @returns the checkbox label
   */
  checkboxLabel(side: 'LEFT-SIDE' | 'RIGHT-SIDE', row?: Employee): string {
    if (side === 'LEFT-SIDE') {
      if (!row) {
        return `${this.isAllSelected('LEFT-SIDE') ? 'deselect' : 'select'} all`;
      } else {
        return `${
          this.leftSideSelection.isSelected(row) ? 'deselect' : 'select'
        } row ${row.id + 1}`;
      }
    } else {
      if (!row) {
        return `${
          this.isAllSelected('RIGHT-SIDE') ? 'deselect' : 'select'
        } all`;
      } else {
        return `${
          this.rightSideSelection.isSelected(row) ? 'deselect' : 'select'
        } row ${row.id + 1}`;
      }
    }
  }
  /**
   * Whether the number of selected elements matches the total number of rows.
   *
   * @param side the side
   * @returns the flag
   */
  isAllSelected(side: 'LEFT-SIDE' | 'RIGHT-SIDE'): boolean {
    if (side === 'LEFT-SIDE') {
      return (
        this.leftSideSelection.selected.length === this.leftSideEmployees.length
      );
    } else {
      return (
        this.rightSideSelection.selected.length ===
        this.rightSideEmployees.length
      );
    }
  }
}
