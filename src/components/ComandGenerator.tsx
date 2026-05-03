import { useState } from 'react';
import { toast } from 'react-toastify';
import type { SshHost } from '../types/ssh';

interface Props {
  host: SshHost;
  onClose: () => void;
}

type CommandType = 'ssh' | 'scp' | 'rsync' | 'tunnel-local' | 'tunnel-remote' | 'tunnel-db';

interface Command {
  type: CommandType;
  label: string;
  description: string;
}

const COMMANDS: Command[] = [
  { type: 'ssh', label: 'SSH', description: 'Conexión básica' },
  { type: 'scp', label: 'SCP', description: 'Copiar archivos' },
  { type: 'rsync', label: 'RSYNC', description: 'Sincronizar directorios' },
  { type: 'tunnel-local', label: 'Túnel local', description: 'Acceder a servicio remoto' },
  { type: 'tunnel-remote', label: 'Túnel remoto', description: 'Exponer servicio local' },
  { type: 'tunnel-db', label: 'Forward DB', description: 'Acceder a DB remota' },
];

export function CommandGenerator({ host, onClose }: Props) {
  const [active, setActive] = useState<CommandType>('ssh');
  const [localPort, setLocalPort] = useState('3000');
  const [remotePort, setRemotePort] = useState('3000');
  const [localPath, setLocalPath] = useState('./');
  const [remotePath, setRemotePath] = useState('/home/' + host.username);

  const base = `${host.username}@${host.hostName}`;
  const port = host.port !== 22 ? `-p ${host.port}` : '';
  const key = host.identityFile ? `-i ${host.identityFile}` : '';

  const generateCommand = (): string => {
    const sshFlags = [key, port].filter(Boolean).join(' ');
    switch (active) {
      case 'ssh':
        return `ssh ${[sshFlags, base].filter(Boolean).join(' ')}`;
      case 'scp':
        return `scp ${[sshFlags.replace('-p', '-P'), 'archivo.txt', `${base}:${remotePath}`].filter(Boolean).join(' ')}`;
      case 'rsync':
        return `rsync -avz -e "ssh ${sshFlags}" ${localPath} ${base}:${remotePath}`;
      case 'tunnel-local':
        return `ssh -L ${localPort}:localhost:${remotePort} ${[sshFlags, base].filter(Boolean).join(' ')} -N`;
      case 'tunnel-remote':
        return `ssh -R ${remotePort}:localhost:${localPort} ${[sshFlags, base].filter(Boolean).join(' ')} -N`;
      case 'tunnel-db':
        return `ssh -L ${localPort}:localhost:5432 ${[sshFlags, base].filter(Boolean).join(' ')} -N`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCommand());
    toast.success('Comando copiado');
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-2xl flex flex-col gap-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-mono text-white font-semibold">Generador de comandos</h2>
            <p className="font-mono text-xs text-gray-500">{host.alias} — {host.hostName}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {COMMANDS.map(cmd => (
            <button
              key={cmd.type}
              onClick={() => setActive(cmd.type)}
              className={`font-mono text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                active === cmd.type
                  ? 'border-green-500 text-green-400 bg-green-950'
                  : 'border-gray-700 text-gray-500 hover:text-gray-300'
              }`}
            >
              {cmd.label}
            </button>
          ))}
        </div>

        <p className="font-mono text-xs text-gray-500">
          {COMMANDS.find(c => c.type === active)?.description}
        </p>

        {/* Opciones extra según el tipo */}
        {(active === 'tunnel-local' || active === 'tunnel-remote' || active === 'tunnel-db') && (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wide text-gray-500">Puerto local</label>
              <input
                value={localPort}
                onChange={e => setLocalPort(e.target.value)}
                className="bg-gray-800 border border-gray-700 focus:border-green-500 outline-none rounded-lg px-3 py-2 font-mono text-sm text-gray-300"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wide text-gray-500">Puerto remoto</label>
              <input
                value={remotePort}
                onChange={e => setRemotePort(e.target.value)}
                className="bg-gray-800 border border-gray-700 focus:border-green-500 outline-none rounded-lg px-3 py-2 font-mono text-sm text-gray-300"
              />
            </div>
          </div>
        )}

        {(active === 'scp' || active === 'rsync') && (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wide text-gray-500">Ruta local</label>
              <input
                value={localPath}
                onChange={e => setLocalPath(e.target.value)}
                className="bg-gray-800 border border-gray-700 focus:border-green-500 outline-none rounded-lg px-3 py-2 font-mono text-sm text-gray-300"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wide text-gray-500">Ruta remota</label>
              <input
                value={remotePath}
                onChange={e => setRemotePath(e.target.value)}
                className="bg-gray-800 border border-gray-700 focus:border-green-500 outline-none rounded-lg px-3 py-2 font-mono text-sm text-gray-300"
              />
            </div>
          </div>
        )}

        {/* Comando generado */}
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 flex items-center justify-between gap-3">
          <code className="font-mono text-sm text-green-400 break-all">{generateCommand()}</code>
          <button
            onClick={handleCopy}
            className="shrink-0 font-mono text-xs px-3 py-1.5 border border-gray-700 hover:border-green-500 hover:text-green-400 text-gray-400 rounded-lg transition-colors"
          >
            📋 Copiar
          </button>
        </div>
      </div>
    </div>
  );
}