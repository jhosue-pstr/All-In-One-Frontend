import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Modulos } from './Modulos'

const mockSitios = vi.hoisted(() => [
  { id: 1, nombre: 'Sitio A', slug: 'sitio-a', activo: true },
  { id: 2, nombre: 'Sitio B', slug: 'sitio-b', activo: false },
])

const mockModulos = vi.hoisted(() => [
  { id: 1, slug: 'auth', nombre: 'Autenticación', descripcion: '', tipo: 'component', configuracion_base: null, activo: true },
  { id: 2, slug: 'blog', nombre: 'Blog', descripcion: '', tipo: 'component', configuracion_base: null, activo: true },
])

const mockSitioGetAll = vi.hoisted(() => vi.fn().mockResolvedValue(mockSitios))
const mockGetBySitio = vi.hoisted(() => vi.fn().mockResolvedValue([1]))
const mockAdd = vi.hoisted(() => vi.fn().mockResolvedValue(undefined))
const mockRemove = vi.hoisted(() => vi.fn().mockResolvedValue(undefined))

vi.mock('../../services/sitio', () => ({
  sitioService: { getAll: mockSitioGetAll },
}))

vi.mock('../../services/modulo', () => ({
  moduloService: { getAll: vi.fn().mockResolvedValue(mockModulos) },
}))

vi.mock('../../services/sitioModulo', () => ({
  sitioModuloService: {
    getBySitio: mockGetBySitio,
    add: mockAdd,
    remove: mockRemove,
  },
}))

describe('Modulos', () => {
  beforeEach(() => {
    vi.stubGlobal('confirm', vi.fn())
  })

  it('should render sidebar with sites', async () => {
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

  it('should show modules for selected site', async () => {
    render(
      <MemoryRouter>
        <Modulos />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Sitio A')).toBeInTheDocument()
    })

    const sitioButton = screen.getByText('Sitio A')
    fireEvent.click(sitioButton)

    await waitFor(() => {
      expect(screen.getByText('Autenticación')).toBeInTheDocument()
    })
    expect(screen.getByText('Blog')).toBeInTheDocument()
  })

  it('should show empty state when no sites exist', async () => {
    mockSitioGetAll.mockResolvedValue([])

    render(
      <MemoryRouter>
        <Modulos />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('No hay sitios')).toBeInTheDocument()
    })

    mockSitioGetAll.mockResolvedValue(mockSitios)
  })
})
