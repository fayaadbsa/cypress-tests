const { loginAndAddBackpack } = require("../../utils/uiHelper");
const { CHECKOUT_COMPLETE_URL, INVENTORY_URL, SITE_URL } = require("../../utils/constants");

describe("Checkout Complete Page Tests", () => {
  it("Positive: Verify complete order details and back home button redirects to inventory", () => {
    loginAndAddBackpack();
    cy.get("a.shopping_cart_link").click();
    cy.get("button#checkout").click();
    cy.get("input#first-name").type("John");
    cy.get("input#last-name").type("Doe");
    cy.get("input#postal-code").type("12345");
    cy.get("input#continue").click();
    cy.get("button#finish").click();
    cy.url().should("eq", CHECKOUT_COMPLETE_URL);

    cy.get(".complete-header").should("have.text", "Thank you for your order!");
    
    cy.get("button#back-to-products").click();
    cy.url().should("eq", INVENTORY_URL);
  });

  it("Negative: Access checkout complete directly without login redirects to homepage", () => {
    cy.visit(CHECKOUT_COMPLETE_URL, { failOnStatusCode: false });
    
    cy.url().should("eq", SITE_URL);
    cy.get('[data-test="error"]').should("be.visible");
  });
});
