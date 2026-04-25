import type { Modulo, ModuloCreate, ModuloUpdate } from '../models';
import { fetchApi } from './api';

export const moduloService = {
  async getAll(): Promise<Modulo[]> {
    return fetchApi<Modulo[]>('/modulos/');
  },
  async getById(id: number): Promise<Modulo> {
    return fetchApi<Modulo>(`/modulos/${id}`);
  },
  async create(data: ModuloCreate): Promise<Modulo> {
    return fetchApi<Modulo>('/modulos/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async update(id: number, data: ModuloUpdate): Promise<Modulo> {
    return fetchApi<Modulo>(`/modulos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async delete(id: number): Promise<void> {
    return fetchApi<void>(`/modulos/${id}`, {
      method: 'DELETE',
    });
  },
};