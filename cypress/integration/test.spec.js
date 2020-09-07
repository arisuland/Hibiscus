/// <reference types='cypress' />

describe('monori.TestSpec', () => {
  it('should say "Sup" when redirected to the Homepage', () => {
    cy.visit('/');
    cy.get('h1').contains('ea sports');
  });
});
