import { apiFetch } from './api';

export interface PerfilData {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string | null;
  direccion_envio?: string | null;
  ciudad?: string | null;
  pais?: string | null;
  codigo_postal?: string | null;
}

export async function fetchProfile(): Promise<PerfilData> {
  return apiFetch<PerfilData>('/site-auth/me');
}

export async function loadProfile(block: HTMLElement): Promise<void> {
  try {
    const data = await fetchProfile();

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