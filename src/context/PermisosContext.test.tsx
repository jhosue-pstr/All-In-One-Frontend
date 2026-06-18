import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PermisosProvider, usePermisos } from './PermisosContext'

vi.mock('../services/roles', () => ({
  rolesService: {
    getMisPermisos: vi.fn(),
  },
}))

import { rolesService } from '../services/roles'

function TestChild() {
  const { permisos, role, loading, tienePermiso, tieneAlgunPermiso } = usePermisos()
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="role">{role}</span>
      <span data-testid="permisos">{permisos.join(',')}</span>
      <span data-testid="tienePermiso">{String(tienePermiso('roles.ver'))}</span>
      <span data-testid="tieneAlgunPermiso">{String(tieneAlgunPermiso(['roles.ver', 'roles.editar']))}</span>
    </div>
  )
}

function renderProvider() {
  return render(
    <PermisosProvider>
      <TestChild />
    </PermisosProvider>
  )
}

describe('PermisosProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading initially then loads data', async () => {
    vi.mocked(rolesService.getMisPermisos).mockResolvedValue({
      permisos: ['roles.ver'],
      role: 'admin',
    })

    renderProvider()

    expect(screen.getByTestId('loading').textContent).toBe('true')

    await vi.waitFor(() => {
      expect(screen.getByTestId('role').textContent).toBe('admin')
    })

    expect(screen.getByTestId('loading').textContent).toBe('false')
    expect(screen.getByTestId('permisos').textContent).toBe('roles.ver')
  })

  it('handles super_admin role returning true for any permiso', async () => {
    vi.mocked(rolesService.getMisPermisos).mockResolvedValue({
      permisos: [],
      role: 'super_admin',
    })

    renderProvider()

    await vi.waitFor(() => {
      expect(screen.getByTestId('role').textContent).toBe('super_admin')
    })

    expect(screen.getByTestId('tienePermiso').textContent).toBe('true')
    expect(screen.getByTestId('tieneAlgunPermiso').textContent).toBe('true')
  })

  it('handles regular user with permisos', async () => {
    vi.mocked(rolesService.getMisPermisos).mockResolvedValue({
      permisos: ['roles.ver'],
      role: 'editor',
    })

    renderProvider()

    await vi.waitFor(() => {
      expect(screen.getByTestId('role').textContent).toBe('editor')
    })

    expect(screen.getByTestId('tienePermiso').textContent).toBe('true')
    expect(screen.getByTestId('tieneAlgunPermiso').textContent).toBe('true')
  })

  it('handles error from rolesService gracefully', async () => {
    vi.mocked(rolesService.getMisPermisos).mockRejectedValue(new Error('API error'))

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    renderProvider()

    await vi.waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })

    expect(screen.getByTestId('permisos').textContent).toBe('')
    expect(screen.getByTestId('role').textContent).toBe('')

    consoleSpy.mockRestore()
  })

  it('handles null permisos from API', async () => {
    vi.mocked(rolesService.getMisPermisos).mockResolvedValue({
      role: 'user',
    } as any)

    renderProvider()

    await vi.waitFor(() => {
      expect(screen.getByTestId('role').textContent).toBe('user')
    })

    expect(screen.getByTestId('permisos').textContent).toBe('')
  })
})

describe('usePermisos', () => {
  it('throws when used outside PermisosProvider', () => {
    expect(() => render(<TestChild />)).toThrow('usePermisos debe usarse dentro de PermisosProvider')
  })
})
