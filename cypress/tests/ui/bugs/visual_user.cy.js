/**
 * Visual User Bug Validation
 *
 * Tests assert CORRECT/EXPECTED layout behavior for `visual_user`.
 * These tests are EXPECTED TO FAIL — each failure exposes a known visual bug.
 * If the bugs are fixed, these tests will automatically pass.
 *
 * Known bugs for visual_user:
 *   - Bug 1: "Add to Cart" buttons are misaligned — they appear outside or at
 *            the bottom of the page instead of inside each product card.
 *   - Bug 2: Product card price label is misaligned relative to its button.
 *   - Bug 3: Product card images may render at inconsistent sizes.
 *
 * Approach: DOM-based layout checks using getBoundingClientRect() — no plugin required.
 *
 * Note: Performance glitch testing belongs to `performance_glitch_user`, not this file.
 */

const { login } = require("../../../utils/uiHelper");

describe("Visual User Bug Validation", () => {
  beforeEach(() => {
    login("visual_user", "secret_sauce");
    cy.url().should("include", "inventory.html");
  });

  // ── Bug 1: Misaligned Add to Cart Buttons ─────────────────────────────────

  it("Bug 1 [EXPECTED TO FAIL]: Each Add to Cart button should be inside its own product card bounds", () => {
    cy.get(".inventory_item").each(($card) => {
      const cardRect = $card[0].getBoundingClientRect();
      const $btn = $card.find("[data-test^='add-to-cart']");

      if ($btn.length === 0) return;

      const btnRect = $btn[0].getBoundingClientRect();

      // Button must sit within the card vertically
      expect(
        btnRect.top,
        `Button top (${btnRect.top.toFixed(0)}px) is above card top (${cardRect.top.toFixed(0)}px)`,
      ).to.be.gte(cardRect.top);

      expect(
        btnRect.bottom,
        `Button bottom (${btnRect.bottom.toFixed(0)}px) overflows card bottom (${cardRect.bottom.toFixed(0)}px)`,
      ).to.be.lte(cardRect.bottom);

      // Button must sit within the card horizontally
      expect(
        btnRect.left,
        `Button left (${btnRect.left.toFixed(0)}px) is outside card left (${cardRect.left.toFixed(0)}px)`,
      ).to.be.gte(cardRect.left);

      expect(
        btnRect.right,
        `Button right (${btnRect.right.toFixed(0)}px) overflows card right (${cardRect.right.toFixed(0)}px)`,
      ).to.be.lte(cardRect.right);
    });
  });

  // ── Bug 2: Price Label Alignment ──────────────────────────────────────────

  it("Bug 2 [EXPECTED TO FAIL]: Price label should appear above the Add to Cart button inside each card", () => {
    cy.get(".inventory_item").each(($card) => {
      const $price = $card.find(".inventory_item_price");
      const $btn = $card.find("[data-test^='add-to-cart']");

      if ($price.length === 0 || $btn.length === 0) return;

      const priceBottom = $price[0].getBoundingClientRect().bottom;
      const btnTop = $btn[0].getBoundingClientRect().top;

      expect(
        priceBottom,
        `Price bottom (${priceBottom.toFixed(0)}px) is below button top (${btnTop.toFixed(0)}px) — layout is inverted`,
      ).to.be.lte(btnTop);
    });
  });

  // ── Bug 3: Product Image Size Consistency ─────────────────────────────────

  it("Bug 3 [EXPECTED TO FAIL]: All product images should render at the same height", () => {
    const heights = [];

    cy.get(".inventory_item_img img")
      .each(($img) => {
        heights.push(Math.round($img[0].getBoundingClientRect().height));
      })
      .then(() => {
        const uniqueHeights = new Set(heights);
        expect(
          uniqueHeights.size,
          `Product images have ${uniqueHeights.size} different heights: ${[...uniqueHeights].join("px, ")}px`,
        ).to.eq(1);
      });
  });
});
