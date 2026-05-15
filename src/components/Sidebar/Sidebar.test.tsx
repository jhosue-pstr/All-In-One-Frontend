import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Sidebar } from './Sidebar'

const mockUser = {
  id: 1,
  correo: 'a@b.com',
  nombre: 'Juan',
  apellido: 'Perez',
  role: 'user',
  created_at: '',
  updated_at: '',
}

function renderSidebar(user = mockUser) {
  return render(
    <MemoryRouter>
      <Sidebar user={user} />
    </MemoryRouter>
  )
}

describe('Sidebar', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should render user name', () => {
    renderSidebar()
    expect(screen.getByText(/Bienvenido, Juan/)).toBeInTheDocument()
  })

  it('should render all navigation links', () => {
    renderSidebar()
    expect(screen.getByText('Inicio')).toBeInTheDocument()
    expect(screen.getByText('Sitios')).toBeInTheDocument()
    expect(screen.getByText('Plantillas')).toBeInTheDocument()
    expect(screen.getByText('Módulos')).toBeInTheDocument()
    expect(screen.getByText('Configuraciones')).toBeInTheDocument()
  })

  it('should show user initial when no image in localStorage', () => {
    renderSidebar()
    expect(screen.getByText('J')).toBeInTheDocument()
  })

  it('should show user image when present in localStorage', () => {
    localStorage.setItem('user_image', 'data:image/png;base64,abc')
    renderSidebar()
    const img = screen.getByAltText('Avatar')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'data:image/png;base64,abc')
  })

  it('should show default initial U when user has no nombre', () => {
    renderSidebar({ ...mockUser, nombre: '' })
    expect(screen.getByText('U')).toBeInTheDocument()
  })

  it('should clear token and redirect on logout', () => {
    localStorage.setItem('token', 'tok')
    const originalLocation = globalThis.location
    delete (globalThis as any).location
    globalThis.location = { href: '' } as any

    renderSidebar()
    fireEvent.click(screen.getByText('Salir'))

    expect(localStorage.getItem('token')).toBeNull()
    expect(globalThis.location.href).toBe('/')

    globalThis.location = originalLocation
  })
})
