import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CardPlantilla } from './CardPlantilla'

const mockNavigate = vi.hoisted(() => vi.fn())
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const mockPlantilla = {
  id: 1,
  nombre: 'Mi Plantilla',
  slug: 'mi-plantilla',
  descripcion: 'Una descripción',
  visibilidad: 'PUBLICA' as const,
  activo: true,
  miniatura: null,
}

function renderCardPlantilla(props = {}) {
  return render(
    <MemoryRouter>
      <CardPlantilla plantilla={mockPlantilla as any} {...props} />
    </MemoryRouter>
  )
}

describe('CardPlantilla', () => {
  beforeEach(() => {
    vi.stubGlobal('confirm', vi.fn())
  })

  it('should render plantilla name and slug', () => {
    renderCardPlantilla()
    expect(screen.getByText('Mi Plantilla')).toBeInTheDocument()
    expect(screen.getByText('mi-plantilla')).toBeInTheDocument()
  })

  it('should show description or fallback text', () => {
    renderCardPlantilla()
    expect(screen.getByText('Una descripción')).toBeInTheDocument()
  })

  it('should show default description when empty', () => {
    renderCardPlantilla({ plantilla: { ...mockPlantilla, descripcion: '' } as any })
    expect(screen.getByText('Sin descripción')).toBeInTheDocument()
  })

  it('should show visibility badge as Pública', () => {
    renderCardPlantilla()
    expect(screen.getByText('Pública')).toBeInTheDocument()
  })

  it('should show visibility badge as Privada', () => {
    renderCardPlantilla({ plantilla: { ...mockPlantilla, visibilidad: 'PRIVADA' as const } as any })
    expect(screen.getByText('Privada')).toBeInTheDocument()
  })

  it('should show active status', () => {
    renderCardPlantilla()
    expect(screen.getByText('Activa')).toBeInTheDocument()
  })

  it('should show inactive status', () => {
    renderCardPlantilla({ plantilla: { ...mockPlantilla, activo: false } as any })
    expect(screen.getByText('Inactiva')).toBeInTheDocument()
  })

  it('should render miniatura image when provided', () => {
    renderCardPlantilla({ plantilla: { ...mockPlantilla, miniatura: 'thumb.jpg' } as any })
    const img = screen.getByAltText('Mi Plantilla')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'thumb.jpg')
  })

  it('should show actions when showActions is true', () => {
    renderCardPlantilla()
    expect(screen.getByText('Editar')).toBeInTheDocument()
    expect(screen.getByText('Editar basic')).toBeInTheDocument()
    expect(screen.getByText('Eliminar')).toBeInTheDocument()
  })

  it('should hide actions when showActions is false', () => {
    renderCardPlantilla({ showActions: false })
    expect(screen.queryByText('Eliminar')).toBeNull()
  })

  it('should call onDelete when delete confirmed', () => {
    const onDelete = vi.fn()
    ;(globalThis.confirm as any).mockReturnValue(true)
    renderCardPlantilla({ onDelete })
    fireEvent.click(screen.getByText('Eliminar'))
    expect(onDelete).toHaveBeenCalledWith(1)
  })

  it('should not call onDelete when delete cancelled', () => {
    const onDelete = vi.fn()
    ;(globalThis.confirm as any).mockReturnValue(false)
    renderCardPlantilla({ onDelete })
    fireEvent.click(screen.getByText('Eliminar'))
    expect(onDelete).not.toHaveBeenCalled()
  })

  it('should call onEdit when edit basic clicked', () => {
    const onEdit = vi.fn()
    renderCardPlantilla({ onEdit })
    fireEvent.click(screen.getByText('Editar basic'))
    expect(onEdit).toHaveBeenCalledWith(mockPlantilla)
  })

  it('should navigate to edit page when Editar is clicked', () => {
    renderCardPlantilla()
    fireEvent.click(screen.getByText('Editar'))
    expect(mockNavigate).toHaveBeenCalledWith('/plantillas/1/editar')
  })
})
