import { test, expect } from '@playwright/test';
import { ModulosPage } from '../pages/ModulosPage';
import { SitiosPage } from '../pages/SitiosPage';

test.describe('Módulos', () => {
  let modulosPage: ModulosPage;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage({ storageState: 'e2e/.auth/user.json' });
    const sitiosPage = new SitiosPage(page);
    await sitiosPage.goto();
    const cards = await sitiosPage.sitioCards.count();
    if (cards === 0) {
      await sitiosPage.btnNuevoSitio.click();
      await sitiosPage.modal.waitFor({ state: 'visible' });
      await sitiosPage.inputNombre.fill('Test Sitio Modulos');
      await sitiosPage.inputSlug.fill('test-sitio-modulos');
      await sitiosPage.btnCrear.click();
      await expect(sitiosPage.modal).not.toBeVisible();
    }
    await page.close();
  });

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
