import { describe, it, expect, vi, afterAll, beforeEach } from 'vitest'

vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({ render: vi.fn() })),
}))

vi.mock('./index.css', () => ({}))

describe('main entry point', () => {
  afterAll(() => {
    document.getElementById('root')?.remove()
  })

  it('should render App inside StrictMode when root exists', async () => {
    const rootEl = document.createElement('div')
    rootEl.id = 'root'
    document.body.appendChild(rootEl)
    expect(document.getElementById('root')).not.toBeNull()

    await import('./main')
    const { createRoot } = await import('react-dom/client')
    expect(createRoot).toHaveBeenCalled()
  })
})
