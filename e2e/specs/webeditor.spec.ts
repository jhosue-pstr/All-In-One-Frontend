import { test, expect } from '@playwright/test';
import { WebEditorPage } from '../pages/WebEditorPage';

test.describe('WebEditor (GrapesJS)', () => {
  let editorPage: WebEditorPage;

  test.beforeEach(async ({ page }) => {
    editorPage = new WebEditorPage(page);
  });

  test('should return 404 or redirect when accessing without valid id', async ({ page }) => {
    await page.goto('/plantillas/99999/editar', { waitUntil: 'networkidle' });
    await page.waitForURL(/\/inicio/, { timeout: 15000 });
    expect(page.url()).toContain('/inicio');
  });

  test('should display editor container when valid plantilla accessed', async () => {
    await editorPage.gotoPlantilla(1);
    await expect(editorPage.editorContainer).toBeVisible();
  });

  test('should show editor toolbar elements', async () => {
    await editorPage.gotoPlantilla(1);

    await expect(editorPage.btnBack).toBeVisible();
    await expect(editorPage.editorTitle).toContainText('Editor');

    await expect(editorPage.deviceButtons).toHaveCount(3);

    await expect(editorPage.btnSave).toBeVisible();
    await expect(editorPage.btnBorders).toBeVisible();
  });

  test('should switch devices', async () => {
    await editorPage.gotoPlantilla(1);

    await editorPage.selectDevice('Tablet');
    await expect(editorPage.page.locator('.panel__devices .gjs-pn-active')).toHaveAttribute('title', 'Tablet');

    await editorPage.selectDevice('Mobile');
    await expect(editorPage.page.locator('.panel__devices .gjs-pn-active')).toHaveAttribute('title', 'Mobile');

    await editorPage.selectDevice('Desktop');
    await expect(editorPage.page.locator('.panel__devices .gjs-pn-active')).toHaveAttribute('title', 'Desktop');
  });

  test('should switch right panel tabs', async () => {
    await editorPage.gotoPlantilla(1);

    await editorPage.selectPanel('layers');
    await expect(editorPage.page.locator('.layers-container')).toBeVisible();

    await editorPage.selectPanel('blocks');
    await expect(editorPage.page.locator('.panel-content.active')).toBeVisible();
  });
});
