import { describe, it, expect, vi, beforeEach } from 'vitest'
import { siteAuthService } from './siteAuth'

import { fetchApi } from './api'

const mockFetchApi = vi.fn()
vi.mock('./api', () => ({
  fetchApi: (...args: any[]) => mockFetchApi(...args),
}))

describe('siteAuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('register calls fetchApi with POST', async () => {
    const data = { correo: 'a@b.com', contrasena: '123', nombre: 'A', apellido: 'B', id_sitio: 1 }
    mockFetchApi.mockResolvedValue({ id: 1 })
    const result = await siteAuthService.register(data as any)
    expect(result).toEqual({ id: 1 })
    expect(mockFetchApi).toHaveBeenCalledWith('/site-auth/registro', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  })

  it('login calls fetchApi with POST', async () => {
    const data = { correo: 'a@b.com', contrasena: '123' }
    mockFetchApi.mockResolvedValue({ access_token: 'tok' })
    const result = await siteAuthService.login(data as any)
    expect(result).toEqual({ access_token: 'tok' })
    expect(mockFetchApi).toHaveBeenCalledWith('/site-auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  })

  it('logout calls fetchApi with POST', async () => {
    mockFetchApi.mockResolvedValue(undefined)
    await siteAuthService.logout()
    expect(mockFetchApi).toHaveBeenCalledWith('/site-auth/logout', {
      method: 'POST',
    })
  })

  it('me calls fetchApi with GET', async () => {
    mockFetchApi.mockResolvedValue({ id: 1, correo: 'a@b.com' })
    const result = await siteAuthService.me()
    expect(result).toEqual({ id: 1, correo: 'a@b.com' })
    expect(mockFetchApi).toHaveBeenCalledWith('/site-auth/me')
  })

  it('update calls fetchApi with PUT', async () => {
    const data = { nombre: 'New' }
    mockFetchApi.mockResolvedValue({ id: 1 })
    await siteAuthService.update(data as any)
    expect(mockFetchApi).toHaveBeenCalledWith('/site-auth/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  })

  it('verify calls fetchApi with token param', async () => {
    mockFetchApi.mockResolvedValue({ valido: true })
    const result = await siteAuthService.verify('abc123')
    expect(result).toEqual({ valido: true })
    expect(mockFetchApi).toHaveBeenCalledWith('/site-auth/verify?token=abc123')
  })

  it('verify encodes special characters in token', async () => {
    mockFetchApi.mockResolvedValue({ valido: true })
    await siteAuthService.verify('token/with+chars')
    expect(mockFetchApi).toHaveBeenCalledWith('/site-auth/verify?token=token%2Fwith%2Bchars')
  })
  it('listBySite should call fetchApi with site id query', async () => {
    const mockUsers = [
      { id: 1, nombre: 'Juan' },
    ]

    mockFetchApi.mockResolvedValue(mockUsers)

    const result = await siteAuthService.listBySite(99)

    expect(mockFetchApi).toHaveBeenCalledWith(
      '/site-auth/usuarios?site_id=99'
    )

    expect(result).toEqual(mockUsers)
  })

})
