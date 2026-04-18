import { useEffect, useState } from 'react';
import { moduloService } from '../../services';
import type { Modulo } from '../../models';
import './Modulos.css';

export function Modulos() {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="page-loading">Cargando...</div>;
  }

  return (
    <div className="modulos-container">
      <header className="page-header">
        <h1>Módulos</h1>
      </header>

      {modulos.length === 0 ? (
        <div className="empty-state">
          <p>No hay módulos disponibles.</p>
        </div>
      ) : (
        <div className="modulos-grid">
          {modulos.map((modulo) => (
            <div key={modulo.id} className="modulo-card">
              <div className="modulo-info">
                <h3>{modulo.nombre}</h3>
                <p className="modulo-desc">{modulo.descripcion || 'Sin descripción'}</p>
                <span className="modulo-type">{modulo.tipo}</span>
                <span className={`modulo-status ${modulo.activo ? 'active' : 'inactive'}`}>
                  {modulo.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}