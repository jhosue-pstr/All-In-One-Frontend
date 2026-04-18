import type { Plantilla, PlantillaCreate, PlantillaUpdate } from '../models';
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

export const plantillaService = {
  async getAll(): Promise<Plantilla[]> {
    return fetchApi<Plantilla[]>('/plantillas');
  },

  async getById(id: number): Promise<Plantilla> {
    return fetchApi<Plantilla>(`/plantillas/${id}`);
  },

  async create(data: PlantillaCreate): Promise<Plantilla> {
    return fetchApi<Plantilla>('/plantillas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: PlantillaUpdate): Promise<Plantilla> {
    return fetchApi<Plantilla>(`/plantillas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: number): Promise<void> {
    return fetchApi<void>(`/plantillas/${id}`, {
      method: 'DELETE',
    });
  },
};