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
  it('duree jour', ()=>{
    cy.get('[data-testid="dureeJourButton"]').click();
    cy.get('[data-testid="dureeInput"]').clear().type('5');
    cy.get('[data-testid="dureeValideButton"]').click();

  })
  it('duree nuit + les restes', ()=>{

    cy.get('[data-testid="dureenuitButton"]').click();
    cy.get('[data-testid="dureenuitInput"]').clear().type('15');
    cy.get('[data-testid="dureenuitValideButton"]').click();

    cy.get('[data-testid="dataButton"]').click();
    cy.get('[data-testid="dateInput"]').clear().type('2023-12-12;13:33:55');
    cy.get('[data-testid="dateValideButton"]').click();

    cy.get('[data-testid="pouvoirButton"]').click();
    cy.get('[data-testid="pouvoirInput"]').clear().type('0.5');
    cy.get('[data-testid="pouvoirValideButton"]').click();

    cy.get('[data-testid="proportionButton"]').click();
    cy.get('[data-testid="proportionInput"]').clear().type('0.5');
    cy.get('[data-testid="proportionValideButton"]').click();
  })

})