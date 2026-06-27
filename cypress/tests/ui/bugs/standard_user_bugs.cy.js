/**
 * Standard User Bug Validation
 *
 * Tests assert CORRECT/EXPECTED behavior for `standard_user`.
 * These tests are EXPECTED TO FAIL — each failure exposes a known application bug.
 * If the bugs are fixed, these tests will automatically pass.
 *
 * Known bug for standard_user:
 *   - Bug 1: Checkout is not blocked when the cart is empty. A user can
 *            navigate directly to the cart and complete the full checkout
 *            flow without adding any items.
 */

const { login } = require("../../../utils/uiHelper");
const { CHECKOUT_STEP_ONE_URL } = require("../../../utils/constants");

describe("Standard User Bug Validation", () => {
  beforeEach(() => {
    login("standard_user", "secret_sauce");
    cy.url().should("include", "inventory.html");
  });

  // ── Bug 1: Checkout Permitted with Empty Cart ─────────────────────────────

  it("Bug 1 [EXPECTED TO FAIL]: Checkout button should be disabled or blocked when the cart is empty", () => {
    // Navigate via cart icon to preserve React state
    cy.get("a.shopping_cart_link").click();
    cy.get(".cart_item").should("have.length", 0);

    // Checkout button should NOT be clickable with an empty cart
    cy.get("button#checkout").should("be.disabled");
  });

  it("Bug 1 [EXPECTED TO FAIL]: Clicking Checkout with an empty cart should not proceed to Step One", () => {
    // Navigate via cart icon to preserve React state
    cy.get("a.shopping_cart_link").click();
    cy.get("button#checkout").click();

    // Should NOT proceed to step one — app should block this
    cy.url().should("not.eq", CHECKOUT_STEP_ONE_URL);
    cy.url().should("include", "cart.html");
  });
});
