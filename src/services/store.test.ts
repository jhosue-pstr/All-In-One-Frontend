import { describe, it, expect, vi, beforeEach } from 'vitest'
import { storeService } from './store'

const mockFetchApi = vi.fn()
vi.mock('./api', () => ({
  fetchApi: (...args: any[]) => mockFetchApi(...args),
}))

describe('storeService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Products', () => {
    it('getProducts calls fetchApi with base URL', async () => {
      mockFetchApi.mockResolvedValue({ items: [], total: 0 })
      await storeService.getProducts(1)
      expect(mockFetchApi).toHaveBeenCalledWith('/api/v1/sitios/1/tienda/productos')
    })

    it('getProducts passes query params', async () => {
      mockFetchApi.mockResolvedValue({ items: [], total: 0 })
      await storeService.getProducts(1, { categoria_id: 5, pagina: 2, por_pagina: 10, solo_activos: true, featured: true })
      expect(mockFetchApi).toHaveBeenCalledWith(
        '/api/v1/sitios/1/tienda/productos?categoria_id=5&pagina=2&por_pagina=10&solo_activos=true&featured=true'
      )
    })

    it('getProduct calls fetchApi with id', async () => {
      mockFetchApi.mockResolvedValue({ id: 1 })
      await storeService.getProduct(1, 1)
      expect(mockFetchApi).toHaveBeenCalledWith('/api/v1/sitios/1/tienda/productos/1')
    })

    it('createProduct calls fetchApi with POST', async () => {
      const data = { nombre: 'Producto', precio: 100 }
      mockFetchApi.mockResolvedValue({ id: 1 })
      await storeService.createProduct(1, data as any)
      expect(mockFetchApi).toHaveBeenCalledWith('/api/v1/sitios/1/tienda/productos', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    })

    it('updateProduct calls fetchApi with PUT', async () => {
      const data = { nombre: 'Editado' }
      mockFetchApi.mockResolvedValue({ id: 1 })
      await storeService.updateProduct(1, 1, data as any)
      expect(mockFetchApi).toHaveBeenCalledWith('/api/v1/sitios/1/tienda/productos/1', {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    })

    it('deleteProduct calls fetchApi with DELETE', async () => {
      mockFetchApi.mockResolvedValue(undefined)
      await storeService.deleteProduct(1, 1)
      expect(mockFetchApi).toHaveBeenCalledWith('/api/v1/sitios/1/tienda/productos/1', {
        method: 'DELETE',
      })
    })
  })

  describe('Categories', () => {
    it('getCategorias calls fetchApi with base URL', async () => {
      mockFetchApi.mockResolvedValue({ items: [] })
      await storeService.getCategorias(1)
      expect(mockFetchApi).toHaveBeenCalledWith('/api/v1/sitios/1/tienda/categorias?solo_activas=true')
    })

    it('getCategorias with soloActivas=false omits param', async () => {
      mockFetchApi.mockResolvedValue({ items: [] })
      await storeService.getCategorias(1, false)
      expect(mockFetchApi).toHaveBeenCalledWith('/api/v1/sitios/1/tienda/categorias')
    })

    it('getCategoria calls fetchApi with id', async () => {
      mockFetchApi.mockResolvedValue({ id: 1 })
      await storeService.getCategoria(1, 1)
      expect(mockFetchApi).toHaveBeenCalledWith('/api/v1/sitios/1/tienda/categorias/1')
    })

    it('createCategoria calls fetchApi with POST', async () => {
      const data = { nombre: 'Cat' }
      mockFetchApi.mockResolvedValue({ id: 1 })
      await storeService.createCategoria(1, data as any)
      expect(mockFetchApi).toHaveBeenCalledWith('/api/v1/sitios/1/tienda/categorias', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    })

    it('updateCategoria calls fetchApi with PUT', async () => {
      const data = { nombre: 'Edit' }
      mockFetchApi.mockResolvedValue({ id: 1 })
      await storeService.updateCategoria(1, 1, data as any)
      expect(mockFetchApi).toHaveBeenCalledWith('/api/v1/sitios/1/tienda/categorias/1', {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    })

    it('deleteCategoria calls fetchApi with DELETE', async () => {
      mockFetchApi.mockResolvedValue(undefined)
      await storeService.deleteCategoria(1, 1)
      expect(mockFetchApi).toHaveBeenCalledWith('/api/v1/sitios/1/tienda/categorias/1', {
        method: 'DELETE',
      })
    })
  })

  describe('Orders', () => {
    it('getPedidos calls fetchApi with base URL', async () => {
      mockFetchApi.mockResolvedValue({ items: [], total: 0 })
      await storeService.getPedidos(1)
      expect(mockFetchApi).toHaveBeenCalledWith('/api/v1/sitios/1/tienda/pedidos')
    })

    it('getPedidos passes estado param', async () => {
      mockFetchApi.mockResolvedValue({ items: [], total: 0 })
      await storeService.getPedidos(1, { estado: 'pendiente', pagina: 1, por_pagina: 20 })
      expect(mockFetchApi).toHaveBeenCalledWith(
        '/api/v1/sitios/1/tienda/pedidos?estado=pendiente&pagina=1&por_pagina=20'
      )
    })

    it('getPedido calls fetchApi with id', async () => {
      mockFetchApi.mockResolvedValue({ id: 1 })
      await storeService.getPedido(1, 1)
      expect(mockFetchApi).toHaveBeenCalledWith('/api/v1/sitios/1/tienda/pedidos/1')
    })

    it('updatePedidoEstado calls fetchApi with PUT', async () => {
      const data = { estado: 'completado' }
      mockFetchApi.mockResolvedValue({ id: 1 })
      await storeService.updatePedidoEstado(1, 1, data as any)
      expect(mockFetchApi).toHaveBeenCalledWith('/api/v1/sitios/1/tienda/pedidos/1/estado', {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    })
  })

  describe('Cart', () => {
    it('getCarrito calls fetchApi', async () => {
      mockFetchApi.mockResolvedValue({ items: [] })
      await storeService.getCarrito(1)
      expect(mockFetchApi).toHaveBeenCalledWith('/api/v1/sitios/1/tienda/carrito')
    })

    it('getCarrito with usuarioId adds query param', async () => {
      mockFetchApi.mockResolvedValue({ items: [] })
      await storeService.getCarrito(1, 5)
      expect(mockFetchApi).toHaveBeenCalledWith('/api/v1/sitios/1/tienda/carrito?usuario_id=5')
    })

    it('addToCarrito calls fetchApi with POST', async () => {
      const data = { producto_id: 1, cantidad: 2 }
      mockFetchApi.mockResolvedValue({ id: 1 })
      await storeService.addToCarrito(1, data as any)
      expect(mockFetchApi).toHaveBeenCalledWith('/api/v1/sitios/1/tienda/carrito/items', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    })

    it('updateCarritoItem calls fetchApi with PUT', async () => {
      mockFetchApi.mockResolvedValue({ id: 1 })
      await storeService.updateCarritoItem(1, 1, 3)
      expect(mockFetchApi).toHaveBeenCalledWith(
        '/api/v1/sitios/1/tienda/carrito/items/1?cantidad=3',
        { method: 'PUT' }
      )
    })

    it('removeFromCarrito calls fetchApi with DELETE', async () => {
      mockFetchApi.mockResolvedValue(undefined)
      await storeService.removeFromCarrito(1, 1)
      expect(mockFetchApi).toHaveBeenCalledWith('/api/v1/sitios/1/tienda/carrito/items/1', {
        method: 'DELETE',
      })
    })

    it('checkout calls fetchApi with POST', async () => {
      const data = { direccion: 'Calle 123' }
      mockFetchApi.mockResolvedValue({ orden_id: 1 })
      await storeService.checkout(1, data as any)
      expect(mockFetchApi).toHaveBeenCalledWith('/api/v1/sitios/1/tienda/checkout', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    })
  })
})
