import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { plantillaService } from '../../services';
import type { Plantilla, PlantillaCreate, PlantillaUpdate } from '../../models';
import './Plantillas.css';

export function Plantillas() {
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlantilla, setEditingPlantilla] = useState<Plantilla | null>(null);
  const [formData, setFormData] = useState<PlantillaCreate>({
    nombre: '',
    slug: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadPlantillas();
  }, []);

  const loadPlantillas = async () => {
    try {
      const data = await plantillaService.getAll();
      setPlantillas(data);
    } catch (error) {
      console.error('Error loading plantillas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPlantilla) {
        await plantillaService.update(editingPlantilla.id, formData as PlantillaUpdate);
      } else {
        await plantillaService.create(formData);
      }
      setShowModal(false);
      setEditingPlantilla(null);
      setFormData({ nombre: '', slug: '' });
      loadPlantillas();
    } catch (error) {
      console.error('Error saving plantilla:', error);
    }
  };

  const handleEdit = (plantilla: Plantilla) => {
    navigate(`/plantillas/${plantilla.id}/editar`);
  };

  const handleEditBasic = (plantilla: Plantilla) => {
    setEditingPlantilla(plantilla);
    setFormData({ nombre: plantilla.nombre, slug: plantilla.slug });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta plantilla?')) {
      try {
        await plantillaService.delete(id);
        loadPlantillas();
      } catch (error) {
        console.error('Error deleting plantilla:', error);
      }
    }
  };

  const openCreateModal = () => {
    setEditingPlantilla(null);
    setFormData({ nombre: '', slug: '' });
    setShowModal(true);
  };

  if (loading) {
    return <div className="page-loading">Cargando...</div>;
  }

  return (
    <div className="plantillas-container">
      <header className="page-header">
        <h1>Plantillas</h1>
        <button className="btn-primary" onClick={openCreateModal}>
          + Nueva Plantilla
        </button>
      </header>

      {plantillas.length === 0 ? (
        <div className="empty-state">
          <p>No hay plantillas creadas aún.</p>
          <button className="btn-primary" onClick={openCreateModal}>
            Crear mi primera plantilla
          </button>
        </div>
      ) : (
        <div className="plantillas-grid">
          {plantillas.map((plantilla) => (
            <div key={plantilla.id} className="plantilla-card">
              <div className="plantilla-info">
                <h3>{plantilla.nombre}</h3>
                <span className="plantilla-slug">{plantilla.slug}</span>
                <p className="plantilla-desc">{plantilla.descripcion || 'Sin descripción'}</p>
                <span className={`plantilla-status ${plantilla.activo ? 'active' : 'inactive'}`}>
                  {plantilla.activo ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <div className="plantilla-actions">
                <button onClick={() => handleEdit(plantilla)} className="btn-edit">
                  Editar
                </button>
                <button onClick={() => handleEditBasic(plantilla)} className="btn-secondary">
                  Editar basic
                </button>
                <button onClick={() => handleDelete(plantilla.id)} className="btn-delete">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingPlantilla ? 'Editar Plantilla' : 'Nueva Plantilla'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingPlantilla ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}