import { Department } from '../models/department';
import { Employee } from '../models/employee';
import { Title } from '../models/title';

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
    startDate: TEST_DAYS[2],
    endDate: TEST_DAYS[3],
    notes: 'Main product:\n - money transfer',
    keywords: [SUGGESTION_KEYWORDS[0]],
  },
];
/**
 * Test department id.
 */
export const TEST_DEPARTMENT_ID = 1;
/**
 * Test employee id.
 */
export const TEST_EMPLOYEE_ID = 1;
/**
 * Test employee data for the application.
 * This data is used to simulate employee records for testing purposes.
 */
export const TEST_EMPLOYEES: Employee[] = [
  {
    id: 1,
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
  },
];
