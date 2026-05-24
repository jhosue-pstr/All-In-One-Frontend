const API_BASE = '/api';

function getToken(): string | null {
  try {
    return localStorage.getItem('site_token');
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem('site_token', token);
  } catch {
    // localStorage no disponible
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem('site_token');
  } catch {
    // localStorage no disponible
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Error en la solicitud' }));
    throw new Error(error.detail || 'Error en la solicitud');
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
