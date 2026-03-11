import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Todo Application end-to-end tests.
 * Includes setup for local testing against the Dockerized environment.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
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

  /* Configure projects for major browsers */
  projects: [
    // This project runs first and saves the authentication state
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    // This is our main testing project. It depends on 'setup' and uses the saved state.
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Tell this project to use the saved storage state
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    }
  ],
});