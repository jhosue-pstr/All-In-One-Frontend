import { authService } from '../../services';
import { AuthForm } from '../AuthForm/AuthForm';
import './Register.css';

interface RegisterProps {
  readonly onSuccess?: () => void;
  readonly onSwitchToLogin?: () => void;
}

export function Register({ onSuccess }: Readonly<RegisterProps>) {
  return (
    <AuthForm
      title="Crear Cuenta"
      formClassName="register-form"
      fields={[
        { id: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Tu nombre', required: true },
        { id: 'apellido', label: 'Apellido', type: 'text', placeholder: 'Tu apellido', required: true },
        { id: 'correo', label: 'Correo electrónico', type: 'email', placeholder: 'correo@ejemplo.com', required: true },
        { id: 'contrasena', label: 'Contraseña', type: 'password', placeholder: '••••••••', required: true },
      ]}
      submitText="Crear Cuenta"
      onSubmit={async (v) => { await authService.register(v); }}
      onSuccess={onSuccess}
      successMessage="¡Registro exitoso! Ahora puedes iniciar sesión."
    />
  );
}