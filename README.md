# Cypress Test Suite (API & UI Validation)

This repository contains Cypress automated tests for validating the One Piece Character API and testing user interface flows and bugs on SauceDemo.

---

## What It Is

This test suite covers two main categories of tests:

1. **API Validation Tests (One Piece Character API)**
   - Validates status codes, unique identifiers, exclusivity rules for specific characters (e.g. Gum-Gum fruit mapping), and bounty balancing (bounty sum vs total prime values).
   - Designed to run against the live API endpoint: `https://api.api-onepiece.com/v2/characters/en`.

2. **UI Validation Tests (SauceDemo E2E)**
   - Performs positive and negative verification across 6 core pages of `https://www.saucedemo.com/`:
     - Login Page
     - Inventory Page
     - Cart Page
     - Checkout Step One
     - Checkout Step Two
     - Checkout Complete Page
   - Includes specific test specs that target and expose known website bugs (e.g. Empty Cart checkout, Problem User issues, and Error User form failures).

## Project Structure

- **`cypress/tests/api/api_validation.cy.js`**: Implementations of API tests.
- **`cypress/tests/ui/ui_validation.cy.js`**: Implementations of UI tests.
- **`cypress/utils/numberHelper.js`**: Reusable number parsing utility.
- **`cypress/temp/`**: Temporary run artifacts (screenshots, videos, downloads) ignored by git.

## Installation

Ensure you have **Node.js** (v18+) installed. Clone the repository, navigate into the directory, and install dependencies:

```bash
npm install
```

---

## How to Run Tests

### 1. Headless Mode (CLI)

_By default, the `cypress run` commands below run headlessly in the command line (tests run in the background without opening a visible browser window)._

#### Run All Tests

Run all test specs headlessly:

```bash
npm run test
```

#### Run Only API Validation Tests

Run only the API validation specs:

```bash
npm run test:api
```

#### Run Only UI Validation Tests

Run only the SauceDemo UI specs:

```bash
npm run test:ui
```

For Headed mode

```bash
npm run test:ui -- --headed
```

### 2. Interactive Mode (Cypress App)

Open the interactive Cypress Test Runner to visually step through the tests:

```bash
npm run cypress:open
```

Once the runner opens, select **E2E Testing** and choose a browser (e.g., Chrome or Electron). You can then select and run individual specs (`api_validation.cy.js` or `ui_validation.cy.js`) in the browser.
