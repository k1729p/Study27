import { Injectable, InjectionToken, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Employee } from 'models/employee';
import { Department } from 'models/department';
import { RepositoryType } from 'home/repository-type';
import { ENDPOINTS } from 'services/backend-endpoints.constants';
/**
 * Injection token for browser storage.
 * This token is used to inject the browser's localStorage into services that require it.
 */
export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage,
});
/**
 * Service for managing employee data.
 * This service provides methods to get, set, create, update, and delete employees.
 */
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  storage = inject<Storage>(BROWSER_STORAGE);
  http = inject(HttpClient);
  /**
   * Sets the employee array.
   * This method takes an array of employees,
   * converts it to JSON format, and stores it in the storage.
   *
   * @param employeeArray the employee array
   * @returns void
   */
  setEmployees(departmentId: number, employees: Employee[]) {
    let json = this.storage.getItem('departments') ?? '';
    const departments = JSON.parse(json) as Department[];
    const department = departments.find(dep => dep.id === departmentId);
    if (department) {
      department.employees = employees;
    }
    json = JSON.stringify(departments) ?? '';
    console.log('EmployeeService.setEmployees(): department id[%s]', departmentId);
    this.storage.setItem('departments', json);
  }
  /**
   * Gets the employees for a specific department.
   * This method retrieves the employee array and returns the employees
   *
   * @param departmentId the department id
   * @returns an array of employees for the specified department
   */
  getEmployees(departmentId: number): Employee[] {
    const employees = (JSON.parse(this.storage.getItem('departments') ?? '') as Department[])
      .find(dep => dep.id === departmentId)
      ?.employees
      .sort((emp1, emp2) => emp1.id - emp2.id) || [];
    console.log('EmployeeService.getEmployees(): department id[%s]', departmentId);
    return employees;
  }
  /**
   * Gets a specific employee by id from a department.
   * This method retrieves the employee array,
   * finds the employee with the specified id in the specified department,
   * and returns it.
   *
   * @param departmentId the department id
   * @param employeeId the employee id
   * @return the employee with the specified id, or undefined if not found
   */
  getEmployee(departmentId: number, employeeId: number): Employee | undefined {
    const employee = this.getEmployees(departmentId).find(emp => emp.id === employeeId);
    console.log('EmployeeService.getEmployee(): department id[%s], employee id[%s]', departmentId, employeeId);
    return employee;
  }
  /**
   * Creates a new employee in the specified department.
   * This method generates a new employee ID based on the existing employees in the department,
   * adds the new employee to the department's employee array,
   * and updates the storage with the new employee array.
   *
   * @param departmentId the department id
   * @param employee the employee to create
   * @return void
   */
  createEmployee(departmentId: number, employee: Employee) {
    employee.id = this.getNextEmployeeId();
    const employees = this.getEmployees(departmentId);
    employees.push(employee);
    this.setEmployees(departmentId, employees);
    const repositoryType = this.storage.getItem('repositoryType') as RepositoryType;
    if (repositoryType !== RepositoryType.WebStorage) {
      this.http.post(ENDPOINTS.createEmployee(repositoryType), employee)
        .subscribe({
          next: () => {
            console.log(
              'EmployeeService.createEmployee(): repositoryType[%s], department id[%s], employee id[%s]',
              repositoryType, departmentId, employee.id);
          },
          error: err => console.log('EmployeeService.createEmployee(): error[%s]', err)
        });
    }
  }
  /**
   * Updates the employee.
   * This method finds the employee in the specified department's employee array
   * and updates its details with the provided employee object.
   *
   * @param departmentId the department id
   * @param employee the employee to update
   * @return void
   */
  updateEmployee(departmentId: number, employee: Employee) {
    const employees = this.getEmployees(departmentId);
    const empIndex = employees.findIndex(emp => emp.id === employee.id);
    if (empIndex !== -1) {
      employees[empIndex] = employee;
    }
    this.setEmployees(departmentId, employees);
    const repositoryType = this.storage.getItem('repositoryType') as RepositoryType;
    if (repositoryType !== RepositoryType.WebStorage) {
      this.http.patch(ENDPOINTS.updateEmployee(employee.id, repositoryType), employee)
        .subscribe({
          next: () => {
            console.log(
              'EmployeeService.updateEmployee(): repositoryType[%s], department id[%s], employee id[%s]',
              repositoryType, departmentId, employee.id);
          },
          error: err => console.log('EmployeeService.updateEmployee(): error[%s]', err)
        });
    }
  }
  /**
   * Deletes the employee from the specified department.
   * This method finds the employee in the specified department's employee array
   * and removes it from the array.
   *
   * @param departmentId the department id
   * @param employeeId the employee id
   * @return void
   */
  deleteEmployee(departmentId: number, employeeId: number) {
    const employees = this.getEmployees(departmentId);
    const empIndex = employees.findIndex(emp => emp.id === employeeId);
    if (empIndex !== -1) {
      employees.splice(empIndex, 1);
    }
    this.setEmployees(departmentId, employees);
    const repositoryType = this.storage.getItem('repositoryType') as RepositoryType;
    if (repositoryType !== RepositoryType.WebStorage) {
      this.http.delete(ENDPOINTS.deleteEmployee(employeeId, repositoryType))
        .subscribe({
          next: () => {
            console.log(
              'EmployeeService.deleteEmployee(): repositoryType[%s], department id[%s], employee id[%s]',
              repositoryType, departmentId, employeeId);
          },
          error: err => console.log('EmployeeService.deleteEmployee(): error[%s]', err)
        });
    }
  }
  /**
   * Returns the next available employee id:
   * (maximum id found in all departments' employees) + 1.
   * If there are no employees, returns 1.
   * @return id
   */
  private getNextEmployeeId(): number {
    const json = this.storage.getItem('departments') ?? '';
    const departments = JSON.parse(json) as Department[];
    const employeeIds = departments.flatMap(dep => dep.employees).map(emp => emp.id);
    return employeeIds.length > 0 ? Math.max(...employeeIds) + 1 : 1;
  };

}
