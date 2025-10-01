import { Department } from 'models/department';
import { Employee } from 'models/employee';
import { Title } from 'models/title';
import { RepositoryType } from 'home/repository-type';
/**
 * Test days.
 */
export const TEST_DAYS: Date[] = [
  new Date('2020-01-04'),
  new Date('2020-01-05'),
  new Date('2020-01-06'),
  new Date('2020-01-07'),
];
/**
 * Suggestion keywords for the autocomplete.
 */
export const SUGGESTION_KEYWORDS: string[] = ['Banking', 'Credit'];

/**
 * Test department data for departments.
 * This data is used to populate the department array in tests.
 */
export const TEST_DEPARTMENTS: Department[] = [
  {
    id: 1,
    name: 'Main Office',
    employees: [{
      id: 1,
      departmentId: 1,
      firstName: 'Emily',
      lastName: 'Clark',
      title: Title.Developer,
      phone: '2025550143',
      mail: 'emily.clark@company.com',
      streetName: 'Maple Street',
      houseNumber: '42B',
      postalCode: '30301',
      locality: 'Atlanta',
      province: 'GA',
      country: 'United States',
    }],
    startDate: TEST_DAYS[2],
    endDate: TEST_DAYS[3],
    notes: 'Main product:\n - money transfer',
    keywords: [SUGGESTION_KEYWORDS[0]],
  },
  {
    id: 2,
    name: 'Back Office',
    employees: [{
      id: 2,
      departmentId: 2,
      firstName: 'Thomas',
      lastName: 'Ferguson',
      title: Title.Developer,
      phone: '+41 21 613 12 12',
      mail: 'Thomas.Ferguson@example.com',
      streetName: 'Rue de Bourg',
      houseNumber: '20',
      postalCode: '1003',
      locality: 'Lausanne',
      province: '',
      country: 'Switzerland',
    }],
    startDate: TEST_DAYS[2],
    endDate: TEST_DAYS[3],
    notes: 'Main product:\n - credit',
    keywords: [SUGGESTION_KEYWORDS[1]],
  },
];
/**
 * Test department id.
 */
export const TEST_DEPARTMENT_ID = TEST_DEPARTMENTS[0].id;
/**
 * Test employee id.
 */
export const TEST_EMPLOYEE_ID = TEST_DEPARTMENTS[0].employees[0].id;
/**
 * Test employee full name.
 */
export const TEST_EMPLOYEE_FULL_NAME = 
  `${TEST_DEPARTMENTS[0].employees[0].firstName} ${TEST_DEPARTMENTS[0].employees[0].lastName}`;
/**
 * Test employees transferred to the left.
 */
export const TEST_EMPLOYEES_TRANSFERRED: Employee[] = [
  TEST_DEPARTMENTS[0].employees[0], TEST_DEPARTMENTS[1].employees[0],
];
/**
 * Test repository type.
 */
export const TEST_REPOSITORY_TYPE = RepositoryType.PostgreSQL;
