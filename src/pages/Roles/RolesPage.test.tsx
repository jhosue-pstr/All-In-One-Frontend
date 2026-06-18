import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import RolesPage from './RolesPage'

const mockRoles = [
  { id: 1, codigo: 'super_admin', nombre: 'Super Admin', descripcion: 'Acceso total', permisos: ['todos'], created_at: '', updated_at: '' },
  { id: 2, codigo: 'editor_sitios', nombre: 'Editor Sitios', descripcion: 'Edita sitios', permisos: ['sitios.ver'], created_at: '', updated_at: '' },
]

const mockPermisos = [
  { id: 1, codigo: 'roles.ver', modulo: 'Roles', descripcion: 'Ver roles', created_at: '' },
  { id: 2, codigo: 'roles.editar', modulo: 'Roles', descripcion: 'Editar roles', created_at: '' },
]

const mockUsuarios = [
  { id: 1, correo: 'admin@test.com', nombre: 'Admin', apellido: 'User', role: 'super_admin', activo: true, created_at: '', updated_at: '' },
  { id: 2, correo: 'inactivo@test.com', nombre: 'Inactivo', apellido: 'User', role: 'editor_sitios', activo: false, created_at: '', updated_at: '' },
]

vi.mock('../../services/roles', () => ({
  rolesService: {
    getRoles: vi.fn(),
    getPermisos: vi.fn(),
    getUsuarios: vi.fn(),
    createUsuario: vi.fn(),
    desactivarUsuario: vi.fn(),
    activarUsuario: vi.fn(),
  },
}))

import { rolesService } from '../../services/roles'

function setupResolved() {
  vi.mocked(rolesService.getRoles).mockResolvedValue(mockRoles as any)
  vi.mocked(rolesService.getPermisos).mockResolvedValue(mockPermisos as any)
  vi.mocked(rolesService.getUsuarios).mockResolvedValue(mockUsuarios as any)
}

describe('RolesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
    vi.spyOn(window, 'confirm').mockImplementation(() => true)
  })

  it('shows loading state initially', () => {
    setupResolved()
    render(<RolesPage />)
    expect(screen.getByText('Cargando roles...')).toBeInTheDocument()
  })

  it('renders all sections after loading', async () => {
    setupResolved()
    render(<RolesPage />)

    await waitFor(() => {
      expect(screen.getByText('Administración de Roles')).toBeInTheDocument()
    })

    expect(screen.getByText('Crear usuario del sistema')).toBeInTheDocument()
    expect(screen.getByText('Usuarios del sistema')).toBeInTheDocument()
    expect(screen.getByText('Roles disponibles')).toBeInTheDocument()
    expect(screen.getByText('Permisos registrados')).toBeInTheDocument()
  })

  it('renders usuarios with active/inactive status', async () => {
    setupResolved()
    render(<RolesPage />)

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument()
    })

    expect(screen.getByText('Inactivo User')).toBeInTheDocument()
    expect(screen.getByText('Activo')).toBeInTheDocument()
    expect(screen.getByText('Inactivo')).toBeInTheDocument()
  })

  it('shows desactivar button for active user and activar for inactive', async () => {
    setupResolved()
    render(<RolesPage />)

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument()
    })

    const buttons = screen.getAllByRole('button')
    const desactivarBtns = buttons.filter(b => b.textContent === 'Desactivar')
    const activarBtns = buttons.filter(b => b.textContent === 'Activar')

    expect(desactivarBtns.length).toBe(1)
    expect(activarBtns.length).toBe(1)
  })

  it('renders roles cards', async () => {
    setupResolved()
    render(<RolesPage />)

    await waitFor(() => {
      expect(screen.getAllByText('Super Admin').length).toBeGreaterThanOrEqual(1)
    })

    expect(screen.getAllByText('Editor Sitios').length).toBeGreaterThanOrEqual(1)
  })

  it('renders permisos list', async () => {
    setupResolved()
    render(<RolesPage />)

    await waitFor(() => {
      expect(screen.getByText('roles.ver')).toBeInTheDocument()
    })

    expect(screen.getByText('roles.editar')).toBeInTheDocument()
  })

  it('handles API error gracefully', async () => {
    vi.mocked(rolesService.getRoles).mockRejectedValue(new Error('API error'))

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<RolesPage />)

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Error cargando roles o usuarios')
    })

    await waitFor(() => {
      expect(screen.queryByText('Cargando roles...')).not.toBeInTheDocument()
    })

    consoleSpy.mockRestore()
  })

  it('handles create usuario form submission and resets form', async () => {
    vi.mocked(rolesService.createUsuario).mockResolvedValue({ id: 3 } as any)
    setupResolved()

    render(<RolesPage />)

    await waitFor(() => {
      expect(screen.getByText('Crear usuario del sistema')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'Nuevo' } })
    fireEvent.change(screen.getByPlaceholderText('Apellido'), { target: { value: 'Usuario' } })
    fireEvent.change(screen.getByPlaceholderText('Correo'), { target: { value: 'nuevo@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: '123456' } })

    fireEvent.click(screen.getByText('Crear usuario'))

    await waitFor(() => {
      expect(rolesService.createUsuario).toHaveBeenCalledWith({
        correo: 'nuevo@test.com',
        contrasena: '123456',
        nombre: 'Nuevo',
        apellido: 'Usuario',
        role: 'editor_sitios',
      })
    })

    expect(window.alert).toHaveBeenCalledWith('Usuario creado correctamente')

    expect((screen.getByPlaceholderText('Nombre') as HTMLInputElement).value).toBe('')
  })

  it('handles create usuario error', async () => {
    vi.mocked(rolesService.createUsuario).mockRejectedValue(new Error('Create error'))
    setupResolved()

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<RolesPage />)

    await waitFor(() => {
      expect(screen.getByText('Crear usuario del sistema')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'Nuevo' } })
    fireEvent.change(screen.getByPlaceholderText('Apellido'), { target: { value: 'User' } })
    fireEvent.change(screen.getByPlaceholderText('Correo'), { target: { value: 'nuevo@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: '123456' } })

    fireEvent.click(screen.getByText('Crear usuario'))

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('No se pudo crear el usuario')
    })

    consoleSpy.mockRestore()
  })

  it('handles desactivar usuario', async () => {
    vi.mocked(rolesService.desactivarUsuario).mockResolvedValue({ mensaje: 'ok' } as any)
    setupResolved()

    render(<RolesPage />)

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Desactivar'))

    await waitFor(() => {
      expect(rolesService.desactivarUsuario).toHaveBeenCalledWith(1)
    })
  })

  it('handles desactivar usuario confirm cancel', async () => {
    vi.mocked(window.confirm).mockReturnValue(false)
    setupResolved()

    render(<RolesPage />)

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Desactivar'))

    expect(rolesService.desactivarUsuario).not.toHaveBeenCalled()
  })

  it('handles desactivar usuario error', async () => {
    vi.mocked(rolesService.desactivarUsuario).mockRejectedValue(new Error('Desactivar error'))
    setupResolved()

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<RolesPage />)

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Desactivar'))

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('No se pudo desactivar el usuario')
    })

    consoleSpy.mockRestore()
  })

  it('handles activar usuario', async () => {
    vi.mocked(rolesService.activarUsuario).mockResolvedValue({ id: 2, activo: true } as any)
    setupResolved()

    render(<RolesPage />)

    await waitFor(() => {
      expect(screen.getByText('Inactivo User')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Activar'))

    await waitFor(() => {
      expect(rolesService.activarUsuario).toHaveBeenCalledWith(2)
    })
  })

  it('handles activar usuario error', async () => {
    vi.mocked(rolesService.activarUsuario).mockRejectedValue(new Error('Activar error'))
    setupResolved()

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<RolesPage />)

    await waitFor(() => {
      expect(screen.getByText('Inactivo User')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Activar'))

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('No se pudo activar el usuario')
    })

    consoleSpy.mockRestore()
  })
})
