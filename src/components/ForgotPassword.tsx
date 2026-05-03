import { useState } from 'react';
import { api } from '../hooks/useApi';
import logo from '../assets/logossh.png'

interface Props {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email) { setError('El email es requerido'); return; }
    setLoading(true);
    setError(null);
    try {
      await api.forgotPassword(email);
      setSent(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 w-full max-w-md flex flex-col gap-6">
          <div className="text-center flex flex-col gap-3">
            <span className="text-4xl">📬</span>
            <h2 className="font-mono text-white font-semibold">Email enviado</h2>
            <p className="font-mono text-sm text-gray-400">
              Si el email existe recibirás un link para resetear tu contraseña.
            </p>
          </div>
          <button
            onClick={onBack}
            className="font-mono text-sm py-2 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            Volver al login
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
            <img src={logo} />
          </div>
          <div>
            <h1 className="font-mono text-white font-semibold">Olvidé mi contraseña</h1>
            <p className="font-mono text-xs text-gray-600">Te enviamos un link por email</p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-wide text-gray-500">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@email.com"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className="bg-gray-800 border border-gray-700 focus:border-green-500 outline-none rounded-lg px-3 py-2 font-mono text-sm text-gray-300 placeholder-gray-600 transition-colors"
          />
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
          {loading ? '⏳ Enviando...' : 'Enviar link'}
        </button>

        <button
          onClick={onBack}
          className="font-mono text-sm py-2 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white rounded-lg transition-colors"
        >
          Volver al login
        </button>
      </div>
    </div>
  );
}