import { describe, it, expect, vi } from 'vitest'
import { analiticaService } from './analitica'

vi.mock('./api', () => ({
  fetchApi: vi.fn(),
}))

import { fetchApi } from './api'

describe('analiticaService', () => {
  it('getDashboard calls fetchApi with correct endpoint and default dias', async () => {
    const mockData = { resumen: {}, visitas_por_dia: [] }
    vi.mocked(fetchApi).mockResolvedValue(mockData)
    const result = await analiticaService.getDashboard(1)
    expect(fetchApi).toHaveBeenCalledWith('/modules/analitica/1/dashboard?dias=7')
    expect(result).toEqual(mockData)
  })

  it('getDashboard uses custom dias parameter', async () => {
    vi.mocked(fetchApi).mockResolvedValue({})
    await analiticaService.getDashboard(2, 30)
    expect(fetchApi).toHaveBeenCalledWith('/modules/analitica/2/dashboard?dias=30')
  })

  it('registrarVisita calls fetchApi with POST', async () => {
    const data = { url: '/test', titulo_pagina: 'Test', session_id: 'abc' }
    vi.mocked(fetchApi).mockResolvedValue(undefined)
    await analiticaService.registrarVisita(1, data)
    expect(fetchApi).toHaveBeenCalledWith('/modules/analitica/1/visitas', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  })

  it('registrarEvento calls fetchApi with POST', async () => {
    const data = { tipo: 'click', etiqueta: 'btn', url: '/test', session_id: 'abc' }
    vi.mocked(fetchApi).mockResolvedValue(undefined)
    await analiticaService.registrarEvento(1, data)
    expect(fetchApi).toHaveBeenCalledWith('/modules/analitica/1/eventos', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  })
})
