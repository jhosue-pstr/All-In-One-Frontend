import type { DashboardResponse, VisitaCreate, EventoCreate } from '../models';
import { fetchApi } from './api';

export const analiticaService = {
  async getDashboard(siteId: number, dias: number = 7): Promise<DashboardResponse> {
    return fetchApi<DashboardResponse>(`/modules/analitica/${siteId}/dashboard?dias=${dias}`);
  },

  async registrarVisita(siteId: number, data: VisitaCreate): Promise<void> {
    await fetchApi(`/modules/analitica/${siteId}/visitas`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async registrarEvento(siteId: number, data: EventoCreate): Promise<void> {
    await fetchApi(`/modules/analitica/${siteId}/eventos`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
