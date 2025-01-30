const { faker } = require('@faker-js/faker');

function fillLoginFields(email, password) {
    cy.get('[data-testid="email"]').should('be.visible').type(email);
    cy.get('[data-testid="senha"]').should('be.visible').type(password);
    cy.get('[data-testid="entrar"]').should('be.visible').click();
}

describe('Login Tests - Serverest', () => {
    let user, admin;

    before(() => {
        user = {
            nome: Cypress.env("userName"),
            email: Cypress.env("userEmail"),
            password: Cypress.env("userPassword"),
            administrador: 'false'
        }
        cy.api_createUser(user)
        admin = {
            nome: Cypress.env("adminName"),
            email: Cypress.env("adminEmail"),
            password: Cypress.env("adminPassword"),
            administrador: 'true'
        }
        cy.api_createUser(admin)
    })

    beforeEach(() => {
        cy.visit('/');
        cy.intercept({
            method: 'GET',
            path: `/usuarios`
        }).as('getUsuarios')
    });

    context('Successful Login', () => {
        it('Should log in successfully with valid user credentials and after logout', () => {
            fillLoginFields(user.email, user.password);
            cy.wait('@getUsuarios')
            cy.url().should('include', '/home');
            cy.contains('Serverest Store').should('be.visible');
            cy.get('[data-testid="logout"]').should('be.visible').click();
            cy.url().should('include', '/login');
        });

        it('Should log in successfully with valid admin credentials and after logout', () => {
            fillLoginFields(admin.email, admin.password);
            cy.wait('@getUsuarios')
            cy.url().should('include', '/home');
            cy.contains(`Bem Vindo ${admin.nome}`).should('be.visible');
            cy.get('[data-testid="logout"]').should('be.visible').click();
            cy.url().should('include', '/login');
        });
    });

    context('Validation Errors', () => {
        it('Should display error for incorrect password', () => {
            const invalidPassword = faker.internet.password();
            fillLoginFields(user.email, invalidPassword);
            cy.contains('Email e/ou senha inválidos').should('be.visible');
        });

        it('Should display error for unregistered email', () => {
            const unregisteredEmail = faker.internet.email();
            const password = faker.internet.password();
            fillLoginFields(unregisteredEmail, password);
            cy.contains('Email e/ou senha inválidos').should('be.visible');
        });
        it('Should validate required fields', () => {
            cy.get('[data-testid="entrar"]').click();
            cy.contains('Email é obrigatório').should('be.visible');
            cy.contains('Password é obrigatório').should('be.visible');
        });
    });
});
