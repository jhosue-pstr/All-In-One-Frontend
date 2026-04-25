import { useState, type FormEvent } from 'react';
import { authService } from '../../services';
import './Register.css';

interface RegisterProps {
  readonly onSuccess?: () => void;
  readonly onSwitchToLogin?: () => void;
}

export function Register({ onSuccess, onSwitchToLogin }: Readonly<RegisterProps>) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authService.register({ correo, contrasena, nombre, apellido });
      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

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
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          placeholder="Juan"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="apellido">Apellido</label>
        <input
          type="text"
          id="apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          required
          placeholder="Pérez"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="correo">Correo electrónico</label>
        <input
          type="email"
          id="correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
          placeholder="correo@ejemplo.com"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="contrasena">Contraseña</label>
        <input
          type="password"
          id="contrasena"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
          placeholder="••••••••"
        />
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>
      
      <p className="switch-text">
        ¿Ya tienes cuenta?{' '}
        <button type="button" className="switch-btn" onClick={onSwitchToLogin}>
          Iniciar Sesión
        </button>
      </p>
    </form>
  );
}