import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { WebEditor } from './WebEditor'
import { plantillaService } from '../../services/plantilla'
import { sitioService } from '../../services/sitio'
import { initGrapesJS } from '../../components/GrapesJS'

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
  default: vi.fn().mockResolvedValue({
    toBlob: (cb: any) => cb(new Blob()),
  }),
}))

vi.mock('../../services/plantilla', () => ({
  plantillaService: {
    getById: vi.fn().mockResolvedValue({ configuracion: { html: '<h1>Test</h1>', css: '' } }),
    update: vi.fn().mockResolvedValue({}),
  },
}))

vi.mock('../../services/sitio', () => ({
  sitioService: {
    getById: vi.fn().mockResolvedValue({ configuracion: { html: '<h1>Sitio</h1>', css: '' } }),
    update: vi.fn().mockResolvedValue({}),
  },
}))

function renderWebEditor(path = '/plantillas/1/editar') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/plantillas/:id/editar" element={<WebEditor />} />
        <Route path="/sitio/:id/editar" element={<WebEditor />} />
        <Route path="/plantillas" element={<div>Plantillas List</div>} />
        <Route path="/sitioWeb" element={<div>SitioWeb List</div>} />
      </Routes>
    </MemoryRouter>
  )
}

async function waitForRender(path?: string) {
  const result = renderWebEditor(path)
  await waitFor(() => {
    expect(screen.getByTitle('PC')).toBeInTheDocument()
  })
  return result
}

describe('WebEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn((url: string) => {
      if (url === '/scripts/site-auth.js') {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('console.log("auth")'),
        })
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ url: 'https://img.url' }),
      })
    }))
    localStorage.setItem('token', 'tok')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
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

  it('should load plantilla data via plantillaService.getById', async () => {
    await waitForRender()

    expect(plantillaService.getById).toHaveBeenCalledWith(1)
  })

  it('should load sitio data via sitioService.getById', async () => {
    await waitForRender('/sitio/1/editar')

    expect(sitioService.getById).toHaveBeenCalledWith(1)
  })

  it('should handle error when plantillaService.getById rejects', async () => {
    plantillaService.getById.mockRejectedValueOnce(new Error('Failed'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    renderWebEditor()
    await waitFor(() => {
      expect(screen.getByTitle('PC')).toBeInTheDocument()
    })

    expect(consoleSpy).toHaveBeenCalledWith('Error al cargar:', expect.any(Error))
    consoleSpy.mockRestore()
  })

  it('should switch device when clicking PC, Tablet, and Móvil buttons', async () => {
    await waitForRender()
    const editor = initGrapesJS.mock.results[0].value

    fireEvent.click(screen.getByTitle('PC'))
    expect(editor.setDevice).toHaveBeenCalledWith('Desktop')

    fireEvent.click(screen.getByTitle('Tablet'))
    expect(editor.setDevice).toHaveBeenCalledWith('Tablet')

    fireEvent.click(screen.getByTitle('Móvil'))
    expect(editor.setDevice).toHaveBeenCalledWith('Mobile')
  })

  it('should run commands when clicking action buttons', async () => {
    await waitForRender()
    const editor = initGrapesJS.mock.results[0].value

    fireEvent.click(screen.getByTitle('Ver Bordes'))
    expect(editor.runCommand).toHaveBeenCalledWith('sw-visibility')

    fireEvent.click(screen.getByTitle('Deshacer'))
    expect(editor.runCommand).toHaveBeenCalledWith('undo')

    fireEvent.click(screen.getByTitle('Rehacer'))
    expect(editor.runCommand).toHaveBeenCalledWith('redo')

    fireEvent.click(screen.getByTitle('Ver Código'))
    expect(editor.runCommand).toHaveBeenCalledWith('edit-code')
  })

  it('should run panel commands when clicking tab buttons', async () => {
    await waitForRender()
    const editor = initGrapesJS.mock.results[0].value

    const tab = (panel: string) => document.querySelector(`[data-panel="${panel}"]`) as HTMLElement

    fireEvent.click(tab('blocks'))
    expect(editor.runCommand).toHaveBeenCalledWith('show-blocks')

    fireEvent.click(tab('layers'))
    expect(editor.runCommand).toHaveBeenCalledWith('show-layers')

    fireEvent.click(tab('styles'))
    expect(editor.runCommand).toHaveBeenCalledWith('show-styles')

    fireEvent.click(tab('pages'))
    expect(editor.runCommand).toHaveBeenCalledWith('show-pages')
  })

  it('should navigate to /plantillas when clicking back from plantilla path', async () => {
    await waitForRender()

    fireEvent.click(document.querySelector('.btn-back')!)
    await waitFor(() => {
      expect(screen.getByText('Plantillas List')).toBeInTheDocument()
    })
  })

  it('should navigate to /sitioWeb when clicking back from sitio path', async () => {
    await waitForRender('/sitio/1/editar')

    fireEvent.click(document.querySelector('.btn-back')!)
    await waitFor(() => {
      expect(screen.getByText('SitioWeb List')).toBeInTheDocument()
    })
  })

  it('should save plantilla, upload miniatura, and show success toast', async () => {
    await waitForRender()

    fireEvent.click(screen.getByTitle('Guardar'))
    await waitFor(() => {
      expect(screen.getByText('Plantilla guardada correctamente')).toBeInTheDocument()
    }, { timeout: 10000 })

    expect(plantillaService.update).toHaveBeenCalled()
    const updateArg = plantillaService.update.mock.calls[0][1]
    expect(updateArg).toHaveProperty('configuracion')
    expect(updateArg).toHaveProperty('miniatura', 'https://img.url')
  })

  it('should save sitio and show success toast', async () => {
    await waitForRender('/sitio/1/editar')

    fireEvent.click(screen.getByTitle('Guardar'))
    await waitFor(() => {
      expect(screen.getByText('Sitio guardado correctamente')).toBeInTheDocument()
    }, { timeout: 10000 })

    expect(sitioService.update).toHaveBeenCalled()
    const updateArg = sitioService.update.mock.calls[0][1]
    expect(updateArg).toHaveProperty('configuracion')
    expect(updateArg).toHaveProperty('miniatura', 'https://img.url')
  })

  it('should show error toast when save fails', async () => {
    plantillaService.update.mockRejectedValueOnce(new Error('Save failed'))
    await waitForRender()

    fireEvent.click(screen.getByTitle('Guardar'))
    await waitFor(() => {
      expect(screen.getByText('Error al guardar')).toBeInTheDocument()
    }, { timeout: 10000 })
  })

  it('should cleanup editor on unmount by calling editor.destroy()', async () => {
    const { unmount } = await waitForRender()
    const editor = initGrapesJS.mock.results[0].value

    unmount()

    expect(editor.destroy).toHaveBeenCalled()
  })

  it('should handle site-auth.js fetch failure gracefully', async () => {
    vi.stubGlobal('fetch', vi.fn((url: string) => {
      if (url === '/scripts/site-auth.js') {
        return Promise.reject(new Error('Network error'))
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ url: 'https://img.url' }),
      })
    }))
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    await waitForRender()

    fireEvent.click(screen.getByTitle('Guardar'))
    await waitFor(() => {
      expect(screen.getByText('Plantilla guardada correctamente')).toBeInTheDocument()
    }, { timeout: 10000 })

    expect(consoleSpy).toHaveBeenCalledWith('No se pudo cargar site-auth.js', expect.any(Error))
    consoleSpy.mockRestore()
  })

  it('should handle upload miniatura failure', async () => {
    const failingFetch = vi.fn((url: string) => {
      if (url.includes('/miniatura')) {
        return Promise.resolve({ ok: false })
      }
      if (url === '/scripts/site-auth.js') {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('console.log("auth")'),
        })
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ url: 'https://img.url' }),
      })
    })
    vi.stubGlobal('fetch', failingFetch)
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await waitForRender()

    fireEvent.click(screen.getByTitle('Guardar'))
    await waitFor(() => {
      expect(screen.getByText('Error al guardar')).toBeInTheDocument()
    }, { timeout: 10000 })
    consoleSpy.mockRestore()
  })
})
