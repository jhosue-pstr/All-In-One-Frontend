import { fetchApi } from './api';

import type {
  Permiso,
  Rol,
  RolCreate,
  RolUpdate,
  UsuarioSistema,
  UsuarioSistemaCreate,
  MisPermisosResponse,
} from '../models/roles';

export const rolesService = {
  async getMisPermisos(): Promise<MisPermisosResponse> {
    return fetchApi<MisPermisosResponse>('/roles/mis-permisos');
  },

  async getPermisos(): Promise<Permiso[]> {
    return fetchApi<Permiso[]>('/roles/permisos');
  },

  async getRoles(): Promise<Rol[]> {
    return fetchApi<Rol[]>('/roles');
  },

  async createRol(data: RolCreate): Promise<Rol> {
    return fetchApi<Rol>('/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateRol(rolId: number, data: RolUpdate): Promise<Rol> {
    return fetchApi<Rol>(`/roles/${rolId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteRol(rolId: number): Promise<{ mensaje: string }> {
    return fetchApi<{ mensaje: string }>(`/roles/${rolId}`, {
      method: 'DELETE',
    });
  },

  async getUsuarios(): Promise<UsuarioSistema[]> {
    return fetchApi<UsuarioSistema[]>('/roles/usuarios');
  },

  async createUsuario(data: UsuarioSistemaCreate): Promise<UsuarioSistema> {
    return fetchApi<UsuarioSistema>('/roles/usuarios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async cambiarRolUsuario(userId: number, role: string): Promise<UsuarioSistema> {
    return fetchApi<UsuarioSistema>(`/roles/usuarios/${userId}/rol`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },

  async desactivarUsuario(userId: number): Promise<{ mensaje: string }> {
    return fetchApi<{ mensaje: string }>(`/roles/usuarios/${userId}`, {
      method: 'DELETE',
    });
  },

  async activarUsuario(userId: number): Promise<UsuarioSistema> {
  return fetchApi<UsuarioSistema>(`/roles/usuarios/${userId}/activar`, {
    method: 'PUT',
  });
},
};