import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CardSitio } from './CardSitio'

const mockNavigate = vi.hoisted(() => vi.fn())
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const mockSitio = {
  id: 1,
  nombre: 'Mi Sitio',
  slug: 'mi-sitio',
  activo: true,
  miniatura: 'https://img.url',
}

const mockModulos = [
  { id: 1, slug: 'auth', nombre: 'Autenticación' },
  { id: 2, slug: 'blog', nombre: 'Blog' },
]

function renderCardSitio(props = {}) {
  return render(
    <MemoryRouter>
      <CardSitio sitio={mockSitio as any} {...props} />
    </MemoryRouter>
  )
}

describe('CardSitio', () => {
  beforeEach(() => {
    vi.stubGlobal('confirm', vi.fn())
  })

  it('should render sitio name and slug', () => {
    renderCardSitio()
    expect(screen.getByText('Mi Sitio')).toBeInTheDocument()
    expect(screen.getByText('mi-sitio')).toBeInTheDocument()
  })

  it('should show active status', () => {
    renderCardSitio()
    expect(screen.getByText('Activo')).toBeInTheDocument()
  })

  it('should show inactive status', () => {
    renderCardSitio({ sitio: { ...mockSitio, activo: false } as any })
    expect(screen.getByText('Inactivo')).toBeInTheDocument()
  })

  it('should render thumbnail when sitio has miniatura', () => {
    renderCardSitio()
    const img = screen.getByAltText('Mi Sitio')
    expect(img).toHaveAttribute('src', 'https://img.url')
  })

  it('should not render thumbnail when miniatura is missing', () => {
    renderCardSitio({ sitio: { ...mockSitio, miniatura: null } as any })
    expect(screen.queryByAltText('Mi Sitio')).toBeNull()
  })

  it('should show module badges when activeModIds match', () => {
    renderCardSitio({ modulos: mockModulos, activeModIds: [1] })
    expect(screen.getByText('Autenticación')).toBeInTheDocument()
    expect(screen.queryByText('Blog')).toBeNull()
  })

  it('should not show module section when no activeModIds', () => {
    renderCardSitio()
    expect(screen.queryByText('Módulos:')).toBeNull()
  })

  it('should call onDelete when delete confirmed', () => {
    const onDelete = vi.fn()
    ;(globalThis.confirm as any).mockReturnValue(true)
    renderCardSitio({ onDelete })
    fireEvent.click(screen.getByText('Eliminar'))
    expect(onDelete).toHaveBeenCalledWith(1)
  })

  it('should not call onDelete when delete cancelled', () => {
    const onDelete = vi.fn()
    ;(globalThis.confirm as any).mockReturnValue(false)
    renderCardSitio({ onDelete })
    fireEvent.click(screen.getByText('Eliminar'))
    expect(onDelete).not.toHaveBeenCalled()
  })

  it('should navigate to edit page when Editar is clicked', () => {
    renderCardSitio()
    fireEvent.click(screen.getByText('Editar'))
    expect(mockNavigate).toHaveBeenCalledWith('/sitio/1/editar')
  })

  it('should open site in new tab when Ver is clicked', () => {
    const mockOpen = vi.fn()
    vi.stubGlobal('open', mockOpen)
    renderCardSitio()
    fireEvent.click(screen.getByText('👁 Ver'))
    expect(mockOpen).toHaveBeenCalledWith(expect.stringContaining('/mi-sitio'), '_blank')
    vi.unstubAllGlobals()
  })
})
