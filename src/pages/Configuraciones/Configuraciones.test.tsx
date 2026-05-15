import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Configuraciones } from './Configuraciones'

vi.mock('../../services/auth', () => ({
  authService: {
    me: vi.fn().mockResolvedValue({
      id: 1,
      correo: 'a@b.com',
      nombre: 'Juan',
      apellido: 'Perez',
      role: 'user',
      created_at: '',
      updated_at: '',
    }),
    update: vi.fn().mockResolvedValue({
      id: 1,
      correo: 'a@b.com',
      nombre: 'Juan',
      apellido: 'Perez',
      role: 'user',
      created_at: '',
      updated_at: '',
    }),
  },
}))

describe('Configuraciones', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should render tabs', async () => {
    render(
      <MemoryRouter>
        <Configuraciones />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Perfil')).toBeInTheDocument()
    })
    expect(screen.getByText('Seguridad')).toBeInTheDocument()
    expect(screen.getByText('Notificaciones')).toBeInTheDocument()
  })

  it('should show profile tab by default with user info', async () => {
    render(
      <MemoryRouter>
        <Configuraciones />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByDisplayValue('Juan')).toBeInTheDocument()
    })
    expect(screen.getByDisplayValue('Perez')).toBeInTheDocument()
    expect(screen.getByDisplayValue('a@b.com')).toBeInTheDocument()
  })

  it('should switch to Security tab', async () => {
    render(
      <MemoryRouter>
        <Configuraciones />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Perfil')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Seguridad'))

    await waitFor(() => {
      expect(screen.getByText('Actualizar contraseña')).toBeInTheDocument()
    })
  })

  it('should switch to Notifications tab', async () => {
    render(
      <MemoryRouter>
        <Configuraciones />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Perfil')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Notificaciones'))

    await waitFor(() => {
      expect(screen.getByText('Notificaciones por email')).toBeInTheDocument()
    })
  })
})
