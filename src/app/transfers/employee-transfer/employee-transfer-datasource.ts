import { inject } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, of as observableOf } from 'rxjs';

import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee-service/employee.service';

/**
 * Data source for the Employee Table view and Form view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class EmployeeTransferDataSource extends DataSource<Employee> {
  private employeeService: EmployeeService = inject(EmployeeService);
  employeeArr: Employee[] = [];
  departmentId = 0;

  /**
   * Set the department id for which the employee data should be fetched.
   * This method should be called before connecting the data source to the table.
   *
   * @param departmentId - The ID of the department for which to fetch employees.
   * @returns void
   */
  setDepartmentId(departmentId: number) {
    this.departmentId = departmentId;
    this.employeeArr =
      this.employeeService.getEmployeeArray()[departmentId - 1];
    console.log(
      'EmployeeTransferDataSource.setDepartmentId(): departmentId[%d]',
      this.departmentId
    );
  }

  /**
   * Connects the data source to the table. This method is called by the
   * table when it needs to render the data. It should return an observable
   * that emits the items to be rendered in the table.
   *
   * @returns Observable<Employee[]>
   * An observable that emits an array of Employee objects.
   */
  connect(): Observable<Employee[]> {
    console.log(
      'EmployeeTransferDataSource.connect(): departmentId[%d]',
      this.departmentId
    );
    return observableOf(this.employeeArr);
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {
    console.log(
      'EmployeeTransferDataSource.disconnect(): departmentId[%d]',
      this.departmentId
    );
  }
}
