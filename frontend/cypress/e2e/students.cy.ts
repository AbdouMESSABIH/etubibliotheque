describe('Students E2E', () => {

  const student = {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont'
  };

  const visitWithToken = (url: string) => {
    cy.visit(url, {
      onBeforeLoad(window) {
        window.localStorage.setItem('token', 'JWT_TOKEN');
      }
    });
  };

  it('should display the students list', () => {
    // GIVEN
    cy.intercept('GET', '/api/students', {
      statusCode: 200,
      body: [
        student,
        {
          id: 2,
          firstName: 'Marie',
          lastName: 'Martin'
        }
      ]
    }).as('getStudents');

    // WHEN
    visitWithToken('/students');

    // THEN
    cy.wait('@getStudents');

    cy.contains('Jean Dupont')
      .should('be.visible');

    cy.contains('Marie Martin')
      .should('be.visible');

    cy.contains('Ajouter un étudiant')
      .should('be.visible');
  });


  it('should create a student', () => {
    // GIVEN
    cy.intercept('POST', '/api/students', {
      statusCode: 201,
      body: student
    }).as('createStudent');

    cy.intercept('GET', '/api/students', {
      statusCode: 200,
      body: [student]
    }).as('getStudents');

    visitWithToken('/students/new');

    // WHEN
    cy.get('#firstName')
      .type('Jean');

    cy.get('#lastName')
      .type('Dupont');

    cy.contains('button', 'Ajouter')
      .click();

    // THEN
    cy.wait('@createStudent')
      .its('request.body')
      .should('deep.equal', {
        firstName: 'Jean',
        lastName: 'Dupont'
      });

    cy.url()
      .should('include', '/students');

    cy.wait('@getStudents');

    cy.contains('Jean Dupont')
      .should('be.visible');
  });


  it('should update a student', () => {
    // GIVEN
    cy.intercept('GET', '/api/students/1', {
      statusCode: 200,
      body: student
    }).as('getStudent');

    cy.intercept('PUT', '/api/students/1', {
      statusCode: 200,
      body: {
        id: 1,
        firstName: 'Jean',
        lastName: 'Durand'
      }
    }).as('updateStudent');

    visitWithToken('/students/1/edit');

    cy.wait('@getStudent');

    // WHEN
    cy.get('#lastName')
      .clear()
      .type('Durand');

    cy.contains('button', 'Enregistrer')
      .click();

    // THEN
    cy.wait('@updateStudent')
      .its('request.body')
      .should('deep.equal', {
        firstName: 'Jean',
        lastName: 'Durand'
      });

    cy.url()
      .should('include', '/students/1');
  });


  it('should delete a student', () => {
    // GIVEN
    cy.intercept('GET', '/api/students/1', {
      statusCode: 200,
      body: student
    }).as('getStudent');

    cy.intercept('DELETE', '/api/students/1', {
      statusCode: 204
    }).as('deleteStudent');

    cy.intercept('GET', '/api/students', {
      statusCode: 200,
      body: []
    }).as('getStudents');

    visitWithToken('/students/1');

    cy.wait('@getStudent');

    cy.on('window:confirm', (message) => {
      expect(message)
        .to.equal('Voulez-vous vraiment supprimer cet étudiant ?');

      return true;
    });

    // WHEN
    cy.contains('button', 'Supprimer')
      .click();

    // THEN
    cy.wait('@deleteStudent');

    cy.url()
      .should('include', '/students');

    cy.wait('@getStudents');

    cy.contains('Aucun étudiant.')
      .should('be.visible');
  });

});