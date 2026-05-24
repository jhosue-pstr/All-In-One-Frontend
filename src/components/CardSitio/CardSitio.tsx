import { useNavigate } from "react-router-dom";
import type { Sitio } from "../../models";
import { API_CONFIG } from "../../config";
import "./CardSitio.css";

const API_URL = API_CONFIG.baseUrl.replace("/api", "");

interface CardSitioProps {
  readonly sitio: Sitio;
  readonly onDelete?: (id: number) => void;
  readonly modulos?: Array<{ id: number; slug: string; nombre: string }>;
  readonly activeModIds?: number[];
}

export function CardSitio({ sitio, onDelete, modulos, activeModIds }: Readonly<CardSitioProps>) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/sitio/${sitio.id}/editar`);
  };

  const handleDelete = () => {
    if (confirm("¿Estás seguro de eliminar este sitio?")) {
      onDelete?.(sitio.id);
    }
  };

  const handleView = () => {
    window.open(`${API_URL}/${sitio.slug}`, "_blank");
  };

  const activeSet = new Set(activeModIds ?? []);
  const activeModulos = modulos?.filter(m => activeSet.has(m.id)) ?? [];

  return (
    <div className="sitio-card" data-testid={`sitio-card-${sitio.id}`}>
      {sitio.miniatura && (
        <div className="sitio-miniatura">
          <img src={sitio.miniatura} alt={sitio.nombre} />
        </div>
      )}
      <div className="sitio-info">
        <h3>{sitio.nombre}</h3>
        <span className="sitio-slug">{sitio.slug}</span>
        <span className={`sitio-status ${sitio.activo ? 'active' : 'inactive'}`}>
          {sitio.activo ? 'Activo' : 'Inactivo'}
        </span>
      </div>
      {activeModulos.length > 0 && (
        <div className="sitio-modulos">
          <span className="sitio-modulos-label">Módulos:</span>
          <div className="sitio-modulos-list">
            {activeModulos.map(m => (
              <span key={m.slug} className="sitio-modulo-badge">{m.nombre}</span>
            ))}
          </div>
        </div>
      )}
      <div className="sitio-actions">
        <button onClick={handleView} className="btn-view" title="Ver sitio">
          👁 Ver
        </button>
        <button onClick={handleEdit} className="btn-edit" data-testid={`btn-editar-sitio-${sitio.id}`}>
          Editar
        </button>
        <button onClick={handleDelete} className="btn-delete" data-testid={`btn-eliminar-sitio-${sitio.id}`}>
          Eliminar
        </button>
      </div>
    </div>
  );
}