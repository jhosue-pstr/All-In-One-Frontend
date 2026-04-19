import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { plantillaService } from '../../services';
import { CardPlantilla } from '../../components/CardPlantilla/CardPlantilla';
import type { Plantilla, PlantillaCreate, PlantillaUpdate, Visibilidad } from '../../models';
import './Plantillas.css';

type Tab = 'mis-plantillas' | 'comunidad';

export function Plantillas() {
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlantilla, setEditingPlantilla] = useState<Plantilla | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('mis-plantillas');
  const [formData, setFormData] = useState<PlantillaCreate>({
    nombre: '',
    slug: '',
    descripcion: '',
    visibilidad: 'PRIVADA',
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadPlantillas();
  }, [activeTab]);

  const loadPlantillas = async () => {
    try {
      setLoading(true);
      const data = activeTab === 'mis-plantillas'
        ? await plantillaService.getMisPlantillas()
        : await plantillaService.getPublicas();
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
      setFormData({ nombre: '', slug: '', descripcion: '', visibilidad: 'PRIVADA' });
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
    setFormData({
      nombre: plantilla.nombre,
      slug: plantilla.slug,
      descripcion: plantilla.descripcion || '',
      visibilidad: plantilla.visibilidad,
    });
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
    setFormData({ nombre: '', slug: '', descripcion: '', visibilidad: 'PRIVADA' });
    setShowModal(true);
  };

  return (
    <div className="plantillas-container">
      <header className="page-header">
        <h1>Plantillas</h1>
        <button className="btn-primary" onClick={openCreateModal}>
          + Nueva Plantilla
        </button>
      </header>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'mis-plantillas' ? 'active' : ''}`}
          onClick={() => setActiveTab('mis-plantillas')}
        >
          Mis Plantillas
        </button>
        <button
          className={`tab ${activeTab === 'comunidad' ? 'active' : ''}`}
          onClick={() => setActiveTab('comunidad')}
        >
          Comunidad
        </button>
      </div>

      {loading ? (
        <div className="page-loading">Cargando...</div>
      ) : plantillas.length === 0 ? (
        <div className="empty-state">
          <p>No hay plantillas {activeTab === 'mis-plantillas' ? 'creadas aún' : 'disponibles'}.</p>
          {activeTab === 'mis-plantillas' && (
            <button className="btn-primary" onClick={openCreateModal}>
              Crear mi primera plantilla
            </button>
          )}
        </div>
      ) : (
        <div className="plantillas-grid">
          {plantillas.map((plantilla) => (
            <CardPlantilla
              key={plantilla.id}
              plantilla={plantilla}
              showActions={activeTab === 'mis-plantillas'}
              onEdit={handleEditBasic}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPlantilla ? 'Editar Plantilla' : 'Nueva Plantilla'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Mi plantilla"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="mi-plantilla"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Descripción de tu plantilla..."
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Visibilidad</label>
                <div className="visibility-options">
                  <label className={`visibility-option ${formData.visibilidad === 'PRIVADA' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="visibilidad"
                      value="PRIVADA"
                      checked={formData.visibilidad === 'PRIVADA'}
                      onChange={(e) => setFormData({ ...formData, visibilidad: e.target.value as Visibilidad })}
                    />
                    <span className="visibility-icon">🔒</span>
                    <span className="visibility-label">Privada</span>
                    <span className="visibility-desc">Solo tú podrás verla</span>
                  </label>
                  <label className={`visibility-option ${formData.visibilidad === 'PUBLICA' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="visibilidad"
                      value="PUBLICA"
                      checked={formData.visibilidad === 'PUBLICA'}
                      onChange={(e) => setFormData({ ...formData, visibilidad: e.target.value as Visibilidad })}
                    />
                    <span className="visibility-icon">🌍</span>
                    <span className="visibility-label">Pública</span>
                    <span className="visibility-desc">Todos pueden verla</span>
                  </label>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary btn-lg">
                  {editingPlantilla ? 'Actualizar' : 'Crear Plantilla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}