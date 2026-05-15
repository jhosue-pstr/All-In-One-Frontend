import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sitioService } from './sitio'

describe('sitioService', () => {
  beforeEach(() => {
    localStorage.clear()
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    })
  })

  it('getAll should fetch /sitios/mis-sitios', async () => {
    await sitioService.getAll()
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/sitios/mis-sitios'),
      expect.any(Object)
    )
  })

  it('getById should fetch /sitios/{id}', async () => {
    await sitioService.getById(3)
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/sitios/3'),
      expect.any(Object)
    )
  })

  it('create should POST /sitios/', async () => {
    await sitioService.create({ nombre: 'Site', slug: 'site' } as any)
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/sitios/'),
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('update should PUT /sitios/{id}', async () => {
    await sitioService.update(1, { nombre: 'Updated' } as any)
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/sitios/1'),
      expect.objectContaining({ method: 'PUT' })
    )
  })

  it('delete should DELETE /sitios/{id}', async () => {
    await sitioService.delete(1)
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/sitios/1'),
      expect.objectContaining({ method: 'DELETE' })
    )
  })

  it('uploadMinatura should POST multipart to /sitios/{id}/miniatura', async () => {
    ;(globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ url: 'https://img.url' }),
    })
    localStorage.setItem('token', 'tok')
    const file = new File([''], 'test.png', { type: 'image/png' })
    const url = await sitioService.uploadMinatura(1, file)
    expect(url).toBe('https://img.url')
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/sitios/1/miniatura'),
      expect.objectContaining({ method: 'POST' })
    )
  })
})
