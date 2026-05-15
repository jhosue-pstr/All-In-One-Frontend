import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Register } from './Register'

vi.mock('../../services/auth', () => ({
  authService: {
    register: vi.fn().mockResolvedValue({ id: 1 }),
  },
}))

describe('Register', () => {
  it('should render registration form with all fields', () => {
    render(<Register />)
    expect(screen.getAllByText('Crear Cuenta').length).toBeGreaterThan(0)
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
    expect(screen.getByLabelText('Apellido')).toBeInTheDocument()
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Crear Cuenta' })).toBeInTheDocument()
  })

  it('should call authService.register on submit', async () => {
    const { authService } = await import('../../services/auth')
    render(<Register />)

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Juan' } })
    fireEvent.change(screen.getByLabelText('Apellido'), { target: { value: 'Perez' } })
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'j@m.com' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Crear Cuenta' }))

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalled()
    })
  })

  it('should show success message after registration', async () => {
    render(<Register />)

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Juan' } })
    fireEvent.change(screen.getByLabelText('Apellido'), { target: { value: 'Perez' } })
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'j@m.com' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Crear Cuenta' }))

    await expect(screen.findByText('¡Registro exitoso! Ahora puedes iniciar sesión.', {}, { timeout: 3000 })).resolves.toBeInTheDocument()
  })
})
