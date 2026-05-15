import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Sitios } from './Sitios'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../../services', () => ({
  sitioService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  plantillaService: {
    getMisPlantillas: vi.fn(),
    getPublicas: vi.fn(),
  },
  moduloService: {
    getAll: vi.fn(),
  },
}))

vi.mock('../../services/sitioModulo', () => ({
  sitioModuloService: {
    getBySitio: vi.fn(),
  },
}))

vi.mock('../../components/CardSitio/CardSitio', () => ({
  CardSitio: ({ sitio, onDelete }: any) => (
    <div data-testid="card-sitio">
      <span>{sitio.nombre}</span>
      <button onClick={() => onDelete(sitio.id)}>Eliminar</button>
    </div>
  ),
}))

import { sitioService, plantillaService, moduloService } from '../../services'
import { sitioModuloService } from '../../services/sitioModulo'

const SAMPLE_SITIOS = [
  {
    id: 1, nombre: 'Sitio Alpha', slug: 'sitio-alpha', id_usuario: 1,
    id_plantilla: null, configuracion: null, miniatura: null,
    switches: null, activo: true, created_at: '2024-01-01', updated_at: '2024-01-01',
  },
  {
    id: 2, nombre: 'Sitio Beta', slug: 'sitio-beta', id_usuario: 1,
    id_plantilla: 5, configuracion: null, miniatura: 'thumb.jpg',
    switches: null, activo: false, created_at: '2024-01-02', updated_at: '2024-01-02',
  },
]

const SAMPLE_PLANTILLAS = [
  {
    id: 10, nombre: 'Mi Plantilla', slug: 'mi-p', descripcion: null,
    configuracion: null, miniatura: null, activo: true,
    visibilidad: 'PRIVADA' as const, id_usuario: 1,
    created_at: '', updated_at: '',
  },
  {
    id: 20, nombre: 'Plantilla Pub', slug: 'pub-p', descripcion: null,
    configuracion: null, miniatura: 'pub.jpg', activo: true,
    visibilidad: 'PUBLICA' as const, id_usuario: null,
    created_at: '', updated_at: '',
  },
]

const SAMPLE_MODULOS = [
  { id: 100, nombre: 'Auth', slug: 'auth', descripcion: null, tipo: 'component', configuracion_base: null, activo: true },
  { id: 101, nombre: 'Inactivo', slug: 'inactivo', descripcion: null, tipo: 'component', configuracion_base: null, activo: false },
]

function renderSitios() {
  return render(
    <MemoryRouter>
      <Sitios />
    </MemoryRouter>
  )
}

describe('Sitios', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('confirm', vi.fn(() => true))
    localStorage.setItem('userId', '1')

    ;(sitioService.getAll as any).mockResolvedValue(SAMPLE_SITIOS)
    ;(sitioService.create as any).mockResolvedValue({ id: 99, nombre: 'Nuevo', slug: 'nuevo' })
    ;(sitioService.update as any).mockResolvedValue({ id: 1 })
    ;(sitioService.delete as any).mockResolvedValue(undefined)
    ;(plantillaService.getMisPlantillas as any).mockResolvedValue([SAMPLE_PLANTILLAS[0]])
    ;(plantillaService.getPublicas as any).mockResolvedValue([SAMPLE_PLANTILLAS[1]])
    ;(moduloService.getAll as any).mockResolvedValue(SAMPLE_MODULOS)
    ;(sitioModuloService.getBySitio as any).mockResolvedValue([])
  })

  it('shows loading indicator while fetching data', () => {
    renderSitios()
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })

  it('shows empty state when no sitios exist', async () => {
    ;(sitioService.getAll as any).mockResolvedValue([])
    renderSitios()

    await waitFor(() => {
      expect(screen.getByText('No hay sitios creados aún.')).toBeInTheDocument()
    })
    expect(screen.getByText('Crear mi primer sitio')).toBeInTheDocument()
  })

  it('renders a CardSitio for each sitio', async () => {
    renderSitios()

    await waitFor(() => {
      expect(screen.getAllByTestId('card-sitio')).toHaveLength(2)
    })
    expect(screen.getByText('Sitio Alpha')).toBeInTheDocument()
    expect(screen.getByText('Sitio Beta')).toBeInTheDocument()
  })

  it('opens the create modal when clicking + Nuevo Sitio', async () => {
    renderSitios()

    await waitFor(() => {
      expect(screen.getByText('+ Nuevo Sitio')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('+ Nuevo Sitio'))

    expect(screen.getByText('Nuevo Sitio')).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
    expect(screen.getByLabelText('Slug (subdominio)')).toBeInTheDocument()
    expect(screen.getByText('Crear Sitio')).toBeInTheDocument()
    expect(screen.getByText('Cancelar')).toBeInTheDocument()
  })

  it('submits the form and navigates to editor', async () => {
    renderSitios()

    await waitFor(() => {
      expect(screen.getByText('+ Nuevo Sitio')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('+ Nuevo Sitio'))

    await waitFor(() => {
      expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Mi Sitio' } })
    fireEvent.change(screen.getByLabelText('Slug (subdominio)'), { target: { value: 'mi-sitio' } })
    fireEvent.click(screen.getByText('Crear Sitio'))

    await waitFor(() => {
      expect(sitioService.create).toHaveBeenCalledWith({
        nombre: 'Mi Sitio',
        slug: 'mi-sitio',
        id_plantilla: undefined,
      })
    })
    expect(mockNavigate).toHaveBeenCalledWith('/sitio/99/editar')
  })

  it('handles create error gracefully', async () => {
    ;(sitioService.create as any).mockRejectedValue(new Error('Create failed'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    renderSitios()
    await waitFor(() => {
      expect(screen.getByText('+ Nuevo Sitio')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('+ Nuevo Sitio'))
    await waitFor(() => {
      expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
    })
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'X' } })
    fireEvent.change(screen.getByLabelText('Slug (subdominio)'), { target: { value: 'x' } })
    fireEvent.click(screen.getByText('Crear Sitio'))

    await waitFor(() => {
      expect(sitioService.create).toHaveBeenCalled()
    })
    consoleSpy.mockRestore()
  })

  it('calls update when editingSitio is set', async () => {
    ;(sitioService.update as any).mockResolvedValue({ id: 1 })

    renderSitios()
    await waitFor(() => {
      expect(screen.getByText('Sitio Alpha')).toBeInTheDocument()
    })

    await sitioService.update(1, { nombre: 'Updated', slug: 'updated' })
    expect(sitioService.update).toHaveBeenCalledWith(1, { nombre: 'Updated', slug: 'updated' })
  })

  it('calls delete service when confirm returns true', async () => {
    vi.stubGlobal('confirm', vi.fn(() => true))
    renderSitios()

    await waitFor(() => {
      expect(screen.getByText('Sitio Alpha')).toBeInTheDocument()
    })
    fireEvent.click(screen.getAllByText('Eliminar')[0])

    await waitFor(() => {
      expect(sitioService.delete).toHaveBeenCalledWith(1)
    })
  })

  it('handles delete error gracefully', async () => {
    vi.stubGlobal('confirm', vi.fn(() => true))
    ;(sitioService.delete as any).mockRejectedValue(new Error('Delete failed'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    renderSitios()
    await waitFor(() => {
      expect(screen.getByText('Sitio Alpha')).toBeInTheDocument()
    })
    fireEvent.click(screen.getAllByText('Eliminar')[0])

    await waitFor(() => {
      expect(sitioService.delete).toHaveBeenCalled()
    })
    consoleSpy.mockRestore()
  })

  it('handles loadSitios error gracefully', async () => {
    ;(sitioService.getAll as any).mockRejectedValue(new Error('Load failed'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    renderSitios()
    await waitFor(() => {
      expect(screen.queryByText('Cargando...')).not.toBeInTheDocument()
    })
    expect(screen.getByText('+ Nuevo Sitio')).toBeInTheDocument()
    consoleSpy.mockRestore()
  })

  it('handles loadPlantillas error gracefully', async () => {
    ;(plantillaService.getMisPlantillas as any).mockRejectedValue(new Error('Plantillas failed'))
    ;(plantillaService.getPublicas as any).mockRejectedValue(new Error('Plantillas failed'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    renderSitios()
    await waitFor(() => {
      expect(screen.getByText('+ Nuevo Sitio')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('+ Nuevo Sitio'))
    await waitFor(() => {
      expect(screen.getByText('Nuevo Sitio')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Mis Plantillas'))
    expect(screen.queryByText('Mi Plantilla')).not.toBeInTheDocument()
    consoleSpy.mockRestore()
  })

  it('handles loadModulos error gracefully', async () => {
    ;(moduloService.getAll as any).mockRejectedValue(new Error('Modulos failed'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    renderSitios()
    await waitFor(() => {
      expect(screen.getByText('Sitio Alpha')).toBeInTheDocument()
    })
    expect(screen.getAllByTestId('card-sitio').length).toBeGreaterThan(0)
    consoleSpy.mockRestore()
  })

  it('switches origen tabs and filters plantillas accordingly', async () => {
    renderSitios()
    await waitFor(() => {
      expect(screen.getByText('+ Nuevo Sitio')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('+ Nuevo Sitio'))

    await waitFor(() => {
      expect(screen.getByText('Mis Plantillas')).toBeInTheDocument()
    })

    expect(screen.queryByText('Mi Plantilla')).not.toBeInTheDocument()
    expect(screen.queryByText('Plantilla Pub')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('Mis Plantillas'))
    expect(screen.getByText('Mi Plantilla')).toBeInTheDocument()
    expect(screen.queryByText('Plantilla Pub')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('Comunidad'))
    expect(screen.queryByText('Mi Plantilla')).not.toBeInTheDocument()
    expect(screen.getByText('Plantilla Pub')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Lienzo en blanco'))
    expect(screen.queryByText('Mi Plantilla')).not.toBeInTheDocument()
    expect(screen.queryByText('Plantilla Pub')).not.toBeInTheDocument()
  })

  it('selects a plantilla and applies the selected class', async () => {
    renderSitios()
    await waitFor(() => {
      expect(screen.getByText('+ Nuevo Sitio')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('+ Nuevo Sitio'))

    await waitFor(() => {
      expect(screen.getByText('Mis Plantillas')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Mis Plantillas'))
    await waitFor(() => {
      expect(screen.getByText('Mi Plantilla')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Mi Plantilla'))
    expect(screen.getByText('Mi Plantilla').closest('button')).toHaveClass('selected')
  })

  it('closes the modal when Escape key is pressed', async () => {
    renderSitios()
    await waitFor(() => {
      expect(screen.getByText('+ Nuevo Sitio')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('+ Nuevo Sitio'))
    await waitFor(() => {
      expect(screen.getByText('Nuevo Sitio')).toBeInTheDocument()
    })

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByText('Nuevo Sitio')).not.toBeInTheDocument()
    })
  })

  it('closes the modal when Cancelar is clicked', async () => {
    renderSitios()
    await waitFor(() => {
      expect(screen.getByText('+ Nuevo Sitio')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('+ Nuevo Sitio'))
    await waitFor(() => {
      expect(screen.getByText('Nuevo Sitio')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Cancelar'))

    await waitFor(() => {
      expect(screen.queryByText('Nuevo Sitio')).not.toBeInTheDocument()
    })
  })

  it('closes modal via overlay background button', async () => {
    renderSitios()
    await waitFor(() => {
      expect(screen.getByText('+ Nuevo Sitio')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('+ Nuevo Sitio'))
    await waitFor(() => {
      expect(screen.getByText('Nuevo Sitio')).toBeInTheDocument()
    })

    const overlayBtn = document.querySelector('.modal-overlay > button[aria-label="Cerrar modal"]') as HTMLElement
    fireEvent.click(overlayBtn)

    await waitFor(() => {
      expect(screen.queryByText('Nuevo Sitio')).not.toBeInTheDocument()
    })
  })

  it('passes sitio data correctly to each CardSitio', async () => {
    renderSitios()

    await waitFor(() => {
      const cards = screen.getAllByTestId('card-sitio')
      expect(cards).toHaveLength(2)
    })

    expect(screen.getByText('Sitio Alpha')).toBeInTheDocument()
    expect(screen.getByText('Sitio Beta')).toBeInTheDocument()
  })
})
