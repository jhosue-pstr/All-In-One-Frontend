import { type ReactNode } from 'react';
import { useForm } from '../../hooks/useForm';

interface FormField {
  readonly id: string;
  readonly label: string;
  readonly type: string;
  readonly placeholder: string;
  readonly required?: boolean;
}

interface AuthFormProps {
  readonly title: string;
  readonly fields: readonly FormField[];
  readonly submitText: string;
  readonly onSubmit: (values: Record<string, string>) => Promise<void>;
  readonly onSuccess?: () => void;
  readonly additionalContent?: ReactNode;
  readonly successMessage?: string;
  readonly errorClassName?: string;
  readonly formClassName: string;
}

export function AuthForm({
  title,
  fields,
  submitText,
  onSubmit,
  onSuccess,
  additionalContent,
  successMessage,
  errorClassName,
  formClassName,
}: AuthFormProps) {
  const initialValues = fields.reduce((acc, f) => ({ ...acc, [f.id]: '' }), {} as Record<string, string>);
  
  const { values, error, success, loading, setField, handleSubmit } = useForm({
    initialValues,
    onSubmit,
    onSuccess,
  });

  return (
    <form className={formClassName} onSubmit={handleSubmit}>
      <h2>{title}</h2>
      
      {/* Usamos errorClassName o caemos por defecto en "error-message" */}
      {error && <div className={errorClassName || "error-message"}>{error}</div>}
      {successMessage && success && <div className="success-message">{successMessage}</div>}
      
      {fields.map((field) => (
        <div key={field.id} className="form-group">
          <label htmlFor={field.id}>{field.label}</label>
          <input
            type={field.type}
            id={field.id}
            value={values[field.id] || ''}
            onChange={(e) => setField(field.id, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
          />
        </div>
      ))}
      
      {additionalContent}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Procesando...' : submitText}
      </button>
    </form>
  );
}