import type { Page } from '@playwright/test';

export class ModulosPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/modulos');
  }

  get pageHeader() {
    return this.page.locator('.page-header h1');
  }

  get sitiosList() {
    return this.page.locator('.sitios-list');
  }

  sitioItem(name: string) {
    return this.page.locator('.sitio-item').filter({ hasText: name });
  }

  get selectedSitioName() {
    return this.page.locator('.modulos-header h2');
  }

  get moduloCards() {
    return this.page.locator('.modulo-card-detail');
  }

  get enabledModulos() {
    return this.page.locator('.modulo-card-detail.enabled');
  }

  async toggleModulo(moduloName: string) {
    const card = this.page.locator('.modulo-card-detail').filter({ hasText: moduloName });
    const toggle = card.locator('.toggle-switch');
    await toggle.click();
  }

  async selectSitio(name: string) {
    await this.sitioItem(name).click();
  }
}
