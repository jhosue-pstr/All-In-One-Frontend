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
      it('shows perfil block after successful login', async () => {
        ;(globalThis.fetch as any).mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({
            access_token: 'tok123',
          }),
        })

        const loginBlock = document.createElement('div')
        loginBlock.setAttribute('data-auth', 'login')
        loginBlock.setAttribute('data-sitio-id', '1')

        const perfilBlock = document.createElement('div')
        perfilBlock.setAttribute('data-auth', 'perfil')
        perfilBlock.style.display = 'none'

        const form = document.createElement('form')

        ;['correo','contrasena'].forEach(name => {
          const input = document.createElement('input')
          input.name = name
          input.value = 'x'
          form.appendChild(input)
        })

        const error = document.createElement('div')
        error.className='auth-error'
        form.appendChild(error)

        loginBlock.appendChild(form)

        document.body.appendChild(loginBlock)
        document.body.appendChild(perfilBlock)

        handleLogin(form)

        form.dispatchEvent(new Event('submit'))

        await vi.waitFor(() => {
          expect(perfilBlock.style.display)
            .toBe('')
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
    it('initAuthBlocks handles login block without form',()=>{
      document.body.innerHTML=`
        <div data-auth="login"></div>
      `

      expect(()=>initAuthBlocks()).not.toThrow()
    })

    it('initAuthBlocks handles register block without form',()=>{
      document.body.innerHTML=`
        <div data-auth="registro"></div>
      `

      expect(()=>initAuthBlocks()).not.toThrow()
    })

    it('authenticated login block without perfil block', () => {
      const payload = btoa(JSON.stringify({
        exp: Math.floor(Date.now() / 1000) + 3600,
      }))

      localStorage.setItem('site_token', `header.${payload}.sig`)

      document.body.innerHTML = `
        <div data-auth="login">
          <form></form>
        </div>
      `

      initAuthBlocks()

      expect(
        document.querySelector<HTMLElement>('[data-auth="login"]')!.style.display
      ).toBe('none')
    })
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

    it('initializes register forms', () => {
      const block = document.createElement('div')
      block.setAttribute('data-auth', 'registro')

      const form = document.createElement('form')
      block.appendChild(form)
      document.body.appendChild(block)

      expect(() => initAuthBlocks()).not.toThrow()
    })

    it('hides perfil block when not authenticated', () => {
      localStorage.clear()

      const perfil = document.createElement('div')

      perfil.setAttribute(
        'data-auth',
        'perfil',
      )

      perfil.style.display=''

      document.body.appendChild(perfil)

      initAuthBlocks()

      expect(
        perfil.style.display
      ).toBe('none')
    })
  })

  it('handleLogin works without auth-error element', () => {
  document.body.innerHTML = `
    <div data-sitio-id="1">
      <form>
        <input name="correo" value="" />
        <input name="contrasena" value="" />
      </form>
    </div>
  `

  const form = document.querySelector('form')!

  expect(() => {
    handleLogin(form)
    form.dispatchEvent(new Event('submit'))
  }).not.toThrow()
})

it('login success without auth container', async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ access_token: 'tok' }),
  })

  document.body.innerHTML = `
    <div data-sitio-id="1">
      <form>
        <input name="correo" value="a@a.com"/>
        <input name="contrasena" value="123"/>
        <button type="submit">Entrar</button>
      </form>
    </div>
  `

  const form = document.querySelector('form')!
  handleLogin(form)

  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))

  await vi.waitFor(() => {
    expect(localStorage.getItem('site_token')).toBe('tok')
  })
})
it('login uses fallback message for non Error throw', async () => {
  globalThis.fetch = vi.fn().mockRejectedValue('boom')

  document.body.innerHTML = `
    <div data-sitio-id="1">
      <form>
        <div class="auth-error"></div>
        <input name="correo" value="a"/>
        <input name="contrasena" value="b"/>
      </form>
    </div>
  `

  const form = document.querySelector('form')!
  handleLogin(form)

  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))

  await vi.waitFor(() => {
    expect(document.querySelector('.auth-error')?.textContent)
      .toContain('Error al iniciar sesión')
  })
})
it('register works without submit button', async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({}),
  })

  document.body.innerHTML = `
    <div data-sitio-id="1">
      <form>
        <input name="nombre" value="Juan"/>
        <input name="apellido" value="Perez"/>
        <input name="correo" value="a@a.com"/>
        <input name="contrasena" value="123"/>
      </form>
    </div>
  `

  const form = document.querySelector('form')!
  handleRegister(form)

  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))

  await vi.waitFor(() => {
    expect(form.innerHTML).toContain('Registro exitoso')
  })

  
})

it('register uses fallback message for non Error throw', async () => {
  globalThis.fetch = vi.fn().mockRejectedValue("boom")

  document.body.innerHTML = `
    <div data-sitio-id="1">
      <form>
        <div class="auth-error"></div>

        <input name="nombre" value="Juan"/>
        <input name="apellido" value="Perez"/>
        <input name="correo" value="a@a.com"/>
        <input name="contrasena" value="123"/>

        <button type="submit">Registrarse</button>
      </form>
    </div>
  `

  const form = document.querySelector('form')!

  handleRegister(form)

  form.dispatchEvent(
    new Event('submit', {
      bubbles: true,
      cancelable: true,
    })
  )

  await vi.waitFor(() => {
    expect(
      document.querySelector('.auth-error')?.textContent
    ).toContain('Error al registrarse')
  })

  




  
})

it('register uses fallback message for non Error throw', async () => {
  globalThis.fetch = vi.fn().mockRejectedValue("boom")

  document.body.innerHTML = `
    <div data-sitio-id="1">
      <form>
        <div class="auth-error"></div>

        <input name="nombre" value="Juan"/>
        <input name="apellido" value="Perez"/>
        <input name="correo" value="a@a.com"/>
        <input name="contrasena" value="123"/>

        <button type="submit">Registrarse</button>
      </form>
    </div>
  `

  const form = document.querySelector('form')!

  handleRegister(form)

  form.dispatchEvent(
    new Event('submit', {
      bubbles: true,
      cancelable: true,
    })
  )

  await vi.waitFor(() => {
    expect(
      document.querySelector('.auth-error')?.textContent
    ).toContain('Error al registrarse')
  })
})

it('register success reload button reloads page', async () => {
  const reloadSpy = vi.fn()

  Object.defineProperty(window, 'location', {
    value: {
      reload: reloadSpy,
    },
    writable: true,
  })

  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ id: 1 }),
  })

  document.body.innerHTML = `
    <div data-sitio-id="1">
      <form>
        <div class="auth-error"></div>

        <input name="nombre" value="Juan"/>
        <input name="apellido" value="Perez"/>
        <input name="correo" value="a@a.com"/>
        <input name="contrasena" value="123"/>

        <button type="submit">Registrarse</button>
      </form>
    </div>
  `

  const form = document.querySelector('form')!

  handleRegister(form)

  form.dispatchEvent(
    new Event('submit', {
      bubbles: true,
      cancelable: true,
    })
  )

  await vi.waitFor(() => {
    expect(
      document.querySelector('#auth-login-reload-btn')
    ).toBeTruthy()
  })

  document
    .querySelector<HTMLButtonElement>('#auth-login-reload-btn')!
    .click()

  expect(reloadSpy).toHaveBeenCalled()
})