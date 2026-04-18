import { useEffect, useState } from 'react';
import { moduloService } from '../../services';
import type { Modulo, ModuloCreate, ModuloUpdate } from '../../models';
import './Modulos.css';

export function Modulos() {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingModulo, setEditingModulo] = useState<Modulo | null>(null);
  const [formData, setFormData] = useState<ModuloCreate>({
    nombre: '',
    slug: '',
    tipo: '',
  });

  useEffect(() => {
    loadModulos();
  }, []);

  const loadModulos = async () => {
    try {
      const data = await moduloService.getAll();
      setModulos(data);
    } catch (error) {
      console.error('Error loading modulos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingModulo) {
        await moduloService.update(editingModulo.id, formData as ModuloUpdate);
      } else {
        await moduloService.create(formData);
      }
      setShowModal(false);
      setEditingModulo(null);
      setFormData({ nombre: '', slug: '', tipo: '' });
      loadModulos();
    } catch (error) {
      console.error('Error saving modulo:', error);
    }
  };

  const handleEdit = (modulo: Modulo) => {
    setEditingModulo(modulo);
    setFormData({ 
      nombre: modulo.nombre, 
      slug: modulo.slug, 
      tipo: modulo.tipo 
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este módulo?')) {
      try {
        await moduloService.delete(id);
        loadModulos();
      } catch (error) {
        console.error('Error deleting modulo:', error);
      }
    }
  };

  const openCreateModal = () => {
    setEditingModulo(null);
    setFormData({ nombre: '', slug: '', tipo: '' });
    setShowModal(true);
  };

  if (loading) {
    return <div className="page-loading">Cargando...</div>;
  }

  return (
    <div className="modulos-container">
      <header className="page-header">
        <h1>Módulos</h1>
        <button className="btn-primary" onClick={openCreateModal}>
          + Nuevo Módulo
        </button>
      </header>

      {modulos.length === 0 ? (
        <div className="empty-state">
          <p>No hay módulos creados aún.</p>
          <button className="btn-primary" onClick={openCreateModal}>
            Crear mi primer módulo
          </button>
        </div>
      ) : (
        <div className="modulos-grid">
          {modulos.map((modulo) => (
            <div key={modulo.id} className="modulo-card">
              <div className="modulo-info">
                <h3>{modulo.nombre}</h3>
                <span className="modulo-slug">{modulo.slug}</span>
                <p className="modulo-desc">{modulo.descripcion || 'Sin descripción'}</p>
                <span className="modulo-type">{modulo.tipo}</span>
                <span className={`modulo-status ${modulo.activo ? 'active' : 'inactive'}`}>
                  {modulo.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="modulo-actions">
                <button onClick={() => handleEdit(modulo)} className="btn-edit">
                  Editar
                </button>
                <button onClick={() => handleDelete(modulo.id)} className="btn-delete">
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
            <h2>{editingModulo ? 'Editar Módulo' : 'Nuevo Módulo'}</h2>
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
              <div className="form-group">
                <label>Tipo</label>
                <input
                  type="text"
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingModulo ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}