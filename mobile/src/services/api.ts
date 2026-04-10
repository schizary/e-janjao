import type { Consulta, Dashboard, Exame, Internacao, Medico, Paciente, Prescricao, Sessao } from '../types';

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:3000";

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    let message = 'Erro na requisição.';
    try {
      const body = await response.json();
      message = body.mensagem || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  apiUrl: API_URL,
  login: (email: string, senha: string) => request<Sessao>('/auth/login', { method: 'POST', body: JSON.stringify({ email, senha }) }),
  dashboard: (token: string) => request<Dashboard>('/dashboard', {}, token),
  listarPacientes: (token: string) => request<Paciente[]>('/pacientes', {}, token),
  criarPaciente: (token: string, body: Omit<Paciente, 'id'>) => request<Paciente>('/pacientes', { method: 'POST', body: JSON.stringify(body) }, token),
  listarMedicos: (token: string) => request<Medico[]>('/medicos', {}, token),
  criarMedico: (token: string, body: Omit<Medico, 'id'>) => request<Medico>('/medicos', { method: 'POST', body: JSON.stringify(body) }, token),
  listarConsultas: (token: string) => request<Consulta[]>('/consultas', {}, token),
  criarConsulta: (token: string, body: Omit<Consulta, 'id' | 'paciente' | 'medico'>) => request<Consulta>('/consultas', { method: 'POST', body: JSON.stringify(body) }, token),
  listarExames: (token: string) => request<Exame[]>('/exames', {}, token),
  criarExame: (token: string, body: Omit<Exame, 'id' | 'paciente'>) => request<Exame>('/exames', { method: 'POST', body: JSON.stringify(body) }, token),
  listarPrescricoes: (token: string) => request<Prescricao[]>('/prescricoes', {}, token),
  criarPrescricao: (token: string, body: Omit<Prescricao, 'id' | 'paciente' | 'medico'>) => request<Prescricao>('/prescricoes', { method: 'POST', body: JSON.stringify(body) }, token),
  listarInternacoes: (token: string) => request<Internacao[]>('/internacoes', {}, token),
  criarInternacao: (token: string, body: Omit<Internacao, 'id' | 'paciente'>) => request<Internacao>('/internacoes', { method: 'POST', body: JSON.stringify(body) }, token),
};
