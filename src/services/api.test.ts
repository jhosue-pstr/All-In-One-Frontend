import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchApi } from './api'

describe('fetchApi', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should make a GET request and return JSON', async () => {
    const mockData = { id: 1, name: 'test' }
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockData),
    })

    const result = await fetchApi<typeof mockData>('/test')
    expect(result).toEqual(mockData)
  })

  it('should include Authorization header when token exists', async () => {
    localStorage.setItem('token', 'my-token')
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    })

    await fetchApi('/test')
    const call = (globalThis.fetch as any).mock.calls[0]
    const headers = call[1].headers
    expect(headers.Authorization).toBe('Bearer my-token')
  })

  it('should throw on non-ok response with detail message', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ detail: 'Not found' }),
    })

    await expect(fetchApi('/test')).rejects.toThrow('Not found')
  })

  it('should handle 204 responses by returning empty object', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      json: () => Promise.resolve(),
    })

    const result = await fetchApi('/test')
    expect(result).toEqual({})
  })

  it('should use fallback error message when detail is missing', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({}),
    })
    await expect(fetchApi('/test')).rejects.toThrow('Error en la solicitud')
  })

  it('should use unknown fallback when error json throws', async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: false,
    json: () => Promise.reject(new Error('json fail')),
  })

  await expect(fetchApi('/test')).rejects.toThrow('Error desconocido')
  })
})
