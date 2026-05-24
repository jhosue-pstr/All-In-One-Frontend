import { describe, it, expect, vi, beforeEach } from 'vitest'
import { blogService } from './blog'

const mockFetchApi = vi.fn()
vi.mock('./api', () => ({
  fetchApi: (...args: any[]) => mockFetchApi(...args),
}))

describe('blogService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getPosts calls fetchApi with correct URL without params', async () => {
    mockFetchApi.mockResolvedValue([])
    await blogService.getPosts(1)
    expect(mockFetchApi).toHaveBeenCalledWith('/modules/blog/1/posts')
  })

  it('getPosts with onlyPublished=true adds query param', async () => {
    mockFetchApi.mockResolvedValue([])
    await blogService.getPosts(1, true)
    expect(mockFetchApi).toHaveBeenCalledWith('/modules/blog/1/posts?only_published=true')
  })

  it('getPostBySlug calls fetchApi with slug', async () => {
    mockFetchApi.mockResolvedValue({ id: 1 })
    await blogService.getPostBySlug(1, 'mi-post')
    expect(mockFetchApi).toHaveBeenCalledWith('/modules/blog/1/posts/mi-post')
  })

  it('createPost calls fetchApi with POST', async () => {
    const data = { titulo: 'Nuevo', contenido: '...' }
    mockFetchApi.mockResolvedValue({ id: 1 })
    await blogService.createPost(1, data as any)
    expect(mockFetchApi).toHaveBeenCalledWith('/modules/blog/1/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  })

  it('updatePost calls fetchApi with PUT', async () => {
    const data = { titulo: 'Editado' }
    mockFetchApi.mockResolvedValue({ id: 1 })
    await blogService.updatePost(1, 1, data as any)
    expect(mockFetchApi).toHaveBeenCalledWith('/modules/blog/1/posts/1', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  })

  it('deletePost calls fetchApi with DELETE', async () => {
    mockFetchApi.mockResolvedValue(undefined)
    await blogService.deletePost(1, 1)
    expect(mockFetchApi).toHaveBeenCalledWith('/modules/blog/1/posts/1', {
      method: 'DELETE',
    })
  })

  it('createCategory calls fetchApi with POST', async () => {
    const data = { nombre: 'Categoria' }
    mockFetchApi.mockResolvedValue({ id: 1 })
    await blogService.createCategory(1, data as any)
    expect(mockFetchApi).toHaveBeenCalledWith('/modules/blog/1/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  })

  it('uploadImage uses direct fetch with FormData', async () => {
    const file = new File([''], 'img.png', { type: 'image/png' })
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ url: 'https://img.url' }),
    })

    const result = await blogService.uploadImage(1, file)
    expect(result).toEqual({ url: 'https://img.url' })

    const call = (globalThis.fetch as any).mock.calls[0]
    expect(call[0]).toContain('/modules/blog/1/upload-image')
    expect(call[1].method).toBe('POST')
    expect(call[1].body).toBeInstanceOf(FormData)
  })

  it('uploadImage throws on non-ok response', async () => {
    const file = new File([''], 'img.png', { type: 'image/png' })
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ detail: 'Upload failed' }),
    })

    await expect(blogService.uploadImage(1, file)).rejects.toThrow('Upload failed')
  })

  it('uploadImage uses fallback error message', async () => {
    const file = new File([''], 'img.png', { type: 'image/png' })
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.reject(new Error('parse error')),
    })

    await expect(blogService.uploadImage(1, file)).rejects.toThrow('Error al subir la imagen')
  })

  it('uploadImage includes Authorization header when token exists', async () => {
    localStorage.setItem('token', 'my-token')
    const file = new File([''], 'img.png', { type: 'image/png' })
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ url: 'https://img.url' }),
    })

    await blogService.uploadImage(1, file)
    const call = (globalThis.fetch as any).mock.calls[0]
    expect(call[1].headers.Authorization).toBe('Bearer my-token')
  })
})
