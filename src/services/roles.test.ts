import { describe, it, expect, vi } from 'vitest'
import { rolesService } from './roles'

vi.mock('./api', () => ({
  fetchApi: vi.fn(),
}))

import { fetchApi } from './api'

describe('rolesService', () => {
  it('getMisPermisos calls fetchApi with correct endpoint', async () => {
    const mockData = { permisos: ['roles.ver'], role: 'admin' }
    vi.mocked(fetchApi).mockResolvedValue(mockData)
    const result = await rolesService.getMisPermisos()
    expect(fetchApi).toHaveBeenCalledWith('/roles/mis-permisos')
    expect(result).toEqual(mockData)
  })

  it('getPermisos calls fetchApi with correct endpoint', async () => {
    vi.mocked(fetchApi).mockResolvedValue([{ id: 1, nombre: 'roles.ver' }])
    const result = await rolesService.getPermisos()
    expect(fetchApi).toHaveBeenCalledWith('/roles/permisos')
    expect(result).toHaveLength(1)
  })

  it('getRoles calls fetchApi with correct endpoint', async () => {
    vi.mocked(fetchApi).mockResolvedValue([{ id: 1, nombre: 'Admin' }])
    const result = await rolesService.getRoles()
    expect(fetchApi).toHaveBeenCalledWith('/roles')
    expect(result).toHaveLength(1)
  })

  it('createRol calls fetchApi with POST', async () => {
    const data = { nombre: 'Test', permisos_ids: [1] }
    vi.mocked(fetchApi).mockResolvedValue({ id: 1, ...data })
    const result = await rolesService.createRol(data)
    expect(fetchApi).toHaveBeenCalledWith('/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    expect(result).toMatchObject(data)
  })

  it('updateRol calls fetchApi with PUT', async () => {
    const data = { nombre: 'Updated' }
    vi.mocked(fetchApi).mockResolvedValue({ id: 1, ...data })
    const result = await rolesService.updateRol(1, data)
    expect(fetchApi).toHaveBeenCalledWith('/roles/1', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    expect(result).toMatchObject(data)
  })

  it('deleteRol calls fetchApi with DELETE', async () => {
    vi.mocked(fetchApi).mockResolvedValue({ mensaje: 'Eliminado' })
    const result = await rolesService.deleteRol(1)
    expect(fetchApi).toHaveBeenCalledWith('/roles/1', { method: 'DELETE' })
    expect(result).toEqual({ mensaje: 'Eliminado' })
  })

  it('getUsuarios calls fetchApi with correct endpoint', async () => {
    vi.mocked(fetchApi).mockResolvedValue([{ id: 1, email: 'test@test.com' }])
    const result = await rolesService.getUsuarios()
    expect(fetchApi).toHaveBeenCalledWith('/roles/usuarios')
    expect(result).toHaveLength(1)
  })

  it('createUsuario calls fetchApi with POST', async () => {
    const data = { email: 'nuevo@test.com', password: '123456', role: 'editor' }
    vi.mocked(fetchApi).mockResolvedValue({ id: 1, ...data })
    const result = await rolesService.createUsuario(data)
    expect(fetchApi).toHaveBeenCalledWith('/roles/usuarios', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    expect(result).toMatchObject(data)
  })

  it('cambiarRolUsuario calls fetchApi with PUT', async () => {
    vi.mocked(fetchApi).mockResolvedValue({ id: 1, role: 'admin' })
    const result = await rolesService.cambiarRolUsuario(1, 'admin')
    expect(fetchApi).toHaveBeenCalledWith('/roles/usuarios/1/rol', {
      method: 'PUT',
      body: JSON.stringify({ role: 'admin' }),
    })
    expect(result).toMatchObject({ role: 'admin' })
  })

  it('desactivarUsuario calls fetchApi with DELETE', async () => {
    vi.mocked(fetchApi).mockResolvedValue({ mensaje: 'Desactivado' })
    const result = await rolesService.desactivarUsuario(1)
    expect(fetchApi).toHaveBeenCalledWith('/roles/usuarios/1', { method: 'DELETE' })
    expect(result).toEqual({ mensaje: 'Desactivado' })
  })

  it('activarUsuario calls fetchApi with PUT', async () => {
    vi.mocked(fetchApi).mockResolvedValue({ id: 1, activo: true })
    const result = await rolesService.activarUsuario(1)
    expect(fetchApi).toHaveBeenCalledWith('/roles/usuarios/1/activar', {
      method: 'PUT',
    })
    expect(result).toMatchObject({ activo: true })
  })
})
