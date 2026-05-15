import { useState } from 'react';
import type { FormEventHandler } from 'react';

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  onSuccess?: () => void;
}

interface UseFormReturn<T> {
  values: T;
  error: string;
  success: string;
  loading: boolean;
  setField: (field: keyof T, value: string) => void;
  handleSubmit: FormEventHandler<HTMLFormElement>;
  reset: () => void;
}

export function useForm<T extends Record<string, string>>({
  initialValues,
  onSubmit,
  onSuccess,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const setField = (field: keyof T, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const reset = () => {
    setValues(initialValues);
    setError('');
    setSuccess('');
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await onSubmit(values);
      setSuccess('¡Operación exitosa!');
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return { values, error, success, loading, setField, handleSubmit, reset };
}