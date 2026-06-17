export interface Visita {
  id: number;
  site_id: number;
  url: string;
  titulo_pagina: string | null;
  ip: string | null;
  user_agent: string | null;
  referer: string | null;
  session_id: string | null;
  navegador: string | null;
  dispositivo: string | null;
  pais: string | null;
  created_at: string;
}

export interface VisitaCreate {
  url: string;
  titulo_pagina?: string;
  referer?: string;
  session_id?: string;
}

export interface EventoAnalitica {
  id: number;
  site_id: number;
  tipo: string;
  etiqueta: string | null;
  valor: string | null;
  metadata_json: unknown;
  url: string | null;
  session_id: string | null;
  created_at: string;
}

export interface EventoCreate {
  tipo: string;
  etiqueta?: string;
  valor?: string;
  metadata_json?: unknown;
  url?: string;
  session_id?: string;
}

export interface ResumenAnalitica {
  visitas_hoy: number;
  visitas_7d: number;
  visitas_30d: number;
  visitantes_unicos: number;
  bounce_rate: number;
  duracion_promedio: number;
  total_visitas: number;
  total_eventos: number;
}

export interface TopPagina {
  url: string;
  titulo_pagina: string | null;
  visitas: number;
  porcentaje: number;
}

export interface VisitaPorDia {
  fecha: string;
  visitas: number;
}

export interface PostResumen {
  id: number;
  titulo: string;
  slug: string;
  estado: string;
  created_at: string;
  categoria: string | null;
}

export interface CategoriaPostCount {
  nombre: string;
  total: number;
}

export interface BlogStats {
  total_posts: number;
  publicados: number;
  borradores: number;
  posts_por_categoria: CategoriaPostCount[];
  ultimos_posts: PostResumen[];
}

export interface ProductoVendido {
  nombre: string;
  cantidad: number;
  total: number;
}

export interface TiendaStats {
  total_productos: number;
  total_pedidos: number;
  ingresos_totales: number;
  pedidos_por_estado: Record<string, number>;
  productos_mas_vendidos: ProductoVendido[];
}

export interface DashboardResponse {
  resumen: ResumenAnalitica;
  visitas_por_dia: VisitaPorDia[];
  top_paginas: TopPagina[];
  navegadores: Record<string, number>;
  dispositivos: Record<string, number>;
  ultimas_visitas: Visita[];
  eventos_recientes: EventoAnalitica[];
  blog: BlogStats | null;
  tienda: TiendaStats | null;
}
