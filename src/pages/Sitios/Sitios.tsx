import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sitioService, plantillaService } from '../../services';
import { CardSitio } from '../../components/CardSitio/CardSitio';
import type { Sitio, SitioCreate, SitioUpdate, Plantilla } from '../../models';
import './Sitios.css';

type TipoOrigen = 'mis-plantillas' | 'comunidad' | 'blank';

export function Sitios() {
  const navigate = useNavigate();
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSitio, setEditingSitio] = useState<Sitio | null>(null);
  const [formData, setFormData] = useState<SitioCreate>({
    nombre: '',
    slug: '',
    id_plantilla: undefined,
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showModal]);
  const [origenTipo, setOrigenTipo] = useState<TipoOrigen>('blank');

  useEffect(() => {
    loadSitios();
    loadPlantillas();
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

  const loadPlantillas = async () => {
    try {
      const misPlantillas = await plantillaService.getMisPlantillas();
      const publicas = await plantillaService.getPublicas();
      setPlantillas([...misPlantillas, ...publicas]);
    } catch (error) {
      console.error('Error loading plantillas:', error);
    }
  };

  const handleSelectOrigen = (tipo: TipoOrigen) => {
    setOrigenTipo(tipo);
    setFormData({ ...formData, id_plantilla: undefined });
  };

  const handleSelectPlantilla = (id: number) => {
    setFormData({ ...formData, id_plantilla: id });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSitio) {
        await sitioService.update(editingSitio.id, formData as SitioUpdate);
      } else {
        const nuevoSitio = await sitioService.create(formData);
        navigate(`/sitio/${nuevoSitio.id}/editar`);
      }
      setShowModal(false);
      setEditingSitio(null);
      setFormData({ nombre: '', slug: '', id_plantilla: undefined });
      setOrigenTipo('blank');
      loadSitios();
    } catch (error) {
      console.error('Error saving sitio:', error);
    }
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
            <CardSitio
              key={sitio.id}
              sitio={sitio}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showModal && !editingSitio && (
        <button
          className="modal-overlay"
          onClick={() => setShowModal(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
              setShowModal(false);
            }
          }}
          aria-label="Cerrar modal"
          type="button"
        >
          <div 
            className="modal modal-lg" 
            role="dialog" 
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <h2 id="modal-title">Nuevo Sitio</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="sitio-nombre">Nombre</label>
                <input
                  id="sitio-nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Mi sitio web"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="sitio-slug">Slug (subdominio)</label>
                <input
                  id="sitio-slug"
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="mi-sitio"
                  required
                />
              </div>
              
              <div className="form-group">
                <span>Seleccionar origen</span>
                <div className="origen-tabs">
                  <button
                    type="button"
                    className={`origen-tab ${origenTipo === 'blank' ? 'active' : ''}`}
                    onClick={() => handleSelectOrigen('blank')}
                  >
                    Lienzo en blanco
                  </button>
                  <button
                    type="button"
                    className={`origen-tab ${origenTipo === 'mis-plantillas' ? 'active' : ''}`}
                    onClick={() => handleSelectOrigen('mis-plantillas')}
                  >
                    Mis Plantillas
                  </button>
                  <button
                    type="button"
                    className={`origen-tab ${origenTipo === 'comunidad' ? 'active' : ''}`}
                    onClick={() => handleSelectOrigen('comunidad')}
                  >
                    Comunidad
                  </button>
                </div>
              </div>

              {origenTipo !== 'blank' && (
                <div className="form-group">
                  <span>Elegir plantilla</span>
                  <div className="plantillas-grid">
                    {plantillas
                      .filter(p => 
                        origenTipo === 'mis-plantillas' 
                          ? p.visibilidad === 'PRIVADA' && p.id_usuario === Number(localStorage.getItem('userId'))
                          : p.visibilidad === 'PUBLICA'
                      )
                      .map(p => (
                        <button
                          type="button"
                          key={p.id}
                          className={`plantilla-option ${formData.id_plantilla === p.id ? 'selected' : ''}`}
                          onClick={() => handleSelectPlantilla(p.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleSelectPlantilla(p.id);
                            }
                          }}
                        >
                          {p.miniatura && <img src={p.miniatura} alt={p.nombre} />}
                          <span>{p.nombre}</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Crear Sitio
                </button>
              </div>
            </form>
          </div>
        </button>
      )}
    </div>
  );
}