import { Link } from 'react-router-dom';

interface NoAutorizadoProps {
  permiso?: string;
}

export function NoAutorizado({ permiso }: Readonly<NoAutorizadoProps>) {
  return (
    <div style={{ padding: '40px' }}>
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: '#fff',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '28px', marginBottom: '12px', color: '#991b1b' }}>
          Acceso no autorizado
        </h1>

        <p style={{ color: '#555', marginBottom: '12px' }}>
          No tienes permisos para ingresar a esta sección del sistema.
        </p>

        {permiso && (
          <p style={{ color: '#777', fontSize: '14px', marginBottom: '24px' }}>
            Permiso requerido: <strong>{permiso}</strong>
          </p>
        )}

        <Link
          to="/inicio"
          style={{
            display: 'inline-block',
            background: '#2563eb',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}