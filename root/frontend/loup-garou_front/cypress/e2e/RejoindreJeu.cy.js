describe('test the join game button', () => {
  before(() => {
    cy.visit('http://localhost:19000/WelcomePage')
    //register un nouveau utilisateur 
    //l'utilisateur peut être present déja dans la base données
    //mais il faut que le test soit independant de la db ainsi on essaye 
    //de le crée chaque fois
    try{
      cy.get('input').first().type('jia')
      cy.get('input').last().type('jia')
      cy.get('[data-testid="registerTab"]').click()
    }
    catch(error){
      console.log(error);
    }

  })

  describe('Test button join', () => {
    it('joueur souhaite', () => {
      cy.intercept('POST', '**/api/parties/:id', (req) => {
        req.reply({
          status: 200,
        })
      })

      cy.visit('http://localhost:19000/WelcomePage')
      cy.get('input').first().type('hello')
      cy.get('input').last().type('hello')
      cy.get('[data-testid="loginbutton"]').click();
      //create a game then go into the interface of configuration
      cy.get('[data-testid="rejoindreJeuButtonHome"]').should('exist').click();
      cy.get('[data-testid="rejoindreJeuInput"]').clear().type('54549846548');
      cy.get('[data-testid="rejoindreJeuButtonFinal"]').click();
    })
  })
})
