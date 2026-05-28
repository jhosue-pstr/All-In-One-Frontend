import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { handleLogin, handleRegister, handleLogout, initAuthBlocks } from './auth'

function createFormInBlock(attrs: {
  sitioId?: string
  values?: Record<string, string>
} = {}): { block: HTMLElement, form: HTMLFormElement } {
  const block = document.createElement('div')
  if (attrs.sitioId) block.setAttribute('data-sitio-id', attrs.sitioId)
  if (!attrs.sitioId) block.setAttribute('data-auth', 'login')

  const form = document.createElement('form')
  const errorEl = document.createElement('div')
  errorEl.className = 'auth-error'
  form.appendChild(errorEl)

  if (attrs.values) {
    Object.entries(attrs.values).forEach(([name, value]) => {
      const input = document.createElement('input')
      input.name = name
      input.value = value
      form.appendChild(input)
    })
  }

  const submitBtn = document.createElement('button')
  submitBtn.type = 'submit'
  submitBtn.textContent = 'Entrar'
  form.appendChild(submitBtn)

  block.appendChild(form)
  return { block, form }
}

describe('site-widget auth', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  describe('handleLogin', () => {
    it('shows error when sitio is not identified', async () => {
      const { form } = createFormInBlock()
      document.body.appendChild(form.closest('[data-auth]') || form.parentElement!)

      handleLogin(form)
      form.dispatchEvent(new Event('submit'))

      await vi.waitFor(() => {
        expect(form.querySelector('.auth-error')?.textContent).toBe('Error: sitio no identificado')
      })
    })

    it('shows error when fields are empty', async () => {
      const { block, form } = createFormInBlock({ sitioId: '1' })
      document.body.appendChild(block)

      handleLogin(form)
      form.dispatchEvent(new Event('submit'))

      await vi.waitFor(() => {
        expect(form.querySelector('.auth-error')?.textContent).toBe('Todos los campos son obligatorios')
      })
    })

    it('calls apiFetch and hides auth block on success', async () => {
      ;(globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ access_token: 'tok123' }),
      })

      const authBlock = document.createElement('div')
      authBlock.setAttribute('data-auth', 'login')
      authBlock.setAttribute('data-sitio-id', '5')
      const form = document.createElement('form')
      const errorEl = document.createElement('div')
      errorEl.className = 'auth-error'
      form.appendChild(errorEl)
      ;['correo', 'contrasena'].forEach(name => {
        const input = document.createElement('input')
        input.name = name
        input.value = 'test'
        form.appendChild(input)
      })
      const submitBtn = document.createElement('button')
      submitBtn.type = 'submit'
      submitBtn.textContent = 'Entrar'
      form.appendChild(submitBtn)
      authBlock.appendChild(form)
      document.body.appendChild(authBlock)

      handleLogin(form)
      form.dispatchEvent(new Event('submit'))

      await vi.waitFor(() => {
        expect(localStorage.getItem('site_token')).toBe('tok123')
        expect(authBlock.style.display).toBe('none')
      })
    })

    it('shows error on api failure', async () => {
      ;(globalThis.fetch as any).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ detail: 'Invalid credentials' }),
      })

      const { block, form } = createFormInBlock({ sitioId: '5', values: { correo: 'a@b.com', contrasena: 'wrong' } })
      document.body.appendChild(block)

      handleLogin(form)
      form.dispatchEvent(new Event('submit'))

      await vi.waitFor(() => {
        expect(form.querySelector('.auth-error')?.textContent).toBe('Invalid credentials')
      })
    })
  })

  describe('handleRegister', () => {
    it('shows error when sitio is not identified', async () => {
      const { form } = createFormInBlock()
      document.body.appendChild(form.parentElement!)

      handleRegister(form)
      form.dispatchEvent(new Event('submit'))

      await vi.waitFor(() => {
        expect(form.querySelector('.auth-error')?.textContent).toBe('Error: sitio no identificado')
      })
    })

    it('shows error when fields are empty', async () => {
      const { block, form } = createFormInBlock({ sitioId: '1' })
      document.body.appendChild(block)

      handleRegister(form)
      form.dispatchEvent(new Event('submit'))

      await vi.waitFor(() => {
        expect(form.querySelector('.auth-error')?.textContent).toBe('Todos los campos son obligatorios')
      })
    })

    it('calls apiFetch and shows success message', async () => {
      ;(globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 1 }),
      })

      const { block, form } = createFormInBlock({ sitioId: '3', values: { nombre: 'A', apellido: 'B', correo: 'a@b.com', contrasena: '123' } })
      document.body.appendChild(block)

      handleRegister(form)
      form.dispatchEvent(new Event('submit'))

      await vi.waitFor(() => {
        expect(form.innerHTML).toContain('Registro exitoso')
      })
    })

    it('shows error on api failure', async () => {
      ;(globalThis.fetch as any).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ detail: 'Email already exists' }),
      })

      const { block, form } = createFormInBlock({ sitioId: '3', values: { nombre: 'A', apellido: 'B', correo: 'a@b.com', contrasena: '123' } })
      document.body.appendChild(block)

      handleRegister(form)
      form.dispatchEvent(new Event('submit'))

      await vi.waitFor(() => {
        expect(form.querySelector('.auth-error')?.textContent).toBe('Email already exists')
      })
    })
  })

  describe('handleLogout', () => {
    it('clears token and reloads', async () => {
      ;(globalThis.fetch as any).mockResolvedValue({ ok: true })
      const reloadSpy = vi.fn()
      Object.defineProperty(window, 'location', {
        value: { reload: reloadSpy },
        writable: true,
      })
      localStorage.setItem('site_token', 'tok')

      const btn = document.createElement('button')
      handleLogout(btn)
      btn.click()

      await vi.waitFor(() => {
        expect(localStorage.getItem('site_token')).toBeNull()
        expect(reloadSpy).toHaveBeenCalled()
      })
    })

    it('ignores logout fetch error', async () => {
      ;(globalThis.fetch as any).mockRejectedValue(new Error('Network error'))
      const reloadSpy = vi.fn()
      Object.defineProperty(window, 'location', {
        value: { reload: reloadSpy },
        writable: true,
      })
      localStorage.setItem('site_token', 'tok')

      const btn = document.createElement('button')
      handleLogout(btn)
      btn.click()

      await vi.waitFor(() => {
        expect(localStorage.getItem('site_token')).toBeNull()
        expect(reloadSpy).toHaveBeenCalled()
      })
    })
  })

  describe('initAuthBlocks', () => {
    it('shows login block when not authenticated', () => {
      const block = document.createElement('div')
      block.setAttribute('data-auth', 'login')
      block.style.display = 'none'
      const form = document.createElement('form')
      block.appendChild(form)
      document.body.appendChild(block)

      initAuthBlocks()

      expect(block.style.display).toBe('')
      document.body.removeChild(block)
    })

    it('hides login block when authenticated and shows perfil', () => {
      const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }))
      localStorage.setItem('site_token', `header.${payload}.sig`)
      ;(globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 1, nombre: 'A', apellido: 'B', correo: 'a@b.com' }),
      })

      const loginBlock = document.createElement('div')
      loginBlock.setAttribute('data-auth', 'login')
      const form = document.createElement('form')
      loginBlock.appendChild(form)
      document.body.appendChild(loginBlock)

      const perfilBlock = document.createElement('div')
      perfilBlock.setAttribute('data-auth', 'perfil')
      perfilBlock.style.display = 'none'
      document.body.appendChild(perfilBlock)

      initAuthBlocks()

      expect(loginBlock.style.display).toBe('none')
      expect(perfilBlock.style.display).toBe('')
      document.body.removeChild(loginBlock)
      document.body.removeChild(perfilBlock)
    })
  })
})
