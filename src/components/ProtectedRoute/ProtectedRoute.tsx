import { NoAutorizado } from '../../pages/NoAutorizado/NoAutorizado';
import { usePermisos } from '../../context/PermisosContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  permiso?: string;
  permisos?: string[];
}

export function ProtectedRoute({
  children,
  permiso,
  permisos = [],
}: Readonly<ProtectedRouteProps>) {
  const { loading, tienePermiso, tieneAlgunPermiso } = usePermisos();

  if (loading) {
    return <div className="loading">Validando permisos...</div>;
  }

  const autorizado = permiso
    ? tienePermiso(permiso)
    : tieneAlgunPermiso(permisos);

  if (!autorizado) {
    return <NoAutorizado permiso={permiso || permisos.join(', ')} />;
  }

  return <>{children}</>;
}