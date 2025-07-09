import { Routes } from '@angular/router';

import { DepartmentTableComponent } from './tables/department-table/department-table.component';
import { DepartmentFormComponent } from './forms/department-form/department-form.component';
import { EmployeeTableComponent } from './tables/employee-table/employee-table.component';
import { EmployeeFormComponent } from './forms/employee-form/employee-form.component';
import { EmployeeTransferComponent } from './transfers/employee-transfer/employee-transfer.component';
import { DepartmentReportComponent } from './reports/department-report/department-report.component';
import { AppAaa } from './aaa/aaa';

/**
 * Application routes for the Angular application.
 * This file defines the routes for the application, including paths for
 * department and employee tables, forms, and transfers.
 * Each route is associated with a specific component that will be displayed
 * when the route is activated.
 */
export const routes: Routes = [
  {
    path: 'department-table',
    component: DepartmentTableComponent,
  },
  {
    path: 'department-form/:operation/:id',
    component: DepartmentFormComponent,
  },
  {
    path: 'employee-table/:departmentId',
    component: EmployeeTableComponent,
  },
  {
    path: 'employee-form/:departmentId/:operation/:id',
    component: EmployeeFormComponent,
  },
  {
    path: 'employee-transfer',
    component: EmployeeTransferComponent,
  },
  {
    path: 'department-report',
    component: DepartmentReportComponent,
  },
  {
    path: 'aaa',
    component: AppAaa,
  },
  // redirect to default
  {
    path: '',
    redirectTo: 'department-table',
    pathMatch: 'full',
  },
];
