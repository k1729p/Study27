import { Injectable, InjectionToken, inject } from '@angular/core';

import { Department } from '../../models/department';
import { EmployeeService } from '../employee-service/employee.service';
import { DEPARTMENTS } from '../initial-data';
/**
 * Injection token for browser storage.
 * This token is used to inject the browser's localStorage into services that require it.
 */
export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage,
});
/**
 * Service for managing departments.
 * This service provides methods to create, read, update, and delete departments.
 * It uses local storage to persist department data across sessions.
 * It also interacts with the EmployeeService to manage employees associated with departments.
 */
@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  storage = inject<Storage>(BROWSER_STORAGE);
  private employeeService = inject(EmployeeService);

  /**
   * Parameterless constructor.
   */
  constructor() {
    this.storage.setItem('departments', JSON.stringify(DEPARTMENTS));
  }

  /**
   * Gets the department array.
   * Retrieves the department array from local storage,
   * parses it from JSON format,
   * and returns it as an array of Department objects.
   * If the storage is empty, it returns an empty array.
   *
   * @returns an array of Department objects
   */
  getDepartmentArray(): Department[] {
    const json = this.storage.getItem('departments') ?? '';
    return JSON.parse(json) as Department[];
  }
  /**
   * Sets the department array.
   * Converts an array of departments to a JSON string and puts it in the storage.
   *
   * @param departmentArray the array of departments to be stored
   * @returns void
   */
  setDepartmentArray(departmentArray: Department[]) {
    const json = JSON.stringify(departmentArray) ?? '';
    this.storage.setItem('departments', json);
  }
  /**
   * Gets the department by id.
   * Retrieves a specific department by its id from the department array.
   * If the department with the given id does not exist, it returns undefined.
   *
   * @param id the id of the department to retrieve
   * @returns the Department object if found, otherwise undefined
   */
  getDepartment(id: number): Department | undefined {
    const departmentArray = this.getDepartmentArray();
    console.log('DepartmentService.getDepartment(): id[%d]', id);
    return departmentArray.find((department) => department.id === id);
  }
  /**
   * Creates a new department.
   * Generates a new department with a unique id,
   * adds it to the department array, and updates the storage.
   *
   * @param department the department to be created
   * @return void
   */
  createDepartment(department: Department) {
    const departmentArray = this.getDepartmentArray();
    if (departmentArray.length === 0) {
      department.id = 1;
      this.setDepartmentArray([department]);
      console.log(
        'DepartmentService.createDepartment(): id[%d]',
        department.id
      );
      return;
    }
    department.id =
      departmentArray
        .map((dep) => dep?.id ?? 0)
        .reduce((id1, id2) => Math.max(id1, id2)) + 1;
    departmentArray.push(department);
    console.log('DepartmentService.createDepartment(): id[%d]', department.id);
    this.setDepartmentArray(departmentArray);
  }
  /**
   * Updates an existing department.
   * Replaces the existing department in the department array.
   *
   * @param department the department to be updated
   * @returns void
   */
  updateDepartment(department: Department) {
    const departmentArray = this.getDepartmentArray();
    const index = departmentArray.findIndex((dep) => dep.id === department.id);
    departmentArray[index] = department;
    console.log('DepartmentService.updateDepartment(): id[%d]', department.id);
    this.setDepartmentArray(departmentArray);
  }
  /**
   * Deletes a department by its id.
   * Removes the department from the department array
   * and also deletes all employees associated with that department.
   *
   * @param id the id of the department to be deleted
   * @returns void
   */
  deleteDepartment(id: number) {
    const departmentArray = this.getDepartmentArray();
    const index = departmentArray.findIndex((dep) => dep.id === id);
    departmentArray.splice(index, 1);
    this.setDepartmentArray(departmentArray);

    const employeeArray = this.employeeService.getEmployeeArray()[index];
    for (const employee of employeeArray.values()) {
      if (employee) {
        this.employeeService.deleteEmployee(id, employee.id);
      }
    }
    console.log('DepartmentService.deleteDepartment(): id[%d]', id);
  }
}
