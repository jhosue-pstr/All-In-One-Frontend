import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setToken, clearToken, isAuthenticated, apiFetch } from './api'

describe('site-widget api', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('setToken', () => {
    it('stores token in localStorage', () => {
      setToken('my-token')
      expect(localStorage.getItem('site_token')).toBe('my-token')
    })
  })

  describe('clearToken', () => {
    it('removes token from localStorage', () => {
      localStorage.setItem('site_token', 'my-token')
      clearToken()
      expect(localStorage.getItem('site_token')).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('returns true when token exists', () => {
      localStorage.setItem('site_token', 'tok')
      expect(isAuthenticated()).toBe(true)
    })

    it('returns false when no token', () => {
      expect(isAuthenticated()).toBe(false)
    })
  })

  describe('apiFetch', () => {
    it('makes GET request and returns JSON', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: 'ok' }),
      })

      const result = await apiFetch('/test')
      expect(result).toEqual({ data: 'ok' })
      expect(globalThis.fetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }))
    })

    it('includes Authorization header when token exists', async () => {
      localStorage.setItem('site_token', 'bearer-tok')
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      })

      await apiFetch('/test')
      const call = (globalThis.fetch as any).mock.calls[0]
      expect(call[1].headers.Authorization).toBe('Bearer bearer-tok')
    })

    it('throws on non-ok response with detail', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ detail: 'Error message' }),
      })

      await expect(apiFetch('/test')).rejects.toThrow('Error message')
    })

    it('throws fallback error when detail is missing', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.reject(new Error('parse error')),
      })

      await expect(apiFetch('/test')).rejects.toThrow('Error en la solicitud')
    })

    it('returns empty object for 204 response', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
        json: () => Promise.resolve(),
      })

      const result = await apiFetch('/test')
      expect(result).toEqual({})
    })
  })
})
