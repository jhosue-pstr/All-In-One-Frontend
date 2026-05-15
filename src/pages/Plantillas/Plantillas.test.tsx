import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Plantillas } from './Plantillas'

vi.mock('../../services/plantilla', () => ({
  plantillaService: {
    getMisPlantillas: vi.fn().mockResolvedValue([
      { id: 1, nombre: 'Plantilla 1', slug: 'p1', descripcion: 'Desc', visibilidad: 'PUBLICA', activo: true },
      { id: 2, nombre: 'Plantilla 2', slug: 'p2', descripcion: '', visibilidad: 'PRIVADA', activo: false },
    ]),
    getPublicas: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockResolvedValue({ id: 3 }),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue(undefined),
  },
}))

describe('Plantillas', () => {
  beforeEach(() => {
    vi.stubGlobal('confirm', vi.fn().mockReturnValue(true))
  })

  it('should render Mis Plantillas tab by default with templates', async () => {
    render(
      <MemoryRouter>
        <Plantillas />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Plantilla 1')).toBeInTheDocument()
    })
    expect(screen.getByText('Plantilla 2')).toBeInTheDocument()
  })

  it('should switch between tabs', async () => {
    render(
      <MemoryRouter>
        <Plantillas />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Mis Plantillas')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Comunidad'))

    await waitFor(() => {
      expect(screen.getByText(/No hay plantillas/)).toBeInTheDocument()
    })
  })

  it('should open create modal', async () => {
    render(
      <MemoryRouter>
        <Plantillas />
      </MemoryRouter>
    )

    await waitFor(() => {
      fireEvent.click(screen.getByText(/Nueva Plantilla/))
    })

    expect(screen.getByText('Nueva Plantilla')).toBeInTheDocument()
  })

  it('should delete plantilla on confirm', async () => {
    const { plantillaService } = await import('../../services/plantilla')

    render(
      <MemoryRouter>
        <Plantillas />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Plantilla 1')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByText('Eliminar')
    fireEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(plantillaService.delete).toHaveBeenCalledWith(1)
    })
  })
})
