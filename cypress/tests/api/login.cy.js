const { faker } = require('@faker-js/faker');

describe('API Login - Serverest', () => {
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

  context('Successful Login', () => {
    it('Should log in successfully with valid user credentials', () => {
      user = {
        email: Cypress.env("userEmail"),
        password: Cypress.env("userPassword")        
      }
      
      cy.api_login(user)
        .then(response => {
          expect(response.status).to.equal(200)
          expect(response.body.message).to.contains('Login realizado com sucesso')
          expect(response.body.authorization).to.contains('Bearer')
        })
    });
  })
  context('Validation Errors', () => {
    it('Should error for incorrect password', () => {
      user = {
        email: Cypress.env("userEmail"),
        password: faker.internet.password()        
      }

      cy.api_login(user)
        .then(response => {
          expect(response.status).to.equal(401)
          expect(response.body.message).to.contains('Email e/ou senha inválidos')
        })
    });

    it('Should  error for unregistered email', () => {
      user = {
        email: faker.internet.email(),
        password: faker.internet.password()        
      }

      cy.api_login(user)
        .then(response => {
          expect(response.status).to.equal(401)
          expect(response.body.message).to.contains('Email e/ou senha inválidos')
        })
    });
  });

})