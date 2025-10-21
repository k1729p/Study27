import { inject } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, merge, Observable, startWith, BehaviorSubject } from 'rxjs';

import { Department } from 'models/department';
import { DepartmentService } from 'services/department-service/department.service';
/**
 * Data source for the Department Table view and Form view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class DepartmentDataSource extends DataSource<Department> {
  private departmentService: DepartmentService = inject(DepartmentService);
  departments: Department[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  filteredLength = 0;
  private filterSubject = new BehaviorSubject<string>('');
  private lastFilter = '';
  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   *
   * @returns An observable of the items to be rendered by the table.
   */
  connect(): Observable<Department[]> {
    if (!this.paginator || !this.sort) {
      const msg = 'Please set the paginator and sort on the data before connecting.';
      console.log('DepartmentDataSource.connect(): %s', msg);
      throw Error(msg);
    }
    this.departments = this.departmentService.getDepartments();
    const paginator$ = this.paginator!.page;
    const sort$ = this.sort!.sortChange;
    const filter$ = this.filterSubject.asObservable();
    return merge(paginator$, sort$, filter$)
      .pipe(
        startWith({}),
        map(() => {
          const filtered = this.getFilteredData([...this.departments]);
          this.filteredLength = filtered.length;
          const sorted = this.getSortedData(filtered);
          return this.getPagedData(sorted);
        })
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
   * Filter the data by name (case-insensitive). If the filter is empty
   * returns the original array.
   */
  private getFilteredData(departments: Department[]): Department[] {
    const filter = this.lastFilter?.trim().toLowerCase() ?? '';
    if (!filter) {
      return departments;
    }
    return departments.filter(obj => {
      const name = (obj.name ?? '').toLowerCase();
      return name.includes(filter);
    });
  }
  /**
   * Paginate the data (client-side). This method slices the data array based on the current
   * page index and page size. If you switch to using server-side pagination, this method
   * should be replaced with a call to the server to fetch the appropriate page of data.
   *
   * @param departments The array of departments to be paginated.
   * @returns The paginated array of departments.
   */
  private getPagedData(departments: Department[]): Department[] {
    if (!this.paginator) {
      return departments;
    }
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return departments.slice(startIndex, startIndex + this.paginator.pageSize);
  }
  /**
   * Sort the data (client-side). This method sorts the data array based on the active
   * sort field and direction. If you switch to using server-side sorting, this method
   * should be replaced with a call to the server to fetch the appropriately sorted data.
   *
   * @param departments The array of departments to be sorted.
   * @returns The sorted array of departments.
   */
  private getSortedData(departments: Department[]): Department[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return departments;
    }
    return departments.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'id':
          return this.compare(+a.id, +b.id, isAsc);
        default:
          return 0;
      }
    });
  }
  /**
   * Compare two values and return a number indicating their relative order.
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
