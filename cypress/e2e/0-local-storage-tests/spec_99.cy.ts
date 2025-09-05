describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
    cy.get('.navbar-nav').contains('Commands').click()
    cy.get('.dropdown-menu').contains('Navigation').click()
    cy.location('pathname').should('include', 'navigation')
  })
})