import { test as setup, expect } from '@playwright/test';
import * as path from 'path';
import { LoginPage } from './pages/LoginPage';
import { TodoPage } from './pages/TodoPage';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

/**
 * Authenticates the user via Keycloak and saves the browser storage state.
 * This state is utilized by subsequent tests to bypass repetitive UI authentication.
 * * Requires TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables.
 */
setup('authenticate user', async ({ page }) => {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error('Authentication credentials are missing from environment variables.');
  }

  const loginPage = new LoginPage(page);
  const todoPage = new TodoPage(page);

  await loginPage.goto();
  await loginPage.initiateLogin();
  await loginPage.submitKeycloakCredentials(email, password);

  await expect(todoPage.userName).toBeVisible({ timeout: 10000 });
  await expect(todoPage.userName).toHaveText('Test User');

  await page.context().storageState({ path: authFile });
});