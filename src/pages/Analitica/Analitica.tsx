import { useEffect, useState } from "react";
import {
  FiBarChart2, FiFileText, FiPackage, FiEye, FiCalendar,
  FiUsers, FiActivity, FiClock, FiTrendingUp
} from "react-icons/fi";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { analiticaService } from "../../services/analitica";
import { useSite } from "../../context/SiteContext";
import type { DashboardResponse } from "../../models";
import "./Analitica.css";

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const DIAS_OPTIONS = [
  { value: 7, label: "Últimos 7 días" },
  { value: 30, label: "Últimos 30 días" },
  { value: 90, label: "Últimos 90 días" },
];

function formatSegundos(segundos: number): string {
  const mins = Math.floor(segundos / 60);
  const segs = Math.floor(segundos % 60);
  return `${mins}:${String(segs).padStart(2, "0")} min`;
}

function formatNumero(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function mostrarRuta(pag: { titulo_pagina?: string | null; url: string }): string {
  const path = pag.url.replace(/^https?:\/\/[^\/]+/, "");
  const decoded = decodeURIComponent(path);
  const hashIndex = decoded.indexOf("#");
  if (hashIndex !== -1 && hashIndex < decoded.length - 1) return decoded.slice(hashIndex + 1);
  const segments = decoded.replace(/\/+$/, "").split("/");
  const last = segments[segments.length - 1];
  return last && last !== "index.html" && last !== "index.php" ? last : "Principal";
}

export default function Analitica() {
  const { siteId: selectedSiteId } = useSite();
  const [dias, setDias] = useState(7);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedSiteId) return;
    setLoading(true);
    setError(null);
    analiticaService.getDashboard(selectedSiteId, dias)
      .then(setDashboard)
      .catch((err) => setError(err instanceof Error ? err.message : "Error al cargar dashboard"))
      .finally(() => setLoading(false));
  }, [selectedSiteId, dias]);

  const resumen = dashboard?.resumen;
  const visitasPorDia = dashboard?.visitas_por_dia ?? [];
  const topPaginas = dashboard?.top_paginas ?? [];
  const navegadores = dashboard?.navegadores ?? {};
  const dispositivos = dashboard?.dispositivos ?? {};
  const ultimasVisitas = dashboard?.ultimas_visitas ?? [];
  const eventosRecientes = dashboard?.eventos_recientes ?? [];
  const blogStats = dashboard?.blog;
  const tiendaStats = dashboard?.tienda;

  const dispositivosData = Object.entries(dispositivos).map(([name, value]) => ({ name, value }));
  const navegadoresData = Object.entries(navegadores).map(([name, value]) => ({ name, value }));
  const totalDispositivos = dispositivosData.reduce((s, d) => s + d.value, 0);
  const totalNavegadores = navegadoresData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="analitica-page">
      <header className="analitica-header">
        <div>
          <span className="analitica-kicker"><FiBarChart2 size={16} /> Módulo Analítica</span>
          <h1>Dashboard de Analítica</h1>
          <p>Estadísticas y métricas de tus sitios web.</p>
        </div>
      </header>

      <section className="analitica-toolbar">
        <div className="analitica-field">
          <label htmlFor="analitica-dias-select">Período</label>
          <select
            id="analitica-dias-select"
            value={dias}
            onChange={(e) => setDias(Number(e.target.value))}
          >
            {DIAS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </section>

      {error && <div className="analitica-alert analitica-alert-error">{error}</div>}

      {!selectedSiteId && (
        <div className="analitica-empty-state">Selecciona un sitio para ver sus estadísticas.</div>
      )}

      {loading && <div className="analitica-empty-state">Cargando estadísticas...</div>}

      {!loading && selectedSiteId && dashboard && (
        <>
          <section className="analitica-kpi-grid">
            <div className="analitica-kpi-card analitica-kpi-blue">
              <div className="analitica-kpi-icon"><FiEye size={22} /></div>
              <span className="analitica-kpi-label">Visitas Hoy</span>
              <span className="analitica-kpi-value">{formatNumero(resumen?.visitas_hoy ?? 0)}</span>
              <span className="analitica-kpi-sub">en las últimas 24h</span>
            </div>
            <div className="analitica-kpi-card analitica-kpi-indigo">
              <div className="analitica-kpi-icon"><FiCalendar size={22} /></div>
              <span className="analitica-kpi-label">Visitas 7 días</span>
              <span className="analitica-kpi-value">{formatNumero(resumen?.visitas_7d ?? 0)}</span>
              <span className="analitica-kpi-sub">última semana</span>
            </div>
            <div className="analitica-kpi-card analitica-kpi-green">
              <div className="analitica-kpi-icon"><FiUsers size={22} /></div>
              <span className="analitica-kpi-label">Visitantes Únicos</span>
              <span className="analitica-kpi-value">{formatNumero(resumen?.visitantes_unicos ?? 0)}</span>
              <span className="analitica-kpi-sub">en el período</span>
            </div>
            <div className="analitica-kpi-card analitica-kpi-orange">
              <div className="analitica-kpi-icon"><FiActivity size={22} /></div>
              <span className="analitica-kpi-label">Bounce Rate</span>
              <span className="analitica-kpi-value">{resumen?.bounce_rate ?? 0}%</span>
              <span className="analitica-kpi-sub">sesiones de 1 página</span>
            </div>
            <div className="analitica-kpi-card analitica-kpi-purple">
              <div className="analitica-kpi-icon"><FiClock size={22} /></div>
              <span className="analitica-kpi-label">Duración Promedio</span>
              <span className="analitica-kpi-value">{formatSegundos(resumen?.duracion_promedio ?? 0)}</span>
              <span className="analitica-kpi-sub">por sesión</span>
            </div>
            <div className="analitica-kpi-card analitica-kpi-cyan">
              <div className="analitica-kpi-icon"><FiTrendingUp size={22} /></div>
              <span className="analitica-kpi-label">Total Visitas</span>
              <span className="analitica-kpi-value">{formatNumero(resumen?.total_visitas ?? 0)}</span>
              <span className="analitica-kpi-sub">histórico</span>
            </div>
          </section>

          {/* Blog Stats */}
          {blogStats && (
            <section className="analitica-section analitica-module-stats">
              <h2><FiFileText size={18} /> Blog — Resumen</h2>
              <div className="analitica-kpi-grid">
                <div className="analitica-kpi-card analitica-kpi-blue">
                  <div className="analitica-kpi-icon"><FiFileText size={20} /></div>
                  <span className="analitica-kpi-label">Total Posts</span>
                  <span className="analitica-kpi-value">{blogStats.total_posts}</span>
                </div>
                <div className="analitica-kpi-card analitica-kpi-green">
                  <div className="analitica-kpi-icon"><FiTrendingUp size={20} /></div>
                  <span className="analitica-kpi-label">Publicados</span>
                  <span className="analitica-kpi-value">{blogStats.publicados}</span>
                </div>
                <div className="analitica-kpi-card analitica-kpi-orange">
                  <div className="analitica-kpi-icon"><FiClock size={20} /></div>
                  <span className="analitica-kpi-label">Borradores</span>
                  <span className="analitica-kpi-value">{blogStats.borradores}</span>
                </div>
              </div>
            </section>
          )}

          {/* Tienda Stats */}
          {tiendaStats && (
            <section className="analitica-section analitica-module-stats">
              <h2><FiPackage size={18} /> Tienda — Resumen</h2>
              <div className="analitica-kpi-grid">
                <div className="analitica-kpi-card analitica-kpi-purple">
                  <div className="analitica-kpi-icon"><FiPackage size={20} /></div>
                  <span className="analitica-kpi-label">Total Productos</span>
                  <span className="analitica-kpi-value">{tiendaStats.total_productos}</span>
                </div>
                <div className="analitica-kpi-card analitica-kpi-indigo">
                  <div className="analitica-kpi-icon"><FiBarChart2 size={20} /></div>
                  <span className="analitica-kpi-label">Total Pedidos</span>
                  <span className="analitica-kpi-value">{tiendaStats.total_pedidos}</span>
                </div>
                <div className="analitica-kpi-card analitica-kpi-cyan">
                  <div className="analitica-kpi-icon"><FiTrendingUp size={20} /></div>
                  <span className="analitica-kpi-label">Ingresos Totales</span>
                  <span className="analitica-kpi-value">${formatNumero(tiendaStats.ingresos_totales)}</span>
                </div>
              </div>
            </section>
          )}

          <section className="analitica-chart-section">
            <h2>Visitas por día</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visitasPorDia}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="fecha" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                />
                <Bar dataKey="visitas" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </section>

          <div className="analitica-grid-2col">
            <section className="analitica-section">
              <h2>Páginas más visitadas</h2>
              {topPaginas.length === 0 ? (
                <div className="analitica-empty-small">Sin datos</div>
              ) : (
                <div className="analitica-top-paginas">
                  {topPaginas.map((pag, i) => (
                    <div key={pag.url} className="analitica-top-item">
                      <span className="analitica-top-pos">#{i + 1}</span>
                      <span className="analitica-top-dot" style={{ background: COLORS[i % COLORS.length] }} />
                      <div className="analitica-top-info">
                        <span className="analitica-top-url" title={pag.url}>{mostrarRuta(pag)}</span>
                        <div className="analitica-top-bar">
                          <div className="analitica-top-bar-fill" style={{ width: `${pag.porcentaje}%`, background: COLORS[i % COLORS.length] }} />
                        </div>
                      </div>
                      <span className="analitica-top-count">{pag.visitas}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="analitica-section">
              <h2>Distribución de páginas</h2>
              {topPaginas.length === 0 ? (
                <div className="analitica-empty-small">Sin datos</div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={topPaginas.map((p) => ({ name: mostrarRuta(p), value: p.visitas }))}
                      cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {topPaginas.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </section>
          </div>

          <section className="analitica-section">
            <h2>Navegadores y Dispositivos</h2>
            <div className="analitica-pie-grid">
              <div>
                {navegadoresData.length === 0 ? (
                  <div className="analitica-empty-small">Sin datos</div>
                ) : (
                  <div className="analitica-top-paginas">
                    <span className="analitica-kpi-label">Navegadores</span>
                    {navegadoresData.map((d, i) => (
                      <div key={d.name} className="analitica-top-item analitica-top-item-num">
                        <span className="analitica-top-dot" style={{ background: COLORS[i % COLORS.length] }} />
                        <div className="analitica-top-info">
                          <span className="analitica-top-url">{d.name}</span>
                          <div className="analitica-top-bar">
                            <div className="analitica-top-bar-fill" style={{ width: `${totalNavegadores > 0 ? (d.value / totalNavegadores) * 100 : 0}%`, background: COLORS[i % COLORS.length] }} />
                          </div>
                        </div>
                        <span className="analitica-top-count">{d.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                {dispositivosData.length === 0 ? (
                  <div className="analitica-empty-small">Sin datos</div>
                ) : (
                  <div className="analitica-top-paginas">
                    <span className="analitica-kpi-label">Dispositivos</span>
                    {dispositivosData.map((d, i) => (
                      <div key={d.name} className="analitica-top-item analitica-top-item-num">
                        <span className="analitica-top-dot" style={{ background: COLORS[i % COLORS.length] }} />
                        <div className="analitica-top-info">
                          <span className="analitica-top-url">{d.name}</span>
                          <div className="analitica-top-bar">
                            <div className="analitica-top-bar-fill" style={{ width: `${totalDispositivos > 0 ? (d.value / totalDispositivos) * 100 : 0}%`, background: COLORS[i % COLORS.length] }} />
                          </div>
                        </div>
                        <span className="analitica-top-count">{d.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="analitica-pie-grid" style={{ marginTop: 16 }}>
              <div>
                {navegadoresData.length === 0 ? (
                  <div className="analitica-empty-small">Sin datos</div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={navegadoresData}
                        cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                        dataKey="value"
label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        >
                          {navegadoresData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div>
                {dispositivosData.length === 0 ? (
                  <div className="analitica-empty-small">Sin datos</div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={dispositivosData}
                        cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                        dataKey="value"
label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        >
                          {dispositivosData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </section>

          <div className="analitica-grid-2col">
            <section className="analitica-section">
              <h2>Últimas visitas</h2>
              {ultimasVisitas.length === 0 ? (
                <div className="analitica-empty-small">Sin visitas registradas</div>
              ) : (
                <div className="analitica-table-container">
                  <table className="analitica-table">
                    <thead>
                      <tr>
                        <th>Página</th>
                        <th>Navegador</th>
                        <th>Dispositivo</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ultimasVisitas.map((v) => (
                        <tr key={v.id}>
                          <td title={v.url}>{mostrarRuta({ titulo_pagina: v.titulo_pagina, url: v.url })}</td>
                          <td>{v.navegador || "—"}</td>
                          <td>{v.dispositivo || "—"}</td>
                          <td>{new Date(v.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="analitica-section">
              <h2>Eventos recientes</h2>
              {eventosRecientes.length === 0 ? (
                <div className="analitica-empty-small">Sin eventos registrados</div>
              ) : (
                <div className="analitica-eventos-list">
                  {eventosRecientes.map((ev) => (
                    <div key={ev.id} className="analitica-evento-item">
                      <div className="analitica-evento-icon">
                        <span className={`analitica-evento-dot analitica-evento-dot-${ev.tipo}`} />
                      </div>
                      <div className="analitica-evento-info">
                        <span className="analitica-evento-tipo">{ev.tipo}</span>
                        {ev.etiqueta && <span className="analitica-evento-etiqueta">{ev.etiqueta}</span>}
                      </div>
                      <span className="analitica-evento-fecha">
                        {new Date(ev.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
