import { Link, useLocation } from 'react-router-dom';
import { HiOutlineHome, HiOutlineGlobe, HiOutlineTemplate, HiOutlineCube, HiOutlineCog, HiOutlineLogout } from 'react-icons/hi';
import { USER_IMAGE_KEY } from '../../models';
import type { User } from '../../models';
import './Sidebar.css';

interface SidebarProps {
  user: User | null;
}

const menuItems = [
  { path: '/inicio', label: 'Inicio', icon: HiOutlineHome },
  { path: '/sitios', label: 'Sitios', icon: HiOutlineGlobe },
  { path: '/plantillas', label: 'Plantillas', icon: HiOutlineTemplate },
  { path: '/modulos', label: 'Módulos', icon: HiOutlineCube },
  { path: '/configuraciones', label: 'Configuraciones', icon: HiOutlineCog },
];

export function Sidebar({ user }: SidebarProps) {
  const location = useLocation();
  const userImage = localStorage.getItem(USER_IMAGE_KEY);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem(USER_IMAGE_KEY);
    window.location.href = '/';
  };

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

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <item.icon className="nav-icon" />
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <hr className="sidebar-divider" />

      <button className="logout-btn" onClick={handleLogout}>
        <HiOutlineLogout className="nav-icon" />
        <span className="nav-label">Salir</span>
      </button>
    </aside>
  );
}