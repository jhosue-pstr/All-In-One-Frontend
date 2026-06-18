import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'

vi.mock('../../context/PermisosContext', () => ({
  usePermisos: vi.fn(),
}))

import { usePermisos } from '../../context/PermisosContext'

function renderRoute(overrides: Record<string, unknown> = {}) {
  vi.mocked(usePermisos).mockReturnValue({
    loading: false,
    tienePermiso: vi.fn(),
    tieneAlgunPermiso: vi.fn(),
    ...overrides,
  } as any)

  return render(
    <MemoryRouter>
      <ProtectedRoute permiso="roles.ver">
        <div data-testid="children">Protected Content</div>
      </ProtectedRoute>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state', () => {
    renderRoute({ loading: true })
    expect(screen.getByText('Validando permisos...')).toBeInTheDocument()
    expect(screen.queryByTestId('children')).not.toBeInTheDocument()
  })

  it('renders children when autorizado with single permiso', () => {
    vi.mocked(usePermisos).mockReturnValue({
      loading: false,
      tienePermiso: vi.fn().mockReturnValue(true),
      tieneAlgunPermiso: vi.fn(),
    } as any)

    render(
      <MemoryRouter>
        <ProtectedRoute permiso="roles.ver">
          <div data-testid="children">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.getByTestId('children')).toBeInTheDocument()
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('renders children when autorizado with multiple permisos', () => {
    vi.mocked(usePermisos).mockReturnValue({
      loading: false,
      tienePermiso: vi.fn(),
      tieneAlgunPermiso: vi.fn().mockReturnValue(true),
    } as any)

    render(
      <MemoryRouter>
        <ProtectedRoute permisos={['roles.ver', 'roles.editar']}>
          <div data-testid="children">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.getByTestId('children')).toBeInTheDocument()
  })

  it('shows NoAutorizado when not autorizado', () => {
    vi.mocked(usePermisos).mockReturnValue({
      loading: false,
      tienePermiso: vi.fn().mockReturnValue(false),
      tieneAlgunPermiso: vi.fn().mockReturnValue(false),
    } as any)

    render(
      <MemoryRouter>
        <ProtectedRoute permiso="roles.ver">
          <div data-testid="children">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.queryByTestId('children')).not.toBeInTheDocument()
    expect(screen.getByText('Acceso no autorizado')).toBeInTheDocument()
  })
})
