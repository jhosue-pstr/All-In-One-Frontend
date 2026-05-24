import { test as setup } from '@playwright/test';

const authFile = 'e2e/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set');
  }

  await page.goto('/');
  await page.fill('#correo', email);
  await page.fill('#contrasena', password);
  await page.click('button[type="submit"]');

  await page.waitForURL('/inicio');
  await page.locator('.inicio-header h1').waitFor({ state: 'visible' });

  await page.context().storageState({ path: authFile });
});
