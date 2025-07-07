import { Injectable, InjectionToken, inject } from '@angular/core';

import { Employee } from '../../models/employee';
import { EMPLOYEES } from '../initial-data';
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

  /**
   * Parameterized constructor.
   */
  constructor() {
    this.storage.setItem('employees', JSON.stringify(EMPLOYEES));
  }

  /**
   * Gets the employee array.
   * This method retrieves the employee data from the storage,
   * parses it from JSON format, and returns it as an array of employees.
   *
   * @returns the employee array
   */
  getEmployeeArray(): Employee[][] {
    const json = this.storage.getItem('employees') ?? '';
    return JSON.parse(json) as Employee[][];
  }
  /**
   * Sets the employee array.
   * This method takes an array of employees,
   * converts it to JSON format, and stores it in the storage.
   *
   * @param employeeArray the employee array
   * @returns void
   */
  setEmployeeArray(employeeArray: Employee[][]) {
    const json = JSON.stringify(employeeArray) ?? '';
    this.storage.setItem('employees', json);
  }
  /**
   * Gets the employees for a specific department.
   * This method retrieves the employee array and returns the employees
   *
   * @param departmentId the department id
   * @returns an array of employees for the specified department
   */
  getEmployees(departmentId: number): Employee[] {
    const depIndex = departmentId - 1;
    const employeeArray = this.getEmployeeArray();
    console.log(
      'EmployeeService.getEmployees(): department id[%s]',
      departmentId
    );
    return employeeArray[depIndex] ?? [];
  }
  /**
   * Gets a specific employee by id from a department.
   * This method retrieves the employee array,
   * finds the employee with the specified id in the specified department,
   * and returns it.
   *
   * @param departmentId the department id
   * @param id the employee id
   * @return the employee with the specified id, or undefined if not found
   */
  getEmployee(departmentId: number, id: number): Employee | undefined {
    const employeeArray = this.getEmployeeArray();
    const depIndex = departmentId - 1;
    if (depIndex < 0 || depIndex >= employeeArray.length) {
      return undefined;
    }
    return employeeArray[depIndex].find((employee) => employee.id === id);
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
    const depIndex = departmentId - 1;
    const employeeArray = this.getEmployeeArray();
    if (
      employeeArray[depIndex] === undefined ||
      employeeArray[depIndex].length === 0
    ) {
      employee.id = 1;
      employeeArray[depIndex].push(employee);
      this.setEmployeeArray(employeeArray);
      console.log(
        'EmployeeService.createEmployee(): 1st employee, department id[%s], employee id[%s]',
        departmentId,
        employee.id
      );
      return;
    }
    employee.id =
      employeeArray[depIndex]
        .map((dep) => dep?.id ?? 0)
        .reduce((id1, id2) => Math.max(id1, id2)) + 1;
    employeeArray[depIndex].push(employee);
    this.setEmployeeArray(employeeArray);
    console.log(
      'EmployeeService.createEmployee(): department id[%s], employee id[%s]',
      departmentId,
      employee.id
    );
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
    const depIndex = departmentId - 1;
    const employeeArray = this.getEmployeeArray();
    const empIndex = employeeArray[depIndex].findIndex(
      (dep) => dep.id === employee.id
    );
    employeeArray[depIndex][empIndex] = employee;
    this.setEmployeeArray(employeeArray);
    console.log(
      'EmployeeService.updateEmployee(): department id[%s], employee id[%s]',
      departmentId,
      employee.id
    );
  }
  /**
   * Deletes the employee from the specified department.
   * This method finds the employee in the specified department's employee array
   * and removes it from the array.
   *
   * @param departmentId the department id
   * @param id the employee id
   * @return void
   */
  deleteEmployee(departmentId: number, id: number) {
    const depIndex = departmentId - 1;
    const employeeArray = this.getEmployeeArray();
    const empIndex = employeeArray[depIndex].findIndex((dep) => dep.id === id);
    employeeArray[depIndex].splice(empIndex, 1);
    this.setEmployeeArray(employeeArray);
    console.log(
      'EmployeeService.deleteEmployee(): department id[%s], employee id[%s]',
      departmentId,
      id
    );
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
    employees.forEach((employee) => {
      this.transferEmployee(sourceDepartmentId, targetDepartmentId, employee);
    });
    const tmpArray = this.getEmployeeArray();
    tmpArray[targetDepartmentId - 1].sort((emp1, emp2) => emp1.id - emp2.id);
    this.setEmployeeArray(tmpArray);
  }
  /**
   * Transfers an employee from one department to another.
   * This method finds the employee in the source department's employee array,
   * removes it from that array,
   * and adds it to the target department's employee array.
   *
   * @param sourceDepartmentId the source department id
   * @param targetDepartmentId the target department id
   * @param employee the employee to transfer
   * @return void
   */
  transferEmployee(
    sourceDepartmentId: number,
    targetDepartmentId: number,
    employee: Employee
  ) {
    const tmpArray = this.getEmployeeArray();
    const empIndex = tmpArray[sourceDepartmentId - 1].findIndex(
      (emp) => emp.id === employee.id
    );
    tmpArray[sourceDepartmentId - 1].splice(empIndex, 1);
    tmpArray[targetDepartmentId - 1].push(employee);
    this.setEmployeeArray(tmpArray);
    console.log(
      'EmployeeService.transferEmployee(): source department id[%s], target department id[%s], employee id[%s]',
      sourceDepartmentId,
      targetDepartmentId,
      employee.id
    );
  }
}
