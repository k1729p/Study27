import { inject } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, merge, Observable, startWith, BehaviorSubject } from 'rxjs';

import { Employee } from 'models/employee';
import { EmployeeService } from 'services/employee-service/employee.service';
/**
 * Data source for the Employee Table view and Form view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class EmployeeDataSource extends DataSource<Employee> {
  private employeeService: EmployeeService = inject(EmployeeService);
  employees: Employee[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  filteredLength = 0;
  departmentId = 0;
  private filterSubject = new BehaviorSubject<string>('');
  private lastFilter = '';
  /**
   * Sets the department id.
   *
   * @param departmentId the department id
   */
  setDepartmentId(departmentId: number) {
    this.departmentId = departmentId;
    this.employees = this.employeeService.getEmployees(departmentId);
  }
  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   *
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Employee[]> {
    if (!this.paginator || !this.sort) {
      const msg = 'Please set the paginator and sort on the data before connecting.';
      console.log('EmployeeDataSource.connect(): departmentId[%d], ', this.departmentId, msg);
      throw Error(msg);
    }
    const paginator$ = this.paginator!.page;
    const sort$ = this.sort!.sortChange;
    const filter$ = this.filterSubject.asObservable();
    return merge(paginator$, sort$, filter$)
      .pipe(
        startWith({}),
        map(() => {
          const filtered = this.getFilteredData([...this.employees]);
          this.filteredLength = filtered.length;
          const sorted = this.getSortedData(filtered);
          return this.getPagedData(sorted);
        })
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
   * Set the filter string. Emits into the internal subject and stores the value
   * for use during filtering.
   */
  setFilter(value: string) {
    this.lastFilter = value ?? '';
    this.filterSubject.next(this.lastFilter);
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }
  /**
   * Filter the data by first and last name (case-insensitive). If the filter is empty
   * returns the original array.
   */
  private getFilteredData(employees: Employee[]): Employee[] {
    const filter = this.lastFilter?.trim().toLowerCase() ?? '';
    if (!filter) {
      return employees;
    }
    return employees.filter(obj => {
      const firstName = (obj.firstName ?? '').toLowerCase();
      const lastName = (obj.lastName ?? '').toLowerCase();
      return firstName.includes(filter) || lastName.includes(filter);
    });
  }
  /**
   * Paginates the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   *
   * @param employees The array of employees to be paginated.
   * @returns The paginated array of employees.
   */
  private getPagedData(employees: Employee[]): Employee[] {
    if (!this.paginator) {
      return employees;
    }
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return employees.splice(startIndex, this.paginator.pageSize);
  }
  /**
   * Sorts the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   *
   * @param employees The array of employees to be sorted.
   * @returns The sorted array of employees.
   */
  private getSortedData(employees: Employee[]): Employee[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return employees;
    }
    return employees.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'id':
          return this.compare(+a.id, +b.id, isAsc);
        case 'firstName':
          return this.compare(a.firstName, b.firstName, isAsc);
        case 'lastName':
          return this.compare(a.lastName, b.lastName, isAsc);
        default:
          return 0;
      }
    });
  }
  /**
   * Compares two values and returns a number indicating their relative order.
   * This function is used for sorting the data in the table.
   */
  private compare(
    a: string | number,
    b: string | number,
    isAsc: boolean
  ): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
