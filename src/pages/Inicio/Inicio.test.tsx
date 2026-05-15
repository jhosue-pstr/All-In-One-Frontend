import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Inicio } from './Inicio'

describe('Inicio', () => {
  it('should render welcome header', () => {
    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>
    )
    expect(screen.getByText('Bienvenido a All in One')).toBeInTheDocument()
  })

  it('should render section titles', () => {
    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>
    )
    expect(screen.getByText('¿Cómo usar la plataforma?')).toBeInTheDocument()
    expect(screen.getByText('Consejos Rápidos')).toBeInTheDocument()
    expect(screen.getByText('Para empezar')).toBeInTheDocument()
  })

  it('should render quick action links', () => {
    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>
    )
    expect(screen.getByText('Crear mi primer sitio')).toBeInTheDocument()
    expect(screen.getByText('Ver plantillas disponibles')).toBeInTheDocument()
    expect(screen.getByText('Explorar módulos')).toBeInTheDocument()
  })
})
