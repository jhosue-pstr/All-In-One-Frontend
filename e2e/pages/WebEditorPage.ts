import type { Page, Locator } from '@playwright/test';

export class WebEditorPage {
  constructor(public page: Page) {}

  async gotoPlantilla(id: number) {
    await this.page.goto(`/plantillas/${id}/editar`, {
      waitUntil: 'domcontentloaded',
    });

    await this.page.waitForLoadState('networkidle');

    await this.editorContainer.waitFor({
      state: 'visible',
      timeout: 30000,
    });
  }

  async gotoSitio(id: number) {
    await this.page.goto(`/sitio/${id}/editar`, {
      waitUntil: 'domcontentloaded',
    });

    await this.page.waitForLoadState('networkidle');
  }

  get editorContainer(): Locator {
    return this.page.locator('.editor-container, .gjs-editor').first();
  }

  get editorTitle(): Locator {
    return this.page.locator('.editor-title, h1, h2').first();
  }

  get btnBack(): Locator {
    return this.page.locator('.btn-back, button:has-text("Volver")').first();
  }

  get deviceButtons(): Locator {
    return this.page.locator('.panel__devices .gjs-pn-btn, .panel__devices button');
  }

  get btnSave(): Locator {
    return this.page.locator('.btn-save, button:has-text("Guardar")').first();
  }

  get btnBorders(): Locator {
    return this.page.locator('.btn-toggle-borders, button[title*="border" i], button[title*="borde" i]').first();
  }

  get btnExport(): Locator {
    return this.page.locator('.btn-open-export').first();
  }

  get panelTabs(): Locator {
    return this.page.locator('.tab-btn');
  }

  async selectPanel(panel: 'blocks' | 'layers' | 'styles' | 'pages') {
    const tab = this.page.locator(`.tab-btn[data-panel="${panel}"]`).first();

    if (await tab.count()) {
      await tab.click({ force: true });
      return;
    }

    const fallbackText =
      panel === 'blocks'
        ? 'Bloques'
        : panel === 'layers'
          ? 'Capas'
          : panel === 'styles'
            ? 'Estilos'
            : 'Páginas';

    await this.page.getByText(fallbackText, { exact: false }).first().click({ force: true });
  }

  async selectDevice(device: 'Desktop' | 'Tablet' | 'Mobile') {
    const button = this.page.locator(`.panel__devices button[title="${device}"]`).first();

    if (await button.count()) {
      await button.click({ force: true });
      return;
    }

    await this.page.locator(`button[title="${device}"], .gjs-pn-btn[title="${device}"]`).first().click({
      force: true,
    });
  }
}