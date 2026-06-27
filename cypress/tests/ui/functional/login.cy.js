const { login } = require("../../../utils/uiHelper");
const { INVENTORY_URL } = require("../../../utils/constants");

describe("Login Page Tests", () => {
  it("Positive: Valid login redirects to inventory page", () => {
    login("standard_user", "secret_sauce");
    cy.url().should("eq", INVENTORY_URL);
    cy.get(".inventory_list").should("be.visible");
  });

  it("Negative: Locked out user displays error message", () => {
    login("locked_out_user", "secret_sauce");
    cy.get('[data-test="error"]').should("contain.text", "Sorry, this user has been locked out");
  });

  it("Edge Case: Username with leading/trailing whitespace fails to log in", () => {
    // SauceDemo does not trim usernames
    login("  standard_user  ", "secret_sauce");
    cy.get('[data-test="error"]').should("be.visible");
    cy.url().should("not.include", "inventory");
  });
});
