Cypress.Commands.add('api_login', user => {
    cy.request({
        method: 'POST',
        url: 'https://serverest.dev/login',
        body: user,
        failOnStatusCode: false
    })
})

Cypress.Commands.add('api_createUser', (user) => {
    cy.request({
        method: 'POST',
        url: 'https://serverest.dev/usuarios',
        body: user,
        failOnStatusCode: false
    })
})

Cypress.Commands.add('api_deleteUser', (userID) => {
    cy.request({
        method: 'DELETE',
        url: `https://serverest.dev/usuarios/${userID}`,
        failOnStatusCode: false
    })
})

Cypress.Commands.add('api_listUsers', (filter = {}) => {
    const queryString = new URLSearchParams(filter).toString();
    
    cy.request({
        method: 'GET',
        url: `https://serverest.dev/usuarios?${queryString}`,
        failOnStatusCode: false
    })
})