import type { Sitio, SitioCreate, SitioUpdate } from '../models';
import { getApiUrl } from '../config';

const API_URL = getApiUrl();

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Error desconocido' }));
    throw new Error(error.detail || 'Error en la solicitud');
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const sitioService = {
  async getAll(): Promise<Sitio[]> {
    return fetchApi<Sitio[]>('/sitios/mis-sitios');
  },

  async getById(id: number): Promise<Sitio> {
    return fetchApi<Sitio>(`/sitios/${id}`);
  },

  async create(data: SitioCreate): Promise<Sitio> {
    return fetchApi<Sitio>('/sitios/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: SitioUpdate): Promise<Sitio> {
    return fetchApi<Sitio>(`/sitios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: number): Promise<void> {
    return fetchApi<void>(`/sitios/${id}`, {
      method: 'DELETE',
    });
  },

  async uploadMinatura(id: number, file: File): Promise<string> {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/sitios/${id}/miniatura`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Error al subir la miniatura' }));
      throw new Error(error.detail || 'Error al subir la miniatura');
    }

    const data = await response.json();
    return data.url;
  },
};