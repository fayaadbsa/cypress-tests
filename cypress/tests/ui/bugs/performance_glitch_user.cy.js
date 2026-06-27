/**
 * Performance Glitch User Bug Validation
 *
 * Tests assert CORRECT/EXPECTED performance behavior for `performance_glitch_user`.
 * These tests are EXPECTED TO FAIL — each failure exposes an artificial delay bug.
 * If the bugs are fixed, these tests will automatically pass.
 *
 * Known bug for performance_glitch_user:
 *   - Bug 1: Login and page navigation take significantly longer than normal due
 *            to an artificial delay injected server-side for this account.
 *            Response times exceed the acceptable 3-second threshold.
 *
 * Approach: Measures DOM navigation timing via the browser Performance API.
 * No external plugin required.
 */

const { SITE_URL, INVENTORY_URL } = require("../../../utils/constants");

const PERF_THRESHOLD_MS = 3000;

describe("Performance Glitch User Bug Validation", () => {
  // ── Bug 1: Login Response Time ─────────────────────────────────────────────

  it("Bug 1 [EXPECTED TO FAIL]: Login should complete and land on inventory within 3 seconds", () => {
    const start = Date.now();

    cy.visit(SITE_URL);
    cy.get("input#user-name").type("performance_glitch_user");
    cy.get("input#password").type("secret_sauce");
    cy.get("input#login-button").click();

    cy.url()
      .should("include", "inventory.html")
      .then(() => {
        const elapsed = Date.now() - start;
        expect(
          elapsed,
          `Login took ${elapsed}ms — exceeds ${PERF_THRESHOLD_MS}ms threshold`,
        ).to.be.lessThan(PERF_THRESHOLD_MS);
      });
  });

  // ── Bug 1b: Navigation Timing via Performance API ──────────────────────────

  it("Bug 1 [EXPECTED TO FAIL]: Inventory page navigation timing should be under 3 seconds", () => {
    cy.visit(SITE_URL);
    cy.get("input#user-name").type("performance_glitch_user");
    cy.get("input#password").type("secret_sauce");
    cy.get("input#login-button").click();
    cy.url().should("include", "inventory.html");

    cy.window().then((win) => {
      const [entry] = win.performance.getEntriesByType("navigation");
      if (!entry) return; // skip if API not available

      const loadTime = entry.domContentLoadedEventEnd - entry.startTime;
      expect(
        loadTime,
        `Page domContentLoaded took ${loadTime.toFixed(0)}ms (threshold: ${PERF_THRESHOLD_MS}ms)`,
      ).to.be.lessThan(PERF_THRESHOLD_MS);
    });
  });
});
