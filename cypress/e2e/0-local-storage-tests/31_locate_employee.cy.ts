import {
  REPOSITORY_TYPES,
  DEPARTMENT_READ_NAME,
  LOCATE_EMPLOYEE_TITLES,
  LOCATE_EMPLOYEE_FULL_NAME,
  LOCATE_EMPLOYEE_PHONE,
  LOCATE_EMPLOYEE_MAIL,
} from './constants';

/**
 * Cypress End-to-End Tests for Study27.
 */
describe('Locate employee', () => {
  REPOSITORY_TYPES.forEach(repository_type => {
    it(`should locate employee using ${repository_type.name} repository`, () => {
      /*
       * Page "Home"
       */
      cy.visit('/');
      cy.contains('Home').should('be.visible');
      cy.contains(repository_type.label).click();
      cy.contains('Initialise Selected Repository').click();
      cy.get('button').contains('Menu').click();
      cy.get('button').contains('⏵⏵⏵').click();
      cy.get('button').contains('Locate Employees').click();
      /*
       * Page "Employees Location"
       */
      cy.contains(repository_type.name).should('be.visible');
      cy.contains('Employees Location').should('be.visible');

      // locate employee
      cy.get('input[aria-label="Name"]').type('oe');
      cy.get('mat-option').first().should('contain.text', 'John Doe');
      cy.get('mat-option').first().click();
      cy.get('button').contains('Locate Employee').click();

      cy.get('.tree-scroll-container').within(() => {
        cy.contains(DEPARTMENT_READ_NAME).should('be.visible');
        cy.contains(LOCATE_EMPLOYEE_TITLES[0]).should('be.visible');
        cy.contains(LOCATE_EMPLOYEE_FULL_NAME).should('be.visible');
        cy.contains(LOCATE_EMPLOYEE_PHONE).should('be.visible');
        cy.contains(LOCATE_EMPLOYEE_MAIL).should('be.visible');
      });

      // collapse all and expand all
      cy.get('button').contains('Collapse all').click();
      cy.get('.tree-scroll-container').within(() => {
        cy.contains(DEPARTMENT_READ_NAME).should('be.visible');
        cy.contains(LOCATE_EMPLOYEE_TITLES[0]).should('not.exist');
        cy.contains(LOCATE_EMPLOYEE_TITLES[1]).should('not.exist');
        cy.contains(LOCATE_EMPLOYEE_TITLES[2]).should('not.exist');
      });
      cy.get('button').contains('Expand all').click();
      cy.get('.tree-scroll-container').within(() => {
        cy.contains(DEPARTMENT_READ_NAME).should('be.visible');
        cy.contains(LOCATE_EMPLOYEE_TITLES[0]).should('be.visible');
        cy.contains(LOCATE_EMPLOYEE_FULL_NAME).should('be.visible');
      });
    });
  });
});