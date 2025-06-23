import { Injectable, InjectionToken, inject } from '@angular/core';
import { Employee } from '../../models/employee';
import { Title } from '../../models/title';
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
   *
   * @param storage the storage to use for storing employee data
   */
  constructor() {
    this.setEmployeeArray(INITIAL_DATA);
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
    const sourceDepIndex = sourceDepartmentId - 1;
    const employeeArray = this.getEmployeeArray();
    const empIndex = employeeArray[sourceDepIndex].findIndex(
      (dep) => dep.id === employee.id
    );
    employeeArray[sourceDepIndex].splice(empIndex, 1);
    const targetDepIndex = targetDepartmentId - 1;
    employeeArray[targetDepIndex].push(employee);
    this.setEmployeeArray(employeeArray);
    console.log(
      'EmployeeService.transferEmployee(): source department id[%s], target department id[%s], employee id[%s]',
      sourceDepartmentId,
      targetDepartmentId,
      employee.id
    );
  }
}
/**
 * Initial employee data for the application.
 * This data is used to populate the employee array when the application starts.
 */
const INITIAL_DATA: Employee[][] = [
  [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      title: Title.Manager,
      phone: '012345678',
      mail: 'user@example.com',
      streetName: 'Massachusetts Ave NW',
      houseNumber: '2101',
      postalCode: '20008',
      locality: 'Washington',
      province: 'DC',
      country: 'United States',
    },
    {
      id: 2,
      firstName: 'Brett',
      lastName: 'Boe',
      title: Title.Analyst,
      phone: '012345678',
      mail: 'user@example.com',
      streetName: 'Fleet St',
      houseNumber: '175',
      postalCode: 'EC4A 2EA',
      locality: 'London',
      province: '',
      country: 'United Kingdom',
    },
    {
      id: 3,
      firstName: 'Carla',
      lastName: 'Coe',
      title: Title.Analyst,
      phone: '012345678',
      mail: 'user@example.com',
      streetName: 'Av. de José Antonio',
      houseNumber: '38',
      postalCode: '28013',
      locality: 'Madrid',
      province: '',
      country: 'Spain',
    },
    {
      id: 4,
      firstName: 'Donna',
      lastName: 'Doe',
      title: Title.Developer,
      phone: '012345678',
      mail: 'user@example.com',
      streetName: 'Rue Saint-Antoine',
      houseNumber: '1',
      postalCode: '75004',
      locality: 'Paris',
      province: '',
      country: 'France',
    },
    {
      id: 5,
      firstName: 'Kriste',
      lastName: 'Etue',
      title: Title.Developer,
      phone: '012345678',
      mail: 'user@example.com',
      streetName: 'Unter den Linden',
      houseNumber: '7',
      postalCode: '10117',
      locality: ' Berlin',
      province: '',
      country: 'Germany',
    },
  ],
  [
    {
      id: 6,
      firstName: 'Frank',
      lastName: 'Foe',
      title: Title.Developer,
      phone: '012345678',
      mail: 'user@example.com',
    },
    {
      id: 7,
      firstName: 'Grace',
      lastName: 'Goe',
      title: Title.Manager,
      phone: '012345678',
      mail: 'user@example.com',
    },
    {
      id: 8,
      firstName: 'Harry',
      lastName: 'Hoe',
      title: Title.Analyst,
      phone: '012345678',
      mail: 'user@example.com',
    },
    {
      id: 9,
      firstName: 'Larry',
      lastName: 'Loe',
      title: Title.Analyst,
      phone: '012345678',
      mail: 'user@example.com',
    },
    {
      id: 10,
      firstName: 'Mark',
      lastName: 'Moe',
      title: Title.Developer,
      phone: '012345678',
      mail: 'user@example.com',
    },
  ],
  [
    {
      id: 11,
      firstName: 'Norma',
      lastName: 'Noe',
      title: Title.Developer,
      phone: '012345678',
      mail: 'user@example.com',
    },
    {
      id: 12,
      firstName: 'Paula',
      lastName: 'Poe',
      title: Title.Developer,
      phone: '012345678',
      mail: 'user@example.com',
    },
    {
      id: 13,
      firstName: 'Richard',
      lastName: 'Roe',
      title: Title.Manager,
      phone: '012345678',
      mail: 'user@example.com',
    },
    {
      id: 14,
      firstName: 'Sammy',
      lastName: 'Soe',
      title: Title.Analyst,
      phone: '012345678',
      mail: 'user@example.com',
    },
    {
      id: 15,
      firstName: 'Tommy',
      lastName: 'Toe',
      title: Title.Analyst,
      phone: '012345678',
      mail: 'user@example.com',
    },
  ],
  [
    {
      id: 16,
      firstName: 'Vince',
      lastName: 'Voe',
      title: Title.Developer,
      phone: '012345678',
      mail: 'user@example.com',
    },
    {
      id: 17,
      firstName: 'William',
      lastName: 'Woe',
      title: Title.Developer,
      phone: '012345678',
      mail: 'user@example.com',
    },
    {
      id: 18,
      firstName: 'Xerxes',
      lastName: 'Xoe',
      title: Title.Developer,
      phone: '012345678',
      mail: 'user@example.com',
    },
    {
      id: 19,
      firstName: 'Richard',
      lastName: 'Miles',
      title: Title.Manager,
      phone: '012345678',
      mail: 'user@example.com',
    },
    {
      id: 20,
      firstName: 'John',
      lastName: 'Stiles',
      title: Title.Analyst,
      phone: '012345678',
      mail: 'user@example.com',
    },
  ],
  [
    {
      id: 21,
      firstName: 'John',
      lastName: 'Noakes',
      title: Title.Analyst,
      phone: '012345678',
      mail: 'user@example.com',
    },
    {
      id: 22,
      firstName: 'Mary',
      lastName: 'Major',
      title: Title.Developer,
      phone: '012345678',
      mail: 'user@example.com',
    },
    {
      id: 23,
      firstName: 'Jane',
      lastName: 'Smith',
      title: Title.Developer,
      phone: '012345678',
      mail: 'user@example.com',
    },
    {
      id: 24,
      firstName: 'John',
      lastName: 'Bloggs',
      title: Title.Developer,
      phone: '012345678',
      mail: 'user@example.com',
    },
    {
      id: 25,
      firstName: 'Roger',
      lastName: 'Galvin',
      title: Title.Manager,
      phone: '012345678',
      mail: 'user@example.com',
    },
  ],
  [
    {
      id: 26,
      firstName: 'Rick',
      lastName: 'Snyder',
      title: Title.Analyst,
      phone: '012345678',
      mail: 'user@example.com',
    },
    {
      id: 27,
      firstName: 'Bill',
      lastName: 'Schuette',
      title: Title.Analyst,
      phone: '012345678',
      mail: 'user@example.com',
    },
    {
      id: 28,
      firstName: 'William',
      lastName: 'Forsyth',
      title: Title.Developer,
      phone: '012345678',
      mail: 'user@example.com',
    },
    {
      id: 29,
      firstName: 'Wilbur',
      lastName: 'Friedman',
      title: Title.Developer,
      phone: '012345678',
      mail: 'user@example.com',
    },
    {
      id: 30,
      firstName: 'Thomas',
      lastName: 'Ferguson',
      title: Title.Developer,
      phone: '012345678',
      mail: 'user@example.com',
    },
  ],
];
