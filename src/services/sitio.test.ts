import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { sitioService } from './sitio'

describe('sitioService', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    vi.spyOn(window, 'alert').mockImplementation(() => {})

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('getAll should fetch /sitios', async () => {
    await sitioService.getAll()

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/sitios'),
      expect.any(Object)
    )

    expect(globalThis.fetch).not.toHaveBeenCalledWith(
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

  it('uploadMinatura should throw on non-ok response', async () => {
    ;(globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ detail: 'Error' }),
    })

    const file = new File([''], 'test.png', { type: 'image/png' })

    await expect(sitioService.uploadMinatura(1, file)).rejects.toThrow('Error')
  })

  it('uploadMinatura should throw fallback when no detail', async () => {
    ;(globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    })

    const file = new File([''], 'test.png', { type: 'image/png' })

    await expect(
      sitioService.uploadMinatura(1, file)
    ).rejects.toThrow('Error al subir la miniatura')
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

  it('getModulos should fetch /sitios/{id}/modulos/', async () => {
    await sitioService.getModulos(5)

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/sitios/5/modulos/'),
      expect.any(Object)
    )
  })

  it('uploadMinatura should use fallback when error json throws', async () => {
    ;(globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error('json fail')),
    })

    const file = new File([''], 'test.png', { type: 'image/png' })

    await expect(
      sitioService.uploadMinatura(1, file)
    ).rejects.toThrow('Error al subir la miniatura')
  })
})