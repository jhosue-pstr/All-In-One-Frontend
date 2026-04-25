import { authService } from '../../services';
import { useForm } from '../../hooks/useForm';
import './Login.css';

interface LoginProps {
  readonly onSuccess?: () => void;
}

interface LoginValues {
  correo: string;
  contrasena: string;
}

export function Login({ onSuccess }: Readonly<LoginProps>) {
  const { values, error, loading, setField, handleSubmit } = useForm<LoginValues>({
    initialValues: { correo: '', contrasena: '' },
    onSubmit: async (v) => {
      await authService.login(v);
    },
    onSuccess,
  });

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Iniciar Sesión</h2>
      
      {error && <div className="error-message">{error}</div>}
      
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
        {loading ? 'Iniciando...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}