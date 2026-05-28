export interface UsuarioSitioBase {
  correo: string;
  nombre: string;
  apellido: string;
  id_sitio: number;
  telefono?: string | null;
  direccion_envio?: string | null;
  ciudad?: string | null;
  pais?: string | null;
  codigo_postal?: string | null;
}

export interface UsuarioSitioCreate extends UsuarioSitioBase {
  contrasena: string;
}

export interface UsuarioSitioUpdate {
  nombre?: string;
  apellido?: string;
  contrasena?: string;
  telefono?: string | null;
  direccion_envio?: string | null;
  ciudad?: string | null;
  pais?: string | null;
  codigo_postal?: string | null;
}

export interface UsuarioSitioLogin {
  correo: string;
  contrasena: string;
  id_sitio: number;
}

export interface UsuarioSitioResponse extends UsuarioSitioBase {
  id: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteTokenResponse {
  access_token: string;
  token_type: string;
}

export interface TokenVerifyResponse {
  valid: boolean;
  usuario_id: number;
  id_sitio: number;
}
