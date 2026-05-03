import { useState } from "react";
import type { SshHost } from "../types/ssh";

type Errors = Partial<Record<keyof SshHost, string>>;

const isValidHost = (host:string) => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return ipRegex.test(host) || domainRegex.test(host)
}

const isValidAlias = (alias:string) => /^[a-zA-Z0-9_-]+$/.test(alias);

export function useFormValidation() {
    const [error,setError] = useState<Errors>({});

    const validate  = (form:SshHost): boolean=>{
        const newErrors: Errors = {};

        if(!form.alias) {
            newErrors.alias = 'Alias es requerido'
        } else if(!isValidAlias(form.alias)) {
            newErrors.alias = 'Solo letras,numeros,guiones y guiones bajos'
        }


        if(!form.hostName){
             newErrors.hostName = 'Hostname es requerido'
        } else if(!isValidHost(form.hostName)) {
            newErrors.hostName = 'Debe ser una IP válida o un dominio'
        }


         if(!form.port){
             newErrors.alias = 'Puerto es requerido'
        } else if(form.port < 1 || form.port > 65535) 
            newErrors.port = 'El puerto debe ser de 1 a 65535';

        
        if(form.identityFile && !form.identityFile.startsWith('~') && !form.identityFile.startsWith('/'))
            newErrors.identityFile = 'Debe empezar con ~ o /';


        setError(newErrors);
        return Object.keys(newErrors).length === 0;

    };


    const cleanError = (field: keyof SshHost)=> {
        setError(e => ({...e, [field]: undefined}))
    };

    return {error, validate, cleanError}
}