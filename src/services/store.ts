import type {
  StoreCategoria,
  StoreCategoriaCreate,
  StoreCategoriaUpdate,
  StoreProducto,
  StoreProductoCreate,
  StoreProductoUpdate,
  StoreProductoListado,
  StorePedido,
  StorePedidoListado,
  PedidoUpdateEstado,
  StoreCarrito,
  CarritoItem,
  AddToCarritoRequest,
  CheckoutRequest,
  CheckoutResponse,
  ApiPaginatedResponse,
  ApiListResponse,
} from '../models/store';
import { fetchApi } from './api';

const base = (sitioId: number) => `/v1/sitios/${sitioId}/tienda`;

export const storeService = {
  // ============ PRODUCTOS ============

  async getProducts(
    sitioId: number,
    params?: {
      categoria_id?: number;
      pagina?: number;
      por_pagina?: number;
      solo_activos?: boolean;
      featured?: boolean;
    }
  ): Promise<ApiPaginatedResponse<StoreProductoListado>> {
    const query = new URLSearchParams();
    if (params?.categoria_id) query.set('categoria_id', String(params.categoria_id));
    if (params?.pagina) query.set('pagina', String(params.pagina));
    if (params?.por_pagina) query.set('por_pagina', String(params.por_pagina));
    if (params?.solo_activos !== undefined) query.set('solo_activos', String(params.solo_activos));
    if (params?.featured) query.set('featured', 'true');

    const qs = query.toString();
    return fetchApi<ApiPaginatedResponse<StoreProductoListado>>(
      `${base(sitioId)}/productos${qs ? `?${qs}` : ''}`
    );
  },

  async getProduct(
    sitioId: number,
    productoId: number
  ): Promise<StoreProducto> {
    return fetchApi<StoreProducto>(
      `${base(sitioId)}/productos/${productoId}`
    );
  },

  async createProduct(
    sitioId: number,
    data: StoreProductoCreate
  ): Promise<StoreProducto> {
    return fetchApi<StoreProducto>(`${base(sitioId)}/productos`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProduct(
    sitioId: number,
    productoId: number,
    data: StoreProductoUpdate
  ): Promise<StoreProducto> {
    return fetchApi<StoreProducto>(
      `${base(sitioId)}/productos/${productoId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  },

  async deleteProduct(sitioId: number, productoId: number): Promise<void> {
    return fetchApi<void>(`${base(sitioId)}/productos/${productoId}`, {
      method: 'DELETE',
    });
  },

  // ============ CATEGORÍAS ============

  async getCategorias(
    sitioId: number,
    soloActivas = true
  ): Promise<ApiListResponse<StoreCategoria>> {
    const qs = soloActivas ? '?solo_activas=true' : '';
    return fetchApi<ApiListResponse<StoreCategoria>>(
      `${base(sitioId)}/categorias${qs}`
    );
  },

  async getCategoria(
    sitioId: number,
    categoriaId: number
  ): Promise<StoreCategoria> {
    return fetchApi<StoreCategoria>(
      `${base(sitioId)}/categorias/${categoriaId}`
    );
  },

  async createCategoria(
    sitioId: number,
    data: StoreCategoriaCreate
  ): Promise<StoreCategoria> {
    return fetchApi<StoreCategoria>(`${base(sitioId)}/categorias`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCategoria(
    sitioId: number,
    categoriaId: number,
    data: StoreCategoriaUpdate
  ): Promise<StoreCategoria> {
    return fetchApi<StoreCategoria>(
      `${base(sitioId)}/categorias/${categoriaId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  },

  async deleteCategoria(
    sitioId: number,
    categoriaId: number
  ): Promise<void> {
    return fetchApi<void>(
      `${base(sitioId)}/categorias/${categoriaId}`,
      { method: 'DELETE' }
    );
  },

  // ============ PEDIDOS ============

  async getPedidos(
    sitioId: number,
    params?: { estado?: string; pagina?: number; por_pagina?: number }
  ): Promise<ApiPaginatedResponse<StorePedidoListado>> {
    const query = new URLSearchParams();
    if (params?.estado) query.set('estado', params.estado);
    if (params?.pagina) query.set('pagina', String(params.pagina));
    if (params?.por_pagina) query.set('por_pagina', String(params.por_pagina));

    const qs = query.toString();
    return fetchApi<ApiPaginatedResponse<StorePedidoListado>>(
      `${base(sitioId)}/pedidos${qs ? `?${qs}` : ''}`
    );
  },

  async getPedido(sitioId: number, pedidoId: number): Promise<StorePedido> {
    return fetchApi<StorePedido>(`${base(sitioId)}/pedidos/${pedidoId}`);
  },

  async updatePedidoEstado(
    sitioId: number,
    pedidoId: number,
    data: PedidoUpdateEstado
  ): Promise<StorePedido> {
    return fetchApi<StorePedido>(
      `${base(sitioId)}/pedidos/${pedidoId}/estado`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  },

  // ============ CARRITO ============

  async getCarrito(
    sitioId: number,
    usuarioId?: number
  ): Promise<StoreCarrito> {
    const qs = usuarioId ? `?usuario_id=${usuarioId}` : '';
    return fetchApi<StoreCarrito>(`${base(sitioId)}/carrito${qs}`);
  },

  async addToCarrito(
    sitioId: number,
    data: AddToCarritoRequest
  ): Promise<CarritoItem> {
    return fetchApi<CarritoItem>(`${base(sitioId)}/carrito/items`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCarritoItem(
    sitioId: number,
    itemId: number,
    cantidad: number
  ): Promise<CarritoItem> {
    return fetchApi<CarritoItem>(
      `${base(sitioId)}/carrito/items/${itemId}?cantidad=${cantidad}`,
      { method: 'PUT' }
    );
  },

  async removeFromCarrito(
    sitioId: number,
    itemId: number
  ): Promise<void> {
    return fetchApi<void>(
      `${base(sitioId)}/carrito/items/${itemId}`,
      { method: 'DELETE' }
    );
  },

  // ============ CHECKOUT ============

  async checkout(
    sitioId: number,
    data: CheckoutRequest
  ): Promise<CheckoutResponse> {
    return fetchApi<CheckoutResponse>(`${base(sitioId)}/checkout`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
