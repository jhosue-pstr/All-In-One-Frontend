import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { initGrapesJS } from './index'

const { mockEditor, commandsMap } = vi.hoisted(() => {
  const cmds = new Map<string, any>()
  let storedContent: any = null
  const editor = {
    on: vi.fn().mockReturnThis(),
    setComponents: vi.fn(),
    setStyle: vi.fn(),
    getContainer: vi.fn(),
    Modal: {
      setTitle: vi.fn().mockReturnThis(),
      setContent: vi.fn((content: any) => {
        storedContent = content
        return editor.Modal
      }),
      open: vi.fn(),
      close: vi.fn(),
      getContent: vi.fn(() => storedContent),
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
    Traits: {
      addType: vi.fn(),
    },
    DomComponents: {
      addType: vi.fn(),
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
      const comp = { set: vi.fn(), get: vi.fn().mockReturnValue('div') }
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
      initGrapesJS({ siteId: '1' })
    }

    it('opens delete modal when clicking delete span', () => {
      setupDeleteTest()
      const spans = document.querySelectorAll('span')
      expect(spans.length).toBeGreaterThan(0)
      const event = new MouseEvent('click', { bubbles: true })
      spans[0].dispatchEvent(event)
      expect(mockEditor.Modal.setTitle).toHaveBeenCalledWith('Eliminar Página')
      expect(mockEditor.Modal.open).toHaveBeenCalled()
      vi.useRealTimers()
    })

    it('calls remove on confirm', () => {
      setupDeleteTest()
      const spans = document.querySelectorAll('span')
      spans[0].dispatchEvent(new MouseEvent('click', { bubbles: true }))
      vi.advanceTimersByTime(50)
      const buttons = mockEditor.Modal.getContent().querySelectorAll('button')
      buttons[1].click()
      expect(mockEditor.Pages.remove).toHaveBeenCalled()
      expect(mockEditor.Modal.close).toHaveBeenCalled()
      vi.useRealTimers()
    })

    it('calls close on cancel', () => {
      setupDeleteTest()
      const spans = document.querySelectorAll('span')
      spans[0].dispatchEvent(new MouseEvent('click', { bubbles: true }))
      vi.advanceTimersByTime(50)
      const buttons = mockEditor.Modal.getContent().querySelectorAll('button')
      buttons[0].click()
      expect(mockEditor.Modal.close).toHaveBeenCalled()
      expect(mockEditor.Pages.remove).not.toHaveBeenCalled()
      vi.useRealTimers()
    })
  })

  describe('new page flow', () => {
    function openNewPageModal(name = '') {
      vi.useFakeTimers()
      setupDom('1')
      mockEditor.Pages.getAll.mockReturnValue([])
      initGrapesJS({ siteId: '1' })
      document.getElementById('btn-add-page-1')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      vi.advanceTimersByTime(50)
      const content = mockEditor.Modal.getContent()
      const input = content.querySelector<HTMLInputElement>('#new-page-name')
      if (input) input.value = name
      return content
    }

    it('opens new page modal on add button click', () => {
      openNewPageModal()
      expect(mockEditor.Modal.setTitle).toHaveBeenCalledWith('Nueva Página')
      expect(mockEditor.Modal.open).toHaveBeenCalled()
      vi.useRealTimers()
    })

    it('creates page on save', () => {
      const content = openNewPageModal('My Page')
      const buttons = content.querySelectorAll('button')
      buttons[1].click()
      expect(mockEditor.Pages.add).toHaveBeenCalledWith({ name: 'My Page', component: '<div></div>' })
      expect(mockEditor.Modal.close).toHaveBeenCalled()
      vi.useRealTimers()
    })

    it('no add when name empty', () => {
      const content = openNewPageModal('')
      const buttons = content.querySelectorAll('button')
      buttons[1].click()
      expect(mockEditor.Pages.add).not.toHaveBeenCalled()
      expect(mockEditor.Modal.close).toHaveBeenCalled()
      vi.useRealTimers()
    })

    it('cancels new page', () => {
      const content = openNewPageModal('Test')
      const buttons = content.querySelectorAll('button')
      buttons[0].click()
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

describe('page-href traits and link behavior', () => {

  it('registers page-href trait type', () => {
    initGrapesJS({ siteId: '1' })

    expect(mockEditor.Traits.addType)
      .toHaveBeenCalledWith(
        'page-href',
        expect.objectContaining({
          createInput: expect.any(Function),
        }),
      )
  })

  it('creates page-href select input and updates href', () => {
    mockEditor.Pages.getAll.mockReturnValue([
      makePage('p1', 'Inicio'),
      makePage('p2', 'Contacto'),
    ])

    initGrapesJS({ siteId: '1' })

    const traitCfg =
      mockEditor.Traits.addType.mock.calls[0][1]

    const target = { set: vi.fn() }

    const trait = {
      getValue: vi.fn().mockReturnValue(''),
      setValue: vi.fn(),
      getTarget: vi.fn().mockReturnValue(target),
    }

    const select =
      traitCfg.createInput({ trait })

    expect(select.tagName).toBe('SELECT')

    select.value = '?page=inicio'

    select.dispatchEvent(
      new Event('change'),
    )

    expect(trait.setValue)
      .toHaveBeenCalledWith('?page=inicio')

    expect(target.set)
      .toHaveBeenCalledWith(
        'href',
        '?page=inicio',
      )
  })

  it('registers custom link component type', () => {
    initGrapesJS({ siteId: '1' })

    expect(mockEditor.DomComponents.addType)
      .toHaveBeenCalledWith(
        'link',
        expect.any(Object),
      )
  })

  it('component:selected adds missing link traits', () => {
    initGrapesJS({ siteId: '1' })

    const handler =
      mockEditor.on.mock.calls.find(
        ([e]: [string]) =>
          e === 'component:selected',
      )?.[1]

    const component = {
      get: vi.fn((key) => {
        if (key === 'tagName') return 'a'
        if (key === 'traits') return []
      }),
      set: vi.fn(),
    }

    handler(component)

    expect(component.set)
      .toHaveBeenCalledWith(
        'traits',
        expect.arrayContaining([
          expect.objectContaining({
            type: 'page-href',
          }),
        ]),
      )
  })

    it('component:selected returns early when link traits already exist', () => {
    initGrapesJS({ siteId: '1' })

    const handler = mockEditor.on.mock.calls.find(
      ([e]: [string]) => e === 'component:selected',
    )?.[1]

    const component = {
      get: vi.fn((key) => {
        if (key === 'tagName') return 'a'
        if (key === 'traits') {
          return [
            { type: 'page-href' },
            { name: 'target' },
          ]
        }
      }),
      set: vi.fn(),
    }

    handler(component)

    expect(component.set).toHaveBeenCalledWith('resizable', true)
    expect(component.set).toHaveBeenCalledWith('hoverable', true)

    expect(component.set).not.toHaveBeenCalledWith(
      'traits',
      expect.anything(),
    )
  })
})

describe('extra GrapesJS missing branches', () => {
  it('loads multiple saved pages', () => {
    mockEditor.Pages.getAll.mockReturnValue([])

    initGrapesJS({
      siteId: '1',
      projectData: {
        pages: [
          {
            id: 'p1',
            name: 'Inicio',
            html: '<h1>Inicio</h1>',
            css: 'h1{}',
          },
          {
            id: 'p2',
            name: 'Contacto',
            html: '<h1>Contacto</h1>',
            css: 'h1{}',
          },
        ],
      },
    })

    expect(mockEditor.setComponents).toHaveBeenCalledWith('<h1>Inicio</h1>')
    expect(mockEditor.setStyle).toHaveBeenCalledWith('h1{}')
    expect(mockEditor.Pages.add).toHaveBeenCalledWith({
      name: 'Contacto',
      component: '<h1>Contacto</h1>',
    })
  })

  it('page-href select uses current value when option exists', () => {
    mockEditor.Pages.getAll.mockReturnValue([
      makePage('p1', 'Mi Pagina'),
    ])

    initGrapesJS({ siteId: '1' })

    const traitCfg = mockEditor.Traits.addType.mock.calls[0][1]

    const trait = {
      getValue: vi.fn().mockReturnValue('?page=mi-pagina'),
      setValue: vi.fn(),
      getTarget: vi.fn().mockReturnValue(null),
    }

    const select = traitCfg.createInput({ trait }) as HTMLSelectElement

    expect(select.value).toBe('?page=mi-pagina')
  })

  it('component:selected removes duplicate traits before adding missing ones', () => {
    initGrapesJS({ siteId: '1' })

    const handler = mockEditor.on.mock.calls.find(
      ([e]: [string]) => e === 'component:selected',
    )?.[1]

    const component = {
      get: vi.fn((key) => {
        if (key === 'tagName') return 'a'
        if (key === 'traits') {
          return [
            { name: 'href' },
            { name: 'href' },
          ]
        }
      }),
      set: vi.fn(),
    }

    handler(component)

    const traitsCall = component.set.mock.calls.find(
      ([key]) => key === 'traits',
    )

    expect(traitsCall).toBeTruthy()
    expect(traitsCall[1]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'page-href' }),
        expect.objectContaining({ name: 'target' }),
      ]),
    )
  })
})

it('page-href change sets href to # when value is empty', () => {
  mockEditor.Pages.getAll.mockReturnValue([
    makePage('p1', 'Inicio'),
  ])

  initGrapesJS({ siteId: '1' })

  const traitCfg = mockEditor.Traits.addType.mock.calls[0][1]

  const target = {
    set: vi.fn(),
  }

  const trait = {
    getValue: vi.fn().mockReturnValue(''),
    setValue: vi.fn(),
    getTarget: vi.fn().mockReturnValue(target),
  }

  const select = traitCfg.createInput({ trait }) as HTMLSelectElement

  select.value = ''

  select.dispatchEvent(new Event('change'))

  expect(trait.setValue).toHaveBeenCalledWith('')
  expect(target.set).toHaveBeenCalledWith('href', '#')
})

it('page-href re-renders options when page event is emitted', () => {
  mockEditor.Pages.getAll.mockReturnValue([
    makePage('p1', 'Inicio'),
  ])

  initGrapesJS({ siteId: '1' })

  const traitCfg = mockEditor.Traits.addType.mock.calls[0][1]

  const trait = {
    getValue: vi.fn().mockReturnValue(''),
    setValue: vi.fn(),
    getTarget: vi.fn().mockReturnValue(null),
  }

  const select = traitCfg.createInput({ trait }) as HTMLSelectElement

  expect(select.options.length).toBe(2)

  mockEditor.Pages.getAll.mockReturnValue([
    makePage('p1', 'Inicio'),
    makePage('p2', 'Contacto'),
  ])

  const pageHandlers = mockEditor.on.mock.calls
    .filter(([eventName]: [string]) => eventName === 'page')
    .map(([, handler]) => handler)

  pageHandlers.forEach((handler) => handler())

  expect(select.options.length).toBe(3)
  expect([...select.options].map((o) => o.value)).toContain('?page=contacto')
})

it('component:selected keeps existing page-href and only adds target', () => {
  initGrapesJS({ siteId: '1' })

  const handler = mockEditor.on.mock.calls.find(
    ([eventName]: [string]) => eventName === 'component:selected',
  )?.[1]

  const component = {
    get: vi.fn((key) => {
      if (key === 'tagName') return 'a'
      if (key === 'traits') {
        return [
          { type: 'page-href', name: 'href' },
        ]
      }
    }),
    set: vi.fn(),
  }

  handler(component)

  const traitsCall = component.set.mock.calls.find(
    ([key]) => key === 'traits',
  )

  expect(traitsCall).toBeTruthy()
  expect(traitsCall[1]).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ type: 'page-href' }),
      expect.objectContaining({ name: 'target' }),
    ]),
  )
})
describe('page event callback', () => {
  it('renders pages list when page event is triggered', () => {
    setupDom('1')

    mockEditor.Pages.getAll.mockReturnValue([
      {
        id: 'p1',
        get: vi.fn((k) => (k === 'name' ? 'Inicio' : '')),
      },
    ])

    mockEditor.Pages.getSelected.mockReturnValue({
      id: 'p1',
    })

    initGrapesJS({ siteId: '1' })

    const handler = mockEditor.on.mock.calls.find(
      ([event]: [string]) => event === 'page',
    )?.[1]

    expect(handler).toBeTruthy()

    handler()

    expect(mockEditor.Pages.getAll).toHaveBeenCalled()

    const list =
      document.getElementById('pages-list-1')

    expect(list).not.toBeNull()
  })
})
describe('extra branch coverage for GrapesJS', () => {
  it('showPanel does nothing when row does not exist', () => {
    mockEditor.getContainer.mockReturnValue(null)

    initGrapesJS({ siteId: '1' })

    expect(() => {
      commandsMap.get('show-layers').run()
      commandsMap.get('show-styles').run()
      commandsMap.get('show-traits').run()
      commandsMap.get('show-blocks').run()
    }).not.toThrow()
  })

  it('page-href option uses page id when name is empty', () => {
    mockEditor.Pages.getAll.mockReturnValue([
      {
        id: 'pagina-sin-nombre',
        get: vi.fn(() => ''),
      },
    ])

    initGrapesJS({ siteId: '1' })

    const traitCfg = mockEditor.Traits.addType.mock.calls[0][1]

    const trait = {
      getValue: vi.fn().mockReturnValue(''),
      setValue: vi.fn(),
      getTarget: vi.fn().mockReturnValue(null),
    }

    const select = traitCfg.createInput({ trait }) as HTMLSelectElement

    expect([...select.options].map((o) => o.value)).toContain(
      '?page=pagina-sin-nombre',
    )
  })

  it('page-href keeps empty value when current option does not exist', () => {
    mockEditor.Pages.getAll.mockReturnValue([
      makePage('p1', 'Inicio'),
    ])

    initGrapesJS({ siteId: '1' })

    const traitCfg = mockEditor.Traits.addType.mock.calls[0][1]

    const trait = {
      getValue: vi.fn().mockReturnValue('?page-no-existe'),
      setValue: vi.fn(),
      getTarget: vi.fn().mockReturnValue(null),
    }

    const select = traitCfg.createInput({ trait }) as HTMLSelectElement

    expect(select.value).toBe('')
  })

  it('component:selected adds only page-href when target already exists', () => {
    initGrapesJS({ siteId: '1' })

    const handler = mockEditor.on.mock.calls.find(
      ([eventName]: [string]) => eventName === 'component:selected',
    )?.[1]

    const component = {
      get: vi.fn((key) => {
        if (key === 'tagName') return 'a'
        if (key === 'traits') {
          return [
            { name: 'target' },
          ]
        }
      }),
      set: vi.fn(),
    }

    handler(component)

    const traitsCall = component.set.mock.calls.find(
      ([key]) => key === 'traits',
    )

    expect(traitsCall).toBeTruthy()
    expect(traitsCall[1]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'page-href' }),
        expect.objectContaining({ name: 'target' }),
      ]),
    )
  })

  it('component:selected handles null traits', () => {
    initGrapesJS({ siteId: '1' })

    const handler = mockEditor.on.mock.calls.find(
      ([eventName]: [string]) => eventName === 'component:selected',
    )?.[1]

    const component = {
      get: vi.fn((key) => {
        if (key === 'tagName') return 'a'
        if (key === 'traits') return null
      }),
      set: vi.fn(),
    }

    handler(component)

    expect(component.set).toHaveBeenCalledWith(
      'traits',
      expect.arrayContaining([
        expect.objectContaining({ type: 'page-href' }),
        expect.objectContaining({ name: 'target' }),
      ]),
    )
  })
  
})

it('loads saved pages with empty css fallback', () => {
  initGrapesJS({
    siteId: '1',
    projectData: {
      pages: [
        {
          id: 'p1',
          name: 'Inicio',
          html: '<h1>x</h1>',
          css: '',
        },
        {
          id: 'p2',
          name: 'Otro',
          html: '<h1>y</h1>',
        },
      ],
    },
  })

  expect(mockEditor.setStyle)
    .toHaveBeenCalledWith('')
})

it('delete modal uses page id when page name is empty', () => {
  vi.useFakeTimers()

  setupDom('1')

  mockEditor.Pages.getAll.mockReturnValue([
    {
      id: 'page-id-only',
      get: vi.fn(() => ''),
    },
    makePage('p2','B'),
  ])

  mockEditor.Pages.getSelected.mockReturnValue({
    id:'page-id-only',
  })

  initGrapesJS({ siteId:'1' })

  document
    .querySelectorAll('span')[0]
    .dispatchEvent(
      new MouseEvent('click',{bubbles:true}),
    )

  expect(mockEditor.Modal.setContent)
    .toHaveBeenCalled()

  vi.useRealTimers()
})

it('page element uses page id when name is empty', () => {
  setupDom('1')

  mockEditor.Pages.getAll.mockReturnValue([
    {
      id: 'solo-id',
      get: vi.fn(() => ''),
    },
  ])

  mockEditor.Pages.getSelected.mockReturnValue({
    id: 'solo-id',
  })

  initGrapesJS({ siteId: '1' })

  const list = document.getElementById('pages-list-1')!
  const firstChild = list.children[0] as HTMLElement

  expect(firstChild).toBeTruthy()
  expect(firstChild.innerText).toBe('solo-id')
})

it('skips setStyle when css is empty string', () => {
  initGrapesJS({
    siteId:'1',
    projectData:{
      html:'<div>x</div>',
      css:'',
    },
  })

  expect(mockEditor.setStyle)
    .not.toHaveBeenCalled()
})

it('component:selected deduplicates by type before name', () => {
  initGrapesJS({ siteId:'1' })

  const handler =
    mockEditor.on.mock.calls.find(
      ([e]:[string]) =>
        e === 'component:selected',
    )?.[1]

  const component = {
    get: vi.fn((key) => {

      if (key === 'tagName')
        return 'a'

      if (key === 'traits') {
        return [
          { type:'page-href', name:'href' },
          { type:'page-href', name:'otro' },
          { name:'target' },
        ]
      }
    }),
    set:vi.fn(),
  }

  handler(component)

  expect(component.set)
    .not.toHaveBeenCalledWith(
      'traits',
      expect.arrayContaining([
        expect.objectContaining({
          name:'otro',
        }),
      ]),
    )
})
it('component:selected handles trait without type or name', () => {
  initGrapesJS({ siteId:'1' })

  const handler =
    mockEditor.on.mock.calls.find(
      ([e]:[string]) =>
        e === 'component:selected',
    )?.[1]

  const component = {
    get: vi.fn((key) => {

      if (key === 'tagName')
        return 'a'

      if (key === 'traits') {
        return [
          {},
        ]
      }
    }),
    set:vi.fn(),
  }

  handler(component)

  expect(component.set)
    .toHaveBeenCalled()
})

it('component:selected handles empty tagName fallback', () => {
  initGrapesJS({ siteId: '1' })

  const handler =
    mockEditor.on.mock.calls.find(
      ([eventName]: [string]) => eventName === 'component:selected',
    )?.[1]

  const component = {
    get: vi.fn((key) => {
      if (key === 'tagName') return null
    }),
    set: vi.fn(),
  }

  handler(component)

  expect(component.set).toHaveBeenCalledWith('resizable', true)
  expect(component.set).toHaveBeenCalledWith('hoverable', true)
  expect(component.set).not.toHaveBeenCalledWith('traits', expect.anything())
})

it('page-href change with default empty option sets href fallback', () => {
  mockEditor.Pages.getAll.mockReturnValue([
    makePage('p1', 'Inicio'),
  ])

  initGrapesJS({ siteId: '1' })

  const traitCfg = mockEditor.Traits.addType.mock.calls[0][1]

  const target = {
    set: vi.fn(),
  }

  const trait = {
    getValue: vi.fn().mockReturnValue('?page=inicio'),
    setValue: vi.fn(),
    getTarget: vi.fn().mockReturnValue(target),
  }

  const select = traitCfg.createInput({ trait }) as HTMLSelectElement

  select.value = ''

  select.dispatchEvent(new Event('change'))

  expect(trait.setValue).toHaveBeenCalledWith('')
  expect(target.set).toHaveBeenCalledWith('href', '#')
})
})
