export function tienePermiso(permisos: string[], permiso: string): boolean {
  return permisos.includes(permiso);
}

export function tieneAlgunPermiso(permisos: string[], permisosNecesarios: string[]): boolean {
  return permisosNecesarios.some((permiso) => permisos.includes(permiso));
}

export function esSuperAdmin(role?: string): boolean {
  return role === 'super_admin';
}