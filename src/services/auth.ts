import type { TokenResponse, User, UserCreate, UserLogin } from '../models';
import { getApiUrl } from '../config';

const API_URL = getApiUrl();

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Error desconocido' }));
    throw new Error(error.detail || 'Error en la solicitud');
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const authService = {
  async register(data: UserCreate): Promise<User> {
    return fetchApi<User>('/auth/registro', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async login(data: UserLogin): Promise<TokenResponse> {
    const formData = new URLSearchParams();
    formData.append('username', data.correo);
    formData.append('password', data.contrasena);

    const response = await fetch(`${API_URL}/auth/inicio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Credenciales incorrectas' }));
      throw new Error(error.detail || 'Error en el inicio de sesión');
    }

    const tokenData: TokenResponse = await response.json();
    localStorage.setItem('token', tokenData.access_token);
    return tokenData;
  },

  async me(): Promise<User> {
    return fetchApi<User>('/auth/me');
  },

  logout(): void {
    localStorage.removeItem('token');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },
};