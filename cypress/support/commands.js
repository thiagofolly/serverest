Cypress.Commands.add('login', (email, password) => {
    cy.intercept({
        method: 'GET',
        path: `/usuarios`
    }).as('getUsuarios')

    cy.visit('/')
    cy.get('[data-testid="email"]').should('be.visible').type(email);
    cy.get('[data-testid="senha"]').should('be.visible').type(password);
    cy.get('[data-testid="entrar"]').should('be.visible').click();
    cy.wait('@getUsuarios')
        .its('response.statusCode')
        .should('eq', 200)

    cy.url().should('contain', 'home')
})

Cypress.Commands.add('fillRegisterUserFields', (name, email, password, adminCheckbox = false) => {
    cy.get('[data-testid="nome"]').should('be.visible').type(name);
    cy.get('[data-testid="email"]').should('be.visible').type(email);
    cy.get('[data-testid="password"]').should('be.visible').type(password);
    if (adminCheckbox == true) {
        cy.get('[data-testid="checkbox"]').should('be.visible').check();
    } else {
        cy.get('[data-testid="checkbox"]').should('not.be.checked');
    }
})