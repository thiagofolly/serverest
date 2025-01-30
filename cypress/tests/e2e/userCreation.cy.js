const { faker } = require('@faker-js/faker')
import '../../support/commands'
import '../../support/api_commands'

describe('User Creation Tests - Serverest', () => {
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
        cy.login(admin.email, admin.password);
        cy.intercept({
            method: 'GET',
            path: `/usuarios`
        }).as('getUsuarios')
        cy.get('[data-testid="cadastrarUsuarios"]').should('be.visible').click();
    });

    context('User Register', () => {
        it('Should register a standard user successfully', () => {
            const name = faker.name.fullName();
            const email = faker.internet.email();
            const password = faker.internet.password(8);

            cy.fillRegisterUserFields(name, email, password);

            cy.get('[data-testid="cadastrarUsuario"]').should('be.visible').click();
            cy.wait('@getUsuarios');
            cy.contains('Lista dos usuários').should('be.visible');
            cy.contains(email).should('be.visible');
        });

        it('Should register a standard user successfully and remove it', () => {
            const name = faker.name.fullName();
            const email = faker.internet.email();
            const password = faker.internet.password(8);

            cy.fillRegisterUserFields(name, email, password);

            cy.get('[data-testid="cadastrarUsuario"]').should('be.visible').click();
            cy.wait('@getUsuarios');
            cy.contains('Lista dos usuários').should('be.visible');
            cy.contains(email).should('be.visible');
            cy.contains(email).parent().find('button.btn-danger').click();
            cy.contains(email).should('not.exist');
        });

        it('Should register an admin user successfully', () => {
            const name = faker.name.fullName();
            const email = faker.internet.email();
            const password = faker.internet.password(8);

            cy.fillRegisterUserFields(name, email, password, true);

            cy.get('[data-testid="cadastrarUsuario"]').should('be.visible').click();
            cy.wait('@getUsuarios');
            cy.contains('Lista dos usuários').should('be.visible');
            cy.contains(email).should('be.visible');
        });

        it('Should not allow duplicate email registration', () => {
            const email = Cypress.env('userEmail');
            const name = faker.name.fullName();
            const password = faker.internet.password(8);

            cy.fillRegisterUserFields(name, email, password);

            cy.get('[data-testid="cadastrarUsuario"]').should('be.visible').click();
            cy.contains('Este email já está sendo usado').should('be.visible');
        });

        it('Should display error messages when required fields are empty', () => {
            cy.get('[data-testid="cadastrarUsuario"]').click();
            cy.contains('Nome é obrigatório').should('be.visible');
            cy.contains('Email é obrigatório').should('be.visible');
            cy.contains('Password é obrigatório').should('be.visible');
        });
    });
});
