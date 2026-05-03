export interface SshHost {
    alias: string,
    tags?:string,
    hostName: string,
    username: string,
    port: number,
    identityFile?:string,
    extraOptions: Record<string,string>;

}


export interface ConnectionResult {
  success: boolean,
  message: string,
  latencyMs: number;
  errorType?: string;
  suggestion?: string;
}

export interface AuthResponse {
  token: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
}

export interface ScanPortResult{
  port: number,
  open: boolean,
  latencyMs: number

}