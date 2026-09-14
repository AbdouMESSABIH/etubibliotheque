describe('Login E2E', () => {

  beforeEach(() => {
    cy.visit('/login');

    cy.window().then((window) => {
      window.localStorage.clear();
    });
  });

  it('should login successfully, store the JWT token and redirect to students', () => {
    // GIVEN
    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: 'JWT_TOKEN',
      headers: {
        'content-type': 'text/plain'
      }
    }).as('loginRequest');

    cy.intercept('GET', '/api/students', {
      statusCode: 200,
      body: []
    }).as('studentsRequest');

    // WHEN
    cy.get('input[formcontrolname="login"]')
      .type('jean');

    cy.get('input[formcontrolname="password"]')
      .type('password');

    cy.contains('button', /login/i)
      .click();

    // THEN
    cy.wait('@loginRequest')
      .its('request.body')
      .should('deep.equal', {
        login: 'jean',
        password: 'password'
      });

    cy.window().then((window) => {
      expect(
        window.localStorage.getItem('token')
      ).to.equal('JWT_TOKEN');
    });

    cy.url()
      .should('include', '/students');

    cy.wait('@studentsRequest');
  });

  it('should display an error when credentials are incorrect', () => {
    // GIVEN
    cy.intercept('POST', '/api/login', {
      statusCode: 401,
      body: {}
    }).as('loginRequest');

    // WHEN
    cy.get('input[formcontrolname="login"]')
      .type('jean');

    cy.get('input[formcontrolname="password"]')
      .type('wrong-password');

    cy.contains('button', /login/i)
      .click();

    // THEN
    cy.wait('@loginRequest');

    cy.contains('Login ou mot de passe incorrect')
      .should('be.visible');

    cy.window().then((window) => {
      expect(
        window.localStorage.getItem('token')
      ).to.be.null;
    });

    cy.url()
      .should('include', '/login');
  });

});