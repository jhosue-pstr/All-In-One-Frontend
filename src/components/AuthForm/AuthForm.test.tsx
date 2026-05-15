import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthForm } from './AuthForm'

const fields = [
  { id: 'correo', label: 'Email', type: 'email', placeholder: 'correo@ejemplo.com', required: true },
  { id: 'contrasena', label: 'Password', type: 'password', placeholder: '••••', required: true },
]

describe('AuthForm', () => {
  it('should render title and fields', () => {
    render(<AuthForm title="Login" fields={fields} submitText="Entrar" onSubmit={vi.fn()} formClassName="login-form" />)
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })

  it('should call onSubmit with values when submitted', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { container } = render(<AuthForm title="Login" fields={fields} submitText="Entrar" onSubmit={onSubmit} formClassName="login-form" />)
    const form = container.querySelector('form')
    if (!form) throw new Error('Form not found')

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '123' } })
    fireEvent.submit(form)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ correo: 'a@b.com', contrasena: '123' })
    })
  })

  it('should show error message when onSubmit fails', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('Credenciales incorrectas'))
    const { container } = render(<AuthForm title="Login" fields={fields} submitText="Entrar" onSubmit={onSubmit} formClassName="login-form" />)
    const form = container.querySelector('form')
    if (!form) throw new Error('Form not found')

    fireEvent.submit(form)

    expect(await screen.findByText('Credenciales incorrectas')).toBeInTheDocument()
  })

  it('should show success message when successMessage prop is set', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { container } = render(
      <AuthForm
        title="Register"
        fields={fields}
        submitText="Crear"
        onSubmit={onSubmit}
        formClassName="register-form"
        successMessage="Registro exitoso"
      />
    )
    const form = container.querySelector('form')
    if (!form) throw new Error('Form not found')

    fireEvent.submit(form)

    expect(await screen.findByText('Registro exitoso')).toBeInTheDocument()
  })

  it('should render additional content', () => {
    render(
      <AuthForm title="Login" fields={fields} submitText="Entrar" onSubmit={vi.fn()} formClassName="login-form" additionalContent={<a href="/">Link</a>} />
    )
    expect(screen.getByText('Link')).toBeInTheDocument()
  })
})
