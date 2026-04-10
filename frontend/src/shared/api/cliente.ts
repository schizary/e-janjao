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

export interface DetalheErroValidacao {
  campo: string;
  mensagem: string;
}

export class ErroApi extends Error {
  status: number;
  detalhes?: DetalheErroValidacao[];

  constructor(mensagem: string, status: number, detalhes?: DetalheErroValidacao[]) {
    super(mensagem);
    this.name = 'ErroApi';
    this.status = status;
    this.detalhes = detalhes;
  }
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
  const contentType = resposta.headers.get('content-type') ?? '';
  const temJson = contentType.includes('application/json');
  const dados: unknown = temJson ? await resposta.json().catch(() => ({})) : null;

  if (!resposta.ok) {
    const erroObj = (dados ?? {}) as { erro?: unknown; detalhes?: unknown };
    const mensagem =
      typeof erroObj.erro === 'string' && erroObj.erro.trim() !== ''
        ? erroObj.erro
        : 'Erro na requisição';
    const detalhes = Array.isArray(erroObj.detalhes)
      ? (erroObj.detalhes as Array<{ campo?: unknown; mensagem?: unknown }>)
          .filter((d) => typeof d?.campo === 'string' && typeof d?.mensagem === 'string')
          .map((d) => ({ campo: d.campo as string, mensagem: d.mensagem as string }))
      : undefined;
    throw new ErroApi(mensagem, resposta.status, detalhes);
  }

  return (dados ?? null) as T;
}
