import type { Page } from '@playwright/test';

export class WebEditorPage {
  constructor(private page: Page) {}

  async gotoPlantilla(id: number) {
    await this.page.goto(`/plantillas/${id}/editar`);
    await this.editorContainer.waitFor({ state: 'visible', timeout: 15000 });
  }

  async gotoSitio(id: number) {
    await this.page.goto(`/sitio/${id}/editar`);
  }

  get editorContainer() {
    return this.page.locator('.editor-container');
  }

  get editorTitle() {
    return this.page.locator('.editor-title');
  }

  get btnBack() {
    return this.page.locator('.btn-back');
  }

  get deviceButtons() {
    return this.page.locator('.panel__devices .gjs-pn-btn');
  }

  get btnSave() {
    return this.page.locator('.btn-save');
  }

  get btnBorders() {
    return this.page.locator('.btn-toggle-borders');
  }

  get btnExport() {
    return this.page.locator('.btn-open-export');
  }

  get panelTabs() {
    return this.page.locator('.tab-btn');
  }

  async selectPanel(panel: 'blocks' | 'layers' | 'styles' | 'pages') {
    await this.page.locator(`.tab-btn[data-panel="${panel}"]`).click({ force: true });
  }

  async selectDevice(device: 'Desktop' | 'Tablet' | 'Mobile') {
    await this.page.locator(`.panel__devices button[title="${device}"]`).click({ force: true });
  }
}
