import { createContext } from 'react';
import type { Usuario } from '@/shared/tipos/api';

export interface EstadoAuth {
  token: string | null;
  usuario: Usuario | null;
  autenticado: boolean;
}

export interface AuthContextValor extends EstadoAuth {
  definirSessao: (token: string | null, usuario: Usuario | null) => void;
  sair: () => void;
}

export const AuthContext = createContext<AuthContextValor | null>(null);

