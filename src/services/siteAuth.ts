import type {
  UsuarioSitioCreate,
  UsuarioSitioUpdate,
  UsuarioSitioLogin,
  UsuarioSitioResponse,
  SiteTokenResponse,
  TokenVerifyResponse,
} from '../models/siteAuth';
import { fetchApi } from './api';

export const siteAuthService = {
  async register(data: UsuarioSitioCreate): Promise<UsuarioSitioResponse> {
    return fetchApi<UsuarioSitioResponse>('/site-auth/registro', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async login(data: UsuarioSitioLogin): Promise<SiteTokenResponse> {
    return fetchApi<SiteTokenResponse>('/site-auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async logout(): Promise<void> {
    return fetchApi<void>('/site-auth/logout', {
      method: 'POST',
    });
  },

  async me(): Promise<UsuarioSitioResponse> {
    return fetchApi<UsuarioSitioResponse>('/site-auth/me');
  },

  async update(data: UsuarioSitioUpdate): Promise<UsuarioSitioResponse> {
    return fetchApi<UsuarioSitioResponse>('/site-auth/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async verify(token: string): Promise<TokenVerifyResponse> {
    return fetchApi<TokenVerifyResponse>(
      `/site-auth/verify?token=${encodeURIComponent(token)}`
    );
  },

  async listBySite(siteId: number): Promise<UsuarioSitioResponse[]> {
    return fetchApi<UsuarioSitioResponse[]>(
      `/site-auth/usuarios?site_id=${siteId}`
    );
  },
};
