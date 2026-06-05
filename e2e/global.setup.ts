import { test as setup } from '@playwright/test';

const authFile = 'e2e/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set');
  }

  await page.goto('/');

  if (process.env.CI) {
    await page.waitForTimeout(3000);
    console.log('=== DEBUG CI BEFORE LOGIN ===');
    console.log('URL:', page.url());
    console.log('Title:', await page.title());

    const hasRoot = await page.$('#root');
    console.log('Has #root:', !!hasRoot);

    if (hasRoot) {
      const rootHTML = await page.evaluate(
        () => document.getElementById('root')?.innerHTML?.substring(0, 2000) || 'empty',
      );
      console.log('Root innerHTML:', rootHTML);
    }

    const body = await page.evaluate(
      () => document.body?.innerText?.substring(0, 500) || 'empty',
    );
    console.log('Body text:', body);
    console.log('=== END DEBUG CI BEFORE LOGIN ===');
  }

  const loginResponsePromise = page
    .waitForResponse(
      (response) => response.url().includes('/auth/inicio'),
      { timeout: 20000 },
    )
    .catch(() => null);

  await page.fill('#correo', email);
  await page.fill('#contrasena', password);

  await page.click('button[type="submit"]');

  const loginResponse = await loginResponsePromise;

  if (!loginResponse) {
    console.log('No hubo respuesta del endpoint /auth/inicio');
  } else {
    console.log('Login status:', loginResponse.status());
    console.log('Login url:', loginResponse.url());

    const loginBody = await loginResponse.text().catch(() => 'No se pudo leer body');
    console.log('Login body:', loginBody);
  }

  console.log('URL despues del login:', page.url());
  console.log(
    'Body despues del login:',
    await page.locator('body').innerText().catch(() => 'No se pudo leer body'),
  );

  await page.waitForURL('**/inicio', { timeout: 60000 });

  await page.locator('.inicio-header h1').waitFor({
    state: 'visible',
    timeout: 60000,
  });

  await page.context().storageState({ path: authFile });
});