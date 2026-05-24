import type { Page } from '@playwright/test';

export class ConfiguracionesPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/configuraciones');
  }

  get pageHeader() {
    return this.page.locator('.page-header h1');
  }

  get navTabs() {
    return this.page.locator('.nav-tab');
  }

  tab(name: string) {
    return this.page.locator('.nav-tab').filter({ hasText: name });
  }

  get inputNombre() {
    return this.page.locator('#nombre');
  }

  get inputApellido() {
    return this.page.locator('#apellido');
  }

  get inputCorreo() {
    return this.page.locator('#correo');
  }

  get btnGuardarPerfil() {
    return this.page.locator('button[type="submit"]').filter({ hasText: /Guardar cambios/ });
  }

  get inputNuevaContrasena() {
    return this.page.locator('#nueva-contrasena');
  }

  get inputConfirmarContrasena() {
    return this.page.locator('#confirmar-contrasena');
  }

  get btnActualizarContrasena() {
    return this.page.locator('button[type="submit"]').filter({ hasText: /Actualizar contraseña/ });
  }

  get successMessage() {
    return this.page.locator('.message.success');
  }

  get errorMessage() {
    return this.page.locator('.message.error');
  }

  async selectTab(tabName: string) {
    await this.tab(tabName).click();
  }

  async updateProfile(nombre: string, apellido: string) {
    await this.inputNombre.fill(nombre);
    await this.inputApellido.fill(apellido);
    await this.btnGuardarPerfil.click();
  }
}
