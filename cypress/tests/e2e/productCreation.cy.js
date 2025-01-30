const { faker } = require('@faker-js/faker')
import '../../support/commands'
import '../../support/api_commands'

function fillProductFields(name, price, description, quantity) {
    cy.get('[data-testid="nome"]').should('be.visible').type(name);
    cy.get('[data-testid="preco"]').should('be.visible').type(price);
    cy.get('[data-testid="descricao"]').should('be.visible').type(description);
    cy.get('[data-testid="quantity"]').should('be.visible').type(quantity);
}

describe('Product Creation Tests - Serverest', () => {
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
        cy.get('[data-testid="cadastrar-produtos"]').should('be.visible').click();
    });

    context('Form Validation', () => {
        it('Should not allow registration without filling in all required fields', () => {
            cy.get('[data-testid="cadastarProdutos"]').should('be.visible').click();
            cy.contains('Nome é obrigatório').should('be.visible');
            cy.contains('Preco é obrigatório').should('be.visible');
            cy.contains('Descricao é obrigatório').should('be.visible');
            cy.contains('Quantidade é obrigatório').should('be.visible');
        });

        it('Should not allow registration with a negative price and quantity', () => {
            const productName = faker.commerce.productName();
            const productDescription = faker.commerce.productDescription();

            fillProductFields(productName, '-10', productDescription, '-10');
            cy.get('[data-testid="cadastarProdutos"]').should('be.visible').click();
            cy.contains('Preco deve ser um número positivo').should('be.visible');
            cy.contains('Quantidade deve ser maior ou igual a 0').should('be.visible');
        });
    });

    context('Form Submission', () => {
        it('Should register a product with valid data', () => {
            const productName = faker.commerce.productName();
            const productDescription = faker.commerce.productDescription();
            const productPrice = faker.number.int({ min: 1, max: 1000 });
            const productQuantity = faker.number.int({ min: 1, max: 100 });
            const imageFile = 'cypress/fixtures/product.png';

            fillProductFields(productName, productPrice, productDescription, productQuantity);
            cy.get('[data-testid="imagem"]').selectFile(imageFile);
            cy.get('[data-testid="cadastarProdutos"]').should('be.visible').click();
            cy.contains('Lista dos Produtos').should('be.visible');
            cy.contains(productName).should('be.visible');
        });

        it('Should register a product with valid data and remove it', () => {
            const productName = faker.commerce.productName();
            const productDescription = faker.commerce.productDescription();
            const productPrice = faker.number.int({ min: 1, max: 1000 });
            const productQuantity = faker.number.int({ min: 1, max: 100 });
            const imageFile = 'cypress/fixtures/product.png';

            fillProductFields(productName, productPrice, productDescription, productQuantity);
            cy.get('[data-testid="imagem"]').selectFile(imageFile);
            cy.get('[data-testid="cadastarProdutos"]').should('be.visible').click();
            cy.contains('Lista dos Produtos').should('be.visible');
            cy.contains(productName).should('be.visible');
            cy.contains(productName).parent().find('button.btn-danger').click();
            cy.contains(productName).should('not.exist');
        });
    });
});
