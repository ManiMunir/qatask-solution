import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly loginWithKeycloakButton: Locator;
  readonly keycloakUsernameInput: Locator;
  readonly keycloakPasswordInput: Locator;
  readonly keycloakSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginWithKeycloakButton = page.getByText('Log In with Keycloak');
    this.keycloakUsernameInput = page.locator('#username');
    this.keycloakPasswordInput = page.locator('#password');
    this.keycloakSubmitButton = page.locator('#kc-login');
  }

  /**
   * Navigates to the base URL of the application.
   */
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /**
   * Initiates the login flow by clicking the Keycloak login button.
   */
  async initiateLogin(): Promise<void> {
    await this.loginWithKeycloakButton.click();
  }

  /**
   * Fills in the Keycloak authentication form and submits it.
   * @param email The user's email address.
   * @param password The user's password.
   */
  async submitKeycloakCredentials(email: string, password: string): Promise<void> {
    await this.keycloakUsernameInput.fill(email);
    await this.keycloakPasswordInput.fill(password);
    await this.keycloakSubmitButton.click();
  }
}