import { type FormEvent, type ReactNode } from 'react';
import { useForm } from '../../hooks/useForm';

interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
}

interface AuthFormProps {
  title: string;
  fields: FormField[];
  submitText: string;
  onSubmit: (values: Record<string, string>) => Promise<void>;
  onSuccess?: () => void;
  additionalContent?: ReactNode;
  successMessage?: string;
  errorClassName?: string;
  formClassName: string;
}

export function AuthForm({
  title,
  fields,
  submitText,
  onSubmit,
  onSuccess,
  additionalContent,
  successMessage,
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
      
      {error && <div className="error-message">{error}</div>}
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