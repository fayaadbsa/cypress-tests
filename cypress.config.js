const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    supportFile: false,
    specPattern: "cypress/tests/**/*.cy.{js,jsx,ts,tsx}",
    screenshotsFolder: "cypress/temp/screenshots",
    videosFolder: "cypress/temp/videos",
    downloadsFolder: "cypress/temp/downloads",
  },
});

