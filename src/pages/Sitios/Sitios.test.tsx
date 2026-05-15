import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Sitios } from './Sitios'

vi.mock('../../services/sitio', () => ({
  sitioService: {
    getAll: vi.fn().mockResolvedValue([
      { id: 1, nombre: 'Sitio A', slug: 'sitio-a', activo: true },
    ]),
    create: vi.fn().mockResolvedValue({ id: 2, nombre: 'Nuevo', slug: 'nuevo' }),
  },
}))

vi.mock('../../services/plantilla', () => ({
  plantillaService: {
    getAll: vi.fn().mockResolvedValue([
      { id: 1, nombre: 'Plantilla 1', slug: 'p1', visibilidad: 'PUBLICA', activo: true },
    ]),
    getMisPlantillas: vi.fn().mockResolvedValue([
      { id: 1, nombre: 'Plantilla 1', slug: 'p1', visibilidad: 'PUBLICA', activo: true },
    ]),
    getPublicas: vi.fn().mockResolvedValue([]),
  },
}))

vi.mock('../../services/modulo', () => ({
  moduloService: {
    getAll: vi.fn().mockResolvedValue([
      { id: 1, slug: 'auth', nombre: 'Autenticación', descripcion: '', tipo: 'component', activo: true },
    ]),
  },
}))

vi.mock('../../services/sitioModulo', () => ({
  sitioModuloService: {
    getBySitio: vi.fn().mockResolvedValue([]),
  },
}))

describe('Sitios', () => {
  beforeEach(() => {
    vi.stubGlobal('confirm', vi.fn().mockReturnValue(true))
  })

  it('should render list of sites', async () => {
    render(
      <MemoryRouter>
        <Sitios />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Sitio A')).toBeInTheDocument()
    })
  })

  it('should show create site button', async () => {
    render(
      <MemoryRouter>
        <Sitios />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('+ Nuevo Sitio')).toBeInTheDocument()
    })
  })

  it('should open create modal when clicking new site button', async () => {
    render(
      <MemoryRouter>
        <Sitios />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('+ Nuevo Sitio')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('+ Nuevo Sitio'))

    await waitFor(() => {
      expect(screen.getByText('Nuevo Sitio')).toBeInTheDocument()
    })
  })

  it('should show empty state when no sites', async () => {
    const { sitioService } = await import('../../services/sitio')
    ;(sitioService.getAll as any).mockResolvedValue([])

    render(
      <MemoryRouter>
        <Sitios />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('No hay sitios creados aún.')).toBeInTheDocument()
    })
  })
})
