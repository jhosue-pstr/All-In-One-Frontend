import { test, expect } from '@playwright/test';
import { WebEditorPage } from '../pages/WebEditorPage';

async function obtenerPlantillaIdValida(page): Promise<number> {
  await page.goto('/plantillas', { waitUntil: 'networkidle' });

  const token = await page.evaluate(() => {
    return (
      localStorage.getItem('token') ||
      localStorage.getItem('access_token') ||
      localStorage.getItem('authToken') ||
      ''
    );
  });

  const apiBaseUrl = process.env.VITE_API_BASE_URL || 'http://backend:8000/api';
  const uid = Date.now();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const listarResp = await page.request.get(`${apiBaseUrl}/plantillas`, {
    headers,
  });

  if (listarResp.ok()) {
    const data = await listarResp.json();
    const plantillas = Array.isArray(data) ? data : data.items || data.data || [];

    if (plantillas.length > 0 && plantillas[0].id) {
      return plantillas[0].id;
    }
  }

  const crearResp = await page.request.post(`${apiBaseUrl}/plantillas`, {
    headers,
    data: {
      nombre: `Plantilla E2E ${uid}`,
      slug: `plantilla-e2e-${uid}`,
      descripcion: 'Plantilla creada para prueba E2E del editor',
      html: '<section><h1>Plantilla E2E</h1><p>Contenido de prueba</p></section>',
      css: '',
      contenido: '<section><h1>Plantilla E2E</h1><p>Contenido de prueba</p></section>',
    },
  });

  expect(crearResp.ok()).toBeTruthy();

  const creada = await crearResp.json();
  return creada.id;
}

test.describe('WebEditor (GrapesJS)', () => {
  let editorPage: WebEditorPage;
  let plantillaId: number;

  test.beforeEach(async ({ page }) => {
    editorPage = new WebEditorPage(page);
    plantillaId = await obtenerPlantillaIdValida(page);
  });

  test('should return 404 or redirect when accessing without valid id', async ({ page }) => {
    await page.goto('/plantillas/99999/editar', { waitUntil: 'networkidle' });

    await expect(page).toHaveURL(/\/inicio|\/plantillas|\/editar/);
  });

  test('should display editor container when valid plantilla accessed', async () => {
    await editorPage.gotoPlantilla(plantillaId);
    await expect(editorPage.editorContainer).toBeVisible();
  });

  test('should show editor toolbar elements', async () => {
    await editorPage.gotoPlantilla(plantillaId);

    await expect(editorPage.btnBack).toBeVisible();
    await expect(editorPage.editorTitle).toBeVisible();

    await expect(editorPage.deviceButtons.first()).toBeVisible();
    await expect(editorPage.btnSave).toBeVisible();
  });

  test('should switch devices', async () => {
    await editorPage.gotoPlantilla(plantillaId);

    await editorPage.selectDevice('Tablet');
    await expect(editorPage.page.locator('.panel__devices .gjs-pn-active').first()).toBeVisible();

    await editorPage.selectDevice('Mobile');
    await expect(editorPage.page.locator('.panel__devices .gjs-pn-active').first()).toBeVisible();

    await editorPage.selectDevice('Desktop');
    await expect(editorPage.page.locator('.panel__devices .gjs-pn-active').first()).toBeVisible();
  });

  test('should switch right panel tabs', async () => {
    await editorPage.gotoPlantilla(plantillaId);

    await editorPage.selectPanel('layers');
    await expect(
      editorPage.page.locator('.layers-container, .gjs-layer-manager').first(),
    ).toBeVisible();

    await editorPage.selectPanel('blocks');
    await expect(
      editorPage.page.locator('.panel-content.active, .gjs-blocks-c').first(),
    ).toBeVisible();
  });
});