import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import App from './App'
import { authService } from './services/auth'

vi.mock('./services/auth', () => ({
  authService: {
    me: vi.fn(),
    logout: vi.fn(),
  },
}))

vi.mock('./components/Login/Login', () => ({
  Login: ({ onSuccess }: any) => (
    <div>
      <span>Iniciar Sesión</span>
      <button data-testid="login-success" onClick={() => onSuccess()}>
        Login Success
      </button>
    </div>
  ),
}))

vi.mock('./components/Register/Register', () => ({
  Register: ({ onSwitchToLogin, onSuccess }: any) => (
    <div>
      <span>Crear Cuenta</span>
      <button data-testid="switch-to-login" onClick={() => onSwitchToLogin()}>
        Switch to Login
      </button>
      <button data-testid="register-success" onClick={() => onSuccess()}>
        Register Success
      </button>
    </div>
  ),
}))

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    authService.me.mockRejectedValue(new Error('No token'))
    window.history.pushState({}, '', '/')
  })

  it('should show loading state initially', () => {
    authService.me.mockReturnValue(new Promise(() => {}))

    render(<App />)
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })

  it('should render auth layout when no token', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('All in One')).toBeInTheDocument()
    })
  })

  it('should render auth layout when token is invalid', async () => {
    localStorage.setItem('token', 'bad-token')

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('All in One')).toBeInTheDocument()
    })
    expect(authService.logout).toHaveBeenCalled()
  })

  it('should show login and register toggle', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getAllByText('Iniciar Sesión').length).toBeGreaterThan(0)
    })
    expect(screen.getByText('Regístrate')).toBeInTheDocument()
  })

  it('should render AuthenticatedLayout with sidebar when token is valid', async () => {
    localStorage.setItem('token', 'good-token')
    authService.me.mockResolvedValue({ id: 1, correo: 'a@b.com', nombre: 'Juan', apellido: 'Perez', role: 'user', created_at: '', updated_at: '' })

    render(<App />)

    await waitFor(() => {
      expect(screen.getAllByText((content) => content.includes('Bienvenido')).length).toBeGreaterThan(0)
    })
  })

  it('should show register form when clicking Regístrate', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Regístrate')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Regístrate'))

    await waitFor(() => {
      expect(screen.getAllByText('Crear Cuenta').length).toBeGreaterThan(0)
    })
  })

  it('should redirect on AuthenticatedLayout auth failure', async () => {
    localStorage.setItem('token', 'good-token')
    authService.me
      .mockResolvedValueOnce({ id: 1, correo: 'a@b.com', nombre: 'Juan', apellido: 'Perez', role: 'user', created_at: '', updated_at: '' })
      .mockRejectedValueOnce(new Error('Session expired'))

    let assignedHref = ''
    const originalLocation = globalThis.location
    const locationProxy = new Proxy(originalLocation, {
      set(target, prop, value) {
        if (prop === 'href') {
          assignedHref = value as string
          return true
        }
        return Reflect.set(target, prop, value)
      },
    })
    delete (globalThis as any).location
    globalThis.location = locationProxy as any

    render(<App />)

    await waitFor(() => {
      expect(authService.logout).toHaveBeenCalledTimes(1)
    })
    expect(assignedHref).toBe('/')

    globalThis.location = originalLocation
  })

  it('should call handleAuthSuccess on login', async () => {
    let assignedHref = ''
    const originalLocation = globalThis.location
    const locationProxy = new Proxy(originalLocation, {
      set(target, prop, value) {
        if (prop === 'href') {
          assignedHref = value as string
          return true
        }
        return Reflect.set(target, prop, value)
      },
    })
    delete (globalThis as any).location
    globalThis.location = locationProxy as any

    render(<App />)
    await waitFor(() => {
      expect(screen.getByTestId('login-success')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByTestId('login-success'))
    expect(assignedHref).toBe('/inicio')

    globalThis.location = originalLocation
  })

  it('should call Register onSwitchToLogin callback', async () => {
    render(<App />)
    await waitFor(() => expect(screen.getByText('Regístrate')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Regístrate'))
    await waitFor(() => {
      expect(screen.getByTestId('switch-to-login')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByTestId('switch-to-login'))
    await waitFor(() => {
      expect(screen.getByTestId('login-success')).toBeInTheDocument()
    })
  })

  it('should call Register onSuccess callback', async () => {
    render(<App />)
    await waitFor(() => expect(screen.getByText('Regístrate')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Regístrate'))
    await waitFor(() => {
      expect(screen.getByTestId('register-success')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByTestId('register-success'))
    await waitFor(() => {
      expect(screen.getByTestId('login-success')).toBeInTheDocument()
    })
  })

  it('should render editor layout when path starts with /sitio/', async () => {
    localStorage.setItem('token', 'good-token')
    window.history.pushState({}, '', '/sitio/1')
    authService.me.mockResolvedValue({ id: 1, correo: 'a@b.com', nombre: 'Juan', apellido: 'Perez', role: 'user', created_at: '', updated_at: '' })

    render(<App />)

    await waitFor(() => {
      expect(authService.me).toHaveBeenCalled()
    })
  })
})
