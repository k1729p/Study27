import {
  REPOSITORY_TYPES,
  SOURCE_DEPARTMENT_NAME,
  TARGET_DEPARTMENT_NAME,
  EMPLOYEE_READ_FIRST_NAME,
  EMPLOYEE_READ_LAST_NAME,
  EMPLOYEES_NUMBER,
} from './constants';

/**
 * Cypress End-to-End Tests for Study27.
 */
describe('Read department and employee', () => {
  REPOSITORY_TYPES.forEach(repository_type => {
    it(`should transfer employees using ${repository_type.name} repository`, () => {
      /*
       * Page "Home"
       */
      cy.visit('/');
      cy.contains('Home').should('be.visible');
      cy.contains(repository_type.label).click();
      cy.contains('Initialise Selected Repository').click();
      cy.get('button').contains('Menu').click();
      cy.get('button').contains('⏵⏵⏵').click();
      cy.get('button').contains('Transfer Employees').click();
      /*
       * Page "Transfer Employees"
       */
      cy.contains(repository_type.name).should('be.visible');
      cy.contains('Transfer Selected Employees').should('be.visible');
      cy.log(cy.get('form').eq(0));
      cy.get('form').eq(0).find('.mat-mdc-select-value-text .mat-mdc-select-min-line')
        .should('contain', SOURCE_DEPARTMENT_NAME);
      cy.get('form').eq(1).find('.mat-mdc-select-value-text .mat-mdc-select-min-line')
        .should('contain', TARGET_DEPARTMENT_NAME);
      cy.get('.employee-table').eq(0).find('tbody tr').should('have.length', EMPLOYEES_NUMBER);
      cy.get('.employee-table').eq(1).find('tbody tr').should('have.length', EMPLOYEES_NUMBER);
      cy.get('.employee-table').eq(0).find('tbody tr').filter((_, el) => {
        return el.innerText.includes(EMPLOYEE_READ_FIRST_NAME) && el.innerText.includes(EMPLOYEE_READ_LAST_NAME);
      }).should('have.length.at.least', 1);
      /*
       * Could not test the transfer because in Cypress browser the checkboxes are not visible!
       */
    });
  });
});