import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useForm } from './useForm'

describe('useForm', () => {
  const initialValues = { correo: '', contrasena: '' }

  it('should initialize with provided values', () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { correo: 'a@b.com' }, onSubmit: vi.fn() })
    )
    expect(result.current.values.correo).toBe('a@b.com')
  })

  it('should update a field with setField', () => {
    const { result } = renderHook(() => useForm({ initialValues, onSubmit: vi.fn() }))
    act(() => result.current.setField('correo', 'test@test.com'))
    expect(result.current.values.correo).toBe('test@test.com')
  })

  it('should call onSubmit and set success on success', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useForm({ initialValues, onSubmit }))

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    expect(onSubmit).toHaveBeenCalledWith(initialValues)
    expect(result.current.success).toBe('¡Operación exitosa!')
    expect(result.current.loading).toBe(false)
  })

  it('should set error message when onSubmit throws', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('Error de prueba'))
    const { result } = renderHook(() => useForm({ initialValues, onSubmit }))

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    expect(result.current.error).toBe('Error de prueba')
    expect(result.current.loading).toBe(false)
  })

  it('should reset values and messages', () => {
    const { result } = renderHook(() => useForm({ initialValues, onSubmit: vi.fn() }))
    act(() => result.current.setField('correo', 'changed'))
    act(() => result.current.reset())
    expect(result.current.values.correo).toBe('')
    expect(result.current.error).toBe('')
    expect(result.current.success).toBe('')
  })

  it('should call onSuccess callback when provided', async () => {
    const onSuccess = vi.fn()
    const { result } = renderHook(() =>
      useForm({ initialValues, onSubmit: vi.fn().mockResolvedValue(undefined), onSuccess })
    )

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    expect(onSuccess).toHaveBeenCalled()
  })
})
