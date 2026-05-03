import type { ConnectionResult } from '../types/ssh';

interface Props {
  result: ConnectionResult;
  onClose: () => void;
}

const getIcon = (errorType?: string, success?: boolean) => {
  if (success && !errorType) return '✅';
  if (errorType === 'HIGH_LATENCY') return '⚠️';
  if (errorType === 'TIMEOUT') return '⏱';
  if (errorType === 'DNS_ERROR') return '🌐';
  if (errorType === 'PORT_CLOSED') return '🔒';
  return '❌';
};

const getColor = (errorType?: string, success?: boolean) => {
  if (success && !errorType) return 'text-green-400 border-green-500 bg-green-950';
  if (errorType === 'HIGH_LATENCY') return 'text-yellow-400 border-yellow-500 bg-yellow-950';
  return 'text-red-400 border-red-500 bg-red-950';
};

export function DiagnosticModal({ result, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md flex flex-col gap-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-white font-semibold">Diagnóstico de conexión</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">✕</button>
        </div>

        {/* Resultado principal */}
        <div className={`border rounded-lg p-4 flex items-center gap-3 ${getColor(result.errorType, result.success)}`}>
          <span className="text-2xl">{getIcon(result.errorType, result.success)}</span>
          <div>
            <p className="font-mono text-sm font-semibold">{result.message}</p>
            {result.latencyMs > 0 && (
              <p className="font-mono text-xs opacity-70">{result.latencyMs}ms</p>
            )}
          </div>
        </div>

        {/* Sugerencia */}
        {result.suggestion && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex gap-3">
            <span>💡</span>
            <div>
              <p className="font-mono text-xs text-gray-400 uppercase tracking-wide mb-1">Sugerencia</p>
              <p className="font-mono text-sm text-gray-300">{result.suggestion}</p>
            </div>
          </div>
        )}

        {/* Detalles técnicos */}
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 flex flex-col gap-2">
          <p className="font-mono text-xs text-gray-500 uppercase tracking-wide">Detalles</p>
          <div className="grid grid-cols-2 gap-2">
            <Detail label="Estado" value={result.success ? 'Online' : 'Offline'} />
            <Detail label="Latencia" value={result.latencyMs > 0 ? `${result.latencyMs}ms` : '—'} />
            {result.errorType && <Detail label="Error" value={result.errorType} />}
          </div>
        </div>

        <button
          onClick={onClose}
          className="font-mono text-sm py-2 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white rounded-lg transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-xs text-gray-600 uppercase">{label}</span>
      <span className="font-mono text-xs text-gray-300">{value}</span>
    </div>
  );
}