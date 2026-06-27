# Cypress Test Suite — SauceDemo & One Piece API

## Installation & Running

**Requirements:** Node.js v18+

```bash
npm install
```

Run all tests (headless):

```bash
npx cypress run
```

Run specific folder:

```bash
npx cypress run --spec "cypress/tests/api/**"
npx cypress run --spec "cypress/tests/ui/**"
npx cypress run --spec "cypress/tests/ui/functional/**"
npx cypress run --spec "cypress/tests/ui/bugs/**"
```

Open interactive runner:

```bash
npx cypress open
```

---

## What's Covered

### API Tests

Validates the [One Piece Character API](https://api.api-onepiece.com/v2/characters/en):

- Status code is 200
- All character IDs are unique
- Gum-Gum Fruit is exclusive to Monkey D. Luffy
- Each crew's total bounty matches the sum of its members' bounties

### UI Tests — SauceDemo

Covers the full checkout flow of [saucedemo.com](https://www.saucedemo.com) across 6 pages: Login, Inventory, Cart, Checkout Step One, Checkout Step Two, and Checkout Complete.

Tests are split into two categories:

#### `functional/` — Standard tests (expected to pass)

Positive, negative, and edge case tests using `standard_user`.

#### `bugs/` — Bug regression tests (expected to fail)

Each file targets a specific user account that exhibits known bugs. A failing test = bug confirmed.

| File                            | User                      | Bug                                                     |
| ------------------------------- | ------------------------- | ------------------------------------------------------- |
| `standard_user_bugs.cy.js`      | `standard_user`           | Checkout allowed with empty cart                        |
| `problem_user.cy.js`            | `problem_user`            | Broken product images, Bolt T-Shirt button unresponsive |
| `error_user.cy.js`              | `error_user`              | Checkout form fails to submit                           |
| `visual_user.cy.js`             | `visual_user`             | Buttons and layout elements misaligned                  |
| `performance_glitch_user.cy.js` | `performance_glitch_user` | Page load exceeds 3 seconds                             |

---

## Project Structure

```
cypress/
├── tests/
│   ├── api/
│   │   └── api_validation.cy.js
│   └── ui/
│       ├── functional/        ← standard tests (should pass)
│       └── bugs/              ← regression tests (expected to fail)
├── utils/
│   ├── uiHelper.js            ← login helpers
│   ├── constants.js           ← URLs
│   └── numberHelper.js        ← number parsing utility
cypress-output/                ← screenshots, videos, downloads (gitignored)
```

## Test Credentials

All tests run against `https://www.saucedemo.com`. Password for all accounts: `secret_sauce`.
