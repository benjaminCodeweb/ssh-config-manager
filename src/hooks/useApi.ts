import type { ConnectionResult, ScanPortResult, SshHost } from "../types/ssh.ts";

const BASE_URL = 'https://ssh-config-manager-api-production.up.railway.app/api';

export const api = {

  async register(email: string, password: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(await res.text());
  },

  async login(email: string, password: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Email o contraseña incorrectos');
  },

  async logout(): Promise<void> {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  },

  async getHosts(search?: string): Promise<SshHost[]> {
    const url = search
      ? `${BASE_URL}/hosts?search=${encodeURIComponent(search)}`
      : `${BASE_URL}/hosts`;
    const res = await fetch(url, { credentials: 'include' });
    if (res.status === 401) throw new Error('401');
    if (!res.ok) throw new Error('Error al obtener hosts');
    return res.json();
  },

  async createHost(host: SshHost): Promise<SshHost> {
    const res = await fetch(`${BASE_URL}/hosts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(host),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async updateHost(alias: string, host: SshHost): Promise<SshHost> {
    const res = await fetch(`${BASE_URL}/hosts/${encodeURIComponent(alias)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(host),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async deleteHost(alias: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/hosts/${encodeURIComponent(alias)}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Error al eliminar host');
  },

  async testConnection(alias: string): Promise<ConnectionResult> {
    const res = await fetch(`${BASE_URL}/hosts/${encodeURIComponent(alias)}/test`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Error al testear conexión');
    return res.json();
  },

  async scanPort(alias:string, from:number, to:number):Promise<ScanPortResult[]> {
    const res = await fetch(`${BASE_URL}/hosts/${encodeURIComponent(alias)}/scan?from=${from}&to=${to}`, {
      method: 'POST',
      credentials: 'include',
    });

    if(!res.ok) throw new Error("Error al escanear los puertos");

    return res.json();
  },

  async exportHosts(format:'json' | 'ssh'):Promise<void>{
    const endpoint = format === 'json' ? 'export-json' : 'export-ssh'
    const res = await fetch(`${BASE_URL}/hosts/${endpoint}`,{
      method: 'GET',
      credentials: 'include'
    });

    if(!res.ok)throw new Error("Error al exportar hosts");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = format == 'json' ? 'ssh-hosts-json' : 'ssh-config';
    a.click();
    URL.revokeObjectURL(url);

  },

  async forgotPassword(email:string):Promise <void> {
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {'Content-type': 'Application/json'},
      body: JSON.stringify({email}),
      credentials:'include'
    });

    if(!res.ok) throw new Error(await res.text());

  },


  async resetPassword(token:string, newPassword:string):Promise <void>{
    const res = await fetch(`${BASE_URL}/auth/reset-password`,{
      method:'POST',
       headers: {'Content-type': 'Application/json'},
      body: JSON.stringify({token, newPassword}),
      credentials:'include'
    });

    if(!res.ok) throw new Error(await res.text());


  },

  

}