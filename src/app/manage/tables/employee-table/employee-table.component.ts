import { AfterViewInit, Component, ViewChild, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTable } from '@angular/material/table';

import { Employee } from 'models/employee';
import { EmployeeDataSource } from './employee-datasource';
import { DepartmentService } from 'services/department-service/department.service';
/**
 * EmployeeTableComponent is a component that displays a table of employees.
 * It uses Angular Material's table features to display, sort, and paginate the
 * employee data.
 * This component also provides methods to create, update, delete employees,
 * and read details of a specific employee.
 */
@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrl: './employee-table.component.css',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatCardModule,
  ],
})
export class EmployeeTableComponent implements AfterViewInit, OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Employee>;
  private departmentService: DepartmentService = inject(DepartmentService);
  departmentId = '';
  departmentName = '';
  dataSource = new EmployeeDataSource();
  displayedColumns = ['id', 'firstName', 'lastName', 'actions'];

  /**
   * A component lifecycle hook method.
   * Runs once after Angular has initialized all the component's inputs.
   */
  ngOnInit() {
    this.departmentId = this.route.snapshot.paramMap.get('departmentId') ?? '';
    const department = this.departmentService.getDepartment(+this.departmentId);
    this.departmentName = department?.name ?? '';
    this.dataSource.setDepartmentId(+this.departmentId);
  }
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
    console.log('🟩EmployeeTableComponent.ngAfterViewInit():');
  }
  /**
   * Creates a new employee.
   * This method navigates to the employee form with the 'CREATE' action
   * and a placeholder id of '-1'.
   *
   * @param void
   * @returns void
   */
  createEmployee() {
    this.router.navigate(
      ['/employee-form', this.departmentId, 'CREATE', '-1'],
      {
        relativeTo: this.route,
      }
    );
    console.log('🟩EmployeeTableComponent.createEmployee():');
  }
  /**
   * Updates the employee.
   * This method navigates to the employee form with the 'UPDATE' action
   * and the specified employee id.
   *
   * @param id the employee id
   * @returns void
   */
  updateEmployee(id: number) {
    this.router.navigate(['/employee-form', this.departmentId, 'UPDATE', id], {
      relativeTo: this.route,
    });
    console.log('🟩EmployeeTableComponent.updateEmployee(): id[%d]', id);
  }
  /**
   * Deletes the employee.
   * This method navigates to the employee form with the 'DELETE' action
   * and the specified employee id.
   *
   * @param id the employee id
   * @returns void
   */
  deleteEmployee(id: number) {
    this.router.navigate(['/employee-form', this.departmentId, 'DELETE', id], {
      relativeTo: this.route,
    });
    console.log('🟩EmployeeTableComponent.deleteEmployee(): id[%d]', id);
  }
  /**
   * Navigates to the departments table.
   *
   * @returns void
   */
  navigateToDepartments() {
    this.router.navigate(['/department-table'], { 
      relativeTo: this.route
    });
  }
}
