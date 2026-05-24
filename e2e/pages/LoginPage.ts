import type { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async login(email: string, password: string) {
    await this.page.fill('#correo', email);
    await this.page.fill('#contrasena', password);
    await this.page.click('button[type="submit"]');
  }

  async getErrorMessage() {
    return this.page.locator('.error-message');
  }

  async isLoginFormVisible() {
    return this.page.locator('.login-form').isVisible();
  }

  async clickRegisterLink() {
    await this.page.click('.switch-btn');
  }
}
