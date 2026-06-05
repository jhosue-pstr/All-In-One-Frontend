import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { sitioService } from '../../services/sitio'
import { moduloService } from '../../services/modulo'

vi.mock('../../services/sitio', () => ({
  sitioService: {
    getAll: vi.fn(),
    getModulos: vi.fn(),
  },
}))

vi.mock('../../services/modulo', () => ({
  moduloService: {
    getAll: vi.fn(),
  },
}))

const mockUser = {
  id: 1,
  correo: 'a@b.com',
  nombre: 'Juan',
  apellido: 'Perez',
  role: 'user',
  created_at: '',
  updated_at: '',
}

function renderSidebar(user = mockUser, route = '/inicio') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Sidebar user={user} />
    </MemoryRouter>,
  )
}

describe('Sidebar', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()

    vi.mocked(sitioService.getAll).mockResolvedValue([
      { id: 1, nombre: 'Sitio 1' },
      { id: 2, nombre: 'Sitio 2' },
    ] as any)

    vi.mocked(sitioService.getModulos).mockResolvedValue([1, 2] as any)

    vi.mocked(moduloService.getAll).mockResolvedValue([
      { id: 1, nombre: 'Blog', slug: 'blog' },
      { id: 2, nombre: 'Tienda', slug: 'tienda' },
    ] as any)
  })

  it('should render user name', async () => {
    renderSidebar()

    expect(await screen.findByText(/Bienvenido, Juan/)).toBeInTheDocument()
  })

  it('should render base navigation links', async () => {
    renderSidebar()

    expect(await screen.findByText('Inicio')).toBeInTheDocument()
    expect(screen.getByText('Sitios')).toBeInTheDocument()
    expect(screen.getByText('Plantillas')).toBeInTheDocument()
    expect(screen.getByText('Módulos')).toBeInTheDocument()
    expect(screen.getByText('Configuraciones')).toBeInTheDocument()
  })

  it('should show module links when modules are enabled', async () => {
    renderSidebar()

    expect(await screen.findByText('Blog')).toBeInTheDocument()
    expect(await screen.findByText('Tienda')).toBeInTheDocument()

    expect(sitioService.getAll).toHaveBeenCalled()
    expect(sitioService.getModulos).toHaveBeenCalledWith(1)
    expect(moduloService.getAll).toHaveBeenCalled()
  })

  it('should hide module links when modules are not enabled', async () => {
    vi.mocked(sitioService.getModulos).mockResolvedValueOnce([] as any)

    renderSidebar()

    await waitFor(() => {
      expect(sitioService.getModulos).toHaveBeenCalled()
    })

    expect(screen.queryByText('Blog')).not.toBeInTheDocument()
    expect(screen.queryByText('Tienda')).not.toBeInTheDocument()
  })

  it('should change selected site and load its modules', async () => {
    renderSidebar()

    const select = await screen.findByRole('combobox')

    await waitFor(() => {
      expect(screen.getByText('Sitio 1')).toBeInTheDocument()
      expect(screen.getByText('Sitio 2')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(sitioService.getModulos).toHaveBeenCalledWith(1)
    })

    vi.mocked(sitioService.getModulos).mockClear()

    fireEvent.change(select, {
      target: { value: '2' },
    })

    await waitFor(() => {
      expect(select).toHaveValue('2')
    })

    await waitFor(() => {
      expect(sitioService.getModulos).toHaveBeenCalledWith(2)
    })
  })

  it('should handle sitioService.getAll error silently', async () => {
    vi.mocked(sitioService.getAll).mockRejectedValueOnce(new Error('Error'))

    renderSidebar()

    await waitFor(() => {
      expect(sitioService.getAll).toHaveBeenCalled()
    })

    expect(screen.getByText('Seleccionar sitio')).toBeInTheDocument()
  })

  it('should handle getModulos and getAll module errors silently', async () => {
    vi.mocked(sitioService.getModulos).mockRejectedValueOnce(new Error('Error'))
    vi.mocked(moduloService.getAll).mockRejectedValueOnce(new Error('Error'))

    renderSidebar()

    await waitFor(() => {
      expect(sitioService.getModulos).toHaveBeenCalled()
    })

    expect(screen.queryByText('Blog')).not.toBeInTheDocument()
    expect(screen.queryByText('Tienda')).not.toBeInTheDocument()
  })

  it('should mark current route as active', async () => {
    renderSidebar(mockUser, '/sitios')

    expect(await screen.findByTestId('nav-sitios')).toHaveClass('active')
  })

  it('should show user initial when no image in localStorage', async () => {
    renderSidebar()

    expect(await screen.findByText('J')).toBeInTheDocument()
  })

  it('should show user image when present in localStorage', async () => {
    localStorage.setItem('user_image', 'data:image/png;base64,abc')

    renderSidebar()

    const img = await screen.findByAltText('Avatar')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'data:image/png;base64,abc')
  })

  it('should show default initial U when user has no nombre', async () => {
    renderSidebar({ ...mockUser, nombre: '' })

    expect(await screen.findByText('U')).toBeInTheDocument()
    expect(screen.getByText(/Bienvenido, Usuario/)).toBeInTheDocument()
  })

  it('should clear token, user image and redirect on logout', async () => {
    localStorage.setItem('token', 'tok')
    localStorage.setItem('user_image', 'img')

    const originalLocation = globalThis.location
    delete (globalThis as any).location
    globalThis.location = { href: '' } as any

    renderSidebar()

    fireEvent.click(await screen.findByText('Salir'))

    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user_image')).toBeNull()
    expect(globalThis.location.href).toBe('/')

    globalThis.location = originalLocation
  })

  it('handles non-array sitios response', async () => {
    vi.mocked(sitioService.getAll).mockResolvedValueOnce(null as any)

    renderSidebar()

    await waitFor(() => {
      expect(sitioService.getAll).toHaveBeenCalled()
    })

    expect(screen.getByText('Seleccionar sitio')).toBeInTheDocument()
  })

  it('handles empty sitios response without selecting first site', async () => {
    vi.mocked(sitioService.getAll).mockResolvedValueOnce([] as any)

    renderSidebar()

    await waitFor(() => {
      expect(sitioService.getAll).toHaveBeenCalled()
    })

    expect(sitioService.getModulos).not.toHaveBeenCalled()
  })

  it('sets sitioId to null when selected value is empty', async () => {
    renderSidebar()

    const select = await screen.findByRole('combobox')

    await waitFor(() => {
      expect(screen.getByText('Sitio 1')).toBeInTheDocument()
    })

    fireEvent.change(select, {
      target: { value: '' },
    })

    await waitFor(() => {
      expect(select).toHaveValue('')
    })
  })
})