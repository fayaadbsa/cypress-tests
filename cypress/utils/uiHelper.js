const { SITE_URL } = require("./constants");

/**
 * Performs login on SauceDemo using the specified credentials.
 * Re-logs in from scratch each time — no session caching.
 *
 * @param {string} username
 * @param {string} password
 */
const login = (username = "standard_user", password = "secret_sauce") => {
  cy.visit(SITE_URL);
  cy.get("input#user-name").type(username);
  cy.get("input#password").type(password);
  cy.get("input#login-button").click();
};

/**
 * Performs login and adds the Sauce Labs Backpack to the cart.
 */
const loginAndAddBackpack = () => {
  login("standard_user", "secret_sauce");
  cy.get("button#add-to-cart-sauce-labs-backpack").click();
};

module.exports = {
  login,
  loginAndAddBackpack,
};

