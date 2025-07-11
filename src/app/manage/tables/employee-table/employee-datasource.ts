import { inject } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, of as observableOf, merge } from 'rxjs';
import { map } from 'rxjs/operators';

import { Employee } from 'models/employee';
import { EmployeeService } from 'services/employee-service/employee.service';
/**
 * Data source for the Employee Table view and Form view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class EmployeeDataSource extends DataSource<Employee> {
  private employeeService: EmployeeService = inject(EmployeeService);
  employeeArr: Employee[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  departmentId = 0;

  /**
   * Sets the department id.
   *
   * @param departmentId the department id
   */
  setDepartmentId(departmentId: number) {
    this.departmentId = departmentId;
    this.employeeArr =
      this.employeeService.getEmployeeArray()[departmentId - 1];
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   *
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Employee[]> {
    console.log(
      'EmployeeDataSource.connect(): departmentId[%d]',
      this.departmentId
    );
    if (!this.paginator || !this.sort) {
      throw Error(
        'Please set the paginator and sort on the data before connecting.'
      );
    }
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    return merge(
      observableOf(this.employeeArr),
      this.paginator.page,
      this.sort.sortChange
    ).pipe(
      map(() => this.getPagedData(this.getSortedData([...this.employeeArr])))
    );
  }

  /**
   * Called when the table is being destroyed. Use this function to clean up
   * any open connections or free any held resources that were set up during connect.
   * This is a no-op in this implementation, as there are no resources to clean up.
   *
   * @return void
   */
  disconnect(): void {
    // No resources to clean up
  }

  /**
   * Paginates the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   *
   * @param employeeArr The array of employees to be paginated.
   * @returns The paginated array of employees.
   */
  private getPagedData(employeeArr: Employee[]): Employee[] {
    if (!this.paginator) {
      return employeeArr;
    }
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return employeeArr.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sorts the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   *
   * @param employeeArr The array of employees to be sorted.
   * @returns The sorted array of employees.
   */
  private getSortedData(employeeArr: Employee[]): Employee[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return employeeArr;
    }
    return employeeArr.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'id':
          return compare(+a.id, +b.id, isAsc);
        case 'firstName':
          return compare(a.firstName, b.firstName, isAsc);
        case 'lastName':
          return compare(a.lastName, b.lastName, isAsc);
        default:
          return 0;
      }
    });
  }
}

/**
 * Compares two values and returns a number indicating their relative order.
 * This function is used for sorting the data in the table.
 */
function compare(
  a: string | number,
  b: string | number,
  isAsc: boolean
): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
