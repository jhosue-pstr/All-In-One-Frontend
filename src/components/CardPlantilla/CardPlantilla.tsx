import { useNavigate } from "react-router-dom";
import type { Plantilla } from "../../models";
import "./CardPlantilla.css";

interface CardPlantillaProps {
  plantilla: Plantilla;
  showActions?: boolean;
  onDelete?: (id: number) => void;
  onEdit?: (plantilla: Plantilla) => void;
}

export function CardPlantilla({ plantilla, showActions = true, onDelete, onEdit }: CardPlantillaProps) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/plantillas/${plantilla.id}/editar`);
  };

  const handleEditBasic = () => {
    onEdit?.(plantilla);
  };

  const handleDelete = () => {
    if (confirm("¿Estás seguro de eliminar esta plantilla?")) {
      onDelete?.(plantilla.id);
    }
  };

  return (
    <div className="plantilla-card">
      {plantilla.miniatura && (
        <div className="plantilla-miniatura">
          <img src={plantilla.miniatura} alt={plantilla.nombre} />
        </div>
      )}
      <div className="plantilla-info">
        <h3>{plantilla.nombre}</h3>
        <span className="plantilla-slug">{plantilla.slug}</span>
        <p className="plantilla-desc">{plantilla.descripcion || "Sin descripción"}</p>
        <div className="plantilla-badges">
          <span className={`plantilla-visibilidad ${plantilla.visibilidad.toLowerCase()}`}>
            {plantilla.visibilidad === "PUBLICA" ? "Pública" : "Privada"}
          </span>
          <span className={`plantilla-status ${plantilla.activo ? "active" : "inactive"}`}>
            {plantilla.activo ? "Activa" : "Inactiva"}
          </span>
        </div>
      </div>
      {showActions && (
        <div className="plantilla-actions">
          <button onClick={handleEdit} className="btn-edit">
            Editar
          </button>
          <button onClick={handleEditBasic} className="btn-secondary">
            Editar basic
          </button>
          <button onClick={handleDelete} className="btn-delete">
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}