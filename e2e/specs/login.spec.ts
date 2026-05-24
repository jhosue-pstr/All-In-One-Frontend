import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should show login form', async () => {
    await expect(loginPage.isLoginFormVisible()).toBeTruthy();
    await expect(page.locator('h2')).toContainText('Iniciar Sesión');
  });

  test('should show error with invalid credentials', async () => {
    await loginPage.login('invalid@email.com', 'wrongpass');
    const error = await loginPage.getErrorMessage();
    await expect(error).toBeVisible();
  });

  test('should show register link', async ({ page }) => {
    await expect(page.locator('.switch-btn')).toHaveText('Regístrate');
  });
});
