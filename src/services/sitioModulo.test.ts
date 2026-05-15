import { describe, it, expect, vi } from 'vitest'
import { sitioModuloService } from './sitioModulo'

const mockFetchApi = vi.fn()

vi.mock('./api', () => ({
  fetchApi: (...args: any[]) => mockFetchApi(...args),
}))

describe('sitioModuloService', () => {
  it('getBySitio should call fetchApi with correct endpoint', async () => {
    mockFetchApi.mockResolvedValue([1, 2, 3])
    const result = await sitioModuloService.getBySitio(1)
    expect(mockFetchApi).toHaveBeenCalledWith('/sitios/1/modulos/')
    expect(result).toEqual([1, 2, 3])
  })

  it('add should call fetchApi with POST', async () => {
    mockFetchApi.mockResolvedValue(undefined)
    await sitioModuloService.add(1, 5)
    expect(mockFetchApi).toHaveBeenCalledWith('/sitios/1/modulos/5', { method: 'POST' })
  })

  it('remove should call fetchApi with DELETE', async () => {
    mockFetchApi.mockResolvedValue(undefined)
    await sitioModuloService.remove(1, 5)
    expect(mockFetchApi).toHaveBeenCalledWith('/sitios/1/modulos/5', { method: 'DELETE' })
  })
})
