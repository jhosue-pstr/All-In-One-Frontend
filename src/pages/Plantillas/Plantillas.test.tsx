import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Plantillas } from './Plantillas'
import { plantillaService } from '../../services'
import type { Plantilla } from '../../models'

vi.mock('../../services', () => ({
  plantillaService: {
    getMisPlantillas: vi.fn(),
    getPublicas: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

const mockedPlantillaService = plantillaService as unknown as {
  getMisPlantillas: ReturnType<typeof vi.fn>
  getPublicas: ReturnType<typeof vi.fn>
  create: ReturnType<typeof vi.fn>
  update: ReturnType<typeof vi.fn>
  delete: ReturnType<typeof vi.fn>
}

vi.mock('../../components/CardPlantilla/CardPlantilla', () => ({
  CardPlantilla: ({
    plantilla,
    onEdit,
    onDelete,
    showActions,
  }: {
    plantilla: Plantilla
    onEdit: (plantilla: Plantilla) => void
    onDelete: (id: number) => void
    showActions: boolean
  }) => (
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

const mockPlantillas: Plantilla[] = [
  {
    id: 1,
    nombre: 'Plantilla 1',
    slug: 'p1',
    descripcion: 'Descripción 1',
    configuracion: null,
    miniatura: null,
    activo: true,
    visibilidad: 'PUBLICA',
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
    visibilidad: 'PRIVADA',
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
      mockedPlantillaService.getMisPlantillas.mockReturnValue(new Promise(() => {}))

      renderPlantillas()

      expect(screen.getByText('Cargando...')).not.toBeNull()
    })
  })

  describe('Mis Plantillas tab', () => {
    it('shows empty state when there are no plantillas', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue([])

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText(/No hay plantillas creadas aún/)).not.toBeNull()
      })
    })

    it('shows empty state with create button', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue([])

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Crear mi primera plantilla')).not.toBeNull()
      })
    })

    it('renders CardPlantilla for each plantilla', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)

      renderPlantillas()

      await waitFor(() => {
        const cards = screen.getAllByTestId('card-plantilla')
        expect(cards).toHaveLength(2)
      })

      expect(screen.getByText('Plantilla 1')).not.toBeNull()
      expect(screen.getByText('Plantilla 2')).not.toBeNull()
    })

    it('passes showActions=true on mis-plantillas tab', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getAllByText('Editar card')).toHaveLength(2)
        expect(screen.getAllByText('Eliminar card')).toHaveLength(2)
      })
    })
  })

  describe('Comunidad tab', () => {
    it('shows empty state when there are no public plantillas', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)
      mockedPlantillaService.getPublicas.mockResolvedValue([])

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).not.toBeNull()
      })

      fireEvent.click(screen.getByText('Comunidad'))

      await waitFor(() => {
        expect(screen.getByText(/No hay plantillas disponibles/)).not.toBeNull()
      })
    })

    it('renders public plantillas', async () => {
      const publicas: Plantilla[] = [mockPlantillas[0]]

      mockedPlantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)
      mockedPlantillaService.getPublicas.mockResolvedValue(publicas)

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).not.toBeNull()
      })

      fireEvent.click(screen.getByText('Comunidad'))

      await waitFor(() => {
        const cards = screen.getAllByTestId('card-plantilla')
        expect(cards).toHaveLength(1)
      })
    })

    it('does not show action buttons on comunidad tab', async () => {
      const publicas: Plantilla[] = [mockPlantillas[0]]

      mockedPlantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)
      mockedPlantillaService.getPublicas.mockResolvedValue(publicas)

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).not.toBeNull()
      })

      fireEvent.click(screen.getByText('Comunidad'))

      await waitFor(() => {
        expect(screen.queryByText('Editar card')).toBeNull()
        expect(screen.queryByText('Eliminar card')).toBeNull()
      })
    })
  })

  describe('Tab switching', () => {
    it('calls getPublicas when switching to Comunidad tab', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)
      mockedPlantillaService.getPublicas.mockResolvedValue([])

      renderPlantillas()

      await waitFor(() => {
        expect(mockedPlantillaService.getMisPlantillas).toHaveBeenCalledTimes(1)
      })

      fireEvent.click(screen.getByText('Comunidad'))

      await waitFor(() => {
        expect(mockedPlantillaService.getPublicas).toHaveBeenCalledTimes(1)
      })
    })

    it('calls getMisPlantillas when switching back to Mis Plantillas', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)
      mockedPlantillaService.getPublicas.mockResolvedValue([])

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).not.toBeNull()
      })

      fireEvent.click(screen.getByText('Comunidad'))

      await waitFor(() => {
        expect(screen.getByText(/No hay plantillas disponibles/)).not.toBeNull()
      })

      fireEvent.click(screen.getByText('Mis Plantillas'))

      await waitFor(() => {
        expect(mockedPlantillaService.getMisPlantillas).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('Edit plantilla', () => {
    it('opens modal with pre-filled form data when editing', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).not.toBeNull()
      })

      fireEvent.click(screen.getAllByText('Editar card')[0])

      await waitFor(() => {
        expect(screen.getByText('Editar Plantilla')).not.toBeNull()
      })

      expect(screen.getByDisplayValue('Plantilla 1')).not.toBeNull()
      expect(screen.getByDisplayValue('p1')).not.toBeNull()
      expect(screen.getByDisplayValue('Descripción 1')).not.toBeNull()
    })

    it('opens edit modal with empty descripcion when descripcion is null', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 2')).not.toBeNull()
      })

      fireEvent.click(screen.getAllByText('Editar card')[1])

      await waitFor(() => {
        expect(screen.getByText('Editar Plantilla')).not.toBeNull()
      })

      const textarea = document.querySelector('textarea') as HTMLTextAreaElement

      expect(textarea.value).toBe('')
    })

    it('sets editingPlantilla and switches modal title', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).not.toBeNull()
      })

      fireEvent.click(screen.getAllByText('Editar card')[0])

      await waitFor(() => {
        expect(screen.getByText('Editar Plantilla')).not.toBeNull()
      })

      expect(screen.getByText('Actualizar')).not.toBeNull()
    })
  })

  describe('Delete plantilla', () => {
    it('calls plantillaService.delete when confirm returns true', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).not.toBeNull()
      })

      fireEvent.click(screen.getAllByText('Eliminar card')[0])

      await waitFor(() => {
        expect(mockedPlantillaService.delete).toHaveBeenCalledWith(1)
      })
    })

    it('does nothing when confirm returns false', async () => {
      vi.stubGlobal('confirm', vi.fn().mockReturnValue(false))

      mockedPlantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).not.toBeNull()
      })

      fireEvent.click(screen.getAllByText('Eliminar card')[0])

      await waitFor(() => {
        expect(mockedPlantillaService.delete).not.toHaveBeenCalled()
      })
    })

    it('handles delete error gracefully', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)
      mockedPlantillaService.delete.mockRejectedValue(new Error('Delete failed'))

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).not.toBeNull()
      })

      fireEvent.click(screen.getAllByText('Eliminar card')[0])

      await waitFor(() => {
        expect(mockedPlantillaService.delete).toHaveBeenCalledWith(1)
      })

      expect(screen.getByText('Plantilla 1')).not.toBeNull()
    })
  })

  describe('Create plantilla', () => {
    it('opens modal with empty form when clicking Nueva Plantilla', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue([])

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('+ Nueva Plantilla')).not.toBeNull()
      })

      fireEvent.click(screen.getByText('+ Nueva Plantilla'))

      await waitFor(() => {
        expect(screen.getByText('Nueva Plantilla')).not.toBeNull()
      })

      const nombreInput = screen.getByPlaceholderText('Mi plantilla') as HTMLInputElement

      expect(nombreInput.value).toBe('')
      expect(screen.getByText('Crear Plantilla')).not.toBeNull()
    })

    it('calls plantillaService.create and closes modal on submit', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue([])
      mockedPlantillaService.create.mockResolvedValue({ id: 3 })

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('+ Nueva Plantilla')).not.toBeNull()
      })

      fireEvent.click(screen.getByText('+ Nueva Plantilla'))

      await waitFor(() => {
        expect(screen.getByText('Nueva Plantilla')).not.toBeNull()
      })

      await userEvent.type(screen.getByPlaceholderText('Mi plantilla'), 'Nueva P')
      await userEvent.type(screen.getByPlaceholderText('mi-plantilla'), 'nueva-p')

      fireEvent.submit(screen.getByRole('dialog').querySelector('form')!)

      await waitFor(() => {
        expect(mockedPlantillaService.create).toHaveBeenCalledWith(
          expect.objectContaining({
            nombre: 'Nueva P',
            slug: 'nueva-p',
            visibilidad: 'PRIVADA',
          })
        )
      })

      await waitFor(() => {
        expect(screen.queryByText('Nueva Plantilla')).toBeNull()
      })
    })

    it('handles create error gracefully', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue([])
      mockedPlantillaService.create.mockRejectedValue(new Error('Create failed'))

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('+ Nueva Plantilla')).not.toBeNull()
      })

      fireEvent.click(screen.getByText('+ Nueva Plantilla'))

      await waitFor(() => {
        expect(screen.getByText('Nueva Plantilla')).not.toBeNull()
      })

      await userEvent.type(screen.getByPlaceholderText('Mi plantilla'), 'Nueva P')
      await userEvent.type(screen.getByPlaceholderText('mi-plantilla'), 'nueva-p')

      fireEvent.submit(screen.getByRole('dialog').querySelector('form')!)

      await waitFor(() => {
        expect(mockedPlantillaService.create).toHaveBeenCalled()
      })

      expect(screen.getByText('Nueva Plantilla')).not.toBeNull()
    })
  })

  describe('Update plantilla', () => {
    it('calls plantillaService.update and closes modal on submit', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)
      mockedPlantillaService.update.mockResolvedValue({})

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).not.toBeNull()
      })

      fireEvent.click(screen.getAllByText('Editar card')[0])

      await waitFor(() => {
        expect(screen.getByText('Editar Plantilla')).not.toBeNull()
      })

      const nombreInput = screen.getByDisplayValue('Plantilla 1')

      fireEvent.change(nombreInput, {
        target: {
          value: 'Plantilla Editada',
        },
      })

      fireEvent.submit(screen.getByRole('dialog').querySelector('form')!)

      await waitFor(() => {
        expect(mockedPlantillaService.update).toHaveBeenCalledWith(
          1,
          expect.objectContaining({
            nombre: 'Plantilla Editada',
          })
        )
      })

      await waitFor(() => {
        expect(screen.queryByText('Editar Plantilla')).toBeNull()
      })
    })

    it('reloads plantillas after update', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)
      mockedPlantillaService.update.mockResolvedValue({})

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).not.toBeNull()
      })

      fireEvent.click(screen.getAllByText('Editar card')[0])

      await waitFor(() => {
        expect(screen.getByText('Editar Plantilla')).not.toBeNull()
      })

      fireEvent.submit(screen.getByRole('dialog').querySelector('form')!)

      await waitFor(() => {
        expect(mockedPlantillaService.update).toHaveBeenCalled()
      })

      await waitFor(() => {
        expect(mockedPlantillaService.getMisPlantillas).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('Modal visibility radio buttons', () => {
    it('defaults to PRIVADA when creating', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue([])

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('+ Nueva Plantilla')).not.toBeNull()
      })

      fireEvent.click(screen.getByText('+ Nueva Plantilla'))

      await waitFor(() => {
        expect(screen.getByText('Nueva Plantilla')).not.toBeNull()
      })

      const privadaRadio = screen.getByDisplayValue('PRIVADA') as HTMLInputElement

      expect(privadaRadio.checked).toBe(true)
    })

    it('switches visibilidad when clicking PUBLICA radio', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue([])

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('+ Nueva Plantilla')).not.toBeNull()
      })

      fireEvent.click(screen.getByText('+ Nueva Plantilla'))

      await waitFor(() => {
        expect(screen.getByText('Nueva Plantilla')).not.toBeNull()
      })

      fireEvent.click(screen.getByDisplayValue('PUBLICA'))

      expect((screen.getByDisplayValue('PUBLICA') as HTMLInputElement).checked).toBe(true)
      expect((screen.getByDisplayValue('PRIVADA') as HTMLInputElement).checked).toBe(false)
    })

    it('switches visibilidad back to PRIVADA when clicking PRIVADA radio', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue([])

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('+ Nueva Plantilla')).not.toBeNull()
      })

      fireEvent.click(screen.getByText('+ Nueva Plantilla'))

      await waitFor(() => {
        expect(screen.getByText('Nueva Plantilla')).not.toBeNull()
      })

      fireEvent.click(screen.getByDisplayValue('PUBLICA'))
      fireEvent.click(screen.getByDisplayValue('PRIVADA'))

      expect((screen.getByDisplayValue('PRIVADA') as HTMLInputElement).checked).toBe(true)
      expect((screen.getByDisplayValue('PUBLICA') as HTMLInputElement).checked).toBe(false)
    })
  })

  describe('Modal close interactions', () => {
    it('closes modal via overlay close button', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue([])

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('+ Nueva Plantilla')).not.toBeNull()
      })

      fireEvent.click(screen.getByText('+ Nueva Plantilla'))

      await waitFor(() => {
        expect(screen.getByText('Nueva Plantilla')).not.toBeNull()
      })

      const overlayBtn = document.querySelector(
        '.modal-overlay > button[aria-label="Cerrar modal"]'
      ) as HTMLElement

      fireEvent.click(overlayBtn)

      await waitFor(() => {
        expect(screen.queryByText('Nueva Plantilla')).toBeNull()
      })
    })

    it('closes modal via × close button', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue([])

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('+ Nueva Plantilla')).not.toBeNull()
      })

      fireEvent.click(screen.getByText('+ Nueva Plantilla'))

      await waitFor(() => {
        expect(screen.getByText('Nueva Plantilla')).not.toBeNull()
      })

      const closeBtn = document.querySelector('.modal-close') as HTMLElement

      fireEvent.click(closeBtn)

      await waitFor(() => {
        expect(screen.queryByText('Nueva Plantilla')).toBeNull()
      })
    })

    it('changes descripcion textarea', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).not.toBeNull()
      })

      fireEvent.click(screen.getAllByText('Editar card')[0])

      await waitFor(() => {
        expect(screen.getByText('Editar Plantilla')).not.toBeNull()
      })

      const textarea = screen.getByDisplayValue('Descripción 1') as HTMLTextAreaElement

      fireEvent.change(textarea, {
        target: {
          value: 'Nueva descripción',
        },
      })

      expect(screen.getByDisplayValue('Nueva descripción')).not.toBeNull()
    })
  })

  describe('Escape key closes modal', () => {
    it('closes modal when Escape is pressed', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue([])

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('+ Nueva Plantilla')).not.toBeNull()
      })

      fireEvent.click(screen.getByText('+ Nueva Plantilla'))

      await waitFor(() => {
        expect(screen.getByText('Nueva Plantilla')).not.toBeNull()
      })

      fireEvent.keyDown(document, {
        key: 'Escape',
      })

      await waitFor(() => {
        expect(screen.queryByText('Nueva Plantilla')).toBeNull()
      })
    })

    it('does not close modal when other key is pressed', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue([])

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('+ Nueva Plantilla')).not.toBeNull()
      })

      fireEvent.click(screen.getByText('+ Nueva Plantilla'))

      await waitFor(() => {
        expect(screen.getByText('Nueva Plantilla')).not.toBeNull()
      })

      fireEvent.keyDown(document, {
        key: 'Enter',
      })

      expect(screen.getByText('Nueva Plantilla')).not.toBeNull()
    })
  })

  describe('Cancelar button closes modal', () => {
    it('closes modal when Cancelar is clicked', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue([])

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('+ Nueva Plantilla')).not.toBeNull()
      })

      fireEvent.click(screen.getByText('+ Nueva Plantilla'))

      await waitFor(() => {
        expect(screen.getByText('Nueva Plantilla')).not.toBeNull()
      })

      fireEvent.click(screen.getByText('Cancelar'))

      await waitFor(() => {
        expect(screen.queryByText('Nueva Plantilla')).toBeNull()
      })
    })
  })

  describe('loadPlantillas catch', () => {
    it('handles getMisPlantillas error gracefully', async () => {
      mockedPlantillaService.getMisPlantillas.mockRejectedValue(new Error('Network error'))

      renderPlantillas()

      await waitFor(() => {
        expect(screen.queryByTestId('card-plantilla')).toBeNull()
      })

      expect(screen.queryByText('Cargando...')).toBeNull()
    })

    it('handles getPublicas error gracefully', async () => {
      mockedPlantillaService.getMisPlantillas.mockResolvedValue(mockPlantillas)
      mockedPlantillaService.getPublicas.mockRejectedValue(new Error('Network error'))

      renderPlantillas()

      await waitFor(() => {
        expect(screen.getByText('Plantilla 1')).not.toBeNull()
      })

      fireEvent.click(screen.getByText('Comunidad'))

      await waitFor(() => {
        expect(screen.queryByTestId('card-plantilla')).toBeNull()
      })

      expect(screen.queryByText('Cargando...')).toBeNull()
    })
  })
})