export type Visibilidad = 'PUBLICA' | 'PRIVADA';

export interface Plantilla {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  configuracion: Record<string, unknown> | null;
  miniatura: string | null;
  activo: boolean;
  visibilidad: Visibilidad;
  id_usuario: number | null;
  created_at: string;
  updated_at: string;
}

export interface PlantillaCreate {
  nombre: string;
  slug: string;
  descripcion?: string;
  configuracion?: Record<string, unknown>;
  miniatura?: string;
  activo?: boolean;
  visibilidad?: Visibilidad;
}

export interface PlantillaUpdate {
  nombre?: string;
  slug?: string;
  descripcion?: string;
  configuracion?: Record<string, unknown>;
  miniatura?: string;
  activo?: boolean;
  visibilidad?: Visibilidad;
}