import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Configuraciones } from './Configuraciones'
import { authService } from '../../services/auth'

const mockUser = {
  id: 1,
  correo: 'a@b.com',
  nombre: 'Juan',
  apellido: 'Perez',
  role: 'user',
  created_at: '',
  updated_at: '',
}

vi.mock('../../services/auth', () => ({
  authService: {
    me: vi.fn(),
    update: vi.fn(),
    logout: vi.fn(),
  },
}))

async function renderConfig() {
  render(
    <MemoryRouter>
      <Configuraciones />
    </MemoryRouter>
  )
  await waitFor(() => {
    expect(screen.queryByText('Cargando...')).not.toBeInTheDocument()
  })
}

describe('Configuraciones', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('loading', () => {
    it('should show loading state initially', () => {
      authService.me.mockReturnValue(new Promise(() => {}))

      render(
        <MemoryRouter>
          <Configuraciones />
        </MemoryRouter>
      )
      expect(screen.getByText('Cargando...')).toBeInTheDocument()
    })
  })

  describe('profile tab', () => {
    beforeEach(() => {
      authService.me.mockResolvedValue(mockUser)
    })

    it('should render tabs', async () => {
      render(
        <MemoryRouter>
          <Configuraciones />
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Perfil')).toBeInTheDocument()
      })
      expect(screen.getByText('Seguridad')).toBeInTheDocument()
      expect(screen.getByText('Sitio')).toBeInTheDocument()
      expect(screen.getByText('Notificaciones')).toBeInTheDocument()
    })

    it('should show profile tab by default with user info', async () => {
      render(
        <MemoryRouter>
          <Configuraciones />
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByDisplayValue('Juan')).toBeInTheDocument()
      })
      expect(screen.getByDisplayValue('Perez')).toBeInTheDocument()
      expect(screen.getByDisplayValue('a@b.com')).toBeInTheDocument()
    })

    it('should show success message after profile update', async () => {
      authService.update.mockResolvedValue(mockUser)

      await renderConfig()

      fireEvent.click(screen.getByText('Guardar cambios'))

      await waitFor(() => {
        expect(screen.getByText('Perfil actualizado correctamente')).toBeInTheDocument()
      })
    })

    it('should show error message on profile update failure', async () => {
      authService.update.mockRejectedValue(new Error('Error'))

      await renderConfig()

      fireEvent.click(screen.getByText('Guardar cambios'))

      await waitFor(() => {
        expect(screen.getByText('Error al actualizar el perfil')).toBeInTheDocument()
      })
    })

    it('should show saving state while submitting profile', async () => {
      authService.update.mockReturnValue(new Promise(() => {}))

      await renderConfig()

      fireEvent.click(screen.getByText('Guardar cambios'))

      await waitFor(() => {
        expect(screen.getByText('Guardando...')).toBeInTheDocument()
      })
    })

    it('should display user image from localStorage', async () => {
      localStorage.setItem('user_image', 'data:image/png;base64,abc')

      await renderConfig()

      const img = screen.getByAltText('Avatar')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', 'data:image/png;base64,abc')
    })

    it('should show initial letter when no user image', async () => {
      await renderConfig()

      expect(screen.getByText('J')).toBeInTheDocument()
    })

    it('should show U when user has no nombre', async () => {
      authService.me.mockResolvedValue({ ...mockUser, nombre: '' })

      await renderConfig()

      expect(screen.getByText('U')).toBeInTheDocument()
    })

    it('should handle image upload', async () => {
      await renderConfig()

      const file = new File([''], 'avatar.png', { type: 'image/png' })
      const input = screen.getByLabelText('Cambiar imagen')

      const fileReaderInstance: any = {
        readAsDataURL: vi.fn(),
        result: 'data:image/png;base64,newimage',
        onloadend: null,
      }
      vi.spyOn(window, 'FileReader').mockImplementation(function () {
        return fileReaderInstance
      })
      fileReaderInstance.readAsDataURL.mockImplementation(function (this: any) {
        setTimeout(() => {
          if (this.onloadend) this.onloadend()
        }, 0)
      })

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByText('Imagen actualizada correctamente')).toBeInTheDocument()
      })

      expect(localStorage.getItem('user_image')).toBe('data:image/png;base64,newimage')
    })

    it('should trigger onChange when typing nombre and apellido', async () => {
      await renderConfig()

      const nombreInput = screen.getByDisplayValue('Juan')
      fireEvent.change(nombreInput, { target: { value: 'Juan Carlos' } })

      const apellidoInput = screen.getByDisplayValue('Perez')
      fireEvent.change(apellidoInput, { target: { value: 'Perez Garcia' } })

      expect(screen.getByDisplayValue('Juan Carlos')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Perez Garcia')).toBeInTheDocument()
    })

    it('should click Perfil tab when already active', async () => {
      await renderConfig()
      fireEvent.click(screen.getByText('Perfil'))
      expect(screen.getByDisplayValue('Juan')).toBeInTheDocument()
    })
  })

  describe('tab switching', () => {
    beforeEach(() => {
      authService.me.mockResolvedValue(mockUser)
    })

    it('should switch to Security tab', async () => {
      render(
        <MemoryRouter>
          <Configuraciones />
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Perfil')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Seguridad'))

      await waitFor(() => {
        expect(screen.getByText('Actualizar contraseña')).toBeInTheDocument()
      })
    })

    it('should switch to Notifications tab', async () => {
      render(
        <MemoryRouter>
          <Configuraciones />
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Perfil')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Notificaciones'))

      await waitFor(() => {
        expect(screen.getByText('Notificaciones por email')).toBeInTheDocument()
      })
    })

    it('should switch to Sitio tab', async () => {
      render(
        <MemoryRouter>
          <Configuraciones />
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Perfil')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Sitio'))

      await waitFor(() => {
        expect(screen.getByText('Configuración del Sitio')).toBeInTheDocument()
      })
    })
  })

  describe('password change', () => {
    beforeEach(() => {
      authService.me.mockResolvedValue(mockUser)
    })

    it('should show password change form in Security tab', async () => {
      await renderConfig()

      fireEvent.click(screen.getByText('Seguridad'))

      await waitFor(() => {
        expect(screen.getByText('Actualizar contraseña')).toBeInTheDocument()
      })
      expect(screen.getByLabelText('Nueva contraseña')).toBeInTheDocument()
      expect(screen.getByLabelText('Confirmar contraseña')).toBeInTheDocument()
    })

    it('should show error on password mismatch', async () => {
      await renderConfig()

      fireEvent.click(screen.getByText('Seguridad'))
      await waitFor(() => {
        expect(screen.getByText('Actualizar contraseña')).toBeInTheDocument()
      })

      fireEvent.change(screen.getByLabelText('Nueva contraseña'), { target: { value: 'new123' } })
      fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: 'different' } })

      fireEvent.click(screen.getByText('Actualizar contraseña'))

      await waitFor(() => {
        expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument()
      })
    })

    it('should update password successfully', async () => {
      authService.update.mockResolvedValue(mockUser)

      await renderConfig()

      fireEvent.click(screen.getByText('Seguridad'))
      await waitFor(() => {
        expect(screen.getByText('Actualizar contraseña')).toBeInTheDocument()
      })

      fireEvent.change(screen.getByLabelText('Nueva contraseña'), { target: { value: 'new123' } })
      fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: 'new123' } })

      fireEvent.click(screen.getByText('Actualizar contraseña'))

      await waitFor(() => {
        expect(screen.getByText('Contraseña actualizada correctamente')).toBeInTheDocument()
      })
    })

    it('should show error on password update failure', async () => {
      authService.update.mockRejectedValue(new Error('Error'))

      await renderConfig()

      fireEvent.click(screen.getByText('Seguridad'))
      await waitFor(() => {
        expect(screen.getByText('Actualizar contraseña')).toBeInTheDocument()
      })

      fireEvent.change(screen.getByLabelText('Nueva contraseña'), { target: { value: 'new123' } })
      fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: 'new123' } })

      fireEvent.click(screen.getByText('Actualizar contraseña'))

      await waitFor(() => {
        expect(screen.getByText('Error al actualizar la contraseña')).toBeInTheDocument()
      })
    })
  })

  describe('error handling', () => {
    it('should stop loading when me() fails', async () => {
      authService.me.mockRejectedValue(new Error('Error'))

      await renderConfig()

      expect(screen.getByText('Perfil')).toBeInTheDocument()
    })
  })
})
