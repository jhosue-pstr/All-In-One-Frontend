import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HiOutlineHome,
  HiOutlineGlobe,
  HiOutlineTemplate,
  HiOutlineCube,
  HiOutlineCog,
  HiOutlineShoppingCart,
  HiOutlineLogout,
  HiOutlineBookOpen,
  HiOutlineShieldCheck,
  HiOutlineChartBar,
} from 'react-icons/hi';
import { USER_IMAGE_KEY } from '../../models';
import type { User } from '../../models';
import { sitioService } from '../../services/sitio';
import { moduloService } from '../../services/modulo';
import { rolesService } from '../../services/roles';
import './Sidebar.css';

interface SidebarProps {
  readonly user: User | null;
}

const baseMenuItems = [
  {
    path: '/inicio',
    label: 'Inicio',
    icon: HiOutlineHome,
    permiso: 'inicio.ver',
    modulo: null,
  },
  {
    path: '/sitios',
    label: 'Sitios',
    icon: HiOutlineGlobe,
    permiso: 'sitios.ver',
    modulo: null,
  },
  {
    path: '/plantillas',
    label: 'Plantillas',
    icon: HiOutlineTemplate,
    permiso: 'plantillas.ver',
    modulo: null,
  },
  {
    path: '/modulos',
    label: 'Módulos',
    icon: HiOutlineCube,
    permiso: 'modulos.ver',
    modulo: null,
  },
  {
    path: '/configuraciones',
    label: 'Configuraciones',
    icon: HiOutlineCog,
    permiso: 'configuraciones.ver',
    modulo: null,
  },
  {
    path: '/roles',
    label: 'Roles',
    icon: HiOutlineShieldCheck,
    permiso: 'roles.ver',
    modulo: null,
  },
  {
    path: '/blog',
    label: 'Blog',
    icon: HiOutlineBookOpen,
    permiso: 'blog.ver',
    modulo: 'blog',
  },
  {
    path: '/tienda',
    label: 'Tienda',
    icon: HiOutlineShoppingCart,
    permiso: 'tienda.ver',
    modulo: 'tienda',
  },
  {
    path: '/analitica',
    label: 'Analítica',
    icon: HiOutlineChartBar,
    permiso: 'analitica.ver',
    modulo: 'analitica',
  },
];

export function Sidebar({ user }: Readonly<SidebarProps>) {
  const location = useLocation();
  const userImage = localStorage.getItem(USER_IMAGE_KEY);

  const [sitioId, setSitioId] = useState<number | null>(null);
  const [sitios, setSitios] = useState<{ id: number; nombre: string }[]>([]);
  const [permisos, setPermisos] = useState<string[]>([]);
  const [modulosHabilitados, setModulosHabilitados] = useState<Set<string>>(new Set());
  const [cargandoPermisos, setCargandoPermisos] = useState(true);

  useEffect(() => {
    rolesService
      .getMisPermisos()
      .then((data) => {
        setPermisos(data.permisos || []);
      })
      .catch((error) => {
        console.error('Error cargando permisos en Sidebar:', error);
        setPermisos([]);
      })
      .finally(() => {
        setCargandoPermisos(false);
      });
  }, []);

  useEffect(() => {
    sitioService
      .getAll()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];

        setSitios(list);

        if (list.length > 0) {
          setSitioId((actual) => actual ?? list[0].id);
        }
      })
      .catch((error) => {
        console.error('Error cargando sitios en Sidebar:', error);
        setSitios([]);
      });
  }, []);

  useEffect(() => {
    if (!sitioId) {
      setModulosHabilitados(new Set());
      return;
    }

    Promise.all([
      sitioService.getModulos(sitioId).catch<number[]>((error) => {
        console.error('Error cargando módulos del sitio:', error);
        return [];
      }),
      moduloService.getAll().catch<any[]>((error) => {
        console.error('Error cargando catálogo de módulos:', error);
        return [];
      }),
    ]).then(([moduloIds, allModulos]) => {
      const idToSlug = new Map(
        allModulos.map((m: { id: number; slug: string }) => [m.id, m.slug])
      );

      const slugs = new Set(
        moduloIds
          .map((id: number) => idToSlug.get(id))
          .filter((slug): slug is string => Boolean(slug))
      );

      setModulosHabilitados(slugs);
    });
  }, [sitioId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem(USER_IMAGE_KEY);
    globalThis.location.href = '/';
  };

  const esSuperAdmin = (user as any)?.role === 'super_admin';

  const visibleItems = baseMenuItems.filter((item) => {
    const tienePermiso = esSuperAdmin || permisos.includes(item.permiso);

    if (!tienePermiso) {
      return false;
    }

    // Menús normales: Inicio, Sitios, Plantillas, Módulos, Configuraciones, Roles
    if (!item.modulo) {
      return true;
    }

    // Menús dependientes del sitio: Blog, Tienda
    // Se muestran solo si el módulo está activado en el sitio seleccionado.
    if (!sitioId) {
      return false;
    }

    return modulosHabilitados.has(item.modulo);
  });

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="user-info">
          <div className="user-avatar">
            {userImage ? (
              <img src={userImage} alt="Avatar" />
            ) : (
              user?.nombre?.charAt(0).toUpperCase() || 'U'
            )}
          </div>

          <div className="user-details">
            <span className="user-name">
              ¡Bienvenido, {user?.nombre || 'Usuario'}!
            </span>
          </div>
        </div>
      </div>

      <hr className="sidebar-divider" />

      <div className="sidebar-site-selector" style={{ padding: '0 16px 12px' }}>
        <select
          value={sitioId ?? ''}
          onChange={(e) => setSitioId(Number(e.target.value) || null)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #ddd',
            fontSize: '13px',
          }}
        >
          <option value="">Seleccionar sitio</option>
          {sitios.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
        </select>
      </div>

      <nav className="sidebar-nav">
        {!cargandoPermisos &&
          visibleItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <item.icon className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
      </nav>

      <hr className="sidebar-divider" />

      <button className="logout-btn" onClick={handleLogout} data-testid="logout-btn">
        <HiOutlineLogout className="nav-icon" />
        <span className="nav-label">Salir</span>
      </button>
    </aside>
  );
}