/**
 * Error User Bug Validation
 *
 * Tests assert CORRECT/EXPECTED behavior for `error_user`.
 * These tests are EXPECTED TO FAIL — each failure exposes a known bug.
 * If the bugs are fixed, these tests will automatically pass.
 *
 * Known bug for error_user:
 *   - Bug 1: The Checkout Step One form fails to submit even when all fields
 *            are filled in correctly. The page does not redirect to Step Two.
 */

const { login } = require("../../../utils/uiHelper");
const { CHECKOUT_STEP_ONE_URL, CHECKOUT_STEP_TWO_URL } = require("../../../utils/constants");

describe("Error User Bug Validation", () => {
  beforeEach(() => {
    login("error_user", "secret_sauce");
    cy.url().should("include", "inventory.html");

    // Add an item and proceed to checkout
    cy.get("button#add-to-cart-sauce-labs-backpack").click();
    cy.get("a.shopping_cart_link").click();
    cy.get("button#checkout").click();
    cy.url().should("eq", CHECKOUT_STEP_ONE_URL);
  });

  // ── Bug 1: Checkout Step One Form Blocked ─────────────────────────────────

  it("Bug 1 [EXPECTED TO FAIL]: Submitting Checkout Step One with valid data should redirect to Step Two", () => {
    cy.get("input#first-name").type("John");
    cy.get("input#last-name").type("Doe");
    cy.get("input#postal-code").type("12345");
    cy.get("input#continue").click();

    // Should redirect to Step Two — this fails for error_user due to form block
    cy.url().should("eq", CHECKOUT_STEP_TWO_URL);
  });

  it("Bug 1 [EXPECTED TO FAIL]: After submitting, the form should not clear or revert the entered fields", () => {
    cy.get("input#first-name").type("John");
    cy.get("input#last-name").type("Doe");
    cy.get("input#postal-code").type("12345");
    cy.get("input#continue").click();

    // After clicking Continue, user should NOT remain on Step One
    cy.url().should("not.eq", CHECKOUT_STEP_ONE_URL);
  });
});
