export interface User {
  id: number;
  correo: string;
  nombre: string;
  apellido: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  correo: string;
  contrasena: string;
  nombre: string;
  apellido: string;
}

export interface UserUpdate {
  nombre?: string;
  apellido?: string;
  contrasena?: string;
}

export interface UserLogin {
  correo: string;
  contrasena: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const USER_IMAGE_KEY = 'user_image';