# 📝 Todo Application — E2E Test Automation Framework

A robust, fully automated End-to-End (E2E) testing framework for the **Todo Application**. This project validates both the **React Frontend UI** and the **.NET Backend API** using Playwright and TypeScript, with a fully containerized local test environment.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Automation Framework | [Playwright](https://playwright.dev/) |
| Language | TypeScript |
| Design Pattern | Page Object Model (POM) |
| Infrastructure | Docker & Docker Compose |
| Authentication | Keycloak (OIDC) |
| CI/CD | Fully headless execution with HTML reporting |

---

## 📁 Repository Structure

```text
qatask-solution/
├── tests/
│   ├── pages/                    # Page Object Model (POM) classes
│   │   ├── LoginPage.ts          # UI locators and methods for Keycloak login
│   │   └── TodoPage.ts           # UI locators and methods for the Todo app
│   ├── utils/                    # Helper classes and global scripts
│   │   ├── ApiHelper.ts          # REST API wrapper for backend endpoints
│   │   ├── Helper.ts             # Shared utilities (e.g., timestamps)
│   │   ├── global.setup.ts       # Docker startup & health checks
│   │   ├── global.teardown.ts    # Docker teardown & cleanup
│   │   └── auth.setup.ts         # Global Keycloak session generator
│   ├── api.spec.ts               # Backend API test suite
│   └── frontend.spec.ts          # Frontend UI test suite
│   └── login.spec.ts             # Login via UI test suite
├── playwright.config.ts          # Playwright configuration and project dependencies
├── BUG_REPORT.md                 # Documentation of discovered application defects
└── README.md                     # Project documentation
```

---

## ⚙️ Prerequisites

Ensure the following are installed and running on your local machine before proceeding:

- **Node.js** v18 or higher
- **Docker Desktop** — must be running prior to test execution

---

## 🚀 Installation & Configuration

**1. Clone the repository and install dependencies:**

```bash
npm install
```

**2. Install Playwright browsers:**

```bash
npx playwright install --with-deps
```

**3. Configure environment variables:**

Create a `.env` file in the root directory with the following test credentials:

```env
TEST_USER_EMAIL=testuser@example.com
TEST_USER_PASSWORD=TestPassword123!
```

---

## 🎮 Test Execution

> **Note:** You do not need to manually start Docker containers. Playwright's Global Setup/Teardown will automatically spin up the environment, wait for it to be healthy, run all tests, and tear it down on completion.

**Run the full test suite (UI & API) in headless mode:**

```bash
npx playwright test
```

**Run specific suites using tags:**

```bash
npx playwright test --grep @frontend      # Frontend tests only
npx playwright test --grep @api           # API tests only
npx playwright test --grep @smoke         # Smoke tests only
npx playwright test --grep @regression    # Regression tests only
```

**Run with the browser visible (debug mode):**

```bash
npx playwright test --grep @frontend --headed
```

---

## 📊 Reporting

Playwright generates a comprehensive HTML report after each run, including execution times, step-by-step traces, and screenshots for any failures.

**View the report:**

```bash
npx playwright show-report
```

---

## 🏗 Framework Architecture

### Smart Authentication
`auth.setup.ts` runs as the first project in the Playwright dependency chain. It logs into Keycloak once and saves the session state to disk. All subsequent UI tests inject this saved state directly, bypassing the login screen entirely — improving both speed and stability.

### Test Isolation & Data Cleanup
API network interception is used during UI tests to capture the IDs of any newly created Todo items. A global `afterEach` hook silently deletes these items via the API after each test, ensuring a clean state for every subsequent run.

---

## 🐛 Defect Tracking

Defects discovered during the development of this framework are fully documented in [`BUG_REPORT.md`](./BUG_REPORT.md), covering:

- Backend API failures
- Frontend UI state issues
- Keycloak logout configuration errors