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
 * This service provides methods to get, set, create, update, delete, and transfer employees
 * across departments.
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
    const json = this.storage.getItem('departments') ?? '';
    const departments = JSON.parse(json) as Department[];
    const department = departments.find(dep => dep.id === departmentId);
    const employees = department ? department.employees : [];
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
    console.log('EmployeeService.getEmployee(): department id[%s], employee id[%s]',
      departmentId,
      employeeId
    );
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
    const employees = this.getEmployees(departmentId);
    if (employees === undefined || employees.length === 0) {
      employee.id = 1;
    } else {
      employee.id = employees.map(dep => dep?.id ?? 0)
        .reduce((id1, id2) => Math.max(id1, id2)) + 1;
    }
    employees.push(employee);
    this.setEmployees(departmentId, employees);
    const repositoryType = this.storage.getItem('repositoryType') as RepositoryType;
    if (repositoryType !== RepositoryType.WebStorage) {
      this.http.post(ENDPOINTS.createEmployee(repositoryType), employee)
        .subscribe({
          next: () => { console.log('💛💛💛💛💛Creating employee:'); },// #############################################################
          error: err => {
            console.log('EmployeeService.createEmployee(): error[%s]', err);
          }
        }
        );
    }
    console.log(
      'EmployeeService.createEmployee(): repositoryType[%s], department id[%s], employee id[%s]',
      repositoryType, departmentId, employee.id);
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
          next: () => { console.log('💜💜💜💜💜updating employee:'); },// #############################################################
          error: err => {
            console.log('EmployeeService.updateEmployee(): error[%s]', err);
          }
        }
        );
    }
    console.log(
      'EmployeeService.updateEmployee(): repositoryType[%s], department id[%s], employee id[%s]',
      repositoryType, departmentId, employee.id);
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
          next: () => { console.log('🤎🤎🤎🤎🤎deleting employee:'); },// #############################################################
          error: err => {
            console.log('EmployeeService.deleteEmployee(): error[%s]', err);
          }
        }
        );
    }
    console.log(
      'EmployeeService.deleteEmployee(): repositoryType[%s], department id[%s], employee id[%s]',
      repositoryType, departmentId, employeeId);
  }
  /**
   * Transfers a list of employees from one department to another.
   *
   * @param sourceDepartmentId the source department id
   * @param targetDepartmentId the target department id
   * @param employees the list of the employees to transfer
   * @return void
   */
  transferEmployees(
    sourceDepartmentId: number,
    targetDepartmentId: number,
    employees: Employee[]
  ) {
    const sourceEmployees = this.getEmployees(sourceDepartmentId);
    const targetEmployees = this.getEmployees(targetDepartmentId);
    employees.forEach(employee => {
      const empIndex = sourceEmployees.findIndex(emp => emp.id === employee.id);
      if (empIndex !== -1) {
        sourceEmployees.splice(empIndex, 1);
        targetEmployees.push(employee);
      }
    });
    this.setEmployees(sourceDepartmentId, sourceEmployees);
    this.setEmployees(targetDepartmentId, targetEmployees);
    const repositoryType = this.storage.getItem('repositoryType') as RepositoryType;
    if (repositoryType !== RepositoryType.WebStorage) {
      // TODO ### TODO ### TODO ### TODO ### TODO ### TODO ### TODO ### TODO ### TODO ### 
      // TODO ### TODO ### TODO ### TODO ### TODO ### TODO ### TODO ### TODO ### TODO ### 
      // TODO ### TODO ### TODO ### TODO ### TODO ### TODO ### TODO ### TODO ### TODO ### 
    }
    console.log(
      'EmployeeService.transferEmployee(): repositoryType[%s], source department id[%s], target department id[%s], employee id[%s]',
      repositoryType, sourceDepartmentId, targetDepartmentId);
  }
}
