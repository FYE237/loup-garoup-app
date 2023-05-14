describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:19000/WelcomePage')
    cy.get('input').first().type('sam')
    cy.get('input').last().type('123456')
    // cy.get('[title="Login"]').click()
    cy.get('[data-testid="loginbutton"]').click();
  })
})