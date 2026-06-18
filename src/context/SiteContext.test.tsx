import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SiteProvider, useSite } from './SiteContext'

vi.mock('../services/sitio', () => ({
  sitioService: {
    getAll: vi.fn(),
  },
}))

import { sitioService } from '../services/sitio'

const mockSitios = [
  { id: 1, nombre: 'Sitio 1', url: 'https://sitio1.com' },
  { id: 2, nombre: 'Sitio 2', url: 'https://sitio2.com' },
]

function TestChild() {
  const { siteId, siteNombre, sitios, setSite } = useSite()
  return (
    <div>
      <span data-testid="siteId">{String(siteId)}</span>
      <span data-testid="siteNombre">{siteNombre}</span>
      <span data-testid="sitiosCount">{sitios.length}</span>
      <button data-testid="setSite" onClick={() => setSite(2, 'Sitio 2')}>Change</button>
    </div>
  )
}

function renderProvider() {
  return render(
    <SiteProvider>
      <TestChild />
    </SiteProvider>
  )
}

describe('SiteProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads sitios and selects first one by default', async () => {
    vi.mocked(sitioService.getAll).mockResolvedValue(mockSitios as any)

    renderProvider()

    await vi.waitFor(() => {
      expect(screen.getByTestId('sitiosCount').textContent).toBe('2')
    })

    expect(screen.getByTestId('siteId').textContent).toBe('1')
    expect(screen.getByTestId('siteNombre').textContent).toBe('Sitio 1')
  })

  it('handles empty sitios list', async () => {
    vi.mocked(sitioService.getAll).mockResolvedValue([])

    renderProvider()

    await vi.waitFor(() => {
      expect(screen.getByTestId('sitiosCount').textContent).toBe('0')
    })

    expect(screen.getByTestId('siteId').textContent).toBe('null')
    expect(screen.getByTestId('siteNombre').textContent).toBe('')
  })

  it('handles non-array data from API', async () => {
    vi.mocked(sitioService.getAll).mockResolvedValue(null as any)

    renderProvider()

    await vi.waitFor(() => {
      expect(screen.getByTestId('sitiosCount').textContent).toBe('0')
    })
  })

  it('handles API error gracefully', async () => {
    vi.mocked(sitioService.getAll).mockRejectedValue(new Error('API error'))

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    renderProvider()

    await vi.waitFor(() => {
      expect(screen.getByTestId('sitiosCount').textContent).toBe('0')
    })

    consoleSpy.mockRestore()
  })

  it('setSite updates current site', async () => {
    vi.mocked(sitioService.getAll).mockResolvedValue(mockSitios as any)

    renderProvider()

    await vi.waitFor(() => {
      expect(screen.getByTestId('siteId').textContent).toBe('1')
    })

    screen.getByTestId('setSite').click()

    await vi.waitFor(() => {
      expect(screen.getByTestId('siteId').textContent).toBe('2')
    })
    expect(screen.getByTestId('siteNombre').textContent).toBe('Sitio 2')
  })
})

describe('useSite', () => {
  it('throws when used outside SiteProvider', () => {
    expect(() => render(<TestChild />)).toThrow('useSite debe usarse dentro de <SiteProvider>')
  })
})
