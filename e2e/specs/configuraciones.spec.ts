import { test, expect } from '@playwright/test';
import { ConfiguracionesPage } from '../pages/ConfiguracionesPage';

test.describe('Configuraciones', () => {
  let configPage: ConfiguracionesPage;

  test.beforeEach(async ({ page }) => {
    configPage = new ConfiguracionesPage(page);
    await configPage.goto();
  });

  test('should display page header', async () => {
    await expect(configPage.pageHeader).toBeVisible();
    await expect(configPage.pageHeader).toHaveText('Configuraciones');
  });

  test('should show all nav tabs', async () => {
    await expect(configPage.navTabs).toHaveCount(4);
  });

  test('should switch between tabs', async () => {
    await configPage.selectTab('Seguridad');
    await expect(configPage.inputNuevaContrasena).toBeVisible();
    await expect(configPage.inputConfirmarContrasena).toBeVisible();

    await configPage.selectTab('Perfil');
    await expect(configPage.inputNombre).toBeVisible();
    await expect(configPage.inputApellido).toBeVisible();
  });

  test('should show perfil form with user data', async () => {
    await expect(configPage.inputNombre).toBeVisible();
    await expect(configPage.inputApellido).toBeVisible();
    await expect(configPage.inputCorreo).toBeDisabled();
  });

  test('should show notification preferences', async () => {
    await configPage.selectTab('Notificaciones');
    await expect(configPage.page.locator('.checkbox-label')).toHaveCount(3);
    await expect(configPage.page.locator('button:has-text("Guardar preferencias")')).toBeVisible();
  });
});
