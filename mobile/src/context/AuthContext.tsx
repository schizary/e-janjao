import React, { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../services/api';
import type { Usuario } from '../types';

interface AuthContextValue {
  token: string | null;
  usuario: Usuario | null;
  carregar: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregar, setCarregar] = useState(false);

  async function entrar(email: string, senha: string) {
    setCarregar(true);
    try {
      const sessao = await api.login(email, senha);
      setToken(sessao.tokenAcesso);
      setUsuario(sessao.usuario);
    } finally {
      setCarregar(false);
    }
  }

  function sair() {
    setToken(null);
    setUsuario(null);
  }

  const value = useMemo(() => ({ token, usuario, carregar, entrar, sair }), [token, usuario, carregar]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth precisa estar dentro de AuthProvider');
  }
  return context;
}
