import type { SshHost } from "../types/ssh";

export interface SecurityWarning  {
    level: 'danger' | 'warning';
    message:string;
    suggestion:string;
}
export  function useSecurityCheck(host:SshHost): SecurityWarning[] {
const warnings: SecurityWarning[] = [];

if(host.hostName === 'root'){
    warnings.push({
        level: 'danger',
        message: 'Conectandose como root',
        suggestion: 'Creá un usuario con privilegios sudo en lugar de usar root directamente'
    })
}

if (!host.identityFile) {
    warnings.push({
      level: 'warning',
      message: 'Sin clave SSH configurada',
      suggestion: 'Usá autenticación por clave SSH en lugar de contraseña',
    });
  }

  if (host.port === 22) {
    warnings.push({
      level: 'warning',
      message: 'Puerto 22 expuesto',
      suggestion: 'Cambiá el puerto SSH a uno no estándar como 2222 para reducir ataques automatizados',
    });
  }

  if (host.port === 22 && !host.identityFile) {
    warnings.push({
      level: 'danger',
      message: 'Puerto default sin clave SSH',
      suggestion: 'Combinación peligrosa — puerto 22 expuesto y sin clave SSH configurada',
    });
  }

  return warnings


}