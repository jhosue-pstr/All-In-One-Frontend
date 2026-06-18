import { useEffect, useState } from 'react';
import type { SyntheticEvent } from 'react';
import { FiShield } from 'react-icons/fi';
import { rolesService } from '../../services/roles';

import type {
  Permiso,
  Rol,
  UsuarioSistema,
  UsuarioSistemaCreate,
} from '../../models/roles';

import './RolesPage.css';

export default function RolesPage() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioSistema[]>([]);
  const [loading, setLoading] = useState(true);

  const [nuevoUsuario, setNuevoUsuario] = useState<UsuarioSistemaCreate>({
    correo: '',
    contrasena: '',
    nombre: '',
    apellido: '',
    role: 'editor_sitios',
  });

  async function cargarDatos() {
    try {
      setLoading(true);

      const [rolesData, permisosData, usuariosData] = await Promise.all([
        rolesService.getRoles(),
        rolesService.getPermisos(),
        rolesService.getUsuarios(),
      ]);

      setRoles(rolesData);
      setPermisos(permisosData);
      setUsuarios(usuariosData);
    } catch (error) {
      console.error('Error cargando roles:', error);
      alert('Error cargando roles o usuarios');
    } finally {
      setLoading(false);
    }
  }

  async function crearUsuario(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await rolesService.createUsuario(nuevoUsuario);

      setNuevoUsuario({
        correo: '',
        contrasena: '',
        nombre: '',
        apellido: '',
        role: 'editor_sitios',
      });

      await cargarDatos();
      alert('Usuario creado correctamente');
    } catch (error) {
      console.error('Error creando usuario:', error);
      alert('No se pudo crear el usuario');
    }
  }

  async function desactivarUsuario(userId: number) {
    const confirmar = confirm('¿Seguro que deseas desactivar este usuario?');

    if (!confirmar) return;

    try {
      await rolesService.desactivarUsuario(userId);
      await cargarDatos();
    } catch (error) {
      console.error('Error desactivando usuario:', error);
      alert('No se pudo desactivar el usuario');
    }
  }

  async function activarUsuario(userId: number) {
  try {
    await rolesService.activarUsuario(userId);
    await cargarDatos();
  } catch (error) {
    console.error('Error activando usuario:', error);
    alert('No se pudo activar el usuario');
    }
  }
  useEffect(() => {
    cargarDatos();
  }, []);

  if (loading) {
    return <div className="roles-loading">Cargando roles...</div>;
  }

  return (
    <div className="roles-page">
      <header className="roles-header">
        <div>
          <span className="roles-kicker"><FiShield size={16} /> Roles y Permisos</span>
          <h1>Administración de Roles</h1>
          <p>
            Administra cuentas internas del sistema y define qué rol tendrá cada usuario.
          </p>
        </div>
      </header>

      <section className="roles-section">
        <h2>Crear usuario del sistema</h2>
        <form onSubmit={crearUsuario} className="roles-grid-2col">
          <div className="roles-field">
            <label htmlFor="rol-nombre">Nombre</label>
            <input
              id="rol-nombre"
              placeholder="Nombre"
              value={nuevoUsuario.nombre}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
              required
            />
          </div>

          <div className="roles-field">
            <label htmlFor="rol-apellido">Apellido</label>
            <input
              id="rol-apellido"
              placeholder="Apellido"
              value={nuevoUsuario.apellido}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, apellido: e.target.value })}
              required
            />
          </div>

          <div className="roles-field">
            <label htmlFor="rol-correo">Correo</label>
            <input
              id="rol-correo"
              type="email"
              placeholder="Correo"
              value={nuevoUsuario.correo}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })}
              required
            />
          </div>

          <div className="roles-field">
            <label htmlFor="rol-contrasena">Contraseña</label>
            <input
              id="rol-contrasena"
              type="password"
              placeholder="Contraseña"
              value={nuevoUsuario.contrasena}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, contrasena: e.target.value })}
              required
            />
          </div>

          <div className="roles-field">
            <label htmlFor="rol-role">Rol</label>
            <select
              id="rol-role"
              value={nuevoUsuario.role}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, role: e.target.value })}
            >
              {roles.map((rol) => (
                <option key={rol.id} value={rol.codigo}>
                  {rol.nombre}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="roles-primary-btn">
            Crear usuario
          </button>
        </form>
      </section>

      <section className="roles-section">
        <h2>Usuarios del sistema</h2>
        <div className="roles-table-container">
          <table className="roles-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.nombre} {usuario.apellido}</td>
                  <td>{usuario.correo}</td>
                  <td>{usuario.role}</td>
                  <td>
                    <span className={`roles-badge ${usuario.activo ? 'roles-badge-active' : 'roles-badge-inactive'}`}>
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    {usuario.activo ? (
                      <button
                        className="roles-action-btn roles-action-btn-danger"
                        onClick={() => desactivarUsuario(usuario.id)}
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        className="roles-action-btn roles-action-btn-success"
                        onClick={() => activarUsuario(usuario.id)}
                      >
                        Activar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="roles-grid-2col">
        <section className="roles-section">
          <h2>Roles disponibles</h2>
          <div className="roles-grid-2col" style={{ marginBottom: 0 }}>
            {roles.map((rol) => (
              <div key={rol.id} className="roles-rol-card">
                <h3>{rol.nombre}</h3>
                <p>{rol.descripcion}</p>
                <div className="roles-rol-meta">
                  <span>Código: {rol.codigo}</span>
                  <span>Permisos: {rol.permisos.length}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="roles-section">
          <h2>Permisos registrados</h2>
          <div className="roles-grid-3col">
            {permisos.map((permiso) => (
              <div key={permiso.id} className="roles-permiso-item">
                <strong>{permiso.codigo}</strong>
                <p>{permiso.modulo}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
