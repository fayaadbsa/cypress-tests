const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Force 100% zoom (device scale factor = 1) on Chrome/Chromium-based browsers
      // so that cy.screenshot() always captures at true 1:1 pixel ratio
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.family === "chromium") {
          launchOptions.args.push("--force-device-scale-factor=1");
          launchOptions.args.push("--high-dpi-support=1");
        }
        return launchOptions;
      });
    },
    supportFile: false,
    specPattern: "cypress/tests/**/*.cy.{js,jsx,ts,tsx}",
    screenshotsFolder: "cypress-output/screenshots",
    videosFolder: "cypress-output/videos",
    downloadsFolder: "cypress-output/downloads",
    chromeWebSecurity: false,
    // Lock viewport to a standard 1:1 resolution — no OS scaling applied
    viewportWidth: 1280,
    viewportHeight: 800,
  },
});


