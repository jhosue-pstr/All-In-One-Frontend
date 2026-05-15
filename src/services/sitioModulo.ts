import { fetchApi } from './api';

export const sitioModuloService = {
  getBySitio: (sitioId: number): Promise<number[]> =>
    fetchApi<number[]>(`/sitios/${sitioId}/modulos/`),

  add: (sitioId: number, moduloId: number): Promise<void> =>
    fetchApi<void>(`/sitios/${sitioId}/modulos/${moduloId}`, { method: 'POST' }),

  remove: (sitioId: number, moduloId: number): Promise<void> =>
    fetchApi<void>(`/sitios/${sitioId}/modulos/${moduloId}`, { method: 'DELETE' }),
};
