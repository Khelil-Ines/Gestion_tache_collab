describe("Register page", () => {
  it("should allow users to register", () => {
    cy.visit("http://localhost:3000/register");

    cy.get("[data-testid=firstname]").type("aya");
    cy.get("[data-testid=lastname]").type("ghattas");
    cy.get("[data-testid=email]").type("aya@gmail.com");
    cy.get("[data-testid=password]").type("123");
    cy.get("[data-testid=submit-button]").click();
    
  });
  it('should show validation error if leaving all fields blank', () => {
    cy.visit('http://localhost:3000/register')
    cy.get('[data-cy="error-first-name"]').should('exist');
    cy.get('[data-cy="error-last-name"]').should('exist');
    cy.get('[data-cy="error-email"]').should('exist');
    cy.get('[data-cy="error-password"]').should('exist');

  });
  it('should handle special characters in password', () => {
    cy.visit('http://localhost:3000/register');
    cy.get("[data-testid=password]").type("password@!$%");
    cy.get("[data-testid=submit-button]").click();
    cy.wait(2000);
    cy.get('.error-message').should(($error) => {
      expect($error.text()).to.include("ExpectedErrorMessage");
    }).and('be.visible');
    });  
  it('should show validation error for a short password', () => {
    cy.visit('http://localhost:3000/register');
    cy.get("[data-testid=firstname]").type("aya");
    cy.get("[data-testid=lastname]").type("ghattas");
    cy.get("[data-testid=email]").type("aya@gmail.com");
    cy.get("[data-testid=password]").type("12");
    cy.get("[data-testid=submit-button]").click();
    cy.get('.error-message').should('exist').and('be.visible');
  }); 
  it('should handle duplicate email address', () => {
    cy.visit('http://localhost:3000/register');
    cy.get("[data-testid=email]").type("aya@gmail.com");
    cy.get("[data-testid=submit-button]").click();
    cy.get('.error-message').should('exist');
  });
  
});