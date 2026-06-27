/**
 * Error User Bug Validation
 *
 * Known bug for error_user:
 *   - The Checkout Step One form does not submit successfully even when all
 *     fields are filled in. The page stays on Step One instead of advancing.
 *
 * Test order matters here:
 *   1. First verify the fields themselves accept typed input (prerequisite check).
 *   2. Then try submitting with valid data — expected to fail (the main bug).
 *   3. As a fallback, skip filling the form entirely and click Continue directly
 *      to confirm whether the form block is input-related or submission-related.
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

  // ── Step 1: Prerequisite — can the form even be filled? ───────────────────
  // This runs first to isolate whether the bug is at the input level or
  // submission level. Expected to PASS (fields should be interactable).

  it("Prerequisite: Checkout form fields should accept and retain typed values", () => {
    cy.get("input#first-name").type("John").should("have.value", "John");
    cy.get("input#last-name").type("Doe").should("have.value", "Doe");
    cy.get("input#postal-code").type("12345").should("have.value", "12345");
  });

  // ── Step 2: Main bug — form filled but submission is blocked ──────────────

  it("Bug [EXPECTED TO FAIL]: Filling all fields and clicking Continue should redirect to Step Two", () => {
    cy.get("input#first-name").type("John");
    cy.get("input#last-name").type("Doe");
    cy.get("input#postal-code").type("12345");
    cy.get("input#continue").click();

    // Should advance to Step Two — fails for error_user
    cy.url().should("eq", CHECKOUT_STEP_TWO_URL);
  });

  // ── Step 3: Fallback — skip filling, click Continue directly ──────────────
  // If the form fields can't be filled (or get cleared), this tests whether
  // the Continue button itself is at least functional (shows a validation error
  // rather than doing nothing at all).

  it("Fallback: Clicking Continue without filling form should at least show a validation error (not silently fail)", () => {
    // Skip filling — click Continue immediately
    cy.get("input#continue").click();

    // Should stay on Step One and show a visible validation message
    cy.url().should("eq", CHECKOUT_STEP_ONE_URL);
    cy.get('[data-test="error"]').should("be.visible");
  });
});
