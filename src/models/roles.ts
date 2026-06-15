export interface Permiso {
  id: number;
  nombre: string;
  codigo: string;
  modulo: string;
  descripcion?: string;
  activo: boolean;
}

export interface Rol {
  id: number;
  nombre: string;
  codigo: string;
  descripcion?: string;
  activo: boolean;
  es_sistema: boolean;
  permisos: string[];
}

export interface RolCreate {
  nombre: string;
  codigo: string;
  descripcion?: string;
  permisos: string[];
}

export interface RolUpdate {
  nombre?: string;
  descripcion?: string;
  activo?: boolean;
  permisos?: string[];
}

export interface UsuarioSistema {
  id: number;
  correo: string;
  nombre: string;
  apellido: string;
  role: string;
  activo: boolean;
}

export interface UsuarioSistemaCreate {
  correo: string;
  contrasena: string;
  nombre: string;
  apellido: string;
  role: string;
}

export interface MisPermisosResponse {
  usuario_id: number;
  correo: string;
  role: string;
  permisos: string[];
}