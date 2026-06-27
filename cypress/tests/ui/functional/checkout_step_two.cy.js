const { loginAndAddBackpack } = require("../../../utils/uiHelper");
const {
  CHECKOUT_STEP_TWO_URL,
  INVENTORY_URL,
  CHECKOUT_COMPLETE_URL,
} = require("../../../utils/constants");

describe("Checkout Step Two Tests", () => {
  beforeEach(() => {
    loginAndAddBackpack();
    cy.get("a.shopping_cart_link").click();
    cy.get("button#checkout").click();
    cy.get("input#first-name").type("John");
    cy.get("input#last-name").type("Doe");
    cy.get("input#postal-code").type("12345");
    cy.get("input#continue").click();
    cy.url().should("eq", CHECKOUT_STEP_TWO_URL);
  });

  it("Positive: Verify overview summary and click Finish redirects to complete page", () => {
    cy.get(".inventory_item_name").should("have.text", "Sauce Labs Backpack");
    cy.get(".summary_subtotal_label").should("contain.text", "29.99");

    cy.get("button#finish").click();
    cy.url().should("eq", CHECKOUT_COMPLETE_URL);
  });

  it("Negative: Click Cancel redirects back to inventory page", () => {
    cy.get("button#cancel").click();
    cy.url().should("eq", INVENTORY_URL);
  });

  it("Edge Case: Displayed tax matches ~8% of item subtotal", () => {
    // Extract subtotal and tax values
    cy.get(".summary_subtotal_label")
      .invoke("text")
      .then((subtotalText) => {
        const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ""));

        cy.get(".summary_tax_label")
          .invoke("text")
          .then((taxText) => {
            const displayedTax = parseFloat(taxText.replace(/[^0-9.]/g, ""));
            const expectedTax = parseFloat((subtotal * 0.08).toFixed(2));

            expect(displayedTax).to.be.closeTo(expectedTax, 0.01);
          });
      });
  });
});
