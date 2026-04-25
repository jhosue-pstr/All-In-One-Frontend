import type { Plantilla, PlantillaCreate, PlantillaUpdate } from '../models';
import { fetchApi } from './api';

export const plantillaService = {
  async getAll(): Promise<Plantilla[]> {
    return fetchApi<Plantilla[]>('/plantillas');
  },
  async getPublicas(): Promise<Plantilla[]> {
    return fetchApi<Plantilla[]>('/plantillas/publicas');
  },
  async getMisPlantillas(): Promise<Plantilla[]> {
    return fetchApi<Plantilla[]>('/plantillas/mis-plantillas');
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