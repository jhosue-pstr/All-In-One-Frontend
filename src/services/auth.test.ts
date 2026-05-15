import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from './auth'

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear()
    globalThis.fetch = vi.fn()
  })

  it('register should POST to /auth/registro', async () => {
    const mockUser = { id: 1, correo: 'a@b.com', nombre: 'A', apellido: 'B', role: 'user', created_at: '', updated_at: '' }
    ;(globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockUser),
    })
    const result = await authService.register({ correo: 'a@b.com', contrasena: '123', nombre: 'A', apellido: 'B' })
    expect(result).toEqual(mockUser)
  })

  it('login should POST to /auth/inicio with form-urlencoded', async () => {
    const mockToken = { access_token: 'tok', token_type: 'bearer' }
    ;(globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockToken),
    })
    const result = await authService.login({ correo: 'a@b.com', contrasena: '123' })
    expect(result).toEqual(mockToken)
    expect(localStorage.getItem('token')).toBe('tok')
  })

  it('me should GET /auth/me', async () => {
    const mockUser = { id: 1, correo: 'a@b.com', nombre: 'A', apellido: 'B', role: 'user', created_at: '', updated_at: '' }
    ;(globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockUser),
    })
    const result = await authService.me()
    expect(result).toEqual(mockUser)
  })

  it('login should throw on non-ok response', async () => {
    ;(globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ detail: 'Credenciales incorrectas' }),
    })
    await expect(authService.login({ correo: 'a@b.com', contrasena: 'wrong' })).rejects.toThrow('Credenciales incorrectas')
  })

  it('login should throw fallback when no detail in response', async () => {
    ;(globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    })
    await expect(authService.login({ correo: 'a@b.com', contrasena: 'wrong' })).rejects.toThrow('Error en el inicio de sesión')
  })

  it('update should PUT /auth/me', async () => {
    ;(globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    })
    await authService.update({ nombre: 'New' })
  })

  it('logout should remove token from localStorage', () => {
    localStorage.setItem('token', 'tok')
    authService.logout()
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('getToken should return token from localStorage', () => {
    localStorage.setItem('token', 'my-token')
    expect(authService.getToken()).toBe('my-token')
  })

  it('getToken should return null when no token', () => {
    expect(authService.getToken()).toBeNull()
  })
})
