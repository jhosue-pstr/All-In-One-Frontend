export interface StoreCategoria {
  id: number;
  parent_id: number | null;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen: string | null;
  orden: number;
  activa: boolean;
  created_at: string;
  updated_at: string;
}

export interface StoreCategoriaCreate {
  nombre: string;
  slug?: string;
  descripcion?: string;
  imagen?: string;
  orden?: number;
  activa?: boolean;
  parent_id?: number;
}

export interface StoreCategoriaUpdate {
  nombre?: string;
  slug?: string;
  descripcion?: string;
  imagen?: string;
  orden?: number;
  activa?: boolean;
  parent_id?: number;
}

export interface StoreCategoriaSimple {
  id: number;
  nombre: string;
  slug: string;
}

export interface StoreProducto {
  id: number;
  categoria_id: number | null;
  nombre: string;
  slug: string;
  descripcion: string | null;
  sku: string | null;
  precio: number;
  precio_comparacion: number | null;
  costo: number | null;
  stock: number;
  stock_minimo: number;
  controlar_alertas: boolean;
  imagenes: unknown[];
  peso: number | null;
  dimensiones: Record<string, unknown> | null;
  es_activo: boolean;
  es_featured: boolean;
  created_at: string;
  updated_at: string;
  categoria: StoreCategoriaSimple | null;
}

export interface StoreProductoCreate {
  nombre: string;
  slug?: string;
  descripcion?: string;
  sku?: string;
  precio: number;
  precio_comparacion?: number;
  costo?: number;
  stock?: number;
  stock_minimo?: number;
  controlar_alertas?: boolean;
  imagenes?: unknown[];
  peso?: number;
  dimensiones?: Record<string, unknown>;
  es_activo?: boolean;
  es_featured?: boolean;
  categoria_id?: number;
}

export interface StoreProductoUpdate {
  nombre?: string;
  slug?: string;
  descripcion?: string;
  sku?: string;
  precio?: number;
  precio_comparacion?: number;
  costo?: number;
  stock?: number;
  stock_minimo?: number;
  controlar_alertas?: boolean;
  imagenes?: unknown[];
  peso?: number;
  dimensiones?: Record<string, unknown>;
  es_activo?: boolean;
  es_featured?: boolean;
  categoria_id?: number;
}

export interface StoreProductoListado {
  id: number;
  nombre: string;
  slug: string;
  precio: number;
  precio_comparacion: number | null;
  stock: number;
  imagenes: unknown[];
  es_activo: boolean;
  es_featured: boolean;
  created_at: string;
}

export interface ItemPedido {
  id: number;
  producto_id: number;
  nombre_producto: string;
  sku_producto: string | null;
  cantidad: number;
  precio_unitario: number;
  total: number;
}

export interface StorePedido {
  id: number;
  site_id: number;
  usuario_id: number | null;
  numero_pedido: string;
  estado: string;
  estado_pago: string;
  subtotal: number;
  impuesto: number;
  descuento: number;
  envio: number;
  total: number;
  nombre_cliente: string;
  email_cliente: string;
  telefono_cliente: string | null;
  direccion_envio: string | null;
  ciudad_envio: string | null;
  pais_envio: string | null;
  codigo_postal: string | null;
  metodo_pago: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
  items: ItemPedido[];
}

export interface StorePedidoListado {
  id: number;
  numero_pedido: string;
  estado: string;
  estado_pago: string;
  nombre_cliente: string;
  email_cliente: string;
  total: number;
  created_at: string;
}

export interface PedidoUpdateEstado {
  estado: string;
}

export interface CarritoItem {
  id: number;
  producto_id: number;
  cantidad: number;
  producto: StoreProductoListado;
}

export interface StoreCarrito {
  id: number;
  site_id: number;
  items: CarritoItem[];
  total: number;
}

export interface AddToCarritoRequest {
  producto_id: number;
  cantidad?: number;
  usuario_id?: number;
}

export interface CheckoutRequest {
  nombre_cliente: string;
  email_cliente: string;
  telefono_cliente?: string;
  direccion_envio?: string;
  ciudad_envio?: string;
  pais_envio?: string;
  codigo_postal?: string;
  metodo_pago?: string;
  notas?: string;
  usuario_id?: number;
}

export interface CheckoutResponse {
  pedido: StorePedido;
  mensaje: string;
}

export interface ApiPaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    pagina: number;
    por_pagina: number;
    total_paginas: number;
  };
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
}
