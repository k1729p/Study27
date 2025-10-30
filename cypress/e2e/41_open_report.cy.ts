import {
  REPOSITORY_TYPES,
} from './test_constants';

/**
 * Cypress End-to-End Tests for Study27.
 */
describe('Create PDF Reports', () => {
  REPOSITORY_TYPES.forEach(repository_type => {
    it(`should create PDF report using ${repository_type.name} repository`, () => {
      /*
       * Page "Home"
       */
      cy.visit('/');
      cy.contains('Home').should('be.visible');
      cy.contains(repository_type.label).click();
      cy.contains('Initialise Selected Repository').click();
      cy.get('button').contains('Menu').click();
      cy.get('button').contains('⏵⏵⏵').click();
      cy.get('button').contains('Create PDF Reports').click();
      /*
       * Page "Reports"
       */
      cy.contains(repository_type.name).should('be.visible');
      cy.contains('Reports').should('be.visible');
      cy.contains('Departments and Employees').should('be.visible');
      cy.contains('QR Code and Images').should('be.visible');
      cy.window().then((win) => {
        cy.stub(win, 'open').as('windowOpen');
      });
      cy.get('button').contains('Open PDF').click();
      cy.wait(500);// wait for PDF generation
      cy.get('@windowOpen').should('have.been.called');
      cy.get('button').contains('Print PDF').should('be.visible');
      cy.get('button').contains('Download PDF').should('be.visible');
      cy.screenshot(`${repository_type.name}/1_pdf_reports`);
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
      cy.screenshot(`${repository_type.name}/2_home`);
    });
  });
});