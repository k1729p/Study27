import { 
  DEPARTMENT_READ_NAME,
  DEPARTMENT_CREATED_NAME,
  DEPARTMENT_UPDATED_NAME,
  EMPLOYEE_READ_FIRST_NAME,
  EMPLOYEE_READ_LAST_NAME,
  EMPLOYEE_CREATED_FIRST_NAME,
  EMPLOYEE_CREATED_LAST_NAME,
  EMPLOYEE_UPDATED_FIRST_NAME,
  EMPLOYEE_UPDATED_LAST_NAME,
 } from './constants';


describe('Study27 End-to-End Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display Home page and initialise local storage repository', () => {
    cy.contains('Home').should('be.visible');
    cy.contains('Only local web storage').click();
    cy.contains('Initialise Selected Repository').click();
    cy.contains('Home').should('be.visible');
  });

  it('should navigate to Manage Departments from menu', () => {
    cy.get('button').contains('Menu').click();
    cy.get('button').contains('⏵⏵⏵').click();
    cy.get('button').contains('Manage Departments').click();
    cy.contains('Departments').should('be.visible');
//  });
//  it('should update department name for department with id 1', () => {
    cy.contains('Departments').should('be.visible');
    cy.get('table').within(() => {
      cy.get('tr').contains(DEPARTMENT_READ_NAME).parent().within(() => {
        cy.contains('Update').click();
      });
    });
    cy.contains('Update Department').should('be.visible');
    cy.get('input[formcontrolname="name"]').clear().type(DEPARTMENT_UPDATED_NAME);
    cy.get('button').contains('Update').click();
    cy.contains('Departments').should('be.visible');
    cy.get('table').within(() => {
      cy.get('tr').contains(DEPARTMENT_UPDATED_NAME).should('be.visible');
    });
//  });
//  it('should update employee last name and delete employee with id 2', () => {
    // Manage Employees for department id 1
    cy.get('table').within(() => {
      cy.get('tr').contains(DEPARTMENT_UPDATED_NAME).parent().contains('Manage Employees').click();
    });
    cy.contains(DEPARTMENT_UPDATED_NAME).should('be.visible');
    // Update employee with id 1
    cy.get('table').within(() => {
      cy.get('tr').contains(EMPLOYEE_READ_LAST_NAME).parent().contains('Update').click();
    });
    cy.get('input[formcontrolname="lastName"]').clear().type(EMPLOYEE_UPDATED_LAST_NAME);
    cy.get('button').contains('Update').click();
    cy.contains(DEPARTMENT_UPDATED_NAME).should('be.visible');
    cy.get('table').within(() => {
      cy.get('tr').contains('Doe UPDATED').should('be.visible');
    });
    // Delete employee with id 2
    cy.get('table').within(() => {
      cy.get('tr').contains('Boe').parent().contains('Delete').click();
    });
    cy.contains('Delete Employee').should('be.visible');
    cy.get('button').contains('Delete').click();
    cy.contains(DEPARTMENT_UPDATED_NAME).should('be.visible');
    cy.get('table').within(() => {
      cy.get('tr').contains('Boe').should('not.exist');
    });
//  });
//  it('should delete department with id 2 and verify absence', () => {
    cy.get('button').contains('Departments').click();
    cy.contains('Departments').should('be.visible');
    // Delete department with id 2
    cy.get('table').within(() => {
      cy.get('tr').contains('2nd Front Office').parent().contains('Delete').click();
    });
    cy.contains('Delete Department').should('be.visible');
    cy.get('button').contains('Delete').click();
    cy.contains('Departments').should('be.visible');
    cy.get('table').within(() => {
      cy.get('tr').contains('2nd Front Office').should('not.exist');
    });
//  });
//  it('should navigate back to Home and verify radio selection', () => {
    cy.get('button').contains('Menu').click();
    cy.get('button').contains('Home').click();
    cy.contains('Home').should('be.visible');
    cy.get('input[type="radio"][value="WebStorage"]').should('be.checked');
  });
});