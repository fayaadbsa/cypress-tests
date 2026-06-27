const { loginAndAddBackpack } = require("../../utils/uiHelper");
const { CART_URL, CHECKOUT_STEP_ONE_URL } = require("../../utils/constants");

describe("Cart Page Tests", () => {
  it("Positive: View cart item and navigate to checkout", () => {
    loginAndAddBackpack();
    
    // Go to cart page
    cy.get("a.shopping_cart_link").click();
    cy.url().should("eq", CART_URL);
    
    // Assert item is in cart
    cy.get(".cart_item").should("have.length", 1);
    cy.get(".inventory_item_name").should("have.text", "Sauce Labs Backpack");
    
    // Click checkout
    cy.get("button#checkout").click();
    cy.url().should("eq", CHECKOUT_STEP_ONE_URL);
  });

  it("Negative: Remove item from cart on Cart page", () => {
    loginAndAddBackpack();
    
    // Go to cart page
    cy.get("a.shopping_cart_link").click();
    
    // Click remove
    cy.get("button#remove-sauce-labs-backpack").click();
    
    // Assert cart item is removed
    cy.get(".cart_item").should("have.length", 0);
    cy.get("a.shopping_cart_link").should("not.contain.text", "1");
  });
});
