describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
    cy.contains('Ilotalo')
    cy.contains('”sub hoc tecto cives academici excoluntur”?')
  })
})