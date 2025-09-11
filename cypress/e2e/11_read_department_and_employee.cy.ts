import {
  REPOSITORY_TYPES,
  DEPARTMENT_READ_NAME,
  EMPLOYEE_READ_FIRST_NAME,
  EMPLOYEE_READ_LAST_NAME,
  DEPARTMENTS_NUMBER,
  EMPLOYEES_NUMBER,
} from './test_constants';

/**
 * Cypress End-to-End Tests for Study27.
 */
describe('Read department and employee', () => {
  REPOSITORY_TYPES.forEach(repository_type => {
    it(`should read department and employee using ${repository_type.name} repository`, () => {
      /*
       * Page "Home"
       */
      cy.visit('/');
      cy.contains('Home').should('be.visible');
      cy.contains(repository_type.label).click();
      cy.contains('Initialise Selected Repository').click();
      cy.get('button').contains('Menu').click();
      cy.get('button').contains('⏵⏵⏵').click();
      cy.get('button').contains('Manage Departments').click();
      /*
       * Page "Manage Departments"
       * It should read department name.
       */
      cy.contains(repository_type.name).should('be.visible');
      cy.contains('Departments').should('be.visible');
      cy.get('table tbody tr').should('have.length', DEPARTMENTS_NUMBER);
      cy.screenshot(`${repository_type.name}/1_list_departments`);
      cy.get('table').within(() => {
        cy.get('tr').contains(DEPARTMENT_READ_NAME).parent().contains('Manage Employees').click();
      });
      /*
       * Page "Manage Employees"
       * It should read employee first name  and last name.
       */
      cy.contains(repository_type.name).should('be.visible');
      cy.contains('Departments').should('be.visible');
      cy.contains(DEPARTMENT_READ_NAME).should('be.visible');
      cy.contains('Employees').should('be.visible');
      cy.get('table tbody tr').should('have.length', EMPLOYEES_NUMBER);
      cy.get('table').within(() => {
        cy.get('tr').contains(EMPLOYEE_READ_FIRST_NAME).should('be.visible');
        cy.get('tr').contains(EMPLOYEE_READ_LAST_NAME).should('be.visible');
      });
      cy.screenshot(`${repository_type.name}/2_list_employees`);
      /*
       * Page "Home".
       * It should navigate back to Home and verify radio selection.
       */
      cy.get('button').contains('Menu').click();
      cy.get('button').contains('Home').click();
      cy.contains('Home').should('be.visible');
      cy.get(`input[type="radio"][value="${repository_type.name}"]`).should('be.checked');
      cy.screenshot(`${repository_type.name}/3_home`);
    });
  })
});