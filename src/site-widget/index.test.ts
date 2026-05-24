import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('site-widget index', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    localStorage.clear()
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('hides login blocks when token exists and shows perfil', async () => {
    localStorage.setItem('site_token', 'tok123')
    ;(globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 1, nombre: 'A', apellido: 'B', correo: 'a@b.com' }),
    })

    const loginBlock = document.createElement('div')
    loginBlock.setAttribute('data-auth', 'login')
    loginBlock.style.display = ''
    document.body.appendChild(loginBlock)

    const perfilBlock = document.createElement('div')
    perfilBlock.setAttribute('data-auth', 'perfil')
    perfilBlock.style.display = 'none'
    document.body.appendChild(perfilBlock)

    await import('./index')

    await vi.waitFor(() => {
      expect(loginBlock.style.display).toBe('none')
      expect(perfilBlock.style.display).toBe('')
    })
  })

  it('keeps login blocks visible when no token exists', async () => {
    const loginBlock = document.createElement('div')
    loginBlock.setAttribute('data-auth', 'login')
    loginBlock.style.display = ''
    const form = document.createElement('form')
    loginBlock.appendChild(form)
    document.body.appendChild(loginBlock)

    await import('./index')

    await vi.waitFor(() => {
      expect(loginBlock.style.display).toBe('')
    })
  })
})
