/// <reference types='cypress' />

describe('monori.TestSpec', () => {
  it('should say "Hello" when redirected to the Homepage', () => {
    cy.visit('/');
    cy.get('h1').contains('Hello!');
  });
});
