import type { APIRequestContext } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://localhost:8000/api';

export async function deleteSitio(request: APIRequestContext, id: number, token: string) {
  return request.delete(`${API_URL}/sitios/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deletePlantilla(request: APIRequestContext, id: number, token: string) {
  return request.delete(`${API_URL}/plantillas/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deleteModulo(request: APIRequestContext, id: number, token: string) {
  return request.delete(`${API_URL}/modulos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
