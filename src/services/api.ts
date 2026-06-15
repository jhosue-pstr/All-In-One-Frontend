import { getApiUrl } from '../config';

export const API_URL = getApiUrl();

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');

  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: 'Error desconocido' }));

    const message =
      error?.detail ||
      error?.message ||
      'Error en la solicitud';

    if (response.status === 403) {
      alert(`No tienes permisos para realizar esta acción.\n\nDetalle: ${message}`);
    } else if (response.status === 401) {
      alert('Tu sesión expiró o no estás autenticado. Vuelve a iniciar sesión.');
      localStorage.removeItem('token');
      globalThis.location.href = '/';
    } else {
      alert(message);
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}