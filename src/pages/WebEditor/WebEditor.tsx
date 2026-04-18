import { useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { initGrapesJS } from "../../components/GrapesJS";
import "grapesjs/dist/css/grapes.min.css";
import "./WebEditor.css";

export function WebEditor() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const grapesEditorRef = useRef<any>(null);

  const isTemplate = searchParams.get("isTemplate") === "true";

  useEffect(() => {
    if (!id) return;

    (window as any).siteId = id;

    if (!grapesEditorRef.current) {
      grapesEditorRef.current = initGrapesJS({
        siteId: id,
        isTemplate,
        onSave: async (data) => {
          console.log("Guardando:", data);
        },
        onLoad: async () => {
          return null;
        },
      });
    }

    return () => {
      if (grapesEditorRef.current) {
        grapesEditorRef.current.destroy();
        grapesEditorRef.current = null;
      }
    };
  }, [id, isTemplate]);

  useEffect(() => {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.panel-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const panel = tab.getAttribute('data-panel');
        
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        contents.forEach(c => {
          c.classList.remove('active');
          if (c instanceof HTMLElement) c.style.display = 'none';
        });
        
        if (panel === 'blocks') {
          document.querySelector(`#blocks-${id}`)?.classList.add('active');
          document.querySelector(`#blocks-${id}`)?.setAttribute('style', 'display: flex !important; flex-wrap: wrap; align-content: flex-start; gap: 8px; padding: 10px;');
        } else if (panel === 'layers') {
          const el = document.querySelector('.layers-container');
          if (el) {
            el.classList.add('active');
            el.setAttribute('style', 'display: block; flex: 1; overflow-y: auto; padding: 10px;');
          }
        } else if (panel === 'styles') {
          const el = document.querySelector('.styles-container');
          if (el) {
            el.classList.add('active');
            el.setAttribute('style', 'display: block; flex: 1; overflow-y: auto; padding: 10px;');
          }
        } else if (panel === 'pages') {
          const el = document.querySelector('.pages-container');
          if (el) {
            el.classList.add('active');
            el.setAttribute('style', 'display: block; flex: 1; overflow-y: auto; padding: 10px;');
          }
        }
        
        if (grapesEditorRef.current) {
          const cmd = panel === 'blocks' ? 'show-blocks' : 
                      panel === 'layers' ? 'show-layers' : 
                      panel === 'styles' ? 'show-styles' : 'show-pages';
          grapesEditorRef.current.runCommand(cmd);
        }
      });
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
        
        <div className="panel__devices"></div>
        
        {/* Contenedor para los botones de acciones de GrapesJS */}
        <div className="panel__actions"></div>
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
            <button className="tab-btn active" data-panel="blocks"><i className="fa fa-th"></i></button>
            <button className="tab-btn" data-panel="layers"><i className="fa fa-layer-group"></i></button>
            <button className="tab-btn" data-panel="styles"><i className="fa fa-paint-brush"></i></button>
            <button className="tab-btn" data-panel="pages"><i className="fa fa-file-alt"></i></button>
          </div>
          
          {/* Contenido del Panel */}
          <div id={`blocks-${id}`} className="panel-content active" />
          <div className="panel-content layers-container" style={{ display: "none" }} />
          <div className="panel-content styles-container" style={{ display: "none" }} />
          <div className="panel-content pages-container" style={{ display: "none", padding: "10px", color: "#ddd" }}>
            <h3 style={{ borderBottom: "1px solid #444", paddingBottom: "10px", marginTop: 0 }}>
              Mis Páginas
            </h3>
            <div id={`pages-list-${id}`} />
            <button id={`btn-add-page-${id}`} style={{ width: "100%", padding: "10px", marginTop: "15px", background: "#3498db", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}>
              + Nueva Página
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}