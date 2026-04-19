import grapesjs, { type Editor, type EditorConfig } from 'grapesjs';
import { bloquesDefaults } from './Bloques';
import { dispositivosDefaults } from './Paneles/PanelDispositivos';
import { PanelConmutadorButtons } from './Paneles/PanelConmutador';
import './assets/editor.css';

export interface GrapesJSInitOptions {
  siteId: string;
  isTemplate?: boolean;
  projectData?: { html?: string; css?: string } | null;
  onSave?: (data: any) => Promise<void>;
  onLoad?: (siteId: string) => Promise<any>;
}

export const initGrapesJS = (options: GrapesJSInitOptions): Editor => {
  const blockId = `#blocks-${options.siteId}`;
  const config: EditorConfig = {
    container: '#gjs',
    fromElement: true,
    height: '100%',
    width: '100%',
    storageManager: false,
    panels: { defaults: [] },
    blockManager: {
      appendTo: blockId,
      blocks: bloquesDefaults,
    },
    deviceManager: {
      devices: dispositivosDefaults,
    },
    styleManager: {
      appendTo: '.styles-container',
      sectors: [
        { name: 'Dimension', open: false, buildProps: ['width', 'min-height', 'padding', 'margin'] },
        { name: 'Typography', open: true, buildProps: ['font-family', 'font-size', 'color'] },
        { name: 'Background', open: false, buildProps: ['background-color'] },
        { name: 'Border', open: false, buildProps: ['border', 'border-radius'] },
      ],
    },
    traitManager: { appendTo: '.traits-container' },
    selectorManager: { appendTo: '.styles-container' },
    layerManager: { appendTo: '.layers-container' },
  };

  const editor = grapesjs.init(config);

  if (options.projectData) {
    if (options.projectData.html) {
      editor.setComponents(options.projectData.html);
    }
    if (options.projectData.css) {
      editor.setStyle(options.projectData.css);
    }
  }

  editor.Commands.add('set-device-desktop', { run: () => editor.setDevice('Desktop') });
  editor.Commands.add('set-device-mobile', { run: () => editor.setDevice('Mobile') });
  editor.Commands.add('set-device-tablet', { run: () => editor.setDevice('Tablet') });

  const getRow = (): HTMLElement | null => {
    const container = editor.getContainer();
    return container?.closest('.editor-row') as HTMLElement;
  };

  const siteId = options.siteId;
  const blocksSel = `#blocks-${siteId}`;
  const pagesListSel = `#pages-list-${siteId}`;
  const btnAddPageSel = `#btn-add-page-${siteId}`;

  const hideAll = () => {
    const row = getRow();
    if (!row) return;
    const selectors = [blocksSel, '.layers-container', '.styles-container', '.traits-container', '.pages-container'];
    selectors.forEach(sel => {
      const el = row.querySelector(sel) as HTMLElement;
      if (el) el.style.display = 'none';
    });
  };

  editor.Commands.add('show-layers', {
    run() { hideAll(); const el = getRow()?.querySelector('.layers-container') as HTMLElement; if (el) el.style.display = ''; },
    stop() { const el = getRow()?.querySelector('.layers-container') as HTMLElement; if (el) el.style.display = 'none'; },
  });

  editor.Commands.add('show-styles', {
    run() { hideAll(); const el = getRow()?.querySelector('.styles-container') as HTMLElement; if (el) el.style.display = ''; },
    stop() { const el = getRow()?.querySelector('.styles-container') as HTMLElement; if (el) el.style.display = 'none'; },
  });

  editor.Commands.add('show-traits', {
    run() { hideAll(); const el = getRow()?.querySelector('.traits-container') as HTMLElement; if (el) el.style.display = ''; },
    stop() { const el = getRow()?.querySelector('.traits-container') as HTMLElement; if (el) el.style.display = 'none'; },
  });

  editor.Commands.add('show-blocks', {
    run() { hideAll(); const el = getRow()?.querySelector(blocksSel) as HTMLElement; if (el) el.style.display = ''; },
  });

  editor.Commands.add('show-pages', {
    run() {
      hideAll();
      const el = getRow()?.querySelector('.pages-container') as HTMLElement;
      if (el) {
        el.style.display = 'block';
        renderPagesList(el.querySelector(pagesListSel));
      }
    },
  });

  const renderPagesList = (container: Element | null) => {
    if (!container) return;
    container.innerHTML = '';
    editor.Pages.getAll().forEach((page: any) => {
      const el = document.createElement('div');
      el.style.cssText = 'padding:8px; background:#34495e; margin-bottom:4px; border-radius:3px; cursor:pointer;';
      el.innerText = page.get('name') || page.id;
      el.onclick = () => { editor.Pages.select(page.id); renderPagesList(container); };
      container.appendChild(el);
    });
  };

  setTimeout(() => {
    const btn = document.getElementById(btnAddPageSel) as HTMLButtonElement;
    if (btn) {
      btn.onclick = () => {
        const name = prompt('Nombre de página:');
        if (name) {
          const newPage = editor.Pages.add({ name, component: `<div><h1>${name}</h1></div>` });
          if (newPage?.id) {
            editor.Pages.select(String(newPage.id));
            renderPagesList(document.getElementById(pagesListSel));
          }
        }
      };
    }
  }, 1000);

  editor.Commands.add('edit-code', {
    run(ed: Editor) {
      const div = document.createElement('div');
      div.innerHTML = `
        <div style="display:flex; gap:20px; height:350px;">
          <div style="flex:1;"><div style="color:#ccc;margin-bottom:8px;">HTML</div>
            <textarea id="html-code" style="width:100%;height:300px;background:#1e1e1e;color:#ddd;padding:15px;border-radius:5px;font-family:monospace;">${ed.getHtml()}</textarea>
          </div>
          <div style="flex:1;"><div style="color:#ccc;margin-bottom:8px;">CSS</div>
            <textarea id="css-code" style="width:100%;height:300px;background:#1e1e1e;color:#ddd;padding:15px;border-radius:5px;font-family:monospace;">${ed.getCss()}</textarea>
          </div>
        </div>
        <button id="save-code-btn" style="margin-top:15px;padding:12px 24px;background:#3498db;color:white;border:none;border-radius:4px;cursor:pointer;">Guardar</button>
      `;
      ed.Modal.setTitle('Editor de Código').setContent(div).open();
      (div.querySelector('#save-code-btn') as HTMLButtonElement).onclick = () => {
        ed.setComponents((div.querySelector('#html-code') as HTMLTextAreaElement).value);
        ed.setStyle((div.querySelector('#css-code') as HTMLTextAreaElement).value);
        ed.Modal.close();
      };
    },
  });

  editor.Commands.add('save-db', {
    async run(ed: Editor) {
      if (options.onSave) {
        await options.onSave({ ...ed.getProjectData(), htmlFinal: ed.getHtml(), cssFinal: ed.getCss() });
      }
    },
  });

  editor.on('component:selected', (c) => { c.set('resizable', true); c.set('hoverable', true); });

  if (options.onLoad) {
    options.onLoad(options.siteId).then(data => {
      if (data?.settings) editor.loadProjectData(data.settings);
    });
  }

  return editor;
};

export { bloquesDefaults, dispositivosDefaults, PanelConmutadorButtons };