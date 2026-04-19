export interface Sitio {
  id: number;
  nombre: string;
  slug: string;
  id_usuario: number | null;
  id_plantilla: number | null;
  configuracion: Record<string, unknown> | null;
  miniatura: string | null;
  switches: Record<string, boolean> | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface SitioCreate {
  nombre: string;
  slug: string;
  id_usuario?: number;
  id_plantilla?: number;
  configuracion?: Record<string, unknown>;
  miniatura?: string;
  switches?: Record<string, boolean>;
  activo?: boolean;
}

export interface SitioUpdate {
  nombre?: string;
  slug?: string;
  id_usuario?: number;
  id_plantilla?: number;
  configuracion?: Record<string, unknown>;
  miniatura?: string;
  switches?: Record<string, boolean>;
  activo?: boolean;
}