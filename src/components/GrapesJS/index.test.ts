import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { initGrapesJS } from './index'

const { mockEditor, commandsMap } = vi.hoisted(() => {
  const cmds = new Map<string, any>()
  const editor = {
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
      getAll: vi.fn(),
      select: vi.fn(),
      remove: vi.fn(),
      add: vi.fn(),
      getSelected: vi.fn(),
    },
    Commands: {
      add: vi.fn((id: string, cmd: any) => { cmds.set(id, cmd) }),
    },
    setDevice: vi.fn(),
    getDevice: vi.fn().mockReturnValue('Desktop'),
    getHtml: vi.fn().mockReturnValue('<div></div>'),
    getCss: vi.fn().mockReturnValue(''),
    getProjectData: vi.fn().mockReturnValue({}),
    loadProjectData: vi.fn(),
    runCommand: vi.fn(),
    destroy: vi.fn(),
  }
  return { mockEditor: editor, commandsMap: cmds }
})

vi.mock('grapesjs', () => ({
  default: { init: vi.fn(() => mockEditor) },
}))

vi.mock('./assets/editor.css', () => ({}))

function setupDom(siteId = '1') {
  document.body.innerHTML = `
    <div class="editor-row">
      <div id="gjs"></div>
      <div class="layers-container" style="display:block"></div>
      <div class="styles-container" style="display:block"></div>
      <div class="traits-container" style="display:block"></div>
      <div class="pages-container" style="display:block">
        <div id="pages-list-${siteId}"></div>
        <button id="btn-add-page-${siteId}"></button>
      </div>
      <div id="blocks-${siteId}" style="display:block"></div>
    </div>
  `
  mockEditor.getContainer.mockReturnValue(document.getElementById('gjs'))
}

function makePage(id: string, name: string) {
  return { id, get: (k: string) => (k === 'name' ? name : '') }
}

describe('initGrapesJS', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
    commandsMap.clear()
  })

  describe('basic initialization', () => {
    it('creates editor and injects Font Awesome', () => {
      initGrapesJS({ siteId: '1' })
      const link = document.querySelector('link[href*="font-awesome"]')
      expect(link).not.toBeNull()
      expect(link?.getAttribute('rel')).toBe('stylesheet')
    })

    it('loads project data when provided', () => {
      initGrapesJS({ siteId: '1', projectData: { html: '<div>', css: 'div {}' } })
      expect(mockEditor.setComponents).toHaveBeenCalledWith('<div>')
      expect(mockEditor.setStyle).toHaveBeenCalledWith('div {}')
    })

    it('skips setComponents when html is absent', () => {
      initGrapesJS({ siteId: '1', projectData: { css: 'div {}' } } as any)
      expect(mockEditor.setComponents).not.toHaveBeenCalled()
      expect(mockEditor.setStyle).toHaveBeenCalledWith('div {}')
    })

    it('skips setStyle when css is absent', () => {
      initGrapesJS({ siteId: '1', projectData: { html: '<div>' } } as any)
      expect(mockEditor.setComponents).toHaveBeenCalledWith('<div>')
      expect(mockEditor.setStyle).not.toHaveBeenCalled()
    })
  })

  describe('device commands', () => {
    it('adds device commands for desktop, mobile, tablet', () => {
      initGrapesJS({ siteId: '1' })
      commandsMap.get('set-device-desktop').run()
      expect(mockEditor.setDevice).toHaveBeenCalledWith('Desktop')
      commandsMap.get('set-device-mobile').run()
      expect(mockEditor.setDevice).toHaveBeenCalledWith('Mobile')
      commandsMap.get('set-device-tablet').run()
      expect(mockEditor.setDevice).toHaveBeenCalledWith('Tablet')
    })
  })

  describe('component:selected event', () => {
    it('sets resizable and hoverable on component selected', () => {
      initGrapesJS({ siteId: '1' })
      const handler = mockEditor.on.mock.calls.find(([e]: [string]) => e === 'component:selected')?.[1]
      const comp = { set: vi.fn() }
      handler(comp)
      expect(comp.set).toHaveBeenCalledWith('resizable', true)
      expect(comp.set).toHaveBeenCalledWith('hoverable', true)
    })
  })

  describe('onLoad', () => {
    it('loads project data when onLoad returns settings', async () => {
      const onLoad = vi.fn().mockResolvedValue({ settings: { html: '<p>loaded</p>' } })
      initGrapesJS({ siteId: '1', onLoad })
      await vi.waitFor(() => expect(onLoad).toHaveBeenCalledWith('1'))
      expect(mockEditor.loadProjectData).toHaveBeenCalledWith({ html: '<p>loaded</p>' })
    })

    it('skips loadProjectData when onLoad returns null', async () => {
      const onLoad = vi.fn().mockResolvedValue(null)
      initGrapesJS({ siteId: '1', onLoad })
      await vi.waitFor(() => expect(onLoad).toHaveBeenCalledWith('1'))
      expect(mockEditor.loadProjectData).not.toHaveBeenCalled()
    })
  })

  describe('renderPagesList', () => {
    it('renders pages with names', () => {
      setupDom('1')
      mockEditor.Pages.getAll.mockReturnValue([makePage('p1', 'Page A'), makePage('p2', 'Page B')])
      mockEditor.Pages.getSelected.mockReturnValue({ id: 'p1' })
      initGrapesJS({ siteId: '1' })
      const list = document.getElementById('pages-list-1')
      expect(list?.children).toHaveLength(2)
    })

    it('shows empty message when no pages', () => {
      setupDom('1')
      mockEditor.Pages.getAll.mockReturnValue([])
      initGrapesJS({ siteId: '1' })
      expect(document.getElementById('pages-list-1')?.innerHTML).toContain('Sin páginas')
    })

    it('omits delete button for single page', () => {
      setupDom('1')
      mockEditor.Pages.getAll.mockReturnValue([makePage('p1', 'Only')])
      mockEditor.Pages.getSelected.mockReturnValue({ id: 'p1' })
      initGrapesJS({ siteId: '1' })
      expect(document.getElementById('pages-list-1')?.innerHTML).not.toContain('🗑')
    })

    it('includes delete button for multiple pages', () => {
      setupDom('1')
      mockEditor.Pages.getAll.mockReturnValue([makePage('p1', 'A'), makePage('p2', 'B')])
      mockEditor.Pages.getSelected.mockReturnValue({ id: 'p1' })
      initGrapesJS({ siteId: '1' })
      expect(document.getElementById('pages-list-1')?.innerHTML).toContain('🗑')
    })

    it('handles null container', () => {
      mockEditor.getContainer.mockReturnValue(null)
      expect(() => initGrapesJS({ siteId: '1' })).not.toThrow()
    })

    it('selects page on click', () => {
      setupDom('1')
      mockEditor.Pages.getAll.mockReturnValue([makePage('p1', 'Page A'), makePage('p2', 'Page B')])
      mockEditor.Pages.getSelected.mockReturnValue({ id: 'p1' })
      initGrapesJS({ siteId: '1' })
      const list = document.getElementById('pages-list-1')!
      const firstPage = list.children[0] as HTMLElement
      firstPage.click()
      expect(mockEditor.Pages.select).toHaveBeenCalledWith('p1')
    })
  })

  describe('delete page flow', () => {
    function setupDeleteTest() {
      vi.useFakeTimers()
      setupDom('1')
      mockEditor.Pages.getAll.mockReturnValue([makePage('p1', 'A'), makePage('p2', 'B')])
      mockEditor.Pages.getSelected.mockReturnValue({ id: 'p1' })
      const modalContent = document.createElement('div')
      modalContent.innerHTML = `
        <button id="confirm-del-btn">Eliminar</button>
        <button id="cancel-del-btn">Cancelar</button>
      `
      mockEditor.Modal.getContent.mockReturnValue(modalContent)
      initGrapesJS({ siteId: '1' })
      return modalContent
    }

    it('opens delete modal when clicking delete span', () => {
      const modalContent = setupDeleteTest()
      const spans = document.querySelectorAll('span')
      expect(spans.length).toBeGreaterThan(0)
      const event = new MouseEvent('click', { bubbles: true })
      spans[0].dispatchEvent(event)
      expect(mockEditor.Modal.setTitle).toHaveBeenCalledWith('Eliminar Página')
      expect(mockEditor.Modal.open).toHaveBeenCalled()
      vi.useRealTimers()
    })

    it('calls remove on confirm', () => {
      const modalContent = setupDeleteTest()
      const spans = document.querySelectorAll('span')
      spans[0].dispatchEvent(new MouseEvent('click', { bubbles: true }))
      vi.advanceTimersByTime(50)
      modalContent.querySelector('#confirm-del-btn')?.dispatchEvent(new Event('click'))
      expect(mockEditor.Pages.remove).toHaveBeenCalled()
      expect(mockEditor.Modal.close).toHaveBeenCalled()
      vi.useRealTimers()
    })

    it('calls close on cancel', () => {
      const modalContent = setupDeleteTest()
      const spans = document.querySelectorAll('span')
      spans[0].dispatchEvent(new MouseEvent('click', { bubbles: true }))
      vi.advanceTimersByTime(50)
      modalContent.querySelector('#cancel-del-btn')?.dispatchEvent(new Event('click'))
      expect(mockEditor.Modal.close).toHaveBeenCalled()
      expect(mockEditor.Pages.remove).not.toHaveBeenCalled()
      vi.useRealTimers()
    })
  })

  describe('new page flow', () => {
    function setupNewPageTest(name: string) {
      vi.useFakeTimers()
      setupDom('1')
      mockEditor.Pages.getAll.mockReturnValue([])
      const modalContent = document.createElement('div')
      modalContent.innerHTML = `
        <input id="new-page-name" value="${name}">
        <button id="save-new-page">Crear</button>
        <button id="cancel-new-page">Cancelar</button>
      `
      mockEditor.Modal.getContent.mockReturnValue(modalContent)
      initGrapesJS({ siteId: '1' })
      return modalContent
    }

    it('opens new page modal on add button click', () => {
      setupNewPageTest('Test')
      document.getElementById('btn-add-page-1')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      expect(mockEditor.Modal.setTitle).toHaveBeenCalledWith('Nueva Página')
      expect(mockEditor.Modal.open).toHaveBeenCalled()
      vi.useRealTimers()
    })

    it('creates page on save', () => {
      const modalContent = setupNewPageTest('My Page')
      document.getElementById('btn-add-page-1')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      vi.advanceTimersByTime(50)
      modalContent.querySelector('#save-new-page')?.dispatchEvent(new Event('click'))
      expect(mockEditor.Pages.add).toHaveBeenCalledWith({ name: 'My Page', component: '<div></div>' })
      expect(mockEditor.Modal.close).toHaveBeenCalled()
      vi.useRealTimers()
    })

    it('no add when name empty', () => {
      const modalContent = setupNewPageTest('')
      document.getElementById('btn-add-page-1')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      vi.advanceTimersByTime(50)
      modalContent.querySelector('#save-new-page')?.dispatchEvent(new Event('click'))
      expect(mockEditor.Pages.add).not.toHaveBeenCalled()
      expect(mockEditor.Modal.close).toHaveBeenCalled()
      vi.useRealTimers()
    })

    it('cancels new page', () => {
      const modalContent = setupNewPageTest('Test')
      document.getElementById('btn-add-page-1')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      vi.advanceTimersByTime(50)
      modalContent.querySelector('#cancel-new-page')?.dispatchEvent(new Event('click'))
      expect(mockEditor.Modal.close).toHaveBeenCalled()
      expect(mockEditor.Pages.add).not.toHaveBeenCalled()
      vi.useRealTimers()
    })
  })

  describe('initPages via setTimeout', () => {
    it('runs initPages directly when pagesListId exists', () => {
      setupDom('1')
      mockEditor.Pages.getAll.mockReturnValue([])
      initGrapesJS({ siteId: '1' })
      expect(document.getElementById('pages-list-1')?.innerHTML).toContain('Sin páginas')
    })

    it('falls back to setTimeout when pagesListId is not in DOM', () => {
      vi.useFakeTimers()
      document.body.innerHTML = '<div class="editor-row"><div id="gjs"><button id="btn-add-page-1"></button></div></div>'
      mockEditor.getContainer.mockReturnValue(document.getElementById('gjs'))
      initGrapesJS({ siteId: '1' })
      expect(document.getElementById('btn-add-page-1')?.onclick).toBeNull()
      vi.advanceTimersByTime(300)
      expect(document.getElementById('btn-add-page-1')?.onclick).not.toBeNull()
      document.getElementById('btn-add-page-1')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      expect(mockEditor.Modal.setTitle).toHaveBeenCalledWith('Nueva Página')
      vi.useRealTimers()
    })
  })

  describe('panel commands', () => {
    beforeEach(() => {
      setupDom('1')
      mockEditor.Pages.getAll.mockReturnValue([])
      initGrapesJS({ siteId: '1' })
    })

    it('show-layers hides all and shows layers', () => {
      commandsMap.get('show-layers').run()
      expect(document.querySelector('.layers-container')?.style.display).toBe('')
      expect(document.querySelector('.styles-container')?.style.display).toBe('none')
      expect(document.querySelector('.traits-container')?.style.display).toBe('none')
      expect(document.querySelector('.pages-container')?.style.display).toBe('none')
      expect(document.getElementById('blocks-1')?.style.display).toBe('none')
      commandsMap.get('show-layers').stop()
      expect(document.querySelector('.layers-container')?.style.display).toBe('none')
    })

    it('show-styles hides all and shows styles', () => {
      commandsMap.get('show-styles').run()
      expect(document.querySelector('.styles-container')?.style.display).toBe('')
    })

    it('show-traits hides all and shows traits', () => {
      commandsMap.get('show-traits').run()
      expect(document.querySelector('.traits-container')?.style.display).toBe('')
    })

    it('show-blocks has no stop function', () => {
      expect(commandsMap.get('show-blocks').stop).toBeUndefined()
    })

    it('show-blocks shows blocks', () => {
      commandsMap.get('show-blocks').run()
      expect(document.getElementById('blocks-1')?.style.display).toBe('')
    })

    it('show-pages renders pages list', () => {
      mockEditor.Pages.getAll.mockReturnValue([makePage('p1', 'Page A')])
      mockEditor.Pages.getSelected.mockReturnValue({ id: 'p1' })
      document.getElementById('pages-list-1')!.innerHTML = ''
      commandsMap.get('show-pages').run()
      expect(document.getElementById('pages-list-1')?.children).toHaveLength(1)
      expect(document.querySelector('.pages-container')?.style.display).toBe('')
    })

    it('show-pages without pages container does not throw', () => {
      document.body.innerHTML = '<div class="editor-row"><div id="gjs"></div></div>'
      mockEditor.getContainer.mockReturnValue(document.getElementById('gjs'))
      mockEditor.Pages.getAll.mockReturnValue([])
      initGrapesJS({ siteId: '1' })
      expect(() => commandsMap.get('show-pages').run()).not.toThrow()
    })
  })

  describe('edit-code command', () => {
    it('creates modal and saves code changes', () => {
      initGrapesJS({ siteId: '1' })
      const cmd = commandsMap.get('edit-code')
      cmd.run(mockEditor)
      expect(mockEditor.Modal.setTitle).toHaveBeenCalledWith('Editor de Código')
      expect(mockEditor.Modal.open).toHaveBeenCalled()
      const div = mockEditor.Modal.setContent.mock.calls[0][0]
      const htmlTA = div.querySelector('#html-code')
      const cssTA = div.querySelector('#css-code')
      const saveBtn = div.querySelector('#save-code-btn')
      htmlTA.value = '<p>new</p>'
      cssTA.value = 'p { color:red; }'
      saveBtn.click()
      expect(mockEditor.setComponents).toHaveBeenCalledWith('<p>new</p>')
      expect(mockEditor.setStyle).toHaveBeenCalledWith('p { color:red; }')
      expect(mockEditor.Modal.close).toHaveBeenCalled()
    })
  })

  describe('save-db command', () => {
    it('calls onSave with project data', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined)
      mockEditor.getProjectData.mockReturnValue({ assets: [] })
      mockEditor.getHtml.mockReturnValue('<p>hello</p>')
      mockEditor.getCss.mockReturnValue('p{}')
      initGrapesJS({ siteId: '1', onSave })
      await commandsMap.get('save-db').run(mockEditor)
      expect(onSave).toHaveBeenCalledWith({
        assets: [],
        htmlFinal: '<p>hello</p>',
        cssFinal: 'p{}',
      })
    })

    it('skips when onSave absent', async () => {
      initGrapesJS({ siteId: '1' })
      await expect(commandsMap.get('save-db').run(mockEditor)).resolves.toBeUndefined()
    })
  })

  describe('getRow edge cases', () => {
    it('handles null container', () => {
      mockEditor.getContainer.mockReturnValue(null)
      expect(() => initGrapesJS({ siteId: '1' })).not.toThrow()
    })

    it('handles non-HTMLElement container', () => {
      mockEditor.getContainer.mockReturnValue('string' as any)
      expect(() => initGrapesJS({ siteId: '1' })).not.toThrow()
    })
  })
})
