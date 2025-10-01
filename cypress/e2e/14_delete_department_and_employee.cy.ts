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
      cy.get('button').contains('Menu').click();
      cy.get('button').contains('⏵⏵⏵').click();
      cy.get('button').contains('Manage Departments').click();
      /*
       * Page "Manage Departments"
       */
      cy.contains(repository_type.name).should('be.visible');
      cy.contains('Departments').should('be.visible');
      cy.get('table tbody tr').should('have.length', DEPARTMENTS_NUMBER);
      cy.screenshot(`${repository_type.name}/1_list_departments_before_delete`);
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
      cy.get('table tbody tr').should('have.length', EMPLOYEES_NUMBER);
      cy.screenshot(`${repository_type.name}/2_list_employees_before_delete`);
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
      cy.screenshot(`${repository_type.name}/3_delete_employee`);
      cy.get('button').contains('Delete').click();
      /*
       * Page "Manage Employees"
       */
      cy.contains(repository_type.name).should('be.visible');
      cy.contains('Employees').should('be.visible');
      cy.get('table tbody tr').should('have.length', EMPLOYEES_NUMBER - 1);
      cy.get('table').within(() => {
        cy.get('tr').each(($tr) => {
          const text = $tr.text();
          expect(text.includes(EMPLOYEE_READ_FIRST_NAME) && text.includes(EMPLOYEE_READ_LAST_NAME)).to.be.false;
        });
      });
      cy.screenshot(`${repository_type.name}/4_list_employees_after_delete`);
      cy.contains('Departments').click();
      /*
       * Page "Delete Department"
       * It should delete department.
       */
      cy.get('tr').contains(DEPARTMENT_READ_NAME).parent().contains('Delete').click();
      /*
       * Page "Manage Departments"
       */
      cy.get('input[formcontrolname="name"]').should('be.visible')
        .and('have.value', DEPARTMENT_READ_NAME);
      cy.screenshot(`${repository_type.name}/5_delete_department`);        
      cy.get('button').contains('Delete').click();
      /*
       * Page "Manage Departments"
       */
      cy.contains(repository_type.name).should('be.visible');
      cy.contains('Departments').should('be.visible');
      cy.get('table tbody tr').should('have.length', DEPARTMENTS_NUMBER - 1);
      cy.get('table').within(() => {
        cy.get('tr').contains(DEPARTMENT_READ_NAME).should('not.exist');
      });
      cy.screenshot(`${repository_type.name}/6_list_departments_after_delete`);        
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
  });
});