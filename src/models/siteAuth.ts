export interface UsuarioSitioBase {
  correo: string;
  nombre: string;
  apellido: string;
  id_sitio: number;
}

export interface UsuarioSitioCreate extends UsuarioSitioBase {
  contrasena: string;
}

export interface UsuarioSitioUpdate {
  nombre?: string;
  apellido?: string;
  contrasena?: string;
}

export interface UsuarioSitioLogin {
  correo: string;
  contrasena: string;
  id_sitio: number;
}

export interface UsuarioSitioResponse extends UsuarioSitioBase {
  id: number;
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
