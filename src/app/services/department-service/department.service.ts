import { Injectable, InjectionToken, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of as observableOf } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  http = inject(HttpClient);
  /**
   * Gets the department array from the backend server.
   *
   * @returns an observable with an array of Department objects
   */
  getDepartmentsFromBackend(): Observable<Department[] | undefined> {
    const repositoryType = this.storage.getItem('repositoryType') as RepositoryType;
    const departmentsObservable: Observable<Department[]> =
      this.http.get<Department[]>(ENDPOINTS.getDepartments(repositoryType))
        .pipe(
          catchError(err => {
            console.log('DepartmentService.getDepartmentsFromBackend(): repositoryType[%s], error[%s]', repositoryType, err);
            return observableOf([]); // fallback to empty array
          })
        );
    console.log('DepartmentService.getDepartmentsFromBackend(): repositoryType[%s]', repositoryType);
    return departmentsObservable;
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
  getDepartments(): Department[] {
    const json = this.storage.getItem('departments') ?? '';
    console.log('DepartmentService.getDepartments():');
    return JSON.parse(json) as Department[];
  }
  /**
   * Sets the department array.
   * Converts an array of departments to a JSON string and puts it in the storage.
   *
   * @param departments the array of departments to be stored
   * @returns void
   */
  setDepartments(departments: Department[]) {
    const json = JSON.stringify(departments) ?? '';
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
    const departments = this.getDepartments();
    console.log('DepartmentService.getDepartment(): id[%d]', id);
    return departments.find((department) => department.id === id);
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
    let departments = this.getDepartments();
    if (departments.length === 0) {
      department.id = 1;
      departments = [department];
    } else {
      department.id = departments.map(dep => dep?.id ?? 0)
        .reduce((id1, id2) => Math.max(id1, id2)) + 1;
      departments.push(department);
    }
    this.setDepartments(departments);
    const repositoryType = this.storage.getItem('repositoryType') as RepositoryType;
    if (repositoryType !== RepositoryType.WebStorage) {
      this.http.post(ENDPOINTS.createDepartment(repositoryType), department)
        .subscribe({
          next: () => { console.log('💛💛💛💛💛Creating department:'); },// #############################################################
          error: err => {
            console.log('DepartmentService.createDepartment(): error[%s]', err);
          }
        });
    }
    console.log('DepartmentService.createDepartment(): repositoryType[%s], id[%d]',
      repositoryType, department.id);
  }
  /**
   * Updates an existing department.
   * Replaces the existing department in the department array.
   *
   * @param department the department to be updated
   * @returns void
   */
  updateDepartment(department: Department) {
    const departments = this.getDepartments();
    const index = departments.findIndex(dep => dep.id === department.id);
    department.employees = departments[index].employees;
    departments[index] = department;
    this.setDepartments(departments);
    const repositoryType = this.storage.getItem('repositoryType') as RepositoryType;
    if (repositoryType !== RepositoryType.WebStorage) {
      this.http.patch(ENDPOINTS.updateDepartment(department.id, repositoryType), department)
        .subscribe({
          next: () => { console.log('💜💜💜💜💜updating department:'); },// #############################################################
          error: err => {
            console.log('DepartmentService.updateDepartment(): error[%s]', err);
          }
        });
    }
    console.log('DepartmentService.updateDepartment(): repositoryType[%s], id[%d]',
      repositoryType, department.id);
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
    const departments = this.getDepartments();
    const index = departments.findIndex((dep) => dep.id === id);
    departments.splice(index, 1);
    this.setDepartments(departments);
    const repositoryType = this.storage.getItem('repositoryType') as RepositoryType;
    if (repositoryType !== RepositoryType.WebStorage) {
      this.http.delete(ENDPOINTS.deleteDepartment(id, repositoryType))
        .subscribe({
          next: () => { console.log('🤎🤎🤎🤎🤎deleting department:'); },// #############################################################
          error: err => {
            console.log('DepartmentService.deleteDepartment(): error[%s]', err);
          }
        });
    }
    console.log('DepartmentService.deleteDepartment(): repositoryType[%s], id[%d]',
      repositoryType, id);
  }
}
