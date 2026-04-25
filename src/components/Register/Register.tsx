import { authService } from '../../services';
import { useForm } from '../../hooks/useForm';
import './Register.css';

interface RegisterProps {
  readonly onSuccess?: () => void;
  readonly onSwitchToLogin?: () => void;
}

interface RegisterValues {
  correo: string;
  contrasena: string;
  nombre: string;
  apellido: string;
}

export function Register({ onSuccess }: Readonly<RegisterProps>) {
  const { values, error, success, loading, setField, handleSubmit } = useForm<RegisterValues>({
    initialValues: { correo: '', contrasena: '', nombre: '', apellido: '' },
    onSubmit: async (v) => {
      await authService.register(v);
    },
    onSuccess,
  });

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2>Crear Cuenta</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="form-group">
        <label htmlFor="nombre">Nombre</label>
        <input
          type="text"
          id="nombre"
          value={values.nombre}
          onChange={(e) => setField('nombre', e.target.value)}
          required
          placeholder="Tu nombre"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="apellido">Apellido</label>
        <input
          type="text"
          id="apellido"
          value={values.apellido}
          onChange={(e) => setField('apellido', e.target.value)}
          required
          placeholder="Tu apellido"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="correo">Correo electrónico</label>
        <input
          type="email"
          id="correo"
          value={values.correo}
          onChange={(e) => setField('correo', e.target.value)}
          required
          placeholder="correo@ejemplo.com"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="contrasena">Contraseña</label>
        <input
          type="password"
          id="contrasena"
          value={values.contrasena}
          onChange={(e) => setField('contrasena', e.target.value)}
          required
          placeholder="••••••••"
        />
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Registrando...' : 'Crear Cuenta'}
      </button>
    </form>
  );
}