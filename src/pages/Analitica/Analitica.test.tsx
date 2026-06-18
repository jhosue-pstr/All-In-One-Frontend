import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Analitica from './Analitica'

const mockDashboard = {
  resumen: {
    visitas_hoy: 150,
    visitas_7d: 1200,
    visitas_30d: 5000,
    visitantes_unicos: 800,
    bounce_rate: 35,
    duracion_promedio: 125,
    total_visitas: 50000,
    total_eventos: 200,
  },
  visitas_por_dia: [
    { fecha: '2026-06-10', visitas: 100 },
    { fecha: '2026-06-11', visitas: 200 },
  ],
  top_paginas: [
    { url: 'https://ejemplo.com/productos/zapatos', titulo_pagina: 'Zapatos', visitas: 500, porcentaje: 75 },
    { url: 'https://ejemplo.com/index.html', titulo_pagina: 'Home', visitas: 300, porcentaje: 45 },
    { url: 'https://ejemplo.com/categoria/ofertas', titulo_pagina: null, visitas: 100, porcentaje: 15 },
  ],
  navegadores: { Chrome: 600, Firefox: 200, Safari: 100 },
  dispositivos: { Desktop: 500, Mobile: 300, Tablet: 100 },
  ultimas_visitas: [
    {
      id: 1, site_id: 1, url: 'https://ejemplo.com/productos', titulo_pagina: 'Productos',
      ip: '::1', user_agent: 'Chrome', referer: null, session_id: 'abc',
      navegador: 'Chrome', dispositivo: 'Desktop', pais: null,
      created_at: '2026-06-11T10:00:00Z',
    },
    {
      id: 2, site_id: 1, url: 'https://ejemplo.com/contacto', titulo_pagina: null,
      ip: null, user_agent: null, referer: null, session_id: 'def',
      navegador: null, dispositivo: null, pais: null,
      created_at: '2026-06-11T09:00:00Z',
    },
  ],
  eventos_recientes: [
    { id: 1, site_id: 1, tipo: 'click', etiqueta: 'btn-comprar', valor: null, metadata_json: null, url: '/productos', session_id: 'abc', created_at: '2026-06-11T10:00:00Z' },
    { id: 2, site_id: 1, tipo: 'view', etiqueta: null, valor: null, metadata_json: null, url: '/home', session_id: 'def', created_at: '2026-06-11T09:00:00Z' },
  ],
  blog: {
    total_posts: 10, publicados: 7, borradores: 3,
    posts_por_categoria: [], ultimos_posts: [],
  },
  tienda: {
    total_productos: 50, total_pedidos: 120, ingresos_totales: 15000,
    pedidos_por_estado: {}, productos_mas_vendidos: [],
  },
}

vi.mock('../../services/analitica', () => ({
  analiticaService: { getDashboard: vi.fn() },
}))

vi.mock('../../context/SiteContext', () => ({
  useSite: vi.fn(),
}))

import { analiticaService } from '../../services/analitica'
import { useSite } from '../../context/SiteContext'

function mockSiteId(id: number | null) {
  vi.mocked(useSite).mockReturnValue({ siteId: id, siteNombre: id ? 'Test' : null, sitios: [], setSite: vi.fn() })
}

describe('Analitica', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(analiticaService.getDashboard).mockResolvedValue(mockDashboard as any)
  })

  it('shows loading state initially', () => {
    mockSiteId(1)
    vi.mocked(analiticaService.getDashboard).mockReturnValue(new Promise(() => {}))
    render(<Analitica />)
    expect(screen.getByText('Cargando estadísticas...')).toBeInTheDocument()
  })

  it('shows select site message when no siteId', () => {
    mockSiteId(null)
    render(<Analitica />)
    expect(screen.getByText('Selecciona un sitio para ver sus estadísticas.')).toBeInTheDocument()
  })

  it('renders all KPI cards after loading', async () => {
    mockSiteId(1)
    render(<Analitica />)

    await waitFor(() => {
      expect(screen.getByText('150')).toBeInTheDocument()
    })

    expect(screen.getByText('Visitas Hoy')).toBeInTheDocument()
    expect(screen.getByText('1.2K')).toBeInTheDocument()
    expect(screen.getByText('Visitas 7 días')).toBeInTheDocument()
    expect(screen.getByText('800')).toBeInTheDocument()
    expect(screen.getByText('Visitantes Únicos')).toBeInTheDocument()
    expect(screen.getByText('35%')).toBeInTheDocument()
    expect(screen.getByText('Bounce Rate')).toBeInTheDocument()
    expect(screen.getByText('2:05 min')).toBeInTheDocument()
    expect(screen.getByText('Duración Promedio')).toBeInTheDocument()
    expect(screen.getByText('50.0K')).toBeInTheDocument()
    expect(screen.getByText('Total Visitas')).toBeInTheDocument()
  })

  it('renders blog stats section', async () => {
    mockSiteId(1)
    render(<Analitica />)

    await waitFor(() => {
      expect(screen.getByText('Blog — Resumen')).toBeInTheDocument()
    })

    expect(screen.getByText('Total Posts')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('Publicados')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('Borradores')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders tienda stats section', async () => {
    mockSiteId(1)
    render(<Analitica />)

    await waitFor(() => {
      expect(screen.getByText('Tienda — Resumen')).toBeInTheDocument()
    })

    expect(screen.getByText('Total Productos')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
    expect(screen.getByText('Total Pedidos')).toBeInTheDocument()
    expect(screen.getByText('120')).toBeInTheDocument()
    expect(screen.getByText('Ingresos Totales')).toBeInTheDocument()
    expect(screen.getByText('$15.0K')).toBeInTheDocument()
  })

  it('hides blog and tienda sections when null', async () => {
    mockSiteId(1)
    vi.mocked(analiticaService.getDashboard).mockResolvedValue({
      ...mockDashboard, blog: null, tienda: null,
    } as any)
    render(<Analitica />)

    await waitFor(() => {
      expect(screen.getByText('Total Visitas')).toBeInTheDocument()
    })

    expect(screen.queryByText('Blog — Resumen')).not.toBeInTheDocument()
    expect(screen.queryByText('Tienda — Resumen')).not.toBeInTheDocument()
  })

  it('renders top paginas with data', async () => {
    mockSiteId(1)
    render(<Analitica />)

    await waitFor(() => {
      expect(screen.getByText('Páginas más visitadas')).toBeInTheDocument()
    })

    expect(screen.getByText('zapatos')).toBeInTheDocument()
    expect(screen.getByText('Principal')).toBeInTheDocument()
    expect(screen.getByText('ofertas')).toBeInTheDocument()
    expect(screen.getAllByText('500').length).toBeGreaterThanOrEqual(1)
  })

  it('shows empty state for top paginas', async () => {
    mockSiteId(1)
    vi.mocked(analiticaService.getDashboard).mockResolvedValue({
      ...mockDashboard, top_paginas: [],
    } as any)
    render(<Analitica />)

    await waitFor(() => {
      expect(screen.getAllByText('Sin datos').length).toBeGreaterThanOrEqual(1)
    })
  })

  it('renders navegadores and dispositivos lists', async () => {
    mockSiteId(1)
    render(<Analitica />)

    await waitFor(() => {
      expect(screen.getByText('Navegadores y Dispositivos')).toBeInTheDocument()
    })

    expect(screen.getAllByText('Chrome').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Firefox')).toBeInTheDocument()
    expect(screen.getByText('Safari')).toBeInTheDocument()
    expect(screen.getAllByText('Desktop').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Mobile')).toBeInTheDocument()
    expect(screen.getByText('Tablet')).toBeInTheDocument()
  })

  it('shows empty state for navegadores and dispositivos', async () => {
    mockSiteId(1)
    vi.mocked(analiticaService.getDashboard).mockResolvedValue({
      ...mockDashboard, navegadores: {}, dispositivos: {},
    } as any)
    render(<Analitica />)

    await waitFor(() => {
      expect(screen.getByText('Navegadores y Dispositivos')).toBeInTheDocument()
    })

    const sinDatos = screen.getAllByText('Sin datos')
    expect(sinDatos.length).toBeGreaterThanOrEqual(2)
  })

  it('renders ultimas visitas table', async () => {
    mockSiteId(1)
    render(<Analitica />)

    await waitFor(() => {
      expect(screen.getByText('Últimas visitas')).toBeInTheDocument()
    })

    expect(screen.getByText('Navegador')).toBeInTheDocument()
    expect(screen.getByText('Dispositivo')).toBeInTheDocument()
    expect(screen.getByText('Fecha')).toBeInTheDocument()
  })

  it('shows empty state for ultimas visitas', async () => {
    mockSiteId(1)
    vi.mocked(analiticaService.getDashboard).mockResolvedValue({
      ...mockDashboard, ultimas_visitas: [],
    } as any)
    render(<Analitica />)

    await waitFor(() => {
      expect(screen.getByText('Sin visitas registradas')).toBeInTheDocument()
    })
  })

  it('renders eventos recientes list', async () => {
    mockSiteId(1)
    render(<Analitica />)

    await waitFor(() => {
      expect(screen.getByText('Eventos recientes')).toBeInTheDocument()
    })

    expect(screen.getByText('click')).toBeInTheDocument()
    expect(screen.getByText('view')).toBeInTheDocument()
    expect(screen.getByText('btn-comprar')).toBeInTheDocument()
  })

  it('shows empty state for eventos recientes', async () => {
    mockSiteId(1)
    vi.mocked(analiticaService.getDashboard).mockResolvedValue({
      ...mockDashboard, eventos_recientes: [],
    } as any)
    render(<Analitica />)

    await waitFor(() => {
      expect(screen.getByText('Sin eventos registrados')).toBeInTheDocument()
    })
  })

  it('changes period and refetches data', async () => {
    mockSiteId(1)
    render(<Analitica />)

    await waitFor(() => {
      expect(screen.getByText('Visitas Hoy')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText('Período'), { target: { value: '30' } })

    await waitFor(() => {
      expect(analiticaService.getDashboard).toHaveBeenCalledWith(1, 30)
    })
  })

  it('shows error on API failure', async () => {
    mockSiteId(1)
    vi.mocked(analiticaService.getDashboard).mockRejectedValue(new Error('Network error'))
    render(<Analitica />)

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
  })

  it('shows generic error on non-Error rejection', async () => {
    mockSiteId(1)
    vi.mocked(analiticaService.getDashboard).mockRejectedValue('string error')
    render(<Analitica />)

    await waitFor(() => {
      expect(screen.getByText('Error al cargar dashboard')).toBeInTheDocument()
    })
  })
})
