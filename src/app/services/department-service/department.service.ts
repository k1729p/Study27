import { Injectable, InjectionToken, inject, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of as observableOf, interval } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, map, startWith } from 'rxjs/operators';

import { Department } from 'models/department';
import { Employee } from 'models/employee';
import { RepositoryType, ENDPOINTS } from 'services/backend-endpoints.constants';
import { BACKEND_INITIAL_DATA } from 'services/backend-initial-data';
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

  // ###################################################################################################### REMOVE THAT
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  // ######################################################################################################
  getDepartments(): Department[] {
    const repositoryType = this.storage.getItem('repositoryType') as RepositoryType;
    if (RepositoryType.WebStorage == repositoryType) {
      const json = this.storage.getItem('departments') ?? '';
      console.log('DepartmentService.getDepartments(): RepositoryType WebStorage');
      return JSON.parse(json) as Department[];
    }
    this.http.get<Department[]>(ENDPOINTS.getDepartments(repositoryType)).subscribe(
      {
        next: deps => {
          console.log('DepartmentService.getDepartments(): repositoryType[%s]', repositoryType);
        },
        error: err => {
          console.log('DepartmentService.getDepartments(): repositoryType[%s], error[%s]', repositoryType, err);
        }
      }
    );
    return [];
  }
  // ######################################################################################################
  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // ######################################################################################################


  storage = inject<Storage>(BROWSER_STORAGE);
  http = inject(HttpClient);

  /**
   * Parameterless constructor.
   */
  constructor() {
    this.storage.setItem('departments', JSON.stringify(BACKEND_INITIAL_DATA.departments));
    this.storage.setItem('repositoryType', RepositoryType.WebStorage);
  }

  /**
   * Gets the signal with the department array.
   *
   * @returns a signal with an array of Department objects
   */
  getDepartmentsSignal(): Signal<Department[] | undefined> {
    const repositoryType: RepositoryType = RepositoryType.PostgreSQL; // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< !!!!!!!!!!
    // const repositoryType = this.storage.getItem('repositoryType') as RepositoryType; // <<<<<<<<<<<<<<<<<<<< !!!!!!!!!!
    const departmentsObservable: Observable<Department[]> = this.http.get<Department[]>(ENDPOINTS.getDepartments(repositoryType))
      .pipe(
        catchError(err => {
          console.log('DepartmentService.getDepartmentsSignal(): repositoryType[%s], error[%s]', repositoryType, err);
          return observableOf([]); // fallback to empty array
        }),
        finalize(() => console.log('🔵 HTTP Client Finalize'))
      );
    console.log('DepartmentService.getDepartmentsSignal(): repositoryType[%s]', repositoryType);
    return toSignal(departmentsObservable, { initialValue: [] });
  }

  /**
   * Sets the department array.
   * Converts an array of departments to a JSON string and puts it in the storage.
   *
   * @param departments the array of departments to be stored
   * @returns void
   */
  setDepartments(departments: Department[]) {
    const repositoryType = this.storage.getItem('repositoryType') as RepositoryType;
    if (RepositoryType.WebStorage == repositoryType) {
      const json = JSON.stringify(departments) ?? '';
      this.storage.setItem('departments', json);
      console.log('DepartmentService.setDepartments(): RepositoryType WebStorage');
      return;
    }
    console.log('DepartmentService.setDepartments(): repositoryType[%s]', repositoryType);
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
    const departments = this.getDepartments();
    if (departments.length === 0) {
      department.id = 1;
      this.setDepartments([department]);
      console.log(
        'DepartmentService.createDepartment(): id[%d]',
        department.id
      );
      return;
    }
    department.id = departments.map(dep => dep?.id ?? 0)
      .reduce((id1, id2) => Math.max(id1, id2)) + 1;
    departments.push(department);
    console.log('DepartmentService.createDepartment(): id[%d]', department.id);
    this.setDepartments(departments);
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
    console.log('DepartmentService.updateDepartment(): id[%d]', department.id);
    this.setDepartments(departments);
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
    console.log('DepartmentService.deleteDepartment(): id[%d]', id);
  }


  // private async aaaaa() {
  //   const repositoryType = RepositoryType.PostgreSQL;
  //   this.http.get<Department[]>(ENDPOINTS.getDepartments(repositoryType)).subscribe(
  //     {
  //       next: departments => {
  //         console.log('2. getting departments, array length[%s]', departments.length);
  //       },
  //       error: err => {
  //         console.log('Error occurred while reading:', err);
  //       }
  //     }
  //   );
  //   await this.delay(100);
  //   let departmentId = 1;
  //   this.http.get<Department>(ENDPOINTS.getDepartmentById(departmentId, repositoryType)).subscribe(
  //     {
  //       next: department => {
  //         console.log('3. getting department[%s]', JSON.stringify(department));
  //       },
  //       error: err => {
  //         console.log('Error occurred while reading:', err);
  //       }
  //     }
  //   );
  //   await this.delay(100);
  //   this.http.get<Employee[]>(ENDPOINTS.getEmployees(repositoryType)).subscribe(
  //     {
  //       next: employees => {
  //         console.log('4. getting employees, array length[%s]', employees.length);
  //       },
  //       error: err => {
  //         console.log('Error occurred while reading:', err);
  //       }
  //     }
  //   );
  //   await this.delay(100);
  //   let employeeId = 1;
  //   this.http.get<Employee>(ENDPOINTS.getEmployeeById(employeeId, repositoryType)).subscribe(
  //     {
  //       next: employee => {
  //         console.log('5. getting employee[%s]', JSON.stringify(employee));
  //       },
  //       error: err => {
  //         console.log('Error occurred while reading:', err);
  //       }
  //     }
  //   );
  //   await this.delay(100);
  //   this.http.post(ENDPOINTS.createDepartment(repositoryType), CREATED_DEPARTMENT).subscribe(
  //     {
  //       next: () => {
  //         console.log('6. creating department:');
  //       },
  //       error: err => {
  //         console.log('Error occurred while creating department:', err);
  //       }
  //     }
  //   );
  //   await this.delay(100);
  //   this.http.post(ENDPOINTS.createEmployee(repositoryType), CREATED_EMPLOYEE).subscribe(
  //     {
  //       next: () => {
  //         console.log('7. creating employee:');
  //       },
  //       error: err => {
  //         console.log('Error occurred while creating employee:', err);
  //       }
  //     }
  //   );
  //   await this.delay(100);
  //   departmentId = 12345;
  //   this.http.patch(ENDPOINTS.updateDepartment(departmentId, repositoryType), UPDATED_DEPARTMENT).subscribe(
  //     {
  //       next: () => {
  //         console.log('8. updating department:');
  //       },
  //       error: err => {
  //         console.log('Error occurred while updating department:', err);
  //       }
  //     }
  //   );
  //   await this.delay(100);
  //   employeeId = 67890;
  //   this.http.patch(ENDPOINTS.updateEmployee(employeeId, repositoryType), UPDATED_EMPLOYEE).subscribe(
  //     {
  //       next: () => {
  //         console.log('9. updating employee:');
  //       },
  //       error: err => {
  //         console.log('Error occurred while updating employee:', err);
  //       }
  //     }
  //   );
  //   await this.delay(100);
  //   this.http.delete(ENDPOINTS.deleteEmployee(employeeId, repositoryType)).subscribe(
  //     {
  //       next: () => {
  //         console.log('10. deleting employee:');
  //       },
  //       error: err => {
  //         console.log('Error occurred while deleting employee:', err);
  //       }
  //     }
  //   );
  //   await this.delay(100);
  //   this.http.delete(ENDPOINTS.deleteDepartment(departmentId, repositoryType)).subscribe(
  //     {
  //       next: () => {
  //         console.log('11. deleting department:');
  //       },
  //       error: err => {
  //         console.log('Error occurred while deleting department:', err);
  //       }
  //     }
  //   );
  // }
  /**
   * This function creates a delay for a specified time.
   * @param time - The time in milliseconds to delay.
   * @returns A promise that resolves after the specified delay.
   */
  private delay(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
}

const CREATED_DEPARTMENT = {
  "id": 12345,
  "name": "D-Name-CREATE",
  "keywords": [
    "Banking"
  ],
  "notes": "Test note",
  "startDate": "2020-01-20T00:00:00.000Z",
  "endDate": "2020-02-14T00:00:00.000Z",
  "image": "images/building.jpg"
};
const UPDATED_DEPARTMENT = {
  "id": 12345,
  "name": "D-Name-UPDATE",
  "keywords": [
    "Banking"
  ],
  "notes": "Test note",
  "startDate": "2020-01-20T00:00:00.000Z",
  "endDate": "2020-02-14T00:00:00.000Z",
  "image": "images/building.jpg"
};
const CREATED_EMPLOYEE = {
  "id": 67890,
  "departmentId": 12345,
  "firstName": "EF-Name-CREATE",
  "lastName": "EL-Name-CREATE",
  "title": "Manager",
  "phone": "+1 123-456-7890",
  "mail": "user@example.com",
  "streetName": "Main Street",
  "houseNumber": "1",
  "postalCode": "20500",
  "locality": "Washington",
  "province": "DC",
  "country": "United States"
};
const UPDATED_EMPLOYEE = {
  "id": 67890,
  "departmentId": 12345,
  "firstName": "EF-Name-UPDATE",
  "lastName": "EL-Name-UPDATE",
  "title": "Manager",
  "phone": "+1 123-456-7890",
  "mail": "user@example.com",
  "streetName": "Main Street",
  "houseNumber": "1",
  "postalCode": "20500",
  "locality": "Washington",
  "province": "DC",
  "country": "United States"
};