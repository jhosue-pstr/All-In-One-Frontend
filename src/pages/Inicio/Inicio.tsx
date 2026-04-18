import { Link } from 'react-router-dom';
import { HiOutlineGlobe, HiOutlineTemplate, HiOutlineCube, HiOutlineLightBulb, HiOutlineRefresh, HiOutlineUserGroup, HiOutlineDeviceMobile } from 'react-icons/hi';
import './Inicio.css';

export function Inicio() {
  return (
    <div className="inicio-container">
      <header className="inicio-header">
        <h1>Bienvenido a All in One</h1>
        <p className="inicio-subtitle">Tu plataforma integral de gestión</p>
      </header>

      <section className="guide-section">
        <h2>¿Cómo usar la plataforma?</h2>
        
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Crea un Sitio</h3>
            <p>
              Comienza creando tu primer sitio desde la sección "Sitios". 
              Cada sitio puede tener su propia configuración y plantilla.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Selecciona una Plantilla</h3>
            <p>
              Elige una plantilla para tu sitio en la sección "Plantillas". 
              Las plantillas definen la apariencia y estructura de tu sitio.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Activa Módulos</h3>
            <p>
              Los módulos добавляют funcionalidad a tu sitio. 
              Explora la sección "Módulos" y activa los que necesites.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Configura tu Sitio</h3>
            <p>
              Personaliza cada aspecto de tu sitio desde "Configuraciones". 
              Ajusta opciones, permisos y más.
            </p>
          </div>
        </div>
      </section>

      <section className="tips-section">
        <h2>Consejos Rápidos</h2>
        <ul className="tips-list">
          <li>
            <HiOutlineLightBulb className="tip-icon" />
            <span>Puedes tener múltiples sitios activos al mismo tiempo</span>
          </li>
          <li>
            <HiOutlineRefresh className="tip-icon" />
            <span>Los cambios en configuración se aplican en tiempo real</span>
          </li>
          <li>
            <HiOutlineUserGroup className="tip-icon" />
            <span>Gestiona diferentes roles de usuario para tu equipo</span>
          </li>
          <li>
            <HiOutlineDeviceMobile className="tip-icon" />
            <span>Tus sitios son responsive y se adaptan a cualquier dispositivo</span>
          </li>
        </ul>
      </section>

      <section className="getting-started">
        <h2>Para empezar</h2>
        <div className="quick-actions">
          <Link to="/sitios" className="action-btn">
            <HiOutlineGlobe className="action-icon" />
            <span>Crear mi primer sitio</span>
          </Link>
          <Link to="/plantillas" className="action-btn">
            <HiOutlineTemplate className="action-icon" />
            <span>Ver plantillas disponibles</span>
          </Link>
          <Link to="/modulos" className="action-btn">
            <HiOutlineCube className="action-icon" />
            <span>Explorar módulos</span>
          </Link>
        </div>
      </section>
    </div>
  );
}