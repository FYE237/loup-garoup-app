/**
  Ce fichier de test permet de vérifier le fonctionnement de l'authentification : 
  la création de compte et la connexion.
*/
describe('Log the user scenario', () => {
  beforeEach(() => {
    // intercept the request to the API /login
    cy.intercept('POST', '**/api/login', (req) => {
      req.reply({
        status: 200,
        body: {
          token: 'fldasjfskdl1234512'
        }
      })
    })
  })

  it('test if the user gets connected', () => {
    cy.visit('http://localhost:19000/WelcomePage')
    cy.get('input').first().type('sam')
    cy.get('input').last().type('123456')
    cy.get('[data-testid="loginbutton"]').click()

    // check that the view corresponding to the menu of game gets rendered
    cy.get('[data-testid="mainView"]').should('exist')
  })
})

describe('Create user account scenario', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/api/users', (req) => {
      req.reply({
        status: 200,
        body: {
          token: 'fldasjfskdl1234512'
        }
      })
    })
  })

  it('User account creation', () => {
    cy.visit('http://localhost:19000/WelcomePage')
    // select the Register tab
    cy.get('[data-testid="registerTab"]').click()
    cy.get('input').first().type('tony')
    cy.get('input').last().type('123456')

    cy.get('[data-testid="registerBtn"]').click()

    // check that the button login is present meaning that the user has been redirected to the login page
    cy.get('[data-testid="loginbutton"]').should('exist')
  })
})
