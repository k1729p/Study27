import {
  REPOSITORY_TYPES,
  DEPARTMENT_CREATED_NAME,
  EMPLOYEE_CREATED_FIRST_NAME,
  EMPLOYEE_CREATED_LAST_NAME,
  EMPLOYEE_CREATED_PHONE,
  EMPLOYEE_CREATED_MAIL,
  DEPARTMENTS_NUMBER,
} from './test_constants';

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
      cy.get('button').contains('Menu').click();
      cy.get('button').contains('⏵⏵⏵').click();
      cy.get('button').contains('Manage Departments').click();
      /*
       * Page "Manage Departments"
       */
      cy.contains(repository_type.name).should('be.visible');
      cy.contains('Departments').should('be.visible');
      cy.get('table tbody tr').should('have.length', DEPARTMENTS_NUMBER);
      cy.screenshot(`${repository_type.name}/1_list_departments_before_create`);
      cy.contains('Create Department').click();
      /*
       * Page "Create Department"
       * It should create new department.
       */
      cy.contains('Create Department').should('be.visible');
      cy.get('input[formcontrolname="name"]').clear().type(DEPARTMENT_CREATED_NAME);
      cy.screenshot(`${repository_type.name}/2_create_department`);
      cy.get('button').contains('Create').click();
      /*
       * Page "Manage Departments"
       */
      cy.contains(repository_type.name).should('be.visible');
      cy.contains('Departments').should('be.visible');
      cy.screenshot(`${repository_type.name}/3_list_departments_after_create`);
      cy.get('table').within(() => {
        cy.get('tr').contains(DEPARTMENT_CREATED_NAME).parent().contains('Manage Employees').click();
      });
      /*
       * Page "Manage Employees"
       */
      cy.contains(repository_type.name).should('be.visible');
      cy.contains('Departments').should('be.visible');
      cy.contains(DEPARTMENT_CREATED_NAME).should('be.visible');
      cy.screenshot(`${repository_type.name}/4_list_employees_before_create`);
      cy.get('button').contains('Create').click();
      /*
       * Page "Create Employee"
       * It should create new employee.
       */
      cy.get('input[formcontrolname="firstName"]').clear().type(EMPLOYEE_CREATED_FIRST_NAME);
      cy.get('input[formcontrolname="lastName"]').clear().type(EMPLOYEE_CREATED_LAST_NAME);
      cy.get('input[formcontrolname="phone"]').clear().type(EMPLOYEE_CREATED_PHONE);
      cy.get('input[formcontrolname="mail"]').clear().type(EMPLOYEE_CREATED_MAIL);
      cy.screenshot(`${repository_type.name}/5_create_employee`);
      cy.get('button').contains('Create').click();
      /*
       * Page "Manage Employees"
       */
      cy.contains(repository_type.name).should('be.visible');
      cy.contains('Departments').should('be.visible');
      cy.contains(DEPARTMENT_CREATED_NAME).should('be.visible');
      cy.get('table tbody tr').should('have.length', 1);
      cy.contains('Employees').should('be.visible');
      cy.get('table').within(() => {
        cy.get('tr').contains(EMPLOYEE_CREATED_FIRST_NAME).should('be.visible');
        cy.get('tr').contains(EMPLOYEE_CREATED_LAST_NAME).should('be.visible');
      });
      cy.screenshot(`${repository_type.name}/6_list_employees_after_create`);
      /*
       * Page "Home".
       * It should navigate back to Home and verify radio selection.
       */
      cy.get('button').contains('Menu').click();
      cy.get('button').contains('Home').click();
      cy.contains('Home').should('be.visible');
      cy.get(`input[type="radio"][value="${repository_type.name}"]`).should('be.checked');
      // reset test data in database
      cy.contains('Initialise Selected Repository').click();
      cy.screenshot(`${repository_type.name}/7_home`);
    });
  })
});