import grapesjs, { type Editor, type EditorConfig } from "grapesjs";
import { dispositivosDefaults } from "./Paneles/PanelDispositivos";
import { PanelConmutadorButtons } from "./Paneles/PanelConmutador";
import { blocks } from "./Bloques";
import "./assets/editor.css";

export interface GrapesJSInitOptions {
  siteId: string;
  isTemplate?: boolean;
  projectData?: { html?: string; css?: string } | null;
  onSave?: (data: any) => Promise<void>;
  onLoad?: (siteId: string) => Promise<any>;
}

export const initGrapesJS = (options: GrapesJSInitOptions): Editor => {
  const siteId = options.siteId;
  const blockId = `#blocks-${siteId}`;
  const pagesListId = `#pages-list-${siteId}`;
  const btnAddPageId = `btn-add-page-${siteId}`;

  const config: EditorConfig = {
    container: "#gjs",
    fromElement: true,
    height: "100%",
    width: "100%",
    storageManager: false,
    panels: { defaults: [] },

    blockManager: { appendTo: blockId, blocks },
    deviceManager: { devices: dispositivosDefaults },
    styleManager: {
      appendTo: ".styles-container",
      sectors: [
        {
          name: "Dimension",
          open: false,
          buildProps: ["width", "min-height", "padding", "margin"],
        },
        {
          name: "Typography",
          open: true,
          buildProps: ["font-family", "font-size", "color"],
        },
        { name: "Background", open: false, buildProps: ["background-color"] },
        {
          name: "Border",
          open: false,
          buildProps: ["border", "border-radius"],
        },
      ],
    },
    traitManager: { appendTo: ".traits-container" },
    selectorManager: { appendTo: ".styles-container" },
    layerManager: { appendTo: ".layers-container" },
  };

  const editor = grapesjs.init(config);

  // Cargar Font Awesome para los iconos de los bloques
  const faLink = document.createElement("link");
  faLink.rel = "stylesheet";
  faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
  document.head.appendChild(faLink);

if (options.projectData?.html) editor.setComponents(options.projectData.html);
  if (options.projectData?.css) editor.setStyle(options.projectData.css);

  const createDeleteModalContent = (pageName: string) => `
    <div style="padding:20px;text-align:center;">
      <p style="margin-bottom:20px;font-size:16px;">¿Eliminar la página "<b>${pageName}</b>"?</p>
      <div style="display:flex;gap:10px;justify-content:center;">
        <button id="cancel-del-btn" style="padding:10px 20px;background:#95a5a6;color:white;border:none;border-radius:4px;cursor:pointer;font-size:14px;">Cancelar</button>
        <button id="confirm-del-btn" style="padding:10px 20px;background:#e74c3c;color:white;border:none;border-radius:4px;cursor:pointer;font-size:14px;">Eliminar</button>
      </div>
    </div>
  `;

  const createNewPageModalContent = () => `
    <div style="padding:20px;">
      <input type="text" id="new-page-name" placeholder="Nombre de la página" 
        style="width:100%;padding:12px;margin:15px 0;border:1px solid #ddd;border-radius:4px;font-size:14px;box-sizing:border-box;">
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button id="cancel-new-page" style="padding:10px 20px;background:#95a5a6;color:white;border:none;border-radius:4px;cursor:pointer;font-size:14px;">Cancelar</button>
        <button id="save-new-page" style="padding:10px 20px;background:#3498db;color:white;border:none;border-radius:4px;cursor:pointer;font-size:14px;">Crear</button>
      </div>
    </div>
  `;

  const attachDeleteModalHandlers = (pageId: string, container: HTMLElement) => {
    const content = editor.Modal.getContent() as HTMLElement;
    content?.querySelector("#confirm-del-btn")?.addEventListener("click", () => {
      editor.Pages.remove(pageId);
      renderPagesList(container);
      editor.Modal.close();
    });
    content?.querySelector("#cancel-del-btn")?.addEventListener("click", () => editor.Modal.close());
  };

  const attachNewPageModalHandlers = () => {
    const content = editor.Modal.getContent() as HTMLElement;
    const input = content?.querySelector("#new-page-name") as HTMLInputElement;
    input?.focus();
    content?.querySelector("#save-new-page")?.addEventListener("click", () => {
      const name = input?.value.trim();
      if (name) {
        editor.Pages.add({ name, component: `<div></div>` });
        renderPagesList(document.getElementById(pagesListId) as HTMLElement);
      }
      editor.Modal.close();
    });
    content?.querySelector("#cancel-new-page")?.addEventListener("click", () => editor.Modal.close());
  };

  const addDeleteButton = (el: HTMLElement, page: any, container: HTMLElement) => {
    const delBtn = document.createElement("span");
    delBtn.innerHTML = "🗑️";
    delBtn.style.cssText = "cursor:pointer;font-size:14px;padding:0 4px;";
    delBtn.onclick = (e) => {
      e.stopPropagation();
      const pageName = page.get("name") || page.id;
      editor.Modal.setTitle("Eliminar Página").setContent(createDeleteModalContent(pageName)).open();
      setTimeout(() => attachDeleteModalHandlers(page.id, container), 50);
    };
    el.appendChild(delBtn);
  };

  const createPageElement = (page: any, container: HTMLElement) => {
    const isActive = editor.Pages.getSelected()?.id === page.id;
    const el = document.createElement("div");
    el.style.cssText = `padding:8px;background:${isActive ? "#3498db" : "#34495e"};margin-bottom:4px;border-radius:3px;cursor:pointer;color:white;display:flex;justify-content:space-between;`;
    el.innerText = page.get("name") || page.id;
    el.onclick = () => {
      editor.Pages.select(page.id);
      renderPagesList(container);
    };
    return el;
  };

  const renderPagesList = (container: HTMLElement | null) => {
    if (!container) return;
    container.innerHTML = "";
    const pages = editor.Pages.getAll();
    if (pages.length === 0) {
      container.innerHTML = "<p style='color:#999;font-size:13px;'>Sin páginas</p>";
      return;
    }
    pages.forEach((page: any) => {
      const el = createPageElement(page, container);
      if (pages.length > 1) {
        addDeleteButton(el, page, container);
      }
      container.appendChild(el);
    });
  };

  const initPages = () => {
    const c = document.getElementById(pagesListId);
    if (c) renderPagesList(c);
    const b = document.getElementById(btnAddPageId);
    if (b) {
      b.onclick = () => {
        editor.Modal.setTitle("Nueva Página").setContent(createNewPageModalContent()).open();
        setTimeout(attachNewPageModalHandlers, 50);
      };
    }
  };

  if (document.getElementById(pagesListId)) initPages();
  else setTimeout(initPages, 300);

  editor.Commands.add("set-device-desktop", {
    run: () => editor.setDevice("Desktop"),
  });
  editor.Commands.add("set-device-mobile", {
    run: () => editor.setDevice("Mobile"),
  });
  editor.Commands.add("set-device-tablet", {
    run: () => editor.setDevice("Tablet"),
  });

  const getRow = (): HTMLElement | null => {
    return editor.getContainer()?.closest(".editor-row") as HTMLElement;
  };

  const blocksSel = `#blocks-${siteId}`;
  const hideAll = () => {
    const row = getRow();
    if (!row) return;
    [
      blocksSel,
      ".layers-container",
      ".styles-container",
      ".traits-container",
      ".pages-container",
    ].forEach((sel) => {
      const el = row.querySelector(sel) as HTMLElement;
      if (el) el.style.display = "none";
    });
  };

  editor.Commands.add("show-layers", {
    run() {
      hideAll();
      const el = getRow()?.querySelector(".layers-container") as HTMLElement;
      if (el) el.style.display = "";
    },
    stop() {
      const el = getRow()?.querySelector(".layers-container") as HTMLElement;
      if (el) el.style.display = "none";
    },
  });
  editor.Commands.add("show-styles", {
    run() {
      hideAll();
      const el = getRow()?.querySelector(".styles-container") as HTMLElement;
      if (el) el.style.display = "";
    },
    stop() {
      const el = getRow()?.querySelector(".styles-container") as HTMLElement;
      if (el) el.style.display = "none";
    },
  });
  editor.Commands.add("show-traits", {
    run() {
      hideAll();
      const el = getRow()?.querySelector(".traits-container") as HTMLElement;
      if (el) el.style.display = "";
    },
    stop() {
      const el = getRow()?.querySelector(".traits-container") as HTMLElement;
      if (el) el.style.display = "none";
    },
  });
  editor.Commands.add("show-blocks", {
    run() {
      hideAll();
      const el = getRow()?.querySelector(blocksSel) as HTMLElement;
      if (el) el.style.display = "";
    },
  });
  editor.Commands.add("show-pages", {
    run() {
      hideAll();
      const el = getRow()?.querySelector(".pages-container") as HTMLElement;
      if (el) {
        el.style.display = "block";
        renderPagesList(
          el.querySelector(`#pages-list-${siteId}`) as HTMLElement,
        );
      }
    },
  });

  editor.Commands.add("edit-code", {
    run(ed: Editor) {
      const div = document.createElement("div");
      div.innerHTML = `
        <div style="display:flex;gap:20px;height:350px;">
          <div style="flex:1;"><div style="color:#ccc;margin-bottom:8px;">HTML</div>
            <textarea id="html-code" style="width:100%;height:300px;background:#1e1e1e;color:#ddd;padding:15px;border-radius:5px;font-family:monospace;">${ed.getHtml()}</textarea>
          </div>
          <div style="flex:1;"><div style="color:#ccc;margin-bottom:8px;">CSS</div>
            <textarea id="css-code" style="width:100%;height:300px;background:#1e1e1e;color:#ddd;padding:15px;border-radius:5px;font-family:monospace;">${ed.getCss()}</textarea>
          </div>
        </div>
        <button id="save-code-btn" style="margin-top:15px;padding:12px 24px;background:#3498db;color:white;border:none;border-radius:4px;cursor:pointer;">Guardar</button>`;
      ed.Modal.setTitle("Editor de Código").setContent(div).open();
      const btn = div.querySelector("#save-code-btn") as HTMLButtonElement;
      btn.onclick = () => {
        ed.setComponents(
          (div.querySelector("#html-code") as HTMLTextAreaElement).value,
        );
        ed.setStyle(
          (div.querySelector("#css-code") as HTMLTextAreaElement).value,
        );
        ed.Modal.close();
      };
    },
  });

  editor.Commands.add("save-db", {
    async run(ed: Editor) {
      if (options.onSave) {
        await options.onSave({
          ...ed.getProjectData(),
          htmlFinal: ed.getHtml(),
          cssFinal: ed.getCss(),
        });
      }
    },
  });

  editor.on("component:selected", (c) => {
    c.set("resizable", true);
    c.set("hoverable", true);
  });

  if (options.onLoad) {
    options.onLoad(options.siteId).then((data) => {
      if (data?.settings) editor.loadProjectData(data.settings);
    });
  }

  return editor;
};

export { dispositivosDefaults, PanelConmutadorButtons };
