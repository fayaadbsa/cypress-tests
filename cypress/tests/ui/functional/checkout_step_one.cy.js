const { loginAndAddBackpack } = require("../../../utils/uiHelper");
const { CHECKOUT_STEP_ONE_URL, CHECKOUT_STEP_TWO_URL } = require("../../../utils/constants");

describe("Checkout Step One Tests", () => {
  beforeEach(() => {
    loginAndAddBackpack();
    cy.get("a.shopping_cart_link").click();
    cy.get("button#checkout").click();
    cy.url().should("eq", CHECKOUT_STEP_ONE_URL);
  });

  it("Positive: Submitting valid shipping info redirects to step two", () => {
    cy.get("input#first-name").type("John");
    cy.get("input#last-name").type("Doe");
    cy.get("input#postal-code").type("12345");
    cy.get("input#continue").click();

    cy.url().should("eq", CHECKOUT_STEP_TWO_URL);
  });

  it("Negative: Submitting form with missing first name triggers validation error", () => {
    cy.get("input#last-name").type("Doe");
    cy.get("input#postal-code").type("12345");
    cy.get("input#continue").click();

    cy.get('[data-test="error"]').should("contain.text", "Error: First Name is required");
  });

  it("Edge Case: Alphanumeric/special-character postal code is accepted (no strict validation)", () => {
    cy.get("input#first-name").type("John");
    cy.get("input#last-name").type("Doe");
    // SauceDemo does not enforce numeric-only postal codes
    cy.get("input#postal-code").type("A1B-2C3!");
    cy.get("input#continue").click();

    cy.url().should("eq", CHECKOUT_STEP_TWO_URL);
  });
});
