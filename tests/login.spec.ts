import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { TodoPage } from './pages/TodoPage';

test('should log in via Keycloak and verify the user name is displayed @frontend @smoke', async ({ page }) => {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error('Authentication credentials are missing from environment variables.');
  }

  const loginPage = new LoginPage(page);
  const todoPage = new TodoPage(page);

  // Performs the Keycloak authentication flow and validates the logged-in user.
  await loginPage.goto();
  await loginPage.initiateLogin();
  await loginPage.submitKeycloakCredentials(email, password);

  await expect(todoPage.userName).toBeVisible();
  await expect(todoPage.userName).toHaveText('Test User');
});