const { login } = require("../../utils/uiHelper");
const { SITE_URL, INVENTORY_URL } = require("../../utils/constants");

describe("Inventory Page Tests", () => {
  it("Positive: Add item to cart updates badge and button state", () => {
    login("standard_user", "secret_sauce");
    
    // Add backpack to cart
    cy.get("button#add-to-cart-sauce-labs-backpack").click();
    
    // Assert cart badge updates to 1
    cy.get("a.shopping_cart_link").should("contain.text", "1");
    
    // Assert button toggles to 'Remove'
    cy.get("button#remove-sauce-labs-backpack").should("have.text", "Remove");
  });

  it("Negative: Access inventory directly without login redirects to homepage", () => {
    cy.visit(INVENTORY_URL, { failOnStatusCode: false });
    
    // Assert redirect back to login page
    cy.url().should("eq", SITE_URL);
    
    // Assert error message indicates unauthorized access
    cy.get('[data-test="error"]').should("be.visible");
  });
});
