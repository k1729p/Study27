import { Department } from '../../models/department';
import { DepartmentDataSource } from './department-datasource';
import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, ActivatedRoute } from '@angular/router';
/**
 * DepartmentTableComponent is a component that displays a table of departments.
 * It uses Angular Material's table features to display, sort, and paginate the
 * department data.
 * This component also provides methods to create, update, delete departments,
 * and read employees associated with a department.
 */
@Component({
  selector: 'app-department-table',
  templateUrl: './department-table.component.html',
  styleUrl: './department-table.component.css',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatCardModule,
  ],
})
export class DepartmentTableComponent implements AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Department>;
  dataSource = new DepartmentDataSource();
  displayedColumns = ['id', 'name', 'employees', 'actions'];

  /**
   * A component lifecycle hook method.
   * Runs once after the component's view has been initialized.
   *
   * https://angular.dev/guide/components/lifecycle#ngafterviewinit
   */
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
  /**
   * Creates a new department.
   * This method navigates to the department form with the 'CREATE' action
   * and a placeholder id of '-1'.
   *
   * @param void
   * @returns void
   */
  createDepartment() {
    this.router.navigate(['/department-form', 'CREATE', '-1'], {
      relativeTo: this.route,
    });
    console.log('DepartmentTableComponent.createDepartment():');
  }
  /**
   * Updates the department.
   * This method navigates to the department form with the 'UPDATE' action
   * and the specified department id.
   *
   * @param id the department id
   * @returns void
   */
  updateDepartment(id: number) {
    this.router.navigate(['/department-form', 'UPDATE', id], {
      relativeTo: this.route,
    });
    console.log('DepartmentTableComponent.updateDepartment(): id[%d]', id);
  }
  /**
   * Deletes the department.
   * This method navigates to the department form with the 'DELETE' action
   * and the specified department id.
   *
   * @param id the department id
   * @returns void
   */
  deleteDepartment(id: number) {
    this.router.navigate(['/department-form', 'DELETE', id], {
      relativeTo: this.route,
    });
    console.log('DepartmentTableComponent.deleteDepartment(): id[%d]', id);
  }
  /**
   * Reads the employees of the department.
   * This method navigates to the employee table with the specified department id.
   *
   * @param id the department id
   * @returns void
   */
  readEmployees(id: number) {
    this.router.navigate(['/employee-table', id], {
      relativeTo: this.route,
    });
    console.log(
      'DepartmentTableComponent.readEmployees(): department id[%d]',
      id
    );
  }
}
