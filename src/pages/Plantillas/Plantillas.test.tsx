import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Plantillas } from './Plantillas'
import { plantillaService } from '../../services'

vi.mock('../../services', () => ({
  plantillaService: {
    getMisPlantillas: vi.fn(),
    getPublicas: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('../../components/CardPlantilla/CardPlantilla', () => ({
  CardPlantilla: ({ plantilla, onEdit, onDelete, showActions }) => (
    <div data-testid="card-plantilla">
      <span>{plantilla.nombre}</span>
      {showActions && (
        <>
          <button onClick={() => onEdit(plantilla)}>Editar card</button>
          <button onClick={() => onDelete(plantilla.id)}>Eliminar card</button>
        </>
      )}
    </div>
  ),
}))

const mockPlantillas = [
  {
    id: 1,
    nombre: 'Plantilla 1',
    slug: 'p1',
    descripcion: 'Descripción 1',
    configuracion: null,
    miniatura: null,
    activo: true,
    visibilidad: 'PUBLICA' as const,
    id_usuario: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    nombre: 'Plantilla 2',
    slug: 'p2',
    descripcion: null,
    configuracion: null,
    miniatura: null,
    activo: false,
    visibilidad: 'PRIVADA' as const,
    id_usuario: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
]

function renderPlantillas() {
  return render(<Plantillas />)
}

describe('Plantillas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('confirm', vi.fn().mockReturnValue(true))
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('Loading state', () => {
    it('shows loading indicator while fetching plantillas', () => {
      plantillaService.getMisPlantillas.mockReturnValue(new Promise(() => {}))
      renderPlantillas()
      expect(screen.getByText('Cargando...')).toBeInTheDocument()
    })
  })

  describe('Mis Plantillas tab', () => {
    it('shows empty state when there are no plantillas', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue([])
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText(/No hay plantillas creadas aún/)).toBeInTheDocument()
      })
    })

    it('shows empty state with create button', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue([])
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Crear mi primera plantilla')).toBeInTheDocument()
      })
    })

    it('renders CardPlantilla for each plantilla', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)
      renderPlantillas()

      await waitFor(() => {
        const cards = screen.getAllByTestId('card-plantilla')
        expect(cards).toHaveLength(2)
      })
      expect(screen.getByText('Plantilla 1')).toBeInTheDocument()
      expect(screen.getByText('Plantilla 2')).toBeInTheDocument()
    })

    it('passes showActions=true on mis-plantillas tab', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getAllByText('Editar card')).toHaveLength(2)
        expect(screen.getAllByText('Eliminar card')).toHaveLength(2)
      })
    })
  })

  describe('Comunidad tab', () => {
    it('shows empty state when there are no public plantillas', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)
      plantillaService.getPublicas.mockResolvedValue([])
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Comunidad'))

      await waitFor(() => {
        expect(screen.getByText(/No hay plantillas disponibles/)).toBeInTheDocument()
      })
    })

    it('renders public plantillas', async () => {
      const publicas = [mockPlantillas[0]]
      plantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)
      plantillaService.getPublicas.mockResolvedValue(publicas)
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Comunidad'))

      await waitFor(() => {
        const cards = screen.getAllByTestId('card-plantilla')
        expect(cards).toHaveLength(1)
      })
    })

    it('does not show action buttons on comunidad tab', async () => {
      const publicas = [mockPlantillas[0]]
      plantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)
      plantillaService.getPublicas.mockResolvedValue(publicas)
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Comunidad'))

      await waitFor(() => {
        expect(screen.queryByText('Editar card')).not.toBeInTheDocument()
        expect(screen.queryByText('Eliminar card')).not.toBeInTheDocument()
      })
    })
  })

  describe('Tab switching', () => {
    it('calls getPublicas when switching to Comunidad tab', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)
      plantillaService.getPublicas.mockResolvedValue([])
      renderPlantillas()

      await waitFor(() => {
        expect(plantillaService.getMisPlantillas).toHaveBeenCalledTimes(1)
      })

      fireEvent.click(screen.getByText('Comunidad'))

      await waitFor(() => {
        expect(plantillaService.getPublicas).toHaveBeenCalledTimes(1)
      })
    })

    it('calls getMisPlantillas when switching back to Mis Plantillas', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)
      plantillaService.getPublicas.mockResolvedValue([])
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Comunidad'))
      await waitFor(() => {
        expect(screen.getByText(/No hay plantillas disponibles/)).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Mis Plantillas'))
      await waitFor(() => {
        expect(plantillaService.getMisPlantillas).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('Edit plantilla', () => {
    it('opens modal with pre-filled form data when editing', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).toBeInTheDocument()
      })

      fireEvent.click(screen.getAllByText('Editar card')[0])

      await waitFor(() => {
        expect(screen.getByText('Editar Plantilla')).toBeInTheDocument()
      })

      const nombreInput = screen.getByDisplayValue('Plantilla 1') as HTMLInputElement
      expect(nombreInput).toBeInTheDocument()
      expect(screen.getByDisplayValue('p1')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Descripción 1')).toBeInTheDocument()
    })

    it('sets editingPlantilla and switches modal title', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).toBeInTheDocument()
      })

      fireEvent.click(screen.getAllByText('Editar card')[0])

      await waitFor(() => {
        expect(screen.getByText('Editar Plantilla')).toBeInTheDocument()
      })

      expect(screen.getByText('Actualizar')).toBeInTheDocument()
    })
  })

  describe('Delete plantilla', () => {
    it('calls plantillaService.delete when confirm returns true', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).toBeInTheDocument()
      })

      fireEvent.click(screen.getAllByText('Eliminar card')[0])

      await waitFor(() => {
        expect(plantillaService.delete).toHaveBeenCalledWith(1)
      })
    })

    it('does nothing when confirm returns false', async () => {
      vi.stubGlobal('confirm', vi.fn().mockReturnValue(false))
      plantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).toBeInTheDocument()
      })

      fireEvent.click(screen.getAllByText('Eliminar card')[0])

      await waitFor(() => {
        expect(plantillaService.delete).not.toHaveBeenCalled()
      })
    })

    it('handles delete error gracefully', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)
      plantillaService.delete.mockRejectedValue(new Error('Delete failed'))
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).toBeInTheDocument()
      })

      fireEvent.click(screen.getAllByText('Eliminar card')[0])

      await waitFor(() => {
        expect(plantillaService.delete).toHaveBeenCalledWith(1)
      })

      expect(screen.getByText('Plantilla 1')).toBeInTheDocument()
    })
  })

  describe('Create plantilla', () => {
    it('opens modal with empty form when clicking Nueva Plantilla', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue([])
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('+ Nueva Plantilla')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('+ Nueva Plantilla'))

      await waitFor(() => {
        expect(screen.getByText('Nueva Plantilla')).toBeInTheDocument()
      })

      const nombreInput = screen.getByPlaceholderText('Mi plantilla') as HTMLInputElement
      expect(nombreInput.value).toBe('')
      expect(screen.getByText('Crear Plantilla')).toBeInTheDocument()
    })

    it('calls plantillaService.create and closes modal on submit', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue([])
      plantillaService.create.mockResolvedValue({ id: 3 })
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('+ Nueva Plantilla')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('+ Nueva Plantilla'))

      await waitFor(() => {
        expect(screen.getByText('Nueva Plantilla')).toBeInTheDocument()
      })

      await userEvent.type(screen.getByPlaceholderText('Mi plantilla'), 'Nueva P')
      await userEvent.type(screen.getByPlaceholderText('mi-plantilla'), 'nueva-p')

      fireEvent.submit(screen.getByRole('dialog').querySelector('form')!)

      await waitFor(() => {
        expect(plantillaService.create).toHaveBeenCalledWith(
          expect.objectContaining({
            nombre: 'Nueva P',
            slug: 'nueva-p',
            visibilidad: 'PRIVADA',
          })
        )
      })

      await waitFor(() => {
        expect(screen.queryByText('Nueva Plantilla')).not.toBeInTheDocument()
      })
    })

    it('handles create error gracefully', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue([])
      plantillaService.create.mockRejectedValue(new Error('Create failed'))
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('+ Nueva Plantilla')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('+ Nueva Plantilla'))

      await waitFor(() => {
        expect(screen.getByText('Nueva Plantilla')).toBeInTheDocument()
      })

      await userEvent.type(screen.getByPlaceholderText('Mi plantilla'), 'Nueva P')
      await userEvent.type(screen.getByPlaceholderText('mi-plantilla'), 'nueva-p')

      fireEvent.submit(screen.getByRole('dialog').querySelector('form')!)

      await waitFor(() => {
        expect(plantillaService.create).toHaveBeenCalled()
      })

      expect(screen.getByText('Nueva Plantilla')).toBeInTheDocument()
    })
  })

  describe('Update plantilla', () => {
    it('calls plantillaService.update and closes modal on submit', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)
      plantillaService.update.mockResolvedValue({})
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).toBeInTheDocument()
      })

      fireEvent.click(screen.getAllByText('Editar card')[0])

      await waitFor(() => {
        expect(screen.getByText('Editar Plantilla')).toBeInTheDocument()
      })

      const nombreInput = screen.getByDisplayValue('Plantilla 1')
      fireEvent.change(nombreInput, { target: { value: 'Plantilla Editada' } })

      fireEvent.submit(screen.getByRole('dialog').querySelector('form')!)

      await waitFor(() => {
        expect(plantillaService.update).toHaveBeenCalledWith(
          1,
          expect.objectContaining({ nombre: 'Plantilla Editada' })
        )
      })

      await waitFor(() => {
        expect(screen.queryByText('Editar Plantilla')).not.toBeInTheDocument()
      })
    })

    it('reloads plantillas after update', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)
      plantillaService.update.mockResolvedValue({})
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).toBeInTheDocument()
      })

      fireEvent.click(screen.getAllByText('Editar card')[0])

      await waitFor(() => {
        expect(screen.getByText('Editar Plantilla')).toBeInTheDocument()
      })

      fireEvent.submit(screen.getByRole('dialog').querySelector('form')!)

      await waitFor(() => {
        expect(plantillaService.update).toHaveBeenCalled()
      })

      await waitFor(() => {
        expect(plantillaService.getMisPlantillas).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('Modal visibility radio buttons', () => {
    it('defaults to PRIVADA when creating', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue([])
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('+ Nueva Plantilla')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('+ Nueva Plantilla'))

      await waitFor(() => {
        expect(screen.getByText('Nueva Plantilla')).toBeInTheDocument()
      })

      const privadaRadio = screen.getByDisplayValue('PRIVADA') as HTMLInputElement
      expect(privadaRadio.checked).toBe(true)
    })

    it('switches visibilidad when clicking PUBLICA radio', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue([])
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('+ Nueva Plantilla')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('+ Nueva Plantilla'))

      await waitFor(() => {
        expect(screen.getByText('Nueva Plantilla')).toBeInTheDocument()
      })

      const publicaRadio = screen.getByDisplayValue('PUBLICA')
      fireEvent.click(publicaRadio)

      expect((screen.getByDisplayValue('PUBLICA') as HTMLInputElement).checked).toBe(true)
      expect((screen.getByDisplayValue('PRIVADA') as HTMLInputElement).checked).toBe(false)
    })

    it('switches visibilidad back to PRIVADA when clicking PRIVADA radio', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue([])
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('+ Nueva Plantilla')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('+ Nueva Plantilla'))

      await waitFor(() => {
        expect(screen.getByText('Nueva Plantilla')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByDisplayValue('PUBLICA'))
      fireEvent.click(screen.getByDisplayValue('PRIVADA'))

      expect((screen.getByDisplayValue('PRIVADA') as HTMLInputElement).checked).toBe(true)
      expect((screen.getByDisplayValue('PUBLICA') as HTMLInputElement).checked).toBe(false)
    })
  })

  describe('Modal close interactions', () => {
    it('closes modal via overlay close button', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue([])
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('+ Nueva Plantilla')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('+ Nueva Plantilla'))

      await waitFor(() => {
        expect(screen.getByText('Nueva Plantilla')).toBeInTheDocument()
      })

      const overlayBtn = document.querySelector('.modal-overlay > button[aria-label="Cerrar modal"]') as HTMLElement
      fireEvent.click(overlayBtn)

      await waitFor(() => {
        expect(screen.queryByText('Nueva Plantilla')).not.toBeInTheDocument()
      })
    })

    it('closes modal via × close button', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue([])
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('+ Nueva Plantilla')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('+ Nueva Plantilla'))

      await waitFor(() => {
        expect(screen.getByText('Nueva Plantilla')).toBeInTheDocument()
      })

      const closeBtn = document.querySelector('.modal-close') as HTMLElement
      fireEvent.click(closeBtn)

      await waitFor(() => {
        expect(screen.queryByText('Nueva Plantilla')).not.toBeInTheDocument()
      })
    })

    it('changes descripcion textarea', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).toBeInTheDocument()
      })

      fireEvent.click(screen.getAllByText('Editar card')[0])

      await waitFor(() => {
        expect(screen.getByText('Editar Plantilla')).toBeInTheDocument()
      })

      const textarea = screen.getByDisplayValue('Descripción 1') as HTMLTextAreaElement
      fireEvent.change(textarea, { target: { value: 'Nueva descripción' } })
      expect(screen.getByDisplayValue('Nueva descripción')).toBeInTheDocument()
    })
  })

  describe('Escape key closes modal', () => {
    it('closes modal when Escape is pressed', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue([])
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('+ Nueva Plantilla')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('+ Nueva Plantilla'))

      await waitFor(() => {
        expect(screen.getByText('Nueva Plantilla')).toBeInTheDocument()
      })

      fireEvent.keyDown(document, { key: 'Escape' })

      await waitFor(() => {
        expect(screen.queryByText('Nueva Plantilla')).not.toBeInTheDocument()
      })
    })

    it('does not close modal when other key is pressed', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue([])
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('+ Nueva Plantilla')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('+ Nueva Plantilla'))

      await waitFor(() => {
        expect(screen.getByText('Nueva Plantilla')).toBeInTheDocument()
      })

      fireEvent.keyDown(document, { key: 'Enter' })

      expect(screen.getByText('Nueva Plantilla')).toBeInTheDocument()
    })
  })

  describe('Cancelar button closes modal', () => {
    it('closes modal when Cancelar is clicked', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue([])
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('+ Nueva Plantilla')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('+ Nueva Plantilla'))

      await waitFor(() => {
        expect(screen.getByText('Nueva Plantilla')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Cancelar'))

      await waitFor(() => {
        expect(screen.queryByText('Nueva Plantilla')).not.toBeInTheDocument()
      })
    })
  })

  describe('loadPlantillas catch', () => {
    it('handles getMisPlantillas error gracefully', async () => {
      plantillaService.getMisPlantillas.mockRejectedValue(new Error('Network error'))
      renderPlantillas()

      await waitFor(() => {
        expect(screen.queryByTestId('card-plantilla')).not.toBeInTheDocument()
      })

      expect(screen.queryByText('Cargando...')).not.toBeInTheDocument()
    })

    it('handles getPublicas error gracefully', async () => {
      plantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)
      plantillaService.getPublicas.mockRejectedValue(new Error('Network error'))
      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Comunidad'))

      await waitFor(() => {
        expect(screen.queryByTestId('card-plantilla')).not.toBeInTheDocument()
      })

      expect(screen.queryByText('Cargando...')).not.toBeInTheDocument()
    })
  })
})
