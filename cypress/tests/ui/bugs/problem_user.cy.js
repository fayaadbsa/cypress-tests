/**
 * Problem User Bug Validation
 *
 * Tests assert CORRECT/EXPECTED behavior for `problem_user`.
 * These tests are EXPECTED TO FAIL — each failure exposes a known bug.
 * If the bugs are fixed, these tests will automatically pass.
 *
 * Known bugs for problem_user:
 *   - Bug 1: All product image thumbnails render a broken 404 placeholder
 *            instead of individual product images.
 *   - Bug 2: The "Add to Cart" button for "Sauce Labs Bolt T-Shirt" is
 *            unresponsive — cart badge and button state do not update.
 */

const { login } = require("../../../utils/uiHelper");

describe("Problem User Bug Validation", () => {
  beforeEach(() => {
    login("problem_user", "secret_sauce");
    cy.url().should("include", "inventory.html");
  });

  // ── Bug 1: Broken Image Thumbnails ────────────────────────────────────────

  it("Bug 1 [EXPECTED TO FAIL]: Each product image should display a unique, valid product photo", () => {
    // Each img src should NOT be the broken 404 placeholder
    cy.get(".inventory_item_img img").each(($img) => {
      const src = $img.attr("src");
      expect(src, `Image src "${src}" points to a broken placeholder`).to.not.include("sl-404");
    });
  });

  it("Bug 1 [EXPECTED TO FAIL]: All product image src values should be distinct (no duplicates)", () => {
    cy.get(".inventory_item_img img").then(($imgs) => {
      const srcs = [...$imgs].map((img) => img.getAttribute("src"));
      const uniqueSrcs = new Set(srcs);
      expect(
        uniqueSrcs.size,
        `All ${srcs.length} product images share the same broken placeholder src`,
      ).to.eq(srcs.length);
    });
  });

  // ── Bug 2: Bolt T-Shirt Add to Cart Unresponsive ─────────────────────────

  it("Bug 2 [EXPECTED TO FAIL]: Clicking Add to Cart on Sauce Labs Bolt T-Shirt should increment the cart badge to 1", () => {
    cy.get("button#add-to-cart-sauce-labs-bolt-t-shirt").click();

    cy.get("a.shopping_cart_link").should("contain.text", "1");
  });

  it("Bug 2 [EXPECTED TO FAIL]: Clicking Add to Cart on Sauce Labs Bolt T-Shirt should toggle the button to Remove", () => {
    cy.get("button#add-to-cart-sauce-labs-bolt-t-shirt").click();

    cy.get("button#remove-sauce-labs-bolt-t-shirt").should("exist");
  });
});
