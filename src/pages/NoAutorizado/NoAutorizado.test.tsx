import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { NoAutorizado } from './NoAutorizado'

function renderComponent(permiso?: string) {
  return render(
    <BrowserRouter>
      <NoAutorizado permiso={permiso} />
    </BrowserRouter>
  )
}

describe('NoAutorizado', () => {
  it('renders default message', () => {
    renderComponent()
    expect(screen.getByText('Acceso no autorizado')).toBeInTheDocument()
    expect(screen.getByText(/No tienes permisos/)).toBeInTheDocument()
  })

  it('shows permiso when provided', () => {
    renderComponent('roles.ver')
    expect(screen.getByText(/roles\.ver/)).toBeInTheDocument()
  })

  it('does not render permiso paragraph when not provided', () => {
    renderComponent()
    expect(screen.queryByText(/Permiso requerido/)).not.toBeInTheDocument()
  })

  it('renders link to inicio', () => {
    renderComponent()
    const link = screen.getByText('Volver al inicio')
    expect(link).toBeInTheDocument()
    expect(link.getAttribute('href')).toBe('/inicio')
  })
})
