import type { APIRequestContext } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://localhost:8000/api';

function headers(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function createSitio(request: APIRequestContext, data: { nombre: string; slug: string }, token: string) {
  return request.post(`${API_URL}/sitios`, {
    headers: headers(token),
    data,
  });
}

export async function deleteSitio(request: APIRequestContext, id: number, token: string) {
  return request.delete(`${API_URL}/sitios/${id}`, {
    headers: headers(token),
  });
}

export async function createPlantilla(request: APIRequestContext, data: { nombre: string; slug: string; descripcion?: string; visibilidad?: string }, token: string) {
  return request.post(`${API_URL}/plantillas`, {
    headers: headers(token),
    data,
  });
}

export async function deletePlantilla(request: APIRequestContext, id: number, token: string) {
  return request.delete(`${API_URL}/plantillas/${id}`, {
    headers: headers(token),
  });
}

export async function deleteModulo(request: APIRequestContext, id: number, token: string) {
  return request.delete(`${API_URL}/modulos/${id}`, {
    headers: headers(token),
  });
}
