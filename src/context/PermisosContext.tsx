import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { rolesService } from '../services/roles';

interface PermisosContextValue {
  permisos: string[];
  role: string;
  loading: boolean;
  tienePermiso: (permiso: string) => boolean;
  tieneAlgunPermiso: (permisosNecesarios: string[]) => boolean;
}

const PermisosContext = createContext<PermisosContextValue | null>(null);

interface PermisosProviderProps {
  children: React.ReactNode;
}

export function PermisosProvider({ children }: Readonly<PermisosProviderProps>) {
  const [permisos, setPermisos] = useState<string[]>([]);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    rolesService
      .getMisPermisos()
      .then((data) => {
        setPermisos(data.permisos || []);
        setRole(data.role || '');
      })
      .catch((error) => {
        console.error('Error cargando permisos:', error);
        setPermisos([]);
        setRole('');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const value = useMemo(
    () => ({
      permisos,
      role,
      loading,
      tienePermiso: (permiso: string) => {
        if (role === 'super_admin') return true;
        return permisos.includes(permiso);
      },
      tieneAlgunPermiso: (permisosNecesarios: string[]) => {
        if (role === 'super_admin') return true;
        return permisosNecesarios.some((permiso) => permisos.includes(permiso));
      },
    }),
    [permisos, role, loading]
  );

  return (
    <PermisosContext.Provider value={value}>
      {children}
    </PermisosContext.Provider>
  );
}

export function usePermisos() {
  const context = useContext(PermisosContext);

  if (!context) {
    throw new Error('usePermisos debe usarse dentro de PermisosProvider');
  }

  return context;
}