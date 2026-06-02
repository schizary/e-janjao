import type { Consulta, Exame, Internacao, Medico, Paciente, Prescricao, PrescricaoItem, Sessao } from '../types';

// Emulação: AVD Android acessa o host como 10.0.2.2, mas quando
// o código roda no navegador (Expo web / browser) devemos usar localhost.
const defaultApi = typeof window !== 'undefined' ? 'http://localhost:3000/api' : 'http://10.0.2.2:3000/api';
const API_URL = process.env.EXPO_PUBLIC_API_URL || defaultApi;

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
      const body = await response.json() as { erro?: string; mensagem?: string; detalhes?: Array<{ mensagem?: string }> };
      message = body.erro || body.mensagem || message;
      if (body.detalhes?.length) {
        const detalhes = body.detalhes.map((d) => d.mensagem).filter(Boolean).join(' ');
        if (detalhes) message = `${message} ${detalhes}`;
      }
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
  listarPacientes: (token: string) => request<Paciente[]>('/pacientes', {}, token),
  criarPaciente: (token: string, body: Omit<Paciente, 'id'>) => request<Paciente>('/pacientes', { method: 'POST', body: JSON.stringify(body) }, token),
  listarMedicos: (token: string) => request<Medico[]>('/medicos', {}, token),
  criarMedico: (token: string, body: Omit<Medico, 'id'>) => request<Medico>('/medicos', { method: 'POST', body: JSON.stringify(body) }, token),
  listarConsultasPorPaciente: (token: string, pacienteId: string) =>
    request<Consulta[]>(`/consultas/paciente/${pacienteId}`, {}, token),
  criarConsulta: (
    token: string,
    body: { pacienteId: string; medicoId: string; inicio: string; fim: string; observacoes?: string | null },
  ) => request<Consulta>('/consultas', { method: 'POST', body: JSON.stringify(body) }, token),
  listarExamesPorPaciente: (token: string, pacienteId: string) =>
    request<Exame[]>(`/exames/paciente/${pacienteId}`, {}, token),
  criarExame: (
    token: string,
    body: { pacienteId: string; tipo: string; dataHora: string; local: string },
  ) => request<Exame>('/exames', { method: 'POST', body: JSON.stringify(body) }, token),
  registrarResultadoExame: (token: string, id: string, resultado: string) =>
    request<Exame>(`/exames/${id}/resultado`, { method: 'PATCH', body: JSON.stringify({ resultado }) }, token),
  listarPrescricoesPorPaciente: (token: string, pacienteId: string) =>
    request<Prescricao[]>(`/prescricoes/paciente/${pacienteId}`, {}, token),
  criarPrescricao: (
    token: string,
    body: { pacienteId: string; medicoId: string; itens: PrescricaoItem[]; observacoesGerais?: string | null },
  ) => request<Prescricao>('/prescricoes', { method: 'POST', body: JSON.stringify(body) }, token),
  listarInternacoesPorPaciente: (token: string, pacienteId: string) =>
    request<Internacao[]>(`/internacoes/paciente/${pacienteId}`, {}, token),
  criarInternacao: (
    token: string,
    body: { pacienteId: string; quarto: string; leito: string; motivo: string; dataEntrada: string; observacoes?: string | null },
  ) => request<Internacao>('/internacoes', { method: 'POST', body: JSON.stringify(body) }, token),
  darAltaInternacao: (
    token: string,
    id: string,
    body: { dataSaida: string; observacoes?: string | null },
  ) => request<Internacao>(`/internacoes/${id}/alta`, { method: 'POST', body: JSON.stringify(body) }, token),
};
