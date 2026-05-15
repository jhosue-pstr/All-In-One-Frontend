import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { WebEditor } from './WebEditor'

vi.mock('../../components/GrapesJS', () => ({
  initGrapesJS: vi.fn().mockReturnValue({
    on: vi.fn(),
    destroy: vi.fn(),
    setDevice: vi.fn(),
    getDevice: vi.fn().mockReturnValue('Desktop'),
    runCommand: vi.fn(),
    getHtml: vi.fn().mockReturnValue('<div></div>'),
    getCss: vi.fn().mockReturnValue(''),
    getProjectData: vi.fn().mockReturnValue({}),
    loadProjectData: vi.fn(),
    Modal: { setTitle: vi.fn().mockReturnThis(), setContent: vi.fn().mockReturnThis(), open: vi.fn(), close: vi.fn(), getContent: vi.fn() },
    Pages: { getAll: vi.fn().mockReturnValue([]), select: vi.fn(), remove: vi.fn(), add: vi.fn() },
    Commands: { add: vi.fn() },
    setComponents: vi.fn(),
    setStyle: vi.fn(),
  }),
}))

vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({ toBlob: (cb: any) => cb(new Blob()) }),
}))

vi.mock('../../services/plantilla', () => ({
  plantillaService: {
    getById: vi.fn().mockResolvedValue({ configuracion: { html: '<h1>Test</h1>', css: '' } }),
    update: vi.fn().mockResolvedValue({}),
  },
}))

function renderWebEditor(path = '/plantillas/1/editar') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/plantillas/:id/editar" element={<WebEditor />} />
      </Routes>
    </MemoryRouter>
  )
}

async function waitForRender() {
  renderWebEditor()
  await waitFor(() => {
    expect(screen.getByTitle('PC')).toBeInTheDocument()
  })
}

describe('WebEditor', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ url: 'https://img.url' }),
    }))
    localStorage.setItem('token', 'tok')
  })

  it('should render editor with device buttons', async () => {
    await waitForRender()

    expect(screen.getByTitle('Tablet')).toBeInTheDocument()
    expect(screen.getByTitle('Móvil')).toBeInTheDocument()
  })

  it('should render action buttons', async () => {
    await waitForRender()

    expect(screen.getByTitle('Ver Bordes')).toBeInTheDocument()
    expect(screen.getByTitle('Deshacer')).toBeInTheDocument()
    expect(screen.getByTitle('Rehacer')).toBeInTheDocument()
    expect(screen.getByTitle('Guardar')).toBeInTheDocument()
    expect(screen.getByTitle('Ver Código')).toBeInTheDocument()
  })

  it('should render editor title', async () => {
    await waitForRender()

    expect(screen.getAllByText(/Editor/).length).toBeGreaterThan(0)
  })
})
