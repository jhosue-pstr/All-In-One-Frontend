import { test, expect } from '@playwright/test';
import { PlantillasPage } from '../pages/PlantillasPage';

test.describe('Plantillas', () => {
  let plantillasPage: PlantillasPage;

  test.beforeEach(async ({ page }) => {
    plantillasPage = new PlantillasPage(page);
    await plantillasPage.goto();
  });

  test('should display page header', async () => {
    await expect(plantillasPage.pageHeader).toBeVisible();
    await expect(plantillasPage.pageHeader).toHaveText('Plantillas');
  });

  test('should show tabs', async () => {
    await expect(plantillasPage.tabMisPlantillas).toBeVisible();
    await expect(plantillasPage.tabComunidad).toBeVisible();
  });

  test('should open create modal on button click', async () => {
    await plantillasPage.btnNuevaPlantilla.click();
    await expect(plantillasPage.modal).toBeVisible();
    await expect(plantillasPage.modalTitle).toHaveText('Nueva Plantilla');
  });

  test('should close modal on cancel', async () => {
    await plantillasPage.btnNuevaPlantilla.click();
    await expect(plantillasPage.modal).toBeVisible();
    await plantillasPage.btnCancelar.click();
    await expect(plantillasPage.modal).not.toBeVisible();
  });

  test('should create a plantilla', async () => {
    const nombre = `Test Plantilla ${Date.now()}`;
    const slug = `test-plantilla-${Date.now()}`;

    await plantillasPage.createPlantilla(nombre, slug, 'Test description');

    await expect(plantillasPage.modal).not.toBeVisible();
    await expect(plantillasPage.getPlantillaCardByName(nombre)).toBeVisible();
  });

  test('should select visibility option in create modal', async () => {
    await plantillasPage.btnNuevaPlantilla.click();
    await plantillasPage.selectVisibilidad('PUBLICA');
    const radio = plantillasPage.modal.locator('input[name="visibilidad"][value="PUBLICA"]');
    await expect(radio).toBeChecked();
  });

  test('should switch between tabs', async () => {
    await plantillasPage.tabComunidad.click();
    await expect(plantillasPage.tabComunidad).toHaveClass(/active/);

    await plantillasPage.tabMisPlantillas.click();
    await expect(plantillasPage.tabMisPlantillas).toHaveClass(/active/);
  });
});
