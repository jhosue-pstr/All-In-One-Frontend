import { describe, it, expect, vi, beforeEach } from 'vitest'
import { moduloService } from './modulo'

describe('moduloService', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    })
  })

  it('getAll should fetch /modulos/', async () => {
    await moduloService.getAll()
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/modulos/'),
      expect.any(Object)
    )
  })

  it('getById should fetch /modulos/{id}', async () => {
    await moduloService.getById(5)
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/modulos/5'),
      expect.any(Object)
    )
  })

  it('create should POST /modulos/', async () => {
    await moduloService.create({ nombre: 'New', descripcion: 'desc', tipo: 'component' } as any)
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/modulos/'),
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('update should PUT /modulos/{id}', async () => {
    await moduloService.update(1, { nombre: 'Updated' } as any)
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/modulos/1'),
      expect.objectContaining({ method: 'PUT' })
    )
  })

  it('delete should DELETE /modulos/{id}', async () => {
    await moduloService.delete(1)
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/modulos/1'),
      expect.objectContaining({ method: 'DELETE' })
    )
  })
})
