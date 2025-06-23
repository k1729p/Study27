import { inject } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, of as observableOf, merge } from 'rxjs';
import { map } from 'rxjs/operators';

import { Department } from '../../models/department';
import { DepartmentService } from '../../services/department-service/department.service';

/**
 * Data source for the Department Table view and Form view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class DepartmentDataSource extends DataSource<Department> {
  private departmentService: DepartmentService = inject(DepartmentService);
  departmentArr: Department[] = this.departmentService.getDepartmentArray();
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   *
   * @returns An observable of the items to be rendered by the table.
   */
  connect(): Observable<Department[]> {
    if (!this.paginator || !this.sort) {
      throw Error(
        'Please set the paginator and sort on the data before connecting.'
      );
    }
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    return merge(
      observableOf(this.departmentArr),
      this.paginator.page,
      this.sort.sortChange
    ).pipe(
      map(() => this.getPagedData(this.getSortedData([...this.departmentArr])))
    );
  }

  /**
   * Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   *
   * @returns void
   */
  disconnect(): void {
    // No resources to clean up in this implementation.
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   *
   * @param departmentArr The array of departments to be paginated.
   * @returns The paginated array of departments.
   */
  private getPagedData(departmentArr: Department[]): Department[] {
    if (!this.paginator) {
      return departmentArr;
    }
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return departmentArr.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   *
   * @param departmentArr The array of departments to be sorted.
   * @returns The sorted array of departments.
   */
  private getSortedData(departmentArr: Department[]): Department[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return departmentArr;
    }
    return departmentArr.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'id':
          return compare(+a.id, +b.id, isAsc);
        default:
          return 0;
      }
    });
  }
}

/**
 * Compare two values and return a number indicating their relative order.
 * This function is used for sorting the data in the table.
 */
function compare(
  a: string | number,
  b: string | number,
  isAsc: boolean
): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
