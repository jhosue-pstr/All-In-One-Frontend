import { apiFetch } from './api';

export async function loadProfile(block: HTMLElement): Promise<void> {
  try {
    const data = await apiFetch<{
      id: number;
      nombre: string;
      apellido: string;
      correo: string;
    }>('/site-auth/me');

    const nombreEl = block.querySelector('[data-perfil="nombre_completo"]');
    if (nombreEl) {
      nombreEl.textContent = `${data.nombre} ${data.apellido}`;
    }

    const correoEl = block.querySelector('[data-perfil="correo"]');
    if (correoEl) {
      correoEl.textContent = data.correo;
    }

    const avatarEl = block.querySelector('[data-perfil="avatar"]') as HTMLImageElement;
    if (avatarEl) {
      const inicial = (data.nombre?.charAt(0) || 'U').toUpperCase();
      avatarEl.src = `https://placehold.co/80x80/667eea/ffffff?text=${inicial}`;
    }
  } catch {
    const bloqueAuth = document.querySelector('[data-auth="login"]') as HTMLElement;
    if (bloqueAuth) {
      bloqueAuth.style.display = '';
    }
    block.style.display = 'none';
  }
}
