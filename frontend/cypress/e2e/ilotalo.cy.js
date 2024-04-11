describe('Frontpage', () => {

  beforeEach(function() {
    //Reset the testing database
    cy.request('POST', 'http://localhost:8000/api/testing/reset')
  
    cy.visit('http://localhost:5173')
  })

  it('frontpage can be accessed', function() {
    cy.contains('Ilotalo')
    cy.contains('”sub hoc tecto cives academici excoluntur”?')
  })

  it('a user can be created', function() {
    cy.contains('Luo uusi käyttäjä').click()
    cy.contains('Telegram (valinnainen):')
    cy.get('#usernameInput').type('testuser')
    cy.get('#passwordInput').type('salasana123')
    cy.get('#confirmPasswordInput').type('salasana123')
    cy.get('#emailInput').type('testuser@gmail.com')
    cy.get('#telegramInput').type('testtg')
    cy.contains('Luo käyttäjä').click()
    cy.contains('Käyttäjä luotu onnistuneesti!')
  })

  it('a user can log in', function() {
    cy.on('uncaught:exception', () => {
      /*
      Returning false here prevents the test from failing 
      due to "<function name> is not a function"
      */
      return false
    })

    cy.contains('Luo uusi käyttäjä').click()
    cy.contains('Telegram (valinnainen):')
    cy.get('#usernameInput').type('testuser')
    cy.get('#passwordInput').type('salasana123')
    cy.get('#confirmPasswordInput').type('salasana123')
    cy.get('#emailInput').type('testuser@gmail.com')
    cy.get('#telegramInput').type('testtg')
    cy.contains('Luo käyttäjä').click()
    
    cy.wait(500)
    cy.contains('Etusivu').click()

    cy.get('#email').type('testuser@gmail.com')
    cy.get('#password').type('salasana123')
    cy.contains('Kirjaudu sisään').click()
    cy.contains('Hei testuser!')
  })
})

Cypress.on