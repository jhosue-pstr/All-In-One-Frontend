export interface Modulo {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  tipo: string;
  configuracion_base: Record<string, unknown> | null;
  activo: boolean;
}

export interface ModuloCreate {
  nombre: string;
  slug: string;
  descripcion?: string;
  tipo: string;
  configuracion_base?: Record<string, unknown>;
  activo?: boolean;
}

export interface ModuloUpdate {
  nombre?: string;
  slug?: string;
  descripcion?: string;
  tipo?: string;
  configuracion_base?: Record<string, unknown>;
  activo?: boolean;
}