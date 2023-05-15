describe('test the fonctionnalities of configuration interface before creating a game', () => {
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

  describe('Test game input', () => {
    beforeEach(()=>{
      cy.visit('http://localhost:19000/WelcomePage')
      
      cy.get('input').first().type('jia')
      cy.get('input').last().type('jia')
      cy.get('[data-testid="loginbutton"]').click();
      //create a game then go into the interface of configuration
      cy.get('[data-testid="creationJeuButtonHome"]').should('exist').click();
      
    })
    it('Vérifie que l utilisateur peut définir le nombre minimum de joueurs', () => {
      cy.get('[data-testid="joueurSouConfig"]').click();
      cy.get('[data-testid="minJoueurInput"]').clear().type('5');
      cy.get('[data-testid="minJoueurInputValideButton"]').click();
    })
    it('Vérifie que l utilisateur peut définir la durée du jour', ()=>{
      cy.get('[data-testid="dureeJourButton"]').click();
      cy.get('[data-testid="dureeInput"]').clear().type('5');
      cy.get('[data-testid="dureeValideButton"]').click();

    })
    it('Vérifie que l utilisateur peut définir la durée de la nuit et la date de début du jeu', ()=>{

      cy.get('[data-testid="dureenuitButton"]').click();
      cy.get('[data-testid="dureenuitInput"]').clear().type('15');
      cy.get('[data-testid="dureenuitValideButton"]').click();

      cy.get('[data-testid="dataButton"]').click();
      cy.get('[data-testid="dateInput"]').clear().type('2023-12-12;13:33:55');
      cy.get('[data-testid="dateValideButton"]').click();

    })
    it('érifie que l utilisateur peut définir le pouvoir des loups, la proportion des loups, créer le jeu et revenir à la page d accueil.', ()=>{
      cy.get('[data-testid="pouvoirButton"]').click();
      cy.get('[data-testid="pouvoirInput"]').clear().type('0.5');
      cy.get('[data-testid="pouvoirValideButton"]').click();
  
      cy.get('[data-testid="proportionButton"]').click();
      cy.get('[data-testid="proportionInput"]').clear().type('0.5');
      cy.get('[data-testid="proportionValideButton"]').click();
  
      cy.get('[data-testid="creationJeuButtonConfig"]').click();
      cy.wait(1000); //attendre pour entrer le page d'attende 
      
      //retourner le home page
      cy.get('[data-testid="wolfHeadWaiting"]').click();
  
      cy.get('[data-testid="confirmWaiting"]').click();
  
      
    })
  })
})
