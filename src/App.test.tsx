import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from './App'
import { authService } from './services/auth'

vi.mock('./services/auth', () => ({
  authService: {
    me: vi.fn(),
    logout: vi.fn(),
  },
}))

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should show loading state initially', () => {
    authService.me = vi.fn().mockReturnValue(new Promise(() => {}))

    render(<App />)
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })

  it('should render auth layout when no token', async () => {
    authService.me = vi.fn().mockRejectedValue(new Error('No token'))

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('All in One')).toBeInTheDocument()
    })
  })

  it('should render auth layout when token is invalid', async () => {
    localStorage.setItem('token', 'bad-token')
    authService.me = vi.fn().mockRejectedValue(new Error('Unauthorized'))

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('All in One')).toBeInTheDocument()
    })
    expect(authService.logout).toHaveBeenCalled()
  })

  it('should show login and register toggle', async () => {
    authService.me = vi.fn().mockRejectedValue(new Error('No token'))

    render(<App />)

    await waitFor(() => {
      expect(screen.getAllByText('Iniciar Sesión').length).toBeGreaterThan(0)
    })
    expect(screen.getByText('Regístrate')).toBeInTheDocument()
  })

  it('should render AuthenticatedLayout with sidebar when token is valid', async () => {
    localStorage.setItem('token', 'good-token')
    authService.me = vi.fn().mockResolvedValue({ id: 1, correo: 'a@b.com', nombre: 'Juan', apellido: 'Perez', role: 'user', created_at: '', updated_at: '' })

    render(<App />)

    await waitFor(() => {
      expect(screen.getAllByText((content) => content.includes('Bienvenido')).length).toBeGreaterThan(0)
    })
  })
})
