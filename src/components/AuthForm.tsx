import { useState } from 'react';
import { api } from '../hooks/useApi';
import { useAuthValidation } from '../hooks/useAuthValidation';
import logo from '../assets/logossh.png';
import { ForgotPasswordForm } from './ForgotPassword';


interface Props {
  onSuccess: () => void;
}

export function AuthForm({ onSuccess }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {errors, validate, clearError} = useAuthValidation();
  const [showForgot, setShowForgot] = useState(false);

  if (showForgot) {
  return <ForgotPasswordForm onBack={() => setShowForgot(false)} />;
}

  const handleSubmit = async () => {
     if (!validate(email, password)) return;
    setLoading(true);
    setError(null);

    try {
      

    if (mode === 'login') {
  await api.login(email, password);
} else {
  await api.register(email, password);
}

onSuccess();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 w-full max-w-md flex flex-col gap-6">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-950 border border-green-500 flex items-center justify-center text-green-400 text-xl">
            <img src={logo}/>
          </div>
          <div>
            <h1 className="font-mono text-white font-semibold">SSH Config Manager</h1>
            <p className="font-mono text-xs text-gray-600">~/.ssh/config visual editor</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 font-mono text-sm py-2 rounded-lg border transition-colors ${
              mode === 'login'
                ? 'border-green-500 text-green-400 bg-green-950'
                : 'border-gray-700 text-gray-500 hover:text-gray-300'
            }`}
          >Login</button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 font-mono text-sm py-2 rounded-lg border transition-colors ${
              mode === 'register'
                ? 'border-green-500 text-green-400 bg-green-950'
                : 'border-gray-700 text-gray-500 hover:text-gray-300'
            }`}
          >Registro</button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wide text-gray-500">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => {setEmail(e.target.value); clearError('email'); }}
              placeholder="tu@email.com"
              className="bg-gray-800 border border-gray-700 focus:border-green-500 outline-none rounded-lg px-3 py-2 font-mono text-sm text-gray-300 placeholder-gray-600 transition-colors"
            />
            {errors.email && <span className="font-mono text-xs text-red-400">{errors.email}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wide text-gray-500">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => {setPassword(e.target.value); clearError('password'); }}
              placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              className="bg-gray-800 border border-gray-700 focus:border-green-500 outline-none rounded-lg px-3 py-2 font-mono text-sm text-gray-300 placeholder-gray-600 transition-colors"
            />
            {errors.password && <span className="font-mono text-xs text-red-400">{errors.password}</span>}
          </div>
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
          {loading ? '⏳ Cargando...' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
        </button>
        {mode === 'login' && (
  <button
    onClick={() => setShowForgot(true)}
    className="font-mono text-xs text-gray-500 hover:text-gray-300 transition-colors text-center"
  >
    ¿Olvidaste tu contraseña?
  </button>
)}
      </div>
    </div>
  );
}