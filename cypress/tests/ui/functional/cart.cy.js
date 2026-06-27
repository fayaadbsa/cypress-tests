const { loginAndAddBackpack } = require("../../../utils/uiHelper");
const { CART_URL, CHECKOUT_STEP_ONE_URL } = require("../../../utils/constants");

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

  it("Edge Case: Cart state is preserved after navigating away via Continue Shopping", () => {
    loginAndAddBackpack();

    // Go to cart page
    cy.get("a.shopping_cart_link").click();
    cy.url().should("include", "cart.html");
    cy.get(".cart_item").should("have.length", 1);

    // Click "Continue Shopping" to return to inventory
    cy.get("button#continue-shopping").click();
    cy.url().should("include", "inventory.html");

    // Return to cart. item should still be in the cart
    cy.get("a.shopping_cart_link").click();
    cy.get(".cart_item").should("have.length", 1);
    cy.get(".inventory_item_name").should("have.text", "Sauce Labs Backpack");
  });
});
