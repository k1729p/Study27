import { REPOSITORY_TYPES } from './constants';
import {
  DEPARTMENT_CREATED_NAME,
  EMPLOYEE_CREATED_FIRST_NAME,
  EMPLOYEE_CREATED_LAST_NAME,
  EMPLOYEE_CREATED_PHONE,
  EMPLOYEE_CREATED_MAIL,
} from './constants';

/**
 * Cypress End-to-End Tests for Study27.
 */
describe('Create department and employee', () => {
  REPOSITORY_TYPES.forEach(repository_type => {
    it(`should create department and employee using ${repository_type.name} repository`, () => {
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
      cy.contains('Create Department').click();
      /*
       * Page "Create Department"
       * It should create new department.
       */
      cy.contains('Create Department').should('be.visible');
      cy.get('input[formcontrolname="name"]').clear().type(DEPARTMENT_CREATED_NAME);
      cy.get('button').contains('Create').click();
      /*
       * Page "Manage Departments"
       */
      cy.contains(repository_type.name).should('be.visible');
      cy.contains('Departments').should('be.visible');
      cy.get('table').within(() => {
        cy.get('tr').contains(DEPARTMENT_CREATED_NAME).parent().contains('Manage Employees').click();
      });
      /*
       * Page "Manage Employees"
       */
      cy.contains(repository_type.name).should('be.visible');
      cy.contains('Departments').should('be.visible');
      cy.contains(DEPARTMENT_CREATED_NAME).should('be.visible');
      cy.get('button').contains('Create').click();
      /*
       * Page "Create Employee"
       * It should create new employee.
       */
      cy.get('input[formcontrolname="firstName"]').clear().type(EMPLOYEE_CREATED_FIRST_NAME);
      cy.get('input[formcontrolname="lastName"]').clear().type(EMPLOYEE_CREATED_LAST_NAME);
      cy.get('input[formcontrolname="phone"]').clear().type(EMPLOYEE_CREATED_PHONE);
      cy.get('input[formcontrolname="mail"]').clear().type(EMPLOYEE_CREATED_MAIL);
      cy.get('button').contains('Create').click();
      /*
       * Page "Manage Employees"
       */
      cy.contains(repository_type.name).should('be.visible');
      cy.contains('Departments').should('be.visible');
      cy.contains(DEPARTMENT_CREATED_NAME).should('be.visible');
      cy.contains('Employees').should('be.visible');
      cy.get('table').within(() => {
        cy.get('tr').contains(EMPLOYEE_CREATED_FIRST_NAME).should('be.visible');
        cy.get('tr').contains(EMPLOYEE_CREATED_LAST_NAME).should('be.visible');
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
  })
});