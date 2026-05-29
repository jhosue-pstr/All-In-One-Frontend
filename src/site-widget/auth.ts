import { apiFetch, setToken, clearToken, isAuthenticated } from './api';
import { loadProfile } from './perfil';
import { refreshCarritoUI } from './tienda';

function getSitioId(element: HTMLElement): number | null {
  const closestElement = element.closest<HTMLElement>('[data-sitio-id]');
  const id = closestElement?.dataset.sitioId;

  return id ? Number(id) : null;
}

function showError(form: HTMLElement, message: string): void {
  const errorEl = form.querySelector('.auth-error') as HTMLElement;
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
}

function hideError(form: HTMLElement): void {
  const errorEl = form.querySelector('.auth-error') as HTMLElement;
  if (errorEl) {
    errorEl.style.display = 'none';
  }
}

export function handleLogin(form: HTMLFormElement): void {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError(form);

    const sitioId = getSitioId(form);
    if (!sitioId) {
      showError(form, 'Error: sitio no identificado');
      return;
    }

    const formData = new FormData(form);
    const correo = formData.get('correo') as string;
    const contrasena = formData.get('contrasena') as string;

    if (!correo || !contrasena) {
      showError(form, 'Todos los campos son obligatorios');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Entrando...';
    }

    try {
      const data = await apiFetch<{ access_token: string }>('/site-auth/login', {
        method: 'POST',
        body: JSON.stringify({ correo, contrasena, id_sitio: sitioId }),
      });

      setToken(data.access_token);
      refreshCarritoUI();

      const bloqueAuth = form.closest('[data-auth]') as HTMLElement;
      if (bloqueAuth) {
        bloqueAuth.style.display = 'none';
      }

      const perfilBloque = document.querySelector('[data-auth="perfil"]') as HTMLElement;
      if (perfilBloque) {
        perfilBloque.style.display = '';
        loadProfile(perfilBloque);
      }
    } catch (err) {
      showError(form, err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Entrar';
      }
    }
  });
}

export function handleRegister(form: HTMLFormElement): void {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError(form);

    const sitioId = getSitioId(form);
    if (!sitioId) {
      showError(form, 'Error: sitio no identificado');
      return;
    }

    const formData = new FormData(form);
    const nombre = formData.get('nombre') as string;
    const apellido = formData.get('apellido') as string;
    const correo = formData.get('correo') as string;
    const contrasena = formData.get('contrasena') as string;
    const telefono = formData.get('telefono') as string;

    if (!nombre || !apellido || !correo || !contrasena) {
      showError(form, 'Todos los campos son obligatorios');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Registrando...';
    }

    try {
      await apiFetch('/site-auth/registro', {
        method: 'POST',
        body: JSON.stringify({ nombre, apellido, correo, contrasena, telefono: telefono || null, id_sitio: sitioId }),
      });

      form.innerHTML = `
        <div style="text-align:center;padding:20px;">
          <p style="color:#27ae60;font-size:18px;font-weight:600;">¡Registro exitoso!</p>
          <p style="color:#666;">Ahora puedes iniciar sesión.</p>
          <button type="button" style="padding:12px 24px;background:#667eea;color:white;border:none;border-radius:6px;font-size:16px;cursor:pointer;" onclick="window.location.reload()">
            Iniciar Sesión
          </button>
        </div>
      `;
    } catch (err) {
      showError(form, err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Registrarse';
      }
    }
  });
}

export function handleLogout(btn: HTMLElement): void {
  btn.addEventListener('click', async () => {
    try {
      await apiFetch('/site-auth/logout', { method: 'POST' });
    } catch {
      // Ignorar error de logout
    }
    clearToken();
    window.location.reload();
  });
}

export function initAuthBlocks(): void {
  const loginBlocks = document.querySelectorAll<HTMLElement>('[data-auth="login"]');
  loginBlocks.forEach((block) => {
    const form = block.querySelector('form');
    if (form) {
      if (isAuthenticated()) {
        block.style.display = 'none';
        const perfilBloque = document.querySelector('[data-auth="perfil"]') as HTMLElement;
        if (perfilBloque) {
          perfilBloque.style.display = '';
          loadProfile(perfilBloque);
        }
      } else {
        block.style.display = '';
        handleLogin(form);
      }
    }
  });

  const registerBlocks = document.querySelectorAll<HTMLElement>('[data-auth="registro"]');
  registerBlocks.forEach((block) => {
    const form = block.querySelector('form');
    if (form) {
      handleRegister(form);
    }
  });

  const logoutBtns = document.querySelectorAll<HTMLElement>('[data-auth="logout"]');
  logoutBtns.forEach(handleLogout);

  const perfilBlocks = document.querySelectorAll<HTMLElement>('[data-auth="perfil"]');
  perfilBlocks.forEach((block) => {
    if (isAuthenticated()) {
      block.style.display = '';
      loadProfile(block);
    } else {
      block.style.display = 'none';
    }
  });
}
