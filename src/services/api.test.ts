import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchApi } from './api'

describe('fetchApi', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
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

  it('should not include Content-Type when body is FormData', async () => {
    const formData = new FormData()
    formData.append('file', new File(['test'], 'test.png'))

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ ok: true }),
    })

    await fetchApi('/upload', {
      method: 'POST',
      body: formData,
    })

    const call = (globalThis.fetch as any).mock.calls[0]
    const headers = call[1].headers

    expect(headers['Content-Type']).toBeUndefined()
  })

  it('should throw on non-ok response with detail message', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ detail: 'Not found' }),
    })

    await expect(fetchApi('/test')).rejects.toThrow('Not found')
    expect(window.alert).toHaveBeenCalledWith('Not found')
  })

  it('should show permission alert on 403 response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      json: () => Promise.resolve({ detail: 'No tienes permiso: roles.ver' }),
    })

    await expect(fetchApi('/test')).rejects.toThrow('No tienes permiso: roles.ver')

    const alertMessage = vi.mocked(window.alert).mock.calls[0][0] as string

    expect(alertMessage).toContain('No tienes permisos para realizar esta acción')
    expect(alertMessage).toContain('No tienes permiso: roles.ver')
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
      status: 500,
      json: () => Promise.resolve({}),
    })

    await expect(fetchApi('/test')).rejects.toThrow('Error en la solicitud')
    expect(window.alert).toHaveBeenCalledWith('Error en la solicitud')
  })

  it('should use unknown fallback when error json throws', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error('json fail')),
    })

    await expect(fetchApi('/test')).rejects.toThrow('Error desconocido')
    expect(window.alert).toHaveBeenCalledWith('Error desconocido')
  })
})