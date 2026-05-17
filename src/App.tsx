import { useCallback, useEffect, useState } from "react";
import type { SshHost } from "./types/ssh";
import { api } from "./hooks/useApi";
import  HostForm  from "./components/HostForm";
import { HostCard } from "./components/HostCard";
import { AuthForm } from "./components/AuthForm";
import {ToastContainer, toast} from 'react-toastify'
import ConfirmModal from "./components/ConfirmModal";
import logo from './assets/logossh.png';

import { ResetPasswordForm } from './components/ResetPassword';
import ModalExport from "./components/ModalExport";


function App() {
  const [hosts, setHosts] = useState<SshHost[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const[deleteHost, setDeleteHost] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [editHost, setEditHost] = useState<SshHost | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = new URLSearchParams(window.location.search);
  const[showExport, setShowExport] = useState(false);
const resetToken = params.get('token');

if (resetToken) {
  return <ResetPasswordForm token={resetToken} />;
}


   
  const handleLogin = () => setIsAuthenticated(true);

  const handleLogout = async () => {
    try{
        await api.logout();
        toast.info("Sesion cerrada")
        console.log()
    setIsAuthenticated(false);
    setHosts([]);
    }
    catch(err){
      toast.error("Error al cerrar sesion")
    }
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 400)

    return () => clearTimeout(timer);
  },[searchInput]);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await api.getHosts(search || undefined);
      setHosts(data);
      setIsAuthenticated(true);
    } catch (e: any) {
      if (e.message === '401') {
        setIsAuthenticated(false);
      } else {
        setError('No se pudo conectar al backend. ¿Está corriendo la API?');
      }
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { 
    
    load(); }, [load]);

  const handleSave = async (host: SshHost) => {
    try {
      if (editHost) await api.updateHost(editHost.alias, host);
      else await api.createHost(host);
      setEditHost(undefined);
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };


  const handleDelete = async () => {
    if (!deleteHost) return;
    try{
       await api.deleteHost(deleteHost);
    toast.info("Host eliminado");
    setDeleteHost(null);
    load();
    }
    catch(err){
      toast.error("Error al eliminar host")
    }
  };

  const handleCopy = async(host: SshHost) => {
  
    console.log('host: ',host)
    const command = `ssh ${host.username}@${host.hostName} -p ${host.port}`
    
    navigator.clipboard.writeText(command).then(() => {
     toast.info('Comando copiado')
    }).catch(() => {
    toast.error('error al copiar comando')
    })


  }
  const handleExport = async(format: "json" | "ssh") => {
    try{
      await api.exportHosts(format);
      toast.success("Hosts exportados correctamente")

      setShowExport(false);
    }catch(err){
      toast.error('Error al exportar hosts');
    }
  }

  if (!isAuthenticated && !loading) {
    return <AuthForm onSuccess={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-300">
      <ToastContainer
        position="bottom-right"
  autoClose={3000}
  theme="dark"/>

  {deleteHost && (
    <ConfirmModal
    onCancel={() => setDeleteHost}
    onConfirm={handleDelete}
    message={`¿Elminar ${deleteHost}?`}
    />
  )}
      
      <header className="border-b border-gray-800 px-8 py-5 flex items-center justify-between sticky top-0 bg-gray-950 z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-950 border border-green-500 flex items-center justify-center text-green-400 text-xl">
            <img  src={logo} />
          </div>
          <div>
            <h1 className="font-mono text-white font-semibold text-base">SSH Config Manager</h1>
            <p className="font-mono text-xs text-gray-600">~/.ssh/config visual editor</p>
          </div>
        </div>
       <div className="flex items-center gap-3">
  <button
    onClick={() => setEditHost(null)}
    className="font-mono text-sm px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-lg transition-colors"
  >
    + Nuevo host
  </button>
  <button
    onClick={handleLogout}
    className="font-mono text-sm px-4 py-2 border border-gray-700 hover:border-red-500 hover:text-red-400 text-gray-400 rounded-lg transition-colors"
  >
    Salir
  </button>
  <button onClick={() => setShowExport(true)}>Exportar Hosts</button>
  {showExport && (
    <ModalExport
    onExport={handleExport}
    />
  )}
</div>
        
      </header>

      <div className="px-8 pt-6">
        <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 focus-within:border-green-500 rounded-lg px-4 transition-colors">
          <span className="text-gray-600">⌕</span>
          <input
            type="text"
            placeholder="Buscar por alias, host, user o tag..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="flex-1 bg-transparent outline-none font-mono text-sm text-gray-300 placeholder-gray-600 py-3"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-gray-600 hover:text-gray-400">✕</button>
          )}
        </div>
      </div>

      <main className="px-8 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && (
          <p className="col-span-full text-center font-mono text-gray-600 py-20">Cargando...</p>
        )}
        {error && (
          <p className="col-span-full text-center font-mono text-red-400 py-20">{error}</p>
        )}
        {!loading && !error && hosts.length === 0 && (
          <div className="col-span-full text-center py-20">
            <div className="text-5xl mb-4">🔑</div>
            <p className="font-mono text-gray-600">
              {search ? 'No hay hosts que coincidan.' : 'No hay hosts. ¡Agregá el primero!'}
            </p>
          </div>
        )}
        {hosts.map(host => (
          <HostCard
            key={host.alias}
            host={host}
            onEdit={h => setEditHost(h)}
            onDelete={alias => setDeleteHost(alias)}
            onCopy={handleCopy}
          />
        ))}
      </main>

      {editHost !== undefined && (
        <HostForm
          host={editHost}
          onSave={handleSave}
          onClose={() => setEditHost(undefined)}
          
        />
      )}
    </div>
  );
  
}

export default App
