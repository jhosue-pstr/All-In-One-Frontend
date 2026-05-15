import { describe, it, expect, vi, beforeEach } from 'vitest'
import { initGrapesJS } from './index'

vi.mock('grapesjs', () => {
  const mockEditor = {
    on: vi.fn().mockReturnThis(),
    setComponents: vi.fn(),
    setStyle: vi.fn(),
    getContainer: vi.fn(),
    Modal: {
      setTitle: vi.fn().mockReturnThis(),
      setContent: vi.fn().mockReturnThis(),
      open: vi.fn(),
      close: vi.fn(),
      getContent: vi.fn(),
    },
    Pages: {
      getAll: vi.fn().mockReturnValue([]),
      select: vi.fn(),
      remove: vi.fn(),
      add: vi.fn(),
    },
    Commands: { add: vi.fn() },
    setDevice: vi.fn(),
    getDevice: vi.fn().mockReturnValue('Desktop'),
    getHtml: vi.fn().mockReturnValue('<div></div>'),
    getCss: vi.fn().mockReturnValue(''),
    getProjectData: vi.fn().mockReturnValue({}),
    loadProjectData: vi.fn(),
    runCommand: vi.fn(),
    getSelected: vi.fn(),
    destroy: vi.fn(),
  }

  return {
    default: {
      init: vi.fn(() => mockEditor),
    },
  }
})

describe('initGrapesJS', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('should create editor with correct configuration', () => {
    const editor = initGrapesJS({ siteId: '1' })
    expect(editor).toBeDefined()
  })

  it('should load project data when provided', () => {
    const projectData = { html: '<h1>Test</h1>', css: 'h1 { color: red; }' }
    const editor = initGrapesJS({ siteId: '1', projectData })
    expect(editor.setComponents).toHaveBeenCalledWith('<h1>Test</h1>')
    expect(editor.setStyle).toHaveBeenCalledWith('h1 { color: red; }')
  })

  it('should call onLoad and load saved data', async () => {
    const onLoad = vi.fn().mockResolvedValue({ settings: { html: '<p>Loaded</p>' } })
    initGrapesJS({ siteId: '1', onLoad })

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledWith('1')
    })
  })
})
