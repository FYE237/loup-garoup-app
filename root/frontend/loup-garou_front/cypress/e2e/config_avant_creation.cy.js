describe('test the fonctionnalities of configuration interface before creating a game', () => {
  beforeEach(()=>{
    cy.visit('http://localhost:19000/WelcomePage')
    cy.get('input').first().type('sam')
    cy.get('input').last().type('123456')
    cy.get('[data-testid="loginbutton"]').click();
    //create a game then go into the interface of configuration
    cy.get('[data-testid="creationJeuButtonHome"]').should('exist').click();
  })
  it('joueur souhait', () => {
    cy.get('[data-testid="joueurSouConfig"]').click();
    cy.get('[data-testid="minJoueurInput"]').clear().type('5');
    cy.get('[data-testid="minJoueurInputValideButton"]').click();
    
  })
})