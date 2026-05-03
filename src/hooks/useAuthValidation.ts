import { useState } from 'react';

type AuthErrors = {
  email?: string;
  password?: string;
};

export function useAuthValidation() {
  const [errors, setErrors] = useState<AuthErrors>({});

  const validate = (email: string, password: string, _mode: 'login' | 'register' = 'register'): boolean => {
    const newErrors: AuthErrors = {};

    if (!email)
      newErrors.email = 'El email es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = 'Email inválido';

    if (!password)
      newErrors.password = 'La contraseña es requerida';
    else if (password.length < 8)
      newErrors.password = 'Mínimo 8 caracteres';
    else if (!/[A-Z]/.test(password))
      newErrors.password = 'Debe tener al menos una mayúscula';
    else if (!/[0-9]/.test(password))
      newErrors.password = 'Debe tener al menos un número';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: keyof AuthErrors) => {
    setErrors(e => ({ ...e, [field]: undefined }));
  };

  return { errors, validate, clearError };
}