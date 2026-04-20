import { useNavigate } from "react-router-dom";
import type { Sitio } from "../../models";
import { API_CONFIG } from "../../config";
import "./CardSitio.css";

const API_URL = API_CONFIG.baseUrl.replace("/api", "");

interface CardSitioProps {
  sitio: Sitio;
  onDelete?: (id: number) => void;
}

export function CardSitio({ sitio, onDelete }: CardSitioProps) {
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

  return (
    <div className="sitio-card">
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
      <div className="sitio-actions">
        <button onClick={handleView} className="btn-view" title="Ver sitio">
          👁 Ver
        </button>
        <button onClick={handleEdit} className="btn-edit">
          Editar
        </button>
        <button onClick={handleDelete} className="btn-delete">
          Eliminar
        </button>
      </div>
    </div>
  );
}