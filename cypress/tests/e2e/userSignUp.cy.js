const { faker } = require('@faker-js/faker');

describe('User Sign Up Tests - Serverest', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid="cadastrar"]').should('be.visible').click();
    cy.intercept({
      method: 'GET',
      path: `/usuarios`
    }).as('getUsuarios')
  });

  context('Successful Registrations', () => {
    it('Should register a new user with valid data', () => {
      const name = faker.name.fullName();
      const email = faker.internet.email();
      const password = faker.internet.password(8);

      cy.fillRegisterUserFields(name, email, password);

      cy.get('[data-testid="cadastrar"]').should('be.visible').click();
      cy.contains('Cadastro realizado com sucesso').should('be.visible');
      cy.wait('@getUsuarios')
      cy.contains('Serverest Store').should('be.visible');
    });

    it('Should register a new administrador user with valid data', () => {
      const name = faker.name.fullName();
      const email = faker.internet.email();
      const password = faker.internet.password(8);

      cy.fillRegisterUserFields(name, email, password, true);

      cy.get('[data-testid="cadastrar"]').should('be.visible').click();
      cy.contains('Cadastro realizado com sucesso').should('be.visible');
      cy.wait('@getUsuarios')
      cy.contains(`Bem Vindo ${name}`).should('be.visible');
    });
  });

  context('Validation Errors', () => {
    it('Should display an error when trying to register with an existing email', () => {
      const email = Cypress.env("userEmail");
      const name = faker.name.fullName();
      const password = faker.internet.password(8);

      cy.fillRegisterUserFields(name, email, password);

      cy.get('[data-testid="cadastrar"]').should('be.visible').click();
      cy.contains('Este email já está sendo usado').should('be.visible');
    });

    it('Should display errors when required fields are empty', () => {
      cy.get('[data-testid="cadastrar"]').click();

      cy.contains('Nome é obrigatório').should('be.visible');
      cy.contains('Email é obrigatório').should('be.visible');
      cy.contains('Password é obrigatório').should('be.visible');
    });
  });
});
