/**
 * Visual User Bug Validation
 *
 * Tests assert CORRECT/EXPECTED layout behavior for `visual_user`.
 * These tests are EXPECTED TO FAIL — each failure exposes a known visual bug.
 *
 * Known bugs for visual_user:
 *   - Bug 1: "Add to Cart" buttons on the inventory page are misaligned —
 *            they appear at the bottom of the page / outside the product card
 *            instead of inline within each product's card.
 *   - Bug 2: Product card price label is misaligned (not in its expected position).
 *   - Bug 3: Product card image may render at the wrong size or aspect ratio.
 *
 * Approach: DOM-based layout checks using getBoundingClientRect() to assert
 * that elements are within expected position bounds — no plugin required.
 *
 * Performance check:
 *   - Page load (navigation response) must complete within 3000ms.
 */

const { login } = require("../../../utils/uiHelper");
const { INVENTORY_URL } = require("../../../utils/constants");

const PERF_THRESHOLD_MS = 3000;

describe("Visual User Bug Validation", () => {
  beforeEach(() => {
    login("visual_user", "secret_sauce");
    cy.url().should("include", "inventory.html");
  });

  // ── Performance: Page Load Time ───────────────────────────────────────────

  it("Performance: Inventory page should load within 3 seconds", () => {
    // Measure navigation timing using the Performance API
    cy.window().then((win) => {
      const [entry] = win.performance.getEntriesByType("navigation");
      const loadTime = entry.domContentLoadedEventEnd - entry.startTime;

      expect(
        loadTime,
        `Page took ${loadTime.toFixed(0)}ms to load (threshold: ${PERF_THRESHOLD_MS}ms)`
      ).to.be.lessThan(PERF_THRESHOLD_MS);
    });
  });

  // ── Bug 1: Misaligned Add to Cart Buttons ─────────────────────────────────

  it("Bug 1 [EXPECTED TO FAIL]: Each Add to Cart button should be inside its own product card", () => {
    cy.get(".inventory_item").each(($card) => {
      // Get the card's bounding box
      const cardRect = $card[0].getBoundingClientRect();

      // Find the button inside the card
      const $btn = $card.find("[data-test^='add-to-cart']");
      if ($btn.length === 0) return; // skip if no button in this card

      const btnRect = $btn[0].getBoundingClientRect();

      // Button top must be within the card's vertical bounds
      expect(
        btnRect.top,
        `Button top (${btnRect.top}px) is outside card top (${cardRect.top}px)`
      ).to.be.gte(cardRect.top);

      expect(
        btnRect.bottom,
        `Button bottom (${btnRect.bottom}px) is outside card bottom (${cardRect.bottom}px)`
      ).to.be.lte(cardRect.bottom);

      // Button left must be within the card's horizontal bounds
      expect(
        btnRect.left,
        `Button left (${btnRect.left}px) is outside card left (${cardRect.left}px)`
      ).to.be.gte(cardRect.left);
    });
  });

  it("Bug 1 [EXPECTED TO FAIL]: All Add to Cart buttons should be at a consistent vertical position across cards", () => {
    const buttonTops = [];

    cy.get(".inventory_item [data-test^='add-to-cart']").each(($btn) => {
      buttonTops.push($btn[0].getBoundingClientRect().top);
    }).then(() => {
      if (buttonTops.length < 2) return;

      // All buttons in the same row should have the same top offset.
      // Allow a max deviation of 5px between min and max.
      const min = Math.min(...buttonTops);
      const max = Math.max(...buttonTops);
      expect(
        max - min,
        `Button vertical positions vary by ${(max - min).toFixed(1)}px — buttons are misaligned`
      ).to.be.lessThan(5);
    });
  });

  // ── Bug 2: Price Label Alignment ──────────────────────────────────────────

  it("Bug 2 [EXPECTED TO FAIL]: Price label should be vertically above the Add to Cart button within each card", () => {
    cy.get(".inventory_item").each(($card) => {
      const $price = $card.find(".inventory_item_price");
      const $btn = $card.find("[data-test^='add-to-cart']");

      if ($price.length === 0 || $btn.length === 0) return;

      const priceBottom = $price[0].getBoundingClientRect().bottom;
      const btnTop = $btn[0].getBoundingClientRect().top;

      expect(
        priceBottom,
        `Price label bottom (${priceBottom}px) is below button top (${btnTop}px) — layout is inverted`
      ).to.be.lte(btnTop);
    });
  });

  // ── Bug 3: Product Image Size Consistency ─────────────────────────────────

  it("Bug 3 [EXPECTED TO FAIL]: All product images should have the same rendered height", () => {
    const heights = [];

    cy.get(".inventory_item_img img").each(($img) => {
      heights.push($img[0].getBoundingClientRect().height);
    }).then(() => {
      const uniqueHeights = new Set(heights.map((h) => Math.round(h)));
      expect(
        uniqueHeights.size,
        `Product images have inconsistent heights: ${[...uniqueHeights].join("px, ")}px`
      ).to.eq(1);
    });
  });
});
