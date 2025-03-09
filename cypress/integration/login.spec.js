describe('Login Flow', () => {
  it('logs in with demo credentials and navigates to dashboard', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').clear().type('admin@projectpulse.com');
    cy.get('input[name="password"]').clear().type('admin1234');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome').should('exist');
  });
});
