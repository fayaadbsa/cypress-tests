const { login } = require("../../../utils/uiHelper");
const { SITE_URL, INVENTORY_URL } = require("../../../utils/constants");

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

  it("Edge Case: Sorting by Price (low to high) renders products in ascending price order", () => {
    login("standard_user", "secret_sauce");

    // Select price ascending sort
    cy.get('[data-test="product-sort-container"]').select("lohi");

    // Collect all displayed prices and assert they are in ascending order
    cy.get(".inventory_item_price").then(($prices) => {
      const prices = [...$prices].map((el) => parseFloat(el.innerText.replace("$", "")));
      const sorted = [...prices].sort((a, b) => a - b);
      expect(prices).to.deep.equal(sorted);
    });
  });
});
