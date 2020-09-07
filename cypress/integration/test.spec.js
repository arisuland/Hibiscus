/// <reference types='cypress' />

// TODO: write when it's finished lol
describe('TestSpec', () => {
  it('Should contain "Chris" when going to augu.dev', () => {
    cy.visit('https://augu.dev/');
    cy.get('h1.title').contains('Chris');
  });
});
