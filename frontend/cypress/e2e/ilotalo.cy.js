describe('Frontpage', () => {
  beforeEach(function() {
    cy.visit('http://localhost:5173')
    cy.request('POST', 'http://localhost:8000/api/testing/reset')
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
})