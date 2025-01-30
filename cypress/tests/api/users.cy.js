const { faker } = require('@faker-js/faker');

describe('API Users - Serverest', () => {
    let user

    beforeEach(() => {
        user = {
            nome: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(8),
            administrador: 'false'
        }
    })
    context('User Register', () => {
        it.only('Should register a standard user successfully', () => {
            cy.api_createUser(user)
                .then(response => {
                    expect(response.status).to.equal(201)
                    expect(response.body.message).to.contains('Cadastro realizado com sucesso')
                })
        })
    })

    context('List Users', () => {
        it.only('Should list all registered users', () => {
            cy.api_createUser(user)
            cy.api_listUsers()
                .then(response => {
                    expect(response.status).to.equal(200)
                    expect(response.body.quantidade).to.greaterThan(0)
                    expect(response.body.usuarios.some(u => u.nome === user.nome)).to.be.true;
                })
        })
        it.only('Should list a specific user searched for name', () => {
            cy.api_createUser(user)
            const filter = {
                nome: user.nome
            }
            cy.api_listUsers(filter)
                .then(response => {
                    expect(response.status).to.equal(200)
                    expect(response.body.quantidade).to.equal(1);
                    expect(response.body.usuarios[0].nome).to.equal(user.nome);
                })
        })
        it.only('Should list a specific user searched for email', () => {
            cy.api_createUser(user)
            const filter = {
                email: user.email
            }
            cy.api_listUsers(filter)
                .then(response => {
                    expect(response.status).to.equal(200)
                    expect(response.body.quantidade).to.equal(1);
                    expect(response.body.usuarios[0].email).to.equal(user.email);
                })
        })
        it.only('Should list a specific user searched for ID', () => {
            cy.api_createUser(user)
                .then((response) => {
                    const userID = response.body._id;
                    const filter = {
                        _id: userID
                    }
                    cy.api_listUsers(filter)
                        .then(response => {
                            expect(response.status).to.equal(200)
                            expect(response.body.quantidade).to.equal(1);
                            expect(response.body.usuarios[0]._id).to.equal(userID);
                        })
                })
        })
    })
    context('User Delete', () => {
        it.only('Should delete user successfully', () => {
            cy.api_createUser(user)
                .then((response) => {
                    const userID = response.body._id;
                    cy.api_deleteUser(userID)
                        .then(response => {
                            expect(response.status).to.equal(200)
                            expect(response.body.message).to.contains('Registro excluído com sucesso')
                        })
                })
        })
    })
})