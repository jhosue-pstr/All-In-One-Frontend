import { describe, it, expect } from 'vitest'
import { tienePermiso, tieneAlgunPermiso, esSuperAdmin } from './permisos'

describe('tienePermiso', () => {
  it('returns true when permiso is in list', () => {
    expect(tienePermiso(['roles.ver', 'roles.editar'], 'roles.ver')).toBe(true)
  })

  it('returns false when permiso is not in list', () => {
    expect(tienePermiso(['roles.ver'], 'roles.crear')).toBe(false)
  })

  it('returns false for empty list', () => {
    expect(tienePermiso([], 'roles.ver')).toBe(false)
  })
})

describe('tieneAlgunPermiso', () => {
  it('returns true when any permiso matches', () => {
    expect(tieneAlgunPermiso(['roles.ver', 'roles.editar'], ['roles.crear', 'roles.ver'])).toBe(true)
  })

  it('returns false when no permiso matches', () => {
    expect(tieneAlgunPermiso(['roles.ver'], ['roles.crear', 'roles.editar'])).toBe(false)
  })

  it('returns false for empty lists', () => {
    expect(tieneAlgunPermiso([], ['roles.ver'])).toBe(false)
    expect(tieneAlgunPermiso(['roles.ver'], [])).toBe(false)
  })
})

describe('esSuperAdmin', () => {
  it('returns true for super_admin', () => {
    expect(esSuperAdmin('super_admin')).toBe(true)
  })

  it('returns false for other roles', () => {
    expect(esSuperAdmin('admin')).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(esSuperAdmin(undefined)).toBe(false)
  })
})
