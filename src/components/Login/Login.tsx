import { authService } from '../../services';
import { AuthForm } from '../AuthForm/AuthForm';
import './Login.css';

interface LoginProps {
  readonly onSuccess?: () => void;
}

export function Login({ onSuccess }: Readonly<LoginProps>) {
  return (
    <AuthForm
      title="Iniciar Sesión"
      formClassName="login-form"
      fields={[
        { id: 'correo', label: 'Correo electrónico', type: 'email', placeholder: 'correo@ejemplo.com', required: true },
        { id: 'contrasena', label: 'Contraseña', type: 'password', placeholder: '••••••••', required: true },
      ]}
      submitText="Iniciar Sesión"
      onSubmit={async (v) => { await authService.login(v); }}
      onSuccess={onSuccess}
    />
  );
}