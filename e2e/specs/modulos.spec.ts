import { test, expect } from '@playwright/test';
import { ModulosPage } from '../pages/ModulosPage';

test.describe('Módulos', () => {
  let modulosPage: ModulosPage;

  test.beforeEach(async ({ page }) => {
    modulosPage = new ModulosPage(page);
    await modulosPage.goto();
  });

  test('should display page header', async () => {
    await expect(modulosPage.pageHeader).toBeVisible();
    await expect(modulosPage.pageHeader).toHaveText('Módulos');
  });

  test('should show sitios list in sidebar', async () => {
    await expect(modulosPage.sitiosList).toBeVisible();
  });

  test('should show modulo cards when a sitio is selected', async ({ page }) => {
    const sitioItems = await page.locator('.sitio-item').count();
    if (sitioItems > 0) {
      await page.locator('.sitio-item').first().click();
      await expect(modulosPage.selectedSitioName).toBeVisible();
      await expect(modulosPage.moduloCards).not.toHaveCount(0);
    }
  });
});
