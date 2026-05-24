import type { Page } from '@playwright/test';

export class SitiosPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/sitios');
  }

  get pageHeader() {
    return this.page.locator('.page-header h1');
  }

  get btnNuevoSitio() {
    return this.page.locator('button:has-text("+ Nuevo Sitio")');
  }

  get modal() {
    return this.page.locator('dialog[open]');
  }

  get modalTitle() {
    return this.modal.locator('#modal-title');
  }

  get inputNombre() {
    return this.page.locator('#sitio-nombre');
  }

  get inputSlug() {
    return this.page.locator('#sitio-slug');
  }

  get btnCrear() {
    return this.modal.locator('button[type="submit"]');
  }

  get btnCancelar() {
    return this.modal.locator('button:has-text("Cancelar")');
  }

  get sitioCards() {
    return this.page.locator('.sitio-card');
  }

  sitioCard(id: number) {
    return this.page.locator(`.sitio-card:has(h3)`).filter({ hasText: String(id) });
  }

  async createSitio(nombre: string, slug: string) {
    await this.btnNuevoSitio.click();
    await this.modal.waitFor({ state: 'visible' });
    await this.inputNombre.fill(nombre);
    await this.inputSlug.fill(slug);
    await this.btnCrear.click();
  }

  async getSitioCardByName(nombre: string) {
    return this.page.locator('.sitio-card').filter({ hasText: nombre });
  }

  async clickEditSitio(name: string) {
    const card = this.page.locator('.sitio-card').filter({ hasText: name });
    await card.locator('.btn-edit').click();
  }

  async clickDeleteSitio(name: string) {
    const card = this.page.locator('.sitio-card').filter({ hasText: name });
    await card.locator('.btn-delete').click();
  }
}
