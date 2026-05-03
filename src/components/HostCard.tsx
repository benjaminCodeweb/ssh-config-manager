import { useState } from "react";
import { type ScanPortResult, type ConnectionResult, type SshHost } from "../types/ssh";
import { api } from "../hooks/useApi";
import { CommandGenerator } from "./ComandGenerator";
import { DiagnosticModal } from "./DiagnosticModal";
import ScanPortModal from "./ScanPortModal";
import { useSecurityCheck } from "../hooks/useSecurityCheck";
import { SecurityModal } from "./SecurityModal";
import {
  Pencil,
  Clipboard,
  Trash2,
  Zap,
  Radar,
  Terminal,
  Server,
  KeyRound,
  Copy,
  Network,
  Edit,
} from "lucide-react";


interface Props {
    host: SshHost,
    onEdit: (host:SshHost) => void,
    onDelete: (alias:string) => void;
    onCopy : (host: SshHost) => void;
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-gray-600">{label}</span>
      <span className="font-mono text-sm text-gray-300">{value}</span>
    </div>
  );
}

export function HostCard({host, onEdit, onDelete, onCopy}:Props) {
   
    const[scan, setScan] = useState<ScanPortResult[] | null>(null);
    const[showDiagnostic,setShowDiagnostic] = useState(false);
    const [showScan, setShowScan] = useState(false);
    const[scaning,setScaning] = useState(false);
    const [testing, setTesting] = useState(false);
    const [showCommands, setShowCommands] = useState(false);
    const[diagnostic, setDiagnostic] = useState<ConnectionResult | null>(null);
    const warnings = useSecurityCheck(host);
    const[showSecurity,setShowSecurity] = useState(false);
    


    const handleTest  = async() => {
        setTesting(true);
        try {
            const result = await api.testConnection(host.alias);
            setDiagnostic(result);
            setShowDiagnostic(true);

        }catch {
            setDiagnostic({ success: false, 
      message: 'Error al conectar', 
      latencyMs: 0,
      errorType: 'UNKNOWN',
      suggestion: 'Verificá que la API esté corriendo'});
        }finally {
            setTesting(false);
        }
    };

    const handleScan = async(from: number, to:number):  Promise<ScanPortResult[]> => {
      setScaning(true);
      try{
        const result = await api.scanPort(host.alias, from, to);
        setScan(result);
      }catch{
        setScan([{
          port: host.port,
          open: false,
          latencyMs: 0, 
          
        }])
      }finally{
        setScaning(false);
      }

      return await api.scanPort(host.alias,from,to)
    }

    const tags = host.tags?.split(',').map(t => t.trim()).filter(Boolean) ?? [];

    return (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 flex flex-col gap-4 hover:border-green-500 transition-colors">
      
      <div className="flex items-center justify-between">
        <span className="font-mono text-green-400 text-lg font-semibold">{host.alias}</span>
        {warnings.length > 0 && (
  <button
    onClick={() => setShowSecurity(true)}
    className="font-mono text-xs border border-yellow-700 hover:border-yellow-500 text-yellow-600 hover:text-yellow-400 px-2 py-1 rounded-md transition-colors"
  >
    ⚠️ {warnings.length}
  </button>
)}
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(host)}
            className="text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-md px-2 py-1 text-sm transition-colors"
          ><Edit/></button>
           <button 
            onClick={() => onCopy(host)}
            className="text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-md px-2 py-1 text-sm transition-colors"
          ><Copy/></button>
          <button 
            onClick={() => onDelete(host.alias)}
            className="text-gray-400 hover:text-red-400 border border-gray-700 hover:border-red-500 rounded-md px-2 py-1 text-sm transition-colors"
          ><Trash2/></button>

          <button
  onClick={() => setShowCommands(true)}
  className="font-mono text-xs border border-gray-700 hover:border-green-500 hover:text-green-400 text-gray-400 px-3 py-1.5 rounded-md transition-colors"
>
  ⚡ Comandos
</button>
{showCommands && (
  <CommandGenerator host={host} onClose={() => setShowCommands(false)} />
)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Detail label="Host" value={host.hostName} />
        <Detail label="User" value={host.username} />
        <Detail label="Port" value={String(host.port)} />
        {host.identityFile && <Detail label="Key" value={host.identityFile} />}
      </div>

      {tags.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {tags.map(tag => (
            <span key={tag} className="font-mono text-xs bg-gray-800 border border-gray-700 text-gray-400 px-2 py-1 rounded-md uppercase tracking-wide">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 pt-3 border-t border-gray-800 flex-wrap">
        <button 
          onClick={handleTest} 
          disabled={testing}
          className="font-mono text-xs border border-gray-700 hover:border-green-500 hover:text-green-400 text-gray-400 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
        >
          {testing ? '⏳ Testeando...' : '⚡ Testear conexión'}
        </button>
         {showDiagnostic &&  diagnostic &&  (
  <DiagnosticModal
   result={diagnostic}
   onClose={() => setShowDiagnostic(false)}
  />

)}
{showSecurity && (
  <SecurityModal
    warnings={warnings}
    onClose={() => setShowSecurity(false)}
  />
)}
       
       
        <button onClick={() => setShowScan(true)} disabled={scaning} className="font-mono text-xs border border-gray-700 hover:border-green-500 hover:text-green-400 text-gray-400 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50" >
        {scaning ? '⏳ Escaneando...' : '📡 Escanear puertos' }
        </button>
        {showScan && (
  <ScanPortModal
    alias={host.alias}
    onClose={() => setShowScan(false)}
    onScan={handleScan}
  />
)}
      </div>
    </div>

    );

    
}