import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { loadProfile } from './perfil'

describe('site-widget perfil', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('loads profile data and updates DOM elements', async () => {
    ;(globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 1, nombre: 'Juan', apellido: 'Perez', correo: 'juan@test.com' }),
    })

    const block = document.createElement('div')
    const nombreEl = document.createElement('span')
    nombreEl.setAttribute('data-perfil', 'nombre_completo')
    const correoEl = document.createElement('span')
    correoEl.setAttribute('data-perfil', 'correo')
    const avatarEl = document.createElement('img')
    avatarEl.setAttribute('data-perfil', 'avatar')
    block.appendChild(nombreEl)
    block.appendChild(correoEl)
    block.appendChild(avatarEl)

    await loadProfile(block)

    expect(nombreEl.textContent).toBe('Juan Perez')
    expect(correoEl.textContent).toBe('juan@test.com')
    expect(avatarEl.src).toContain('placehold.co')
    expect(avatarEl.src).toContain('J')
  })

  it('handles missing DOM elements gracefully', async () => {
    ;(globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 1, nombre: 'A', apellido: 'B', correo: 'a@b.com' }),
    })

    const block = document.createElement('div')
    await expect(loadProfile(block)).resolves.toBeUndefined()
  })

  it('shows login block and hides perfil on fetch error', async () => {
    ;(globalThis.fetch as any).mockRejectedValue(new Error('Network error'))

    const loginBlock = document.createElement('div')
    loginBlock.setAttribute('data-auth', 'login')
    loginBlock.style.display = 'none'
    document.body.appendChild(loginBlock)

    const perfilBlock = document.createElement('div')
    perfilBlock.style.display = ''
    document.body.appendChild(perfilBlock)

    await loadProfile(perfilBlock)

    expect(loginBlock.style.display).toBe('')
    expect(perfilBlock.style.display).toBe('none')
    document.body.removeChild(loginBlock)
    document.body.removeChild(perfilBlock)
  })

  it('handles fetch error when login block is missing', async () => {
    ;(globalThis.fetch as any).mockRejectedValue(new Error('Network error'))

    const perfilBlock = document.createElement('div')
    perfilBlock.style.display = ''

    await loadProfile(perfilBlock)

    expect(perfilBlock.style.display).toBe('none')
  })
})
