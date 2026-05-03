import { useCallback, useEffect, useState } from "react";
import type { SshHost } from "../types/ssh";
import { useFormValidation } from "../hooks/useFormValidation";


interface Props {
    host?: SshHost | null,
    onSave: (host: SshHost) => void;
  onClose: () => void;
}

const emptyHost = (): SshHost => ({
  alias: '',
  hostName: '',
  username: '',
  port: 22,
  identityFile: '',
  tags: '',
  extraOptions: {},
});


export default function HostForm({ host, onSave, onClose }: Props) {
  const [form, setForm] = useState<SshHost>(emptyHost());
  const {error, validate, cleanError} = useFormValidation();

  useEffect(() => {
    if (host) setForm(host);
    else setForm(emptyHost());
  }, [host]);

  const handleChange = useCallback((field: keyof SshHost, value: string | number) => {
  setForm(f => ({ ...f, [field]: value }));
  cleanError(field);
}, [cleanError]);

  const handleSubmit = () => {
    if(!validate(form)) return;
    onSave(form);

   
}

 return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-lg flex flex-col gap-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-white font-semibold text-base">
            {host ? `Editar — ${host.alias}` : 'Nuevo host'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >✕</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
        <Field label="Alias *" value={form.alias} onChange={e => handleChange('alias', e.target.value)} placeholder="mi-servidor"  error={error.alias} disabled={!!host} />
<Field label="HostName *" value={form.hostName} onChange={e => handleChange('hostName', e.target.value)} placeholder="192.168.1.1" error={error.hostName} />
<Field label="User" value={form.username} onChange={e => handleChange('username', e.target.value)} placeholder="ubuntu" error={error.username} />
<Field label="Port" value={String(form.port)} onChange={e => handleChange('port', Number(e.target.value))} type="number" placeholder="22" error={error.port} />
<Field label="IdentityFile" value={form.identityFile ?? ''} onChange={e => handleChange('identityFile', e.target.value)} placeholder="~/.ssh/id_rsa" error={error.identityFile} />
<Field label="Tags" value={form.tags ?? ''} onChange={e => handleChange('tags', e.target.value)} placeholder="work, prod"error={error.tags} />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="font-mono text-sm px-4 py-2 border border-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
          >Cancelar</button>
          <button
            onClick={handleSubmit}
            className="font-mono text-sm px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-lg transition-colors"
          >{host ? 'Guardar cambios' : 'Agregar host'}</button>
        </div>
      </div>
    </div>
  );
    };
function Field({ label, value, onChange, placeholder, type = 'text', disabled = false, error }: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  error?: string;
})
 {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-wide text-gray-500">{label}</label>
      {error && <span className="font-mono text-xs text-red-400">{error}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="bg-gray-800 border border-gray-700 focus:border-green-500 outline-none rounded-lg px-3 py-2 font-mono text-sm text-gray-300 placeholder-gray-600 disabled:opacity-40 transition-colors"
      />
    </div>
  );
}
  