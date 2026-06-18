import grapesjs, { type Editor, type EditorConfig } from "grapesjs";
import { dispositivosDefaults } from "./Paneles/PanelDispositivos";
import { blocks } from "./Bloques";
import "./assets/editor.css";

export type PageData = { id: string; name: string; html: string; css: string };

export interface GrapesJSInitOptions {
  siteId: string;
  isTemplate?: boolean;
  projectData?: { html?: string; css?: string; pages?: PageData[] } | null;
  onSave?: (data: any) => Promise<void>;
  onLoad?: (siteId: string) => Promise<any>;
}

export const initGrapesJS = (options: GrapesJSInitOptions): Editor => {
  const siteId = options.siteId;
  const blockId = `#blocks-${siteId}`;
  const pagesListId = `pages-list-${siteId}`;
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

  // Load pages: restore all saved pages, not just the first one
  const savedPages = options.projectData?.pages;
  if (savedPages && savedPages.length > 1) {
    // Set first page
    editor.setComponents(savedPages[0].html);
    editor.setStyle(savedPages[0].css || "");
    // Add remaining pages
    for (let i = 1; i < savedPages.length; i++) {
      editor.Pages.add({ name: savedPages[i].name, component: savedPages[i].html });
    }
  } else {
    if (options.projectData?.html) editor.setComponents(options.projectData.html);
    if (options.projectData?.css) editor.setStyle(options.projectData.css);
  }
  /* v8 ignore start */
  const createDeleteModal = (pageId: string, pageName: string, container: HTMLElement) => {
    const div = document.createElement("div");
    div.style.cssText = "padding:20px;text-align:center;";
    div.innerHTML = `
      <p style="margin-bottom:20px;font-size:16px;">¿Eliminar la página "<b>${pageName}</b>"?</p>
      <div style="display:flex;gap:10px;justify-content:center;">
        <button data-action="cancel" style="padding:10px 20px;background:#95a5a6;color:white;border:none;border-radius:4px;cursor:pointer;font-size:14px;">Cancelar</button>
        <button data-action="confirm" style="padding:10px 20px;background:#e74c3c;color:white;border:none;border-radius:4px;cursor:pointer;font-size:14px;">Eliminar</button>
      </div>`;
    const cancelBtn = div.querySelector<HTMLButtonElement>('[data-action="cancel"]');
    const confirmBtn = div.querySelector<HTMLButtonElement>('[data-action="confirm"]');

    if (cancelBtn) {
      cancelBtn.onclick = () => editor.Modal.close();
    }

    if (confirmBtn) {
      confirmBtn.onclick = () => {
        editor.Pages.remove(pageId);
        renderPagesList(container);
        editor.Modal.close();
      };
    }
    return div;
  };
  /* v8 ignore stop */

  /* v8 ignore start */
  const createNewPageModal = () => {
    const div = document.createElement("div");
    div.style.cssText = "padding:20px;";
    div.innerHTML = `
      <input type="text" id="new-page-name" placeholder="Nombre de la página" 
        style="width:100%;padding:12px;margin:15px 0;border:1px solid #ddd;border-radius:4px;font-size:14px;box-sizing:border-box;">
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button data-action="cancel" style="padding:10px 20px;background:#95a5a6;color:white;border:none;border-radius:4px;cursor:pointer;font-size:14px;">Cancelar</button>
        <button data-action="create" style="padding:10px 20px;background:#3498db;color:white;border:none;border-radius:4px;cursor:pointer;font-size:14px;">Crear</button>
      </div>`;
    const input = div.querySelector<HTMLInputElement>("#new-page-name");
    const cancelBtn = div.querySelector<HTMLButtonElement>('[data-action="cancel"]');
    const createBtn = div.querySelector<HTMLButtonElement>('[data-action="create"]');
    if (!input) return div;

    input.focus();

    if (cancelBtn) {
      cancelBtn.onclick = () => editor.Modal.close();
    }

    if (createBtn) {
      createBtn.onclick = () => {
        const name = input.value.trim();
        if (name) {
          editor.Pages.add({ name, component: `<div></div>` });
          renderPagesList(document.getElementById(pagesListId));
        }
        editor.Modal.close();
      };
    }
    return div;
  };
  /* v8 ignore stop */
  const addDeleteButton = (el: HTMLElement, page: any, container: HTMLElement) => {
    const delBtn = document.createElement("span");
    delBtn.innerHTML = "🗑️";
    delBtn.style.cssText = "cursor:pointer;font-size:14px;padding:0 4px;";
    delBtn.onclick = (e) => {
      e.stopPropagation();
      const pageName = page.get("name") || page.id;
      editor.Modal.setTitle("Eliminar Página").setContent(createDeleteModal(page.id, pageName, container)).open();
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
    if (typeof document === 'undefined') return;
    const c = document.getElementById(pagesListId);
    if (c) renderPagesList(c);
    const b = document.getElementById(btnAddPageId);
    if (b) {
      b.onclick = () => {
        editor.Modal.setTitle("Nueva Página").setContent(createNewPageModal()).open();
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
    const container = editor.getContainer();
    return container instanceof HTMLElement ? container.closest(".editor-row") : null;
  };

  const blocksSel = `#blocks-${siteId}`;
  
  const showPanel = (selector: string, show: boolean) => {
    const el = getRow()?.querySelector<HTMLElement>(selector);
    if (el) el.style.display = show ? "" : "none";
  };
  
  const hideAll = () => {
    const row = getRow();
    if (!row) return;
    [blocksSel, ".layers-container", ".styles-container", ".traits-container", ".pages-container"].forEach((sel) => {
      const el = row.querySelector(sel) as HTMLElement | null;
      if (el) el.style.display = "none";
    });
  };

  const addPanelCommand = (id: string, selectors: string[], hasStop = true) => {
    const cmd: Record<string, unknown> = {
      run() {
        hideAll();
        selectors.forEach(sel => showPanel(sel, true));
      },
    };
    if (hasStop) {
      cmd.stop = () => selectors.forEach(sel => showPanel(sel, false));
    }
    editor.Commands.add(id, cmd);
  };

  addPanelCommand("show-layers", [".layers-container"]);
  addPanelCommand("show-styles", [".styles-container"]);
  addPanelCommand("show-traits", [".traits-container"]);
  addPanelCommand("show-blocks", [blocksSel], false);
  
  editor.Commands.add("show-pages", {
    run() {
      hideAll();
      showPanel(".pages-container", true);
        const el = getRow()?.querySelector<HTMLElement>(".pages-container") || null;      if (el) {
        renderPagesList(el.querySelector<HTMLElement>(`#pages-list-${siteId}`));
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

  // Register custom trait type: dropdown of internal pages for href
  editor.Traits.addType("page-href", {

    createInput({ trait }: { trait: any }) {
      const el = document.createElement("select");
      el.style.width = "100%";

      const renderOptions = () => {
        const current = el.value || trait.getValue();
        el.innerHTML = "";
        const addOpt = (value: string, label: string) => {
          const opt = document.createElement("option");
          opt.value = value;
          opt.textContent = label;
          el.appendChild(opt);
        };
        addOpt("", "-- URL externa --");
        editor.Pages.getAll().forEach((p: any) => {
          const name = p.get("name") || p.id;
          const slug = name
            .toLowerCase()
            .replaceAll(" ", "-")
            .replaceAll("_", "-")
            .replaceAll("/", "-")
            .replaceAll(".", "-")
            .replaceAll(",", "-")
            .replaceAll("--", "-")
            .replaceAll("á", "a")
            .replaceAll("é", "e")
            .replaceAll("í", "i")
            .replaceAll("ó", "o")
            .replaceAll("ú", "u")
            .replaceAll("ñ", "n");          
            addOpt(`?page=${slug}`, `📄 ${name}`);
        });
        if (current && [...el.options].some((o) => o.value === current)) {
          el.value = current;
        }
      };

      renderOptions();
      editor.on("page", renderOptions);

      el.addEventListener("change", () => {
        const val = el.value;
        trait.setValue(val);

        const component = trait.getTarget?.();
        /* v8 ignore start */
        if (component) {
          component.set("href", val || "#");
        }
        /* v8 ignore stop */
      });

      return el;
    },


  });

  // Override default link component type to use page-href trait
  editor.DomComponents.addType("link", {
    extend: "link",
    model: {
      defaults: {
        traits: [
          { type: "page-href", name: "href", label: "Vincular a página" },
          { type: "select", name: "target", label: "Target", options: [
            { id: "", value: "", name: "Misma ventana" },
            { id: "_blank", value: "_blank", name: "Nueva ventana (_blank)" },
          ]},
        ],
      },
    },
  });

  editor.on("component:selected", (component: any) => {
    component.set("resizable", true);
    component.set("hoverable", true);

    const tagName = (component.get("tagName") || "").toLowerCase();
    if (tagName !== "a") return;

    const existingTraits = component.get("traits") || [];
    const hasPageHref = existingTraits.some((t: any) => t.type === "page-href");
    const hasTarget = existingTraits.some((t: any) => t.name === "target");

    if (hasPageHref && hasTarget) return;

    const newTraits = [];
    const seen = new Set<string>();
    for (const t of existingTraits) {
      const key = t.type || t.name;
      if (!seen.has(key)) {
        seen.add(key);
        newTraits.push(t);
      }
    }
    if (!hasPageHref) {
      newTraits.push({ type: "page-href", name: "href", label: "Vincular a página" });
    }
    if (!hasTarget) {
      newTraits.push({ type: "select", name: "target", label: "Target", options: [
        { id: "", value: "", name: "Misma ventana" },
        { id: "_blank", value: "_blank", name: "Nueva ventana (_blank)" },
      ]});
    }
    component.set("traits", newTraits);
  });

  editor.on("page", () => {
    renderPagesList(document.getElementById(pagesListId));
  });

  if (options.onLoad) {
    options.onLoad(options.siteId).then((data) => {
      if (data?.settings) editor.loadProjectData(data.settings);
    });
  }

  return editor;
};

export { dispositivosDefaults } from "./Paneles/PanelDispositivos";
export { PanelConmutadorButtons } from "./Paneles/PanelConmutador";


