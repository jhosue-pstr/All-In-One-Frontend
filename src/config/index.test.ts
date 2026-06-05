import { describe, it, expect, vi, afterEach } from 'vitest'

describe('getApiUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('should use default API URL when VITE_API_BASE_URL is not defined', async () => {
    vi.unstubAllEnvs()
    vi.resetModules()

    const { API_CONFIG, getApiUrl } = await import('./index')

    expect(getApiUrl()).toBe('http://localhost:8000/api')
    expect(API_CONFIG.baseUrl).toBe('http://localhost:8000/api')
  })

  it('should use VITE_API_BASE_URL when it already ends with /api', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://backend:8000/api')
    vi.resetModules()

    const { API_CONFIG, getApiUrl } = await import('./index')

    expect(getApiUrl()).toBe('http://backend:8000/api')
    expect(API_CONFIG.baseUrl).toBe('http://backend:8000/api')
  })

  it('should append /api when VITE_API_BASE_URL does not include it', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://backend:8000')
    vi.resetModules()

    const { API_CONFIG, getApiUrl } = await import('./index')

    expect(getApiUrl()).toBe('http://backend:8000/api')
    expect(API_CONFIG.baseUrl).toBe('http://backend:8000/api')
  })

  it('should append /api and remove trailing slash when VITE_API_BASE_URL ends with slash', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://backend:8000/')
    vi.resetModules()

    const { API_CONFIG, getApiUrl } = await import('./index')

    expect(getApiUrl()).toBe('http://backend:8000/api')
    expect(API_CONFIG.baseUrl).toBe('http://backend:8000/api')
  })

  it('should use default API URL when VITE_API_BASE_URL is empty', async () => {
  vi.stubEnv('VITE_API_BASE_URL', '')
  vi.resetModules()

  const { API_CONFIG, getApiUrl } = await import('./index')

  expect(getApiUrl()).toBe('http://localhost:8000/api')
  expect(API_CONFIG.baseUrl).toBe('http://localhost:8000/api')
})
})