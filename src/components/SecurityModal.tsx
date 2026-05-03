import type { SecurityWarning } from '../hooks/useSecurityCheck';

interface Props {
  warnings: SecurityWarning[];
  onClose: () => void;
}

export function SecurityModal({ warnings, onClose }: Props) {
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
          <div>
            <h2 className="font-mono text-white font-semibold">Configuración peligrosa</h2>
            <p className="font-mono text-xs text-gray-500">{warnings.length} problema{warnings.length > 1 ? 's' : ''} detectado{warnings.length > 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">✕</button>
        </div>

        <div className="flex flex-col gap-3">
          {warnings.map((warning, i) => (
            <div
              key={i}
              className={`border rounded-lg p-4 flex flex-col gap-2 ${
                warning.level === 'danger'
                  ? 'border-red-500 bg-red-950'
                  : 'border-yellow-600 bg-yellow-950'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{warning.level === 'danger' ? '🔴' : '🟡'}</span>
                <p className={`font-mono text-sm font-semibold ${
                  warning.level === 'danger' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {warning.message}
                </p>
              </div>
              <div className="flex gap-2">
                <span>💡</span>
                <p className="font-mono text-xs text-gray-400">{warning.suggestion}</p>
              </div>
            </div>
          ))}
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