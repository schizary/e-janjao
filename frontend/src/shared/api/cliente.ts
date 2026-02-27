/**
 * Cliente HTTP base para a API do backend.
 * Base URL e token são configuráveis via env ou contexto.
 */

const URL_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export type MetodoHttp = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface OpcoesRequisicao {
  metodo?: MetodoHttp;
  body?: unknown;
  token?: string | null;
  headers?: Record<string, string>;
}

export async function requisicao<T>(
  caminho: string,
  opcoes: OpcoesRequisicao = {},
): Promise<T> {
  const { metodo = 'GET', body, token, headers: headersCustom = {} } = opcoes;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headersCustom,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method: metodo,
    headers,
  };

  if (body !== undefined && metodo !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const resposta = await fetch(`${URL_BASE}${caminho}`, config);
  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    const mensagem = typeof dados?.erro === 'string' ? dados.erro : 'Erro na requisição';
    throw new Error(mensagem);
  }

  return dados as T;
}
