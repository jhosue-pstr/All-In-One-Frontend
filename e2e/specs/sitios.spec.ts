import { test, expect } from '@playwright/test';
import { SitiosPage } from '../pages/SitiosPage';

test.describe('Sitios', () => {
  let sitiosPage: SitiosPage;

  test.beforeEach(async ({ page }) => {
    sitiosPage = new SitiosPage(page);
    await sitiosPage.goto();
  });

  test('should display page header', async () => {
    await expect(sitiosPage.pageHeader).toBeVisible();
    await expect(sitiosPage.pageHeader).toHaveText('Sitios');
  });

  test('should show Nuevo Sitio button', async () => {
    await expect(sitiosPage.btnNuevoSitio).toBeVisible();
  });

  test('should open create modal on button click', async () => {
    await sitiosPage.btnNuevoSitio.click();
    await expect(sitiosPage.modal).toBeVisible();
    await expect(sitiosPage.modalTitle).toHaveText('Nuevo Sitio');
  });

  test('should close modal on cancel', async () => {
    await sitiosPage.btnNuevoSitio.click();
    await expect(sitiosPage.modal).toBeVisible();
    await sitiosPage.btnCancelar.click();
    await expect(sitiosPage.modal).not.toBeVisible();
  });

  test('should create a sitio with blank canvas', async ({ page }) => {
    const nombre = `Test Sitio ${Date.now()}`;
    const slug = `test-sitio-${Date.now()}`;

    await sitiosPage.createSitio(nombre, slug);

    await expect(sitiosPage.modal).not.toBeVisible();
    await expect(page).toHaveURL(/\/sitio\/\d+\/editar/);
  });

  test('should show sitio card after creation', async () => {
    await expect(sitiosPage.sitioCards.first()).toBeVisible();
  });
});
