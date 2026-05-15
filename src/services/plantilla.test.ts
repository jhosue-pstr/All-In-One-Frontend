import { describe, it, expect, vi, beforeEach } from 'vitest'
import { plantillaService } from './plantilla'

describe('plantillaService', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    })
  })

  it('getAll should fetch /plantillas', async () => {
    await plantillaService.getAll()
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/plantillas'),
      expect.any(Object)
    )
  })

  it('getPublicas should fetch /plantillas/publicas', async () => {
    await plantillaService.getPublicas()
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/plantillas/publicas'),
      expect.any(Object)
    )
  })

  it('getMisPlantillas should fetch /plantillas/mis-plantillas', async () => {
    await plantillaService.getMisPlantillas()
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/plantillas/mis-plantillas'),
      expect.any(Object)
    )
  })

  it('getById should fetch /plantillas/{id}', async () => {
    await plantillaService.getById(2)
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/plantillas/2'),
      expect.any(Object)
    )
  })

  it('create should POST /plantillas', async () => {
    await plantillaService.create({ nombre: 'Tpl', slug: 'tpl' } as any)
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/plantillas'),
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('update should PUT /plantillas/{id}', async () => {
    await plantillaService.update(1, { nombre: 'Updated' } as any)
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/plantillas/1'),
      expect.objectContaining({ method: 'PUT' })
    )
  })

  it('delete should DELETE /plantillas/{id}', async () => {
    await plantillaService.delete(1)
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/plantillas/1'),
      expect.objectContaining({ method: 'DELETE' })
    )
  })
})
