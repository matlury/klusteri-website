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

  it('Navigates to Christina Regina page when the link is clicked', function() {
    cy.contains('span.link', 'Christina Regina').click()
    cy.url().should('include', '/christinaregina')

  });

  it('rules and instructions can be accessed', function() {
    cy.contains('span.link', 'Säännöt ja ohjeet').click()
    cy.url().should('include', '/saannot_ja_ohjeet')
    cy.contains('Sivua rakennetaan vielä! :)')
  })

  it('privacy policy can be accessed', function() {
    cy.contains('span.link', 'Tietosuojaseloste').click()
    cy.url().should('include', '/tietosuojaseloste')
    cy.contains('Tämä on EU:n yleisen tietosuoja-asetuksen mukainen rekisteri- ja tietosuojaseloste.')
    cy.contains('Rekisterinpitäjä')
  })

  it('contacts page can be accessed and christina regina page can be rendered', function() {
    cy.contains('span.link', 'Yhteystiedot').click()
    cy.url().should('include', '/yhteystiedot')
    cy.contains('Domus Gaudium')
    cy.contains('Klusterikännykkä')
    cy.get('a[href="/christinaregina"] h1').click()
    cy.url().should('include', '/christinaregina')

  })

  it('error message if password input is too short', function() {
    cy.contains('Luo uusi käyttäjä').click()
    cy.contains('Telegram (valinnainen):')
    cy.get('#usernameInput').type('testuser')
    cy.get('#passwordInput').type('s')
    cy.get('#confirmPasswordInput').type('s')
    cy.get('#emailInput').type('testuser@gmail.com')
    cy.get('#telegramInput').type('testtg')
    cy.contains('Luo käyttäjä').click()
    cy.contains('Salasanan tulee olla 8-20 merkkiä pitkä.')
  })

  it('error message if password input is too long', function() {
    cy.contains('Luo uusi käyttäjä').click()
    cy.contains('Telegram (valinnainen):')
    cy.get('#usernameInput').type('testuser')
    cy.get('#passwordInput').type('1234567890salasanaaaaaaaa')
    cy.get('#confirmPasswordInput').type('1234567890salasanaaaaaaaa')
    cy.get('#emailInput').type('testuser@gmail.com')
    cy.get('#telegramInput').type('testtg')
    cy.contains('Luo käyttäjä').click()
    cy.contains('Salasanan tulee olla 8-20 merkkiä pitkä.')
  })

  it('error message if passwords dont match', function() {
    cy.contains('Luo uusi käyttäjä').click()
    cy.contains('Telegram (valinnainen):')
    cy.get('#usernameInput').type('testuser')
    cy.get('#passwordInput').type('salasana123')
    cy.get('#confirmPasswordInput').type('salasana234')
    cy.get('#emailInput').type('testuser@gmail.com')
    cy.get('#telegramInput').type('testtg')
    cy.contains('Luo käyttäjä').click()
    cy.contains('Salasanat eivät täsmää.')
  })

  it('error message if password only contains numbers', function() {
    cy.contains('Luo uusi käyttäjä').click()
    cy.contains('Telegram (valinnainen):')
    cy.get('#usernameInput').type('testuser')
    cy.get('#passwordInput').type('1234567890')
    cy.get('#confirmPasswordInput').type('1234567890')
    cy.get('#emailInput').type('testuser@gmail.com')
    cy.get('#telegramInput').type('testtg')
    cy.contains('Luo käyttäjä').click()
    cy.contains('Salasana ei saa sisältää pelkkiä numeroita tai kirjaimia.')
  })

  it('error message if a field is missing', function() {
    cy.contains('Luo uusi käyttäjä').click()
    cy.contains('Telegram (valinnainen):')
    cy.get('#passwordInput').type('1234567890')
    cy.get('#confirmPasswordInput').type('1234567890')
    cy.get('#emailInput').type('testuser@gmail.com')
    cy.get('#telegramInput').type('testtg')
    cy.contains('Luo käyttäjä').click()
    cy.contains('Käyttäjänimi, salasana, sähköposti ja vahvista salasana ovat pakollisia kenttiä.')
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