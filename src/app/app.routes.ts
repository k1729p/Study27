import { Routes } from '@angular/router';

import { HomeComponent } from 'home/home.component';
import { DepartmentFormComponent } from './manage/forms/department-form/department-form.component';
import { DepartmentTableComponent } from './manage/tables/department-table/department-table.component';
import { EmployeeFormComponent } from './manage/forms/employee-form/employee-form.component';
import { EmployeeTableComponent } from './manage/tables/employee-table/employee-table.component';
import { EmployeeLocateComponent } from './locate/employee-locate/employee-locate.component';
import { EmployeeTransferComponent } from './transfer/employee-transfer/employee-transfer.component';
import { ReportComponent } from './report/report.component';
/**
 * Application routes for the Angular application.
 * This file defines the routes for the application, including paths for
 * department and employee tables, forms, and transfers.
 * Each route is associated with a specific component that will be displayed
 * when the route is activated.
 */
export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
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
    path: 'employee-locate',
    component: EmployeeLocateComponent,
  },
  {
    path: 'report',
    component: ReportComponent,
  },
  // redirect to default
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
