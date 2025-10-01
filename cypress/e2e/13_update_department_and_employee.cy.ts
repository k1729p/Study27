import {
  REPOSITORY_TYPES,
  DEPARTMENT_READ_NAME,
  DEPARTMENT_UPDATED_NAME,
  EMPLOYEE_READ_LAST_NAME,
  EMPLOYEE_UPDATED_FIRST_NAME,
  EMPLOYEE_UPDATED_LAST_NAME,
  DEPARTMENTS_NUMBER,
  EMPLOYEES_NUMBER,
} from './test_constants';
/**
 * Cypress End-to-End Tests for Study27.
 */
describe('Update department and employee', () => {
  REPOSITORY_TYPES.forEach(repository_type => {
    it(`should update department and employee using ${repository_type.name} repository`, () => {
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
      cy.screenshot(`${repository_type.name}/1_list_departments_before_update`);
      cy.get('table').within(() => {
        cy.get('tr').contains(DEPARTMENT_READ_NAME).parent().within(() => {
          cy.contains('Update').click();
        });
      });
      /*
       * Page "Update Department"
       * It should update department.
       */
      cy.contains('Update Department').should('be.visible');
      cy.get('input[formcontrolname="name"]').clear().type(DEPARTMENT_UPDATED_NAME);
      cy.screenshot(`${repository_type.name}/2_update_department`);
      cy.get('button').contains('Update').click();
      /*
       * Page "Manage Departments"
       */
      cy.contains(repository_type.name).should('be.visible');
      cy.contains('Departments').should('be.visible');
      cy.get('table').within(() => {
        cy.get('tr').contains(DEPARTMENT_UPDATED_NAME).should('be.visible');
      });
      cy.screenshot(`${repository_type.name}/3_list_departments_after_update`);
      cy.get('table').within(() => {
        cy.get('tr').contains(DEPARTMENT_UPDATED_NAME).parent().contains('Manage Employees').click();
      });
      /*
       * Page "Manage Employees"
       */
      cy.contains(repository_type.name).should('be.visible');
      cy.contains('Departments').should('be.visible');
      cy.contains(DEPARTMENT_UPDATED_NAME).should('be.visible');
      cy.get('table tbody tr').should('have.length', EMPLOYEES_NUMBER);
      cy.screenshot(`${repository_type.name}/4_list_employees_before_update`);
      cy.get('table').within(() => {
        cy.get('tr').contains(EMPLOYEE_READ_LAST_NAME).parent().contains('Update').click();
      });
      /*
       * Page "Update Employee"
       * It should update employee.
       */
      cy.get('input[formcontrolname="firstName"]').clear().type(EMPLOYEE_UPDATED_FIRST_NAME);
      cy.get('input[formcontrolname="lastName"]').clear().type(EMPLOYEE_UPDATED_LAST_NAME);
      cy.screenshot(`${repository_type.name}/5_update_employee`);
      cy.get('button').contains('Update').click();
      /*
       * Page "Manage Employees"
       */
      cy.contains(repository_type.name).should('be.visible');
      cy.contains('Departments').should('be.visible');
      cy.contains(DEPARTMENT_UPDATED_NAME).should('be.visible');
      cy.contains('Employees').should('be.visible');
      cy.get('table').within(() => {
        cy.get('tr').contains(EMPLOYEE_UPDATED_FIRST_NAME).should('be.visible');
        cy.get('tr').contains(EMPLOYEE_UPDATED_LAST_NAME).should('be.visible');
      });
      cy.screenshot(`${repository_type.name}/6_list_employees_after_update`);

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