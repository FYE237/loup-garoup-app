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
    cy.get('[title="Login"]').click()

    // we check that the component with the submitText prop 'Rejoindre le jeu' exists. If it does, it means that the user is on the home page
    cy.get('[submitText="Rejoindre le jeu"]').should('exist')
  })
})

describe('Create user account scenario', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/api/login', (req) => {
      req.reply({})
    })
  })

  it('User account creation', () => {
    cy.visit('http://localhost:19000/WelcomePage')
    // select the Register tab
  })
})
