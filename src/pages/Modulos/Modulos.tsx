import { useEffect, useState, useCallback } from 'react';
import { sitioService, moduloService } from '../../services';
import { sitioModuloService } from '../../services/sitioModulo';
import { ToggleSwitch } from '../../components/ToggleSwitch/ToggleSwitch';
import type { Sitio, Modulo } from '../../models';
import './Modulos.css';

export function Modulos() {
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeModIds, setActiveModIds] = useState<Set<number>>(new Set());
  const [toggling, setToggling] = useState<number | null>(null);

  const selectedSitio = sitios.find(s => s.id === selectedId) ?? null;

  useEffect(() => {
    const load = async () => {
      try {
        const [sitiosData, modulosData] = await Promise.all([
          sitioService.getAll(),
          moduloService.getAll(),
        ]);
        setSitios(sitiosData);
        setModulos(modulosData.filter(m => m.activo));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!selectedId) { setActiveModIds(new Set()); return; }
    sitioModuloService.getBySitio(selectedId).then(ids => {
      setActiveModIds(new Set(ids));
    }).catch(() => setActiveModIds(new Set()));
  }, [selectedId]);

  const handleToggle = useCallback(async (moduloId: number, value: boolean) => {
    /* v8 ignore next 2 */
    if (!selectedId) return;
    setToggling(moduloId);
    const prev = new Set(activeModIds);
    const next = new Set(activeModIds);
    if (value) next.add(moduloId); else next.delete(moduloId);
    setActiveModIds(next);
    try {
      if (value) {
        await sitioModuloService.add(selectedId, moduloId);
      } else {
        await sitioModuloService.remove(selectedId, moduloId);
      }
    } catch (error) {
      console.error('Error toggling module:', error);
      setActiveModIds(prev);
    } finally {
      setToggling(null);
    }
  }, [selectedId, activeModIds]);

  if (loading) {
    return <div className="page-loading">Cargando...</div>;
  }

  return (
    <div className="modulos-page">
      <header className="page-header">
        <h1>Módulos</h1>
      </header>

      <div className="modulos-layout">
        <aside className="modulos-sidebar">
          <h2 className="sidebar-title">Mis Sitios</h2>
          {sitios.length === 0 ? (
            <p className="empty-text">No hay sitios</p>
          ) : (
            <ul className="sitios-list">
              {sitios.map(sitio => (
                <li key={sitio.id}>
                  <button
                    className={`sitio-item ${selectedId === sitio.id ? 'selected' : ''}`}
                    onClick={() => setSelectedId(sitio.id)}
                  >
                    <span className="sitio-name">{sitio.nombre}</span>
                    <span className="sitio-slug">{sitio.slug}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <main className="modulos-main">
          {selectedSitio ? (
            <>
              <div className="modulos-header">
                <h2>{selectedSitio.nombre}</h2>
                <span className="modulos-slug">{selectedSitio.slug}</span>
              </div>

              {modulos.length === 0 ? (
                <p className="empty-text">No hay módulos disponibles.</p>
              ) : (
                <div className="modulos-grid-detail">
                  {modulos.map(modulo => {
                    const enabled = activeModIds.has(modulo.id);
                    return (
                      <div key={modulo.id} className={`modulo-card-detail ${enabled ? 'enabled' : ''}`}>
                        <div className="modulo-card-info">
                          <h3>{modulo.nombre}</h3>
                          {modulo.descripcion && (
                            <p className="modulo-desc">{modulo.descripcion}</p>
                          )}
                          <span className="modulo-type">{modulo.tipo}</span>
                        </div>
                        <div className="modulo-card-toggle">
                          <ToggleSwitch
                            checked={enabled}
                            onChange={(v) => handleToggle(modulo.id, v)}
                            disabled={toggling === modulo.id}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="modulos-placeholder">
              <p>Selecciona un sitio de la lista para gestionar sus módulos.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
