import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Login } from './Login'

vi.mock('../../services/auth', () => ({
  authService: {
    login: vi.fn().mockResolvedValue({ access_token: 'tok', token_type: 'bearer' }),
  },
}))

describe('Login', () => {
  it('should render login form with email and password fields', () => {
    render(<Login />)
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument()
  })

  it('should call authService.login on submit', async () => {
    const { authService } = await import('../../services/auth')
    render(<Login />)

    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }))

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalled()
    })
  })

  it('should call onSuccess when login succeeds', async () => {
    const onSuccess = vi.fn()
    render(<Login onSuccess={onSuccess} />)

    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }))

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
    })
  })
})
