import type { Page } from '@playwright/test';

export class PlantillasPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/plantillas');
  }

  get pageHeader() {
    return this.page.locator('.page-header h1');
  }

  get btnNuevaPlantilla() {
    return this.page.locator('button:has-text("+ Nueva Plantilla")');
  }

  get modal() {
    return this.page.locator('dialog[open]');
  }

  get modalTitle() {
    return this.modal.locator('#modal-title');
  }

  get inputNombre() {
    return this.page.locator('#plantilla-nombre');
  }

  get inputSlug() {
    return this.page.locator('#plantilla-slug');
  }

  get inputDescripcion() {
    return this.page.locator('#plantilla-descripcion');
  }

  get btnCrear() {
    return this.modal.locator('button[type="submit"]');
  }

  get btnCancelar() {
    return this.modal.locator('button:has-text("Cancelar")');
  }

  get tabMisPlantillas() {
    return this.page.locator('.tab').filter({ hasText: 'Mis Plantillas' });
  }

  get tabComunidad() {
    return this.page.locator('.tab').filter({ hasText: 'Comunidad' });
  }

  get plantillaCards() {
    return this.page.locator('.plantilla-card');
  }

  async createPlantilla(nombre: string, slug: string, descripcion?: string) {
    await this.btnNuevaPlantilla.click();
    await this.modal.waitFor({ state: 'visible' });
    await this.inputNombre.fill(nombre);
    await this.inputSlug.fill(slug);
    if (descripcion) {
      await this.inputDescripcion.fill(descripcion);
    }
    await this.btnCrear.click();
  }

  async selectVisibilidad(visibilidad: 'PUBLICA' | 'PRIVADA') {
    await this.modal.locator(`input[name="visibilidad"][value="${visibilidad}"]`).check();
  }

  async getPlantillaCardByName(nombre: string) {
    return this.page.locator('.plantilla-card').filter({ hasText: nombre });
  }

  async clickEditPlantilla(name: string) {
    const card = this.page.locator('.plantilla-card').filter({ hasText: name });
    await card.locator('.btn-edit').click();
  }

  async clickDeletePlantilla(name: string) {
    const card = this.page.locator('.plantilla-card').filter({ hasText: name });
    await card.locator('.btn-delete').click();
  }
}
