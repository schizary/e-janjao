import { useCallback, useState, type ReactNode } from 'react';
import type { Usuario } from '@/shared/tipos/api';
import { AuthContext, type AuthContextValor, type EstadoAuth } from './AuthContextBase';

const CHAVE_TOKEN = 'gestao_hospitalar_token';
const CHAVE_USUARIO = 'gestao_hospitalar_usuario';

function carregarEstadoInicial(): EstadoAuth {
  const token = localStorage.getItem(CHAVE_TOKEN);
  const usuarioJson = localStorage.getItem(CHAVE_USUARIO);
  let usuario: Usuario | null = null;
  if (usuarioJson) {
    try {
      usuario = JSON.parse(usuarioJson) as Usuario;
    } catch {
      localStorage.removeItem(CHAVE_USUARIO);
    }
  }
  return {
    token,
    usuario,
    autenticado: Boolean(token && usuario),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoAuth>(carregarEstadoInicial);

  const definirSessao = useCallback((token: string | null, usuario: Usuario | null) => {
    if (token && usuario) {
      localStorage.setItem(CHAVE_TOKEN, token);
      localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
      setEstado({ token, usuario, autenticado: true });
    } else {
      localStorage.removeItem(CHAVE_TOKEN);
      localStorage.removeItem(CHAVE_USUARIO);
      setEstado({ token: null, usuario: null, autenticado: false });
    }
  }, []);

  const sair = useCallback(() => {
    definirSessao(null, null);
  }, [definirSessao]);

  const valor: AuthContextValor = {
    ...estado,
    definirSessao,
    sair,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
