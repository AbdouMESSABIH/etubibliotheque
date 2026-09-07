describe('Register E2E', () => {

  beforeEach(() => {
    cy.visit('/register');
  });

  it('should register a user successfully', () => {
    // GIVEN
    cy.intercept('POST', '/api/register', {
      statusCode: 201,
      body: {}
    }).as('registerRequest');

    // WHEN
    cy.get('input[formcontrolname="firstName"]')
      .type('Jean');

    cy.get('input[formcontrolname="lastName"]')
      .type('Dupont');

    cy.get('input[formcontrolname="login"]')
      .type('jean');

    cy.get('input[formcontrolname="password"]')
      .type('password');

    cy.on('window:alert', (message) => {
      expect(message).to.equal('SUCCESS!! :-)');
    });

    cy.contains('button', 'Register')
      .click();

    // THEN
    cy.wait('@registerRequest')
      .its('request.body')
      .should('deep.equal', {
        firstName: 'Jean',
        lastName: 'Dupont',
        login: 'jean',
        password: 'password'
      });
  });

  it('should display validation errors when form is empty', () => {
    // WHEN
    cy.contains('button', 'Register')
      .click();

    // THEN
    cy.contains('First Name is required')
      .should('be.visible');

    cy.contains('Last Name is required')
      .should('be.visible');

    cy.contains('Login is required')
      .should('be.visible');

    cy.contains('password is required')
      .should('be.visible');
  });

});