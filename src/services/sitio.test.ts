import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sitioService } from './sitio'

vi.mock('./api', () => ({
  API_URL: 'http://test.com/api',
  fetchApi: vi.fn(),
}))

import { fetchApi } from './api'

const mockSitios = [
  { id: 1, nombre: 'Sitio 1', url: 'https://sitio1.com' },
  { id: 2, nombre: 'Sitio 2', url: 'https://sitio2.com' },
]

describe('sitioService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('returns array response directly', async () => {
      vi.mocked(fetchApi).mockResolvedValue(mockSitios)
      const result = await sitioService.getAll()
      expect(fetchApi).toHaveBeenCalledWith('/sitios')
      expect(result).toEqual(mockSitios)
    })

    it('extracts data from wrapped response', async () => {
      vi.mocked(fetchApi).mockResolvedValue({ data: mockSitios })
      const result = await sitioService.getAll()
      expect(result).toEqual(mockSitios)
    })

    it('returns empty array for unknown response format', async () => {
      vi.mocked(fetchApi).mockResolvedValue({ foo: 'bar' })
      const result = await sitioService.getAll()
      expect(result).toEqual([])
    })
  })

  describe('getById', () => {
    it('calls fetchApi with correct endpoint', async () => {
      vi.mocked(fetchApi).mockResolvedValue(mockSitios[0])
      const result = await sitioService.getById(1)
      expect(fetchApi).toHaveBeenCalledWith('/sitios/1')
      expect(result).toEqual(mockSitios[0])
    })
  })

  describe('create', () => {
    it('calls fetchApi with POST', async () => {
      const data = { nombre: 'New Site', url: 'https://new.com' }
      vi.mocked(fetchApi).mockResolvedValue({ id: 3, ...data })
      const result = await sitioService.create(data as any)
      expect(fetchApi).toHaveBeenCalledWith('/sitios/', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      expect(result).toMatchObject(data)
    })
  })

  describe('update', () => {
    it('calls fetchApi with PUT', async () => {
      const data = { nombre: 'Updated' }
      vi.mocked(fetchApi).mockResolvedValue({ id: 1, ...data })
      const result = await sitioService.update(1, data as any)
      expect(fetchApi).toHaveBeenCalledWith('/sitios/1', {
        method: 'PUT',
        body: JSON.stringify(data),
      })
      expect(result).toMatchObject(data)
    })
  })

  describe('delete', () => {
    it('calls fetchApi with DELETE', async () => {
      vi.mocked(fetchApi).mockResolvedValue(undefined)
      await sitioService.delete(1)
      expect(fetchApi).toHaveBeenCalledWith('/sitios/1', { method: 'DELETE' })
    })
  })

  describe('getModulos', () => {
    it('returns array response directly', async () => {
      vi.mocked(fetchApi).mockResolvedValue([1, 2, 3])
      const result = await sitioService.getModulos(1)
      expect(fetchApi).toHaveBeenCalledWith('/sitios/1/modulos/')
      expect(result).toEqual([1, 2, 3])
    })

    it('extracts data from wrapped response', async () => {
      vi.mocked(fetchApi).mockResolvedValue({ data: [4, 5] })
      const result = await sitioService.getModulos(1)
      expect(result).toEqual([4, 5])
    })

    it('returns empty array for unknown format', async () => {
      vi.mocked(fetchApi).mockResolvedValue(null)
      const result = await sitioService.getModulos(1)
      expect(result).toEqual([])
    })
  })
})
