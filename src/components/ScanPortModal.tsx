import { useState } from "react";
import type { ScanPortResult } from "../types/ssh";

interface Props {
    alias: string;
    onClose: () => void;
    onScan: (from: number, to:number) => Promise<ScanPortResult[]>;
}

export default function ScanPortModal({alias, onClose, onScan}: Props) {

  const [from, setFrom] = useState(22);
  const [to, setTo] = useState(22);
  const [results, setResults] = useState<ScanPortResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const[showAll,setShowAll] = useState(false);

  const handleScan = async() => {
    if(to - from > 100){
      setError("El rango maximo es de 100 puertos");
      return;
    }

    if(from > to){
      setError("El puerto inicial deber ser menor al final");
      return;
    }

    setError(null);
    setLoading(true);

    try{

      const data = await onScan(from,to);
     
      setResults(data);
      
    }catch(e:any) {
      setError("Error al escanear")
       }
       finally{
      setLoading(false);
    }
  }
  
    
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
            <h2 className="font-mono text-white font-semibold">Escaneo de puertos</h2>
            <p className="font-mono text-xs text-gray-500">{alias}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">✕</button>
        </div>

        {/* Rango */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wide text-gray-500">Desde</label>
            <input
              type="number"
              value={from}
              onChange={e => setFrom(Number(e.target.value))}
              className="bg-gray-800 border border-gray-700 focus:border-green-500 outline-none rounded-lg px-3 py-2 font-mono text-sm text-gray-300"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wide text-gray-500">Hasta</label>
            <input
              type="number"
              value={to}
              onChange={e => setTo(Number(e.target.value))}
              className="bg-gray-800 border border-gray-700 focus:border-green-500 outline-none rounded-lg px-3 py-2 font-mono text-sm text-gray-300"
            />
          </div>
        </div>

        {error && (
          <p className="font-mono text-xs text-red-400 bg-red-950 border border-red-800 rounded-lg px-3 py-2">
            ✗ {error}
          </p>
        )}

        <button
          onClick={handleScan}
          disabled={loading}
          className="font-mono text-sm py-2 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-semibold rounded-lg transition-colors"
        >
          {loading ? '⏳ Escaneando...' : '🔎 Escanear'}
        </button>

        {/* Resultados */}
        {results && (
  <div className="flex flex-col gap-3">
    
    {/* Resumen */}
    <div className="flex items-center justify-between">
      <p className="font-mono text-xs text-gray-500 uppercase tracking-wide">Resultados</p>
      <div className="flex gap-3">
        <span className="font-mono text-xs text-green-400">
          {results.filter(r => r.open).length} abiertos
        </span>
        <span className="font-mono text-xs text-gray-600">
          {results.filter(r => !r.open).length} cerrados
        </span>
      </div>
    </div>

    {/* Toggle */}
    <div className="flex gap-2">
      <button
        onClick={() => setShowAll(false)}
        className={`font-mono text-xs px-3 py-1 rounded-md border transition-colors ${
          !showAll ? 'border-green-500 text-green-400 bg-green-950' : 'border-gray-700 text-gray-500'
        }`}
      >
        Solo abiertos
      </button>
      <button
        onClick={() => setShowAll(true)}
        className={`font-mono text-xs px-3 py-1 rounded-md border transition-colors ${
          showAll ? 'border-gray-500 text-gray-300' : 'border-gray-700 text-gray-500'
        }`}
      >
        Todos
      </button>
    </div>

    {/* Lista */}
    <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
      {results
        .filter(r => showAll || r.open)
        .map(result => (
          <div
            key={result.port}
            className={`flex items-center justify-between px-3 py-2 rounded-lg ${
              result.open
                ? 'bg-green-950 border border-green-800'
                : 'bg-gray-800 border border-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs">{result.open ? '🔓' : '🔒'}</span>
              <span className={`font-mono text-sm ${result.open ? 'text-green-400' : 'text-gray-500'}`}>
                Puerto {result.port}
              </span>
            </div>
            {result.latencyMs > 0 && (
              <span className="font-mono text-xs text-gray-500">{result.latencyMs}ms</span>
            )}
          </div>
        ))}
      {!showAll && results.filter(r => r.open).length === 0 && (
        <p className="font-mono text-xs text-gray-600 text-center py-4">
          Ningún puerto abierto en este rango
        </p>
      )}
    </div>
  </div>
)}

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

