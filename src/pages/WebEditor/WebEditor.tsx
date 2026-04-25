import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import { initGrapesJS } from "../../components/GrapesJS";
import { plantillaService } from "../../services/plantilla";
import { sitioService } from "../../services/sitio";
import "grapesjs/dist/css/grapes.min.css";
import "./WebEditor.css";

export function WebEditor() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const grapesEditorRef = useRef<any>(null);
  const [currentDevice, setCurrentDevice] = useState("Desktop");
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const isTemplate = location.pathname.startsWith("/plantillas");

  const activatePanel = (panel: string | null, siteId: string) => {
    const panelStyles: Record<string, string> = {
      blocks: "display: flex !important; flex-wrap: wrap; align-content: flex-start; gap: 8px; padding: 10px;",
      layers: "display: block; flex: 1; overflow-y: auto; padding: 10px;",
      styles: "display: block; flex: 1; overflow-y: auto; padding: 10px;",
      pages: "display: block; flex: 1; overflow-y: auto; padding: 10px;",
    };

    const panelSelectors: Record<string, string> = {
      blocks: `#blocks-${siteId}`,
      layers: ".layers-container",
      styles: ".styles-container",
      pages: ".pages-container",
    };

    const cmdMap: Record<string, string> = {
      blocks: "show-blocks",
      layers: "show-layers",
      styles: "show-styles",
      pages: "show-pages",
    };

    if (panel === "blocks") {
      const el = document.querySelector(`#blocks-${siteId}`);
      el?.classList.add("active");
      el?.setAttribute("style", panelStyles[panel]);
    } else {
      const selector = panelSelectors[panel || ""];
      const el = selector ? document.querySelector(selector) : null;
      if (el) {
        el.classList.add("active");
        el.setAttribute("style", panelStyles[panel || "layers"]);
      }
    }

    return cmdMap[panel || "blocks"];
  };

  useEffect(() => {
    if (!id) return;

    (globalThis as { siteId?: string }).siteId = id;

    const loadData = async () => {
      try {
        if (isTemplate) {
          const plantilla = await plantillaService.getById(Number.parseInt(id));
          return plantilla.configuracion as {
            html?: string;
            css?: string;
          } | null;
        } else {
          const sitio = await sitioService.getById(Number.parseInt(id));
          return sitio.configuracion as {
            html?: string;
            css?: string;
          } | null;
        }
      } catch (error) {
        console.error("Error al cargar:", error);
        return null;
      }
    };

    const initEditor = async () => {
      const projectData = await loadData();

      if (!grapesEditorRef.current) {
        grapesEditorRef.current = initGrapesJS({
          siteId: id,
          isTemplate,
          projectData: projectData || undefined,
        });
      }
    };

    initEditor();

    return () => {
      if (grapesEditorRef.current) {
        grapesEditorRef.current.destroy();
        grapesEditorRef.current = null;
      }
    };
  }, [id, isTemplate]);

  useEffect(() => {
    if (!grapesEditorRef.current) return;

    const editor = grapesEditorRef.current;
    editor.on("change:device", () => {
      setCurrentDevice(editor.getDevice());
    });
  }, []);

  useEffect(() => {
    const tabs = document.querySelectorAll(".tab-btn");
    const contents = document.querySelectorAll(".panel-content");

    const handleTabClick = (tab: Element) => {
      const panel = (tab as HTMLElement).dataset.panel;

      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      contents.forEach((c) => {
        c.classList.remove("active");
        if (c instanceof HTMLElement) c.style.display = "none";
      });

      if (grapesEditorRef.current && panel) {
        const cmd = activatePanel(panel, id);
        grapesEditorRef.current.runCommand(cmd);
      }
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => handleTabClick(tab));
    });
  }, [id]);

  const handleBack = () => {
    navigate(isTemplate ? "/plantillas" : "/sitioWeb");
  };

  return (
    <div className="editor-container">
      {/* Panel Superior */}
      <div className="panel__top">
        <div className="panel__left-top">
          <button className="btn-back" onClick={handleBack}>
            <i className="fa fa-arrow-left"></i>
          </button>
          <span className="editor-title">Editor - Plantilla {id}</span>
        </div>

        <div className="panel__devices">
          <button
            className={`gjs-pn-btn ${currentDevice === "Desktop" ? "gjs-pn-active" : ""}`}
            onClick={() => {
              setCurrentDevice("Desktop");
              grapesEditorRef.current?.setDevice("Desktop");
            }}
            title="PC"
          >
            <i className="fa fa-desktop"></i>
          </button>
          <button
            className={`gjs-pn-btn ${currentDevice === "Tablet" ? "gjs-pn-active" : ""}`}
            onClick={() => {
              setCurrentDevice("Tablet");
              grapesEditorRef.current?.setDevice("Tablet");
            }}
            title="Tablet"
          >
            <i className="fa fa-tablet"></i>
          </button>
          <button
            className={`gjs-pn-btn ${currentDevice === "Mobile" ? "gjs-pn-active" : ""}`}
            onClick={() => {
              setCurrentDevice("Mobile");
              grapesEditorRef.current?.setDevice("Mobile");
            }}
            title="Móvil"
          >
            <i className="fa fa-mobile"></i>
          </button>
        </div>

        <div className="panel__actions">
          <button
            className="gjs-pn-btn btn-toggle-borders"
            onClick={() => grapesEditorRef.current?.runCommand("sw-visibility")}
            title="Ver Bordes"
          >
            <i className="fa fa-eye"></i>
          </button>
          <button
            className="gjs-pn-btn"
            onClick={() => grapesEditorRef.current?.runCommand("undo")}
            title="Deshacer"
          >
            <i className="fa fa-undo"></i>
          </button>
          <button
            className="gjs-pn-btn"
            onClick={() => grapesEditorRef.current?.runCommand("redo")}
            title="Rehacer"
          >
            <i className="fa fa-repeat"></i>
          </button>
          <button
            className="gjs-pn-btn btn-save"
            disabled={isSaving}
            onClick={async () => {
              if (!grapesEditorRef.current) return;
              setIsSaving(true);
              try {
                const editor = grapesEditorRef.current;
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const wrapperDiv = document.createElement('div');
                wrapperDiv.style.position = 'fixed';
                wrapperDiv.style.top = '0';
                wrapperDiv.style.left = '0';
                wrapperDiv.style.zIndex = '-9999';
                wrapperDiv.style.background = '#ffffff';
                wrapperDiv.style.width = '600px';
                
                wrapperDiv.innerHTML = `
                  <style>${editor.getCss()}</style>
                  <div style="width:100%;padding:20px;">${editor.getHtml()}</div>
                `;
                
                document.body.appendChild(wrapperDiv);
                
                const miniatura = await html2canvas(wrapperDiv, {
                  useCORS: true,
                  allowTaint: true,
                  backgroundColor: "#ffffff",
                  scale: 1,
                  logging: false,
                });
                wrapperDiv.remove();
                
                const itemId = Number.parseInt(id || "0");
                
                const configuracion = {
                  html: editor.getHtml() || "",
                  css: editor.getCss() || "",
                };
                
                let miniaturaUrl = null;
                
                const blob = await new Promise<Blob>((resolve, reject) => {
                  miniatura.toBlob(
                    (blob) => blob ? resolve(blob) : reject(new Error('Error generating blob')),
                    'image/png'
                  );
                });

                const formData = new FormData();
                formData.append('file', blob, 'miniatura.png');

                const token = localStorage.getItem('token');
                const endpoint = isTemplate 
                  ? `/plantillas/${id}/miniatura` 
                  : `/sitios/${id}/miniatura`;
                const uploadResponse = await fetch(
                  `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}${endpoint}`,
                  {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                  }
                );

                if (!uploadResponse.ok) {
                  throw new Error('Error al subir la miniatura');
                }

                const data = await uploadResponse.json();
                miniaturaUrl = data.url;
                
                if (isTemplate) {
                  await plantillaService.update(itemId, {
                    configuracion,
                    miniatura: miniaturaUrl,
                  });
                  showToast("Plantilla guardada correctamente");
                } else {
                  await sitioService.update(itemId, {
                    configuracion,
                    miniatura: miniaturaUrl,
                  });
                  showToast("Sitio guardado correctamente");
                }
              } catch (error) {
                console.error("Error al guardar:", error);
                showToast("Error al guardar");
              } finally {
                setIsSaving(false);
              }
            }}
            title="Guardar"
          >
            <i className="fa fa-save"></i>
          </button>
          <button
            className="gjs-pn-btn btn-open-export"
            onClick={() => grapesEditorRef.current?.runCommand("edit-code")}
            title="Ver Código"
          >
            <i className="fa fa-code"></i>
          </button>
        </div>
      </div>

      {/* Editor Row */}
      <div className="editor-row">
        <div className="editor-canvas">
          <div id="gjs">
            <h1>Editor - Plantilla {id}</h1>
            <p>Arrastra los bloques para comenzar.</p>
          </div>
        </div>

        {/* Panel Izquierdo con Tabs */}
        <div className="panel__right">
          {/* Tabs */}
          <div className="panel-tabs">
            <button className="tab-btn active" data-panel="blocks">
              <i className="fa fa-th"></i>
            </button>
            <button className="tab-btn" data-panel="layers">
              <i className="fa fa-layer-group"></i>
            </button>
            <button className="tab-btn" data-panel="styles">
              <i className="fa fa-paint-brush"></i>
            </button>
            <button className="tab-btn" data-panel="pages">
              <i className="fa fa-file-alt"></i>
            </button>
          </div>

          {/* Contenido del Panel */}
          <div id={`blocks-${id}`} className="panel-content active" />
          <div
            className="panel-content layers-container"
            style={{ display: "none" }}
          />
          <div
            className="panel-content styles-container"
            style={{ display: "none" }}
          />
          <div
            className="panel-content pages-container"
            style={{ display: "none", padding: "10px", color: "#ddd" }}
          >
            <h3
              style={{
                borderBottom: "1px solid #444",
                paddingBottom: "10px",
                marginTop: 0,
              }}
            >
              Mis Páginas
            </h3>
            <div id={`pages-list-${id}`} />
            <button
              id={`btn-add-page-${id}`}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "15px",
                background: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              + Nueva Página
            </button>
          </div>
        </div>
      </div>
      {toast.show && (
        <div className="toast">
          {toast.message}
        </div>
      )}
    </div>
  );
}
