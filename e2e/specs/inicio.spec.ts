import { test, expect } from '@playwright/test';
import { InicioPage } from '../pages/InicioPage';

test.describe('Inicio (Dashboard)', () => {
  let inicioPage: InicioPage;

  test.beforeEach(async ({ page }) => {
    inicioPage = new InicioPage(page);
    await inicioPage.goto();
  });

  test('should display welcome message', async () => {
    const msg = await inicioPage.getWelcomeMessage();
    await expect(msg).toBeVisible();
    await expect(msg).toHaveText('Bienvenido a All in One');
  });

  test('should show 4 step cards', async () => {
    const steps = await inicioPage.getStepCards();
    await expect(steps).toHaveCount(4);
  });

  test('should show tips list', async () => {
    const tips = await inicioPage.getTipsList();
    await expect(tips).toHaveCount(4);
  });

  test('should have 3 quick action links', async () => {
    const actions = await inicioPage.getQuickActions();
    await expect(actions).toHaveCount(3);
  });

  test('should navigate to sitios via quick action', async ({ page }) => {
    await page.locator('a[href="/sitios"]').first().click();
    await expect(page).toHaveURL('/sitios');
  });
});
