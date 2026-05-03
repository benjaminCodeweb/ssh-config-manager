import { useState } from 'react';
import { api } from '../hooks/useApi';
import { useAuthValidation } from '../hooks/useAuthValidation';

interface Props {
  token: string;
}

export function ResetPasswordForm({ token }: Props) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { errors, validate, clearError } = useAuthValidation();

  const handleSubmit = async () => {
    if (!validate('placeholder@email.com', password, 'register')) return;
    setLoading(true);
    setError(null);
    try {
      await api.resetPassword(token, password);
      setSuccess(true);
    } catch (e: any) {
      setError('Token inválido o expirado');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 w-full max-w-md flex flex-col gap-6 text-center">
          <span className="text-4xl">✅</span>
          <h2 className="font-mono text-white font-semibold">Contraseña actualizada</h2>
          <p className="font-mono text-sm text-gray-400">Ya podés iniciar sesión con tu nueva contraseña.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="font-mono text-sm py-2.5 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-lg transition-colors"
          >
            Ir al login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 w-full max-w-md flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-950 border border-green-500 flex items-center justify-center text-green-400 text-xl">
            ⌨
          </div>
          <div>
            <h1 className="font-mono text-white font-semibold">Nueva contraseña</h1>
            <p className="font-mono text-xs text-gray-600">Ingresá tu nueva contraseña</p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-wide text-gray-500">Nueva contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); clearError('password'); }}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className={`bg-gray-800 border ${errors.password ? 'border-red-500' : 'border-gray-700'} focus:border-green-500 outline-none rounded-lg px-3 py-2 font-mono text-sm text-gray-300 placeholder-gray-600 transition-colors`}
          />
          {errors.password && <span className="font-mono text-xs text-red-400">{errors.password}</span>}
        </div>

        {error && (
          <p className="font-mono text-xs text-red-400 bg-red-950 border border-red-800 rounded-lg px-3 py-2">
            ✗ {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="font-mono text-sm py-2.5 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-semibold rounded-lg transition-colors"
        >
          {loading ? '⏳ Guardando...' : 'Guardar contraseña'}
        </button>
      </div>
    </div>
  );
}