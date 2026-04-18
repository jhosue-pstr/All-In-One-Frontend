import { useEffect, useState } from 'react';
import { sitioService } from '../../services';
import type { Sitio, SitioCreate, SitioUpdate } from '../../models';
import './Sitios.css';

export function Sitios() {
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSitio, setEditingSitio] = useState<Sitio | null>(null);
  const [formData, setFormData] = useState<SitioCreate>({
    nombre: '',
    slug: '',
  });

  useEffect(() => {
    loadSitios();
  }, []);

  const loadSitios = async () => {
    try {
      const data = await sitioService.getAll();
      setSitios(data);
    } catch (error) {
      console.error('Error loading sitios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSitio) {
        await sitioService.update(editingSitio.id, formData as SitioUpdate);
      } else {
        await sitioService.create(formData);
      }
      setShowModal(false);
      setEditingSitio(null);
      setFormData({ nombre: '', slug: '' });
      loadSitios();
    } catch (error) {
      console.error('Error saving sitio:', error);
    }
  };

  const handleEdit = (sitio: Sitio) => {
    setEditingSitio(sitio);
    setFormData({ nombre: sitio.nombre, slug: sitio.slug });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este sitio?')) {
      try {
        await sitioService.delete(id);
        loadSitios();
      } catch (error) {
        console.error('Error deleting sitio:', error);
      }
    }
  };

  const openCreateModal = () => {
    setEditingSitio(null);
    setFormData({ nombre: '', slug: '' });
    setShowModal(true);
  };

  if (loading) {
    return <div className="page-loading">Cargando...</div>;
  }

  return (
    <div className="sitios-container">
      <header className="page-header">
        <h1>Sitios</h1>
        <button className="btn-primary" onClick={openCreateModal}>
          + Nuevo Sitio
        </button>
      </header>

      {sitios.length === 0 ? (
        <div className="empty-state">
          <p>No hay sitios creados aún.</p>
          <button className="btn-primary" onClick={openCreateModal}>
            Crear mi primer sitio
          </button>
        </div>
      ) : (
        <div className="sitios-grid">
          {sitios.map((sitio) => (
            <div key={sitio.id} className="sitio-card">
              <div className="sitio-info">
                <h3>{sitio.nombre}</h3>
                <span className="sitio-slug">{sitio.slug}</span>
                <span className={`sitio-status ${sitio.activo ? 'active' : 'inactive'}`}>
                  {sitio.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="sitio-actions">
                <button onClick={() => handleEdit(sitio)} className="btn-edit">
                  Editar
                </button>
                <button onClick={() => handleDelete(sitio.id)} className="btn-delete">
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
            <h2>{editingSitio ? 'Editar Sitio' : 'Nuevo Sitio'}</h2>
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
                  {editingSitio ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}