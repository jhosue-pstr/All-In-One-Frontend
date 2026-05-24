import type { Page } from '@playwright/test';

export class InicioPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/inicio');
  }

  async getWelcomeMessage() {
    return this.page.locator('.inicio-header h1');
  }

  async getStepCards() {
    return this.page.locator('.step-card');
  }

  async getTipsList() {
    return this.page.locator('.tips-list li');
  }

  async getQuickActions() {
    return this.page.locator('.action-btn');
  }
}
