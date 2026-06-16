import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { rolesService } from '../../services/roles';

import type {
  Permiso,
  Rol,
  UsuarioSistema,
  UsuarioSistemaCreate,
} from '../../models/roles';

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

  async function crearUsuario(e: FormEvent<HTMLFormElement>) {
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
    return <div className="p-6">Cargando roles...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Roles y permisos</h1>
        <p className="text-gray-600">
          Administra cuentas internas del sistema y define qué rol tendrá cada usuario.
        </p>
      </div>

      <section className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Crear usuario del sistema</h2>

        <form onSubmit={crearUsuario} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border rounded px-3 py-2"
            placeholder="Nombre"
            value={nuevoUsuario.nombre}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
            required
          />

          <input
            className="border rounded px-3 py-2"
            placeholder="Apellido"
            value={nuevoUsuario.apellido}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, apellido: e.target.value })}
            required
          />

          <input
            className="border rounded px-3 py-2"
            type="email"
            placeholder="Correo"
            value={nuevoUsuario.correo}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })}
            required
          />

          <input
            className="border rounded px-3 py-2"
            type="password"
            placeholder="Contraseña"
            value={nuevoUsuario.contrasena}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, contrasena: e.target.value })}
            required
          />

          <select
            className="border rounded px-3 py-2"
            value={nuevoUsuario.role}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, role: e.target.value })}
          >
            {roles.map((rol) => (
              <option key={rol.id} value={rol.codigo}>
                {rol.nombre}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2"
          >
            Crear usuario
          </button>
        </form>
      </section>

      <section className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Usuarios del sistema</h2>

        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2 text-left">Nombre</th>
                <th className="border px-3 py-2 text-left">Correo</th>
                <th className="border px-3 py-2 text-left">Rol</th>
                <th className="border px-3 py-2 text-left">Estado</th>
                <th className="border px-3 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td className="border px-3 py-2">
                    {usuario.nombre} {usuario.apellido}
                  </td>
                  <td className="border px-3 py-2">{usuario.correo}</td>
                  <td className="border px-3 py-2">{usuario.role}</td>
                  <td className="border px-3 py-2">
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                  </td>
                  <td className="border px-3 py-2">
                    {usuario.activo ? (
                      <button
                        className="text-red-600"
                        onClick={() => desactivarUsuario(usuario.id)}
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        className="text-green-600"
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

      <section className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Roles disponibles</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((rol) => (
            <div key={rol.id} className="border rounded p-4">
              <h3 className="font-bold">{rol.nombre}</h3>
              <p className="text-sm text-gray-600">{rol.descripcion}</p>
              <p className="text-xs text-gray-500 mt-2">
                Código: {rol.codigo}
              </p>
              <p className="text-xs text-gray-500">
                Permisos: {rol.permisos.length}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Permisos registrados</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {permisos.map((permiso) => (
            <div key={permiso.id} className="border rounded px-3 py-2 text-sm">
              <strong>{permiso.codigo}</strong>
              <p className="text-gray-500">{permiso.modulo}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}