import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Todo Application end-to-end tests.
 * Includes setup for local testing against the Dockerized environment.
 */
export default defineConfig({
  //trigger our custom Docker scripts
  globalSetup: require.resolve('./tests/utils/global.setup.ts'),
  globalTeardown: require.resolve('./tests/utils/global.teardown.ts'),

  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:4101',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshots on failure for easier debugging */
    screenshot: 'only-on-failure',
    
    /* Set a custom test id attribute to match the application's configuration */
    testIdAttribute: 'data-testid',
  },

  /* Configure projects for test setup and execution */
  projects: [
    // This runs logs in and saves the authentication state.
    {
      name: 'setup',
      testMatch: '**/utils/auth.setup.ts',
    },
    // This runs the login UI test without a preloaded authenticated session.
    {
      name: 'keycloak-login-ui',
      use: {
        ...devices['Desktop Chrome'],
      },
      testMatch: /.*login\.spec\.ts/,
    },
    // Main testing project. It depends on 'setup' and uses the saved state.
    {
      name: 'e2e-tests',
      use: {
        ...devices['Desktop Chrome'],
        // Tells this project to use the saved storage state.
        storageState: 'playwright/.auth/user.json',
      },
      testMatch: /.*frontend\.spec\.ts|.*api\.spec\.ts/,
      dependencies: ['setup'],
    }
  ],
});