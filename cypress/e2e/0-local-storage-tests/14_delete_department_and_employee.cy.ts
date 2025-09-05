import { REPOSITORY_TYPES } from './constants';
import {
  DEPARTMENT_READ_NAME,
  EMPLOYEE_READ_FIRST_NAME,
  EMPLOYEE_READ_LAST_NAME,
} from './constants';
/**
 * Cypress End-to-End Tests for Study27.
 */
describe('Delete department and employee', () => {
  REPOSITORY_TYPES.forEach(repository_type => {
    it(`should delete department and employee using ${repository_type.name} repository`, () => {
      /*
       * Page "Home"
       */
      cy.visit('/');
      cy.contains('Home').should('be.visible');
      cy.contains(repository_type.label).click();
      cy.contains('Initialise Selected Repository').click();
      cy.visit('/');
      cy.get('button').contains('Menu').click();
      cy.get('button').contains('⏵⏵⏵').click();
      cy.get('button').contains('Manage Departments').click();
      /*
       * Page "Manage Departments"
       */
      cy.contains(repository_type.name).should('be.visible');
      cy.contains('Departments').should('be.visible');
      cy.get('table').within(() => {
        cy.get('tr').contains(DEPARTMENT_READ_NAME).parent().contains('Manage Employees').click();
      });
      /*
       * Page "Manage Employees"
       */
      cy.contains(repository_type.name).should('be.visible');
      cy.contains('Departments').should('be.visible');
      cy.contains(DEPARTMENT_READ_NAME).should('be.visible');
      cy.contains('Employees').should('be.visible');
      cy.get('table').within(() => {
        cy.get('tr').each(($tr) => {
          const firstNameMatch = $tr.text().includes(EMPLOYEE_READ_FIRST_NAME);
          const lastNameMatch = $tr.text().includes(EMPLOYEE_READ_LAST_NAME);
          if (firstNameMatch && lastNameMatch) {
            cy.wrap($tr).contains('Delete').click();
          }
        });
      });
      /*
       * Page "Delete Employee"
       * It should delete employee.
       */
      cy.get('input[formcontrolname="firstName"]').should('be.visible')
        .and('have.value', EMPLOYEE_READ_FIRST_NAME);
      cy.get('input[formcontrolname="lastName"]').should('be.visible')
        .and('have.value', EMPLOYEE_READ_LAST_NAME);
      cy.get('button').contains('Delete').click();
      /*
       * Page "Manage Departments"
       */
      cy.contains(repository_type.name).should('be.visible');
      cy.contains('Departments').should('be.visible');
      cy.get('table').within(() => {
        cy.get('tr').each(($tr) => {
          const text = $tr.text();
          expect(text.includes(EMPLOYEE_READ_FIRST_NAME) && text.includes(EMPLOYEE_READ_LAST_NAME)).to.be.false;
        });
      });
      cy.contains('Departments').click();
      /*
       * Page "Delete Department"
       * It should delete department.
       */
      cy.get('tr').contains(DEPARTMENT_READ_NAME).parent().contains('Delete').click();
      cy.get('input[formcontrolname="name"]').should('be.visible')
        .and('have.value', DEPARTMENT_READ_NAME);
      cy.get('button').contains('Delete').click();
      /*
       * Page "Manage Departments"
       */
      cy.contains(repository_type.name).should('be.visible');
      cy.contains('Departments').should('be.visible');
      cy.get('table').within(() => {
        cy.get('tr').contains(DEPARTMENT_READ_NAME).should('not.exist');
      });
      /*
       * Page "Home".
       * It should navigate back to Home and verify radio selection.
       */
      cy.get('button').contains('Menu').click();
      cy.get('button').contains('Home').click();
      cy.contains('Home').should('be.visible');
      cy.get(`input[type="radio"][value="${repository_type.name}"]`).should('be.checked');
    });
  });
});