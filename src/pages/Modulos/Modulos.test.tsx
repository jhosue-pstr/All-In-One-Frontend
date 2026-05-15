import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Modulos } from './Modulos'
import { sitioService, moduloService } from '../../services'
import { sitioModuloService } from '../../services/sitioModulo'

const mockSitios = [
  { id: 1, nombre: 'Sitio A', slug: 'sitio-a', activo: true },
  { id: 2, nombre: 'Sitio B', slug: 'sitio-b', activo: false },
]

const mockModulos = [
  { id: 1, slug: 'auth', nombre: 'Autenticación', descripcion: null, tipo: 'component', configuracion_base: null, activo: true },
  { id: 2, slug: 'blog', nombre: 'Blog', descripcion: 'Blog module', tipo: 'component', configuracion_base: null, activo: true },
]

vi.mock('../../services', () => ({
  sitioService: { getAll: vi.fn() },
  moduloService: { getAll: vi.fn() },
}))

vi.mock('../../services/sitioModulo', () => ({
  sitioModuloService: { getBySitio: vi.fn(), add: vi.fn(), remove: vi.fn() },
}))

describe('Modulos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sitioService.getAll = vi.fn().mockResolvedValue(mockSitios)
    moduloService.getAll = vi.fn().mockResolvedValue(mockModulos)
    sitioModuloService.getBySitio = vi.fn().mockResolvedValue([1])
    sitioModuloService.add = vi.fn().mockResolvedValue(undefined)
    sitioModuloService.remove = vi.fn().mockResolvedValue(undefined)
  })

  it('should show loading state initially', () => {
    sitioService.getAll = vi.fn().mockReturnValue(new Promise(() => {}))
    moduloService.getAll = vi.fn().mockReturnValue(new Promise(() => {}))

    render(
      <MemoryRouter>
        <Modulos />
      </MemoryRouter>
    )

    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })

  it('should render sidebar with sitios list', async () => {
    render(
      <MemoryRouter>
        <Modulos />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Sitio A')).toBeInTheDocument()
    })
    expect(screen.getByText('Sitio B')).toBeInTheDocument()
  })

  it('should show empty state when no sitios exist', async () => {
    sitioService.getAll = vi.fn().mockResolvedValue([])

    render(
      <MemoryRouter>
        <Modulos />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('No hay sitios')).toBeInTheDocument()
    })
  })

  it('should select a sitio and show its modules', async () => {
    render(
      <MemoryRouter>
        <Modulos />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Sitio A')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Sitio A'))

    await waitFor(() => {
      expect(screen.getByText('Autenticación')).toBeInTheDocument()
    })
    expect(screen.getByText('Blog')).toBeInTheDocument()
    expect(sitioModuloService.getBySitio).toHaveBeenCalledWith(1)
  })

  it('should show empty modules message when no available modules', async () => {
    moduloService.getAll = vi.fn().mockResolvedValue([
      { id: 1, slug: 'auth', nombre: 'Auth', descripcion: null, tipo: 'component', configuracion_base: null, activo: false },
    ])

    render(
      <MemoryRouter>
        <Modulos />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Sitio A')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Sitio A'))

    await waitFor(() => {
      expect(screen.getByText('No hay módulos disponibles.')).toBeInTheDocument()
    })
  })

  it('should call add when toggling a module on', async () => {
    render(
      <MemoryRouter>
        <Modulos />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Sitio A')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Sitio A'))

    await waitFor(() => {
      expect(screen.getByText('Autenticación')).toBeInTheDocument()
    })

    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[1])

    await waitFor(() => {
      expect(sitioModuloService.add).toHaveBeenCalledWith(1, 2)
    })
  })

  it('should call remove when toggling a module off', async () => {
    render(
      <MemoryRouter>
        <Modulos />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Sitio A')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Sitio A'))

    await waitFor(() => {
      expect(screen.getByText('Autenticación')).toBeInTheDocument()
    })

    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0])

    await waitFor(() => {
      expect(sitioModuloService.remove).toHaveBeenCalledWith(1, 1)
    })
  })

  it('should rollback optimistic update on toggle error', async () => {
    sitioModuloService.add = vi.fn().mockRejectedValue(new Error('Network error'))

    render(
      <MemoryRouter>
        <Modulos />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Sitio A')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Sitio A'))

    await waitFor(() => {
      expect(screen.getByText('Autenticación')).toBeInTheDocument()
    })

    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[1])

    await waitFor(() => {
      expect(sitioModuloService.add).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(checkboxes[1]).not.toBeChecked()
    })
  })

  it('should handle getBySitio rejection gracefully', async () => {
    sitioModuloService.getBySitio = vi.fn().mockRejectedValue(new Error('Not found'))

    render(
      <MemoryRouter>
        <Modulos />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Sitio A')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Sitio A'))

    await waitFor(() => {
      expect(screen.getByText('Autenticación')).toBeInTheDocument()
    })

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes[0]).not.toBeChecked()
    expect(checkboxes[1]).not.toBeChecked()
  })

  it('should handle initial load failure gracefully', async () => {
    sitioService.getAll = vi.fn().mockRejectedValue(new Error('Server error'))
    moduloService.getAll = vi.fn().mockRejectedValue(new Error('Server error'))

    render(
      <MemoryRouter>
        <Modulos />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('No hay sitios')).toBeInTheDocument()
    })
  })

  it('should not render modules or call services when no sitio is selected', async () => {
    render(
      <MemoryRouter>
        <Modulos />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Sitio A')).toBeInTheDocument()
    })

    expect(screen.getByText('Selecciona un sitio de la lista para gestionar sus módulos.')).toBeInTheDocument()
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0)
    expect(sitioModuloService.add).not.toHaveBeenCalled()
    expect(sitioModuloService.remove).not.toHaveBeenCalled()
  })
})
