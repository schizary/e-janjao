import { requisicao } from '@/shared/api/cliente';
import type { Internacao } from '@/shared/tipos/api';

export type RegistrarInternacaoEntrada = {
  pacienteId: string;
  quarto: string;
  leito: string;
  motivo: string;
  dataEntrada: string;
  observacoes?: string | null;
};

export type DarAltaEntrada = {
  dataSaida: string;
  observacoes?: string | null;
};

export async function registrarInternacao(params: {
  entrada: RegistrarInternacaoEntrada;
  token: string;
}): Promise<Internacao> {
  return requisicao<Internacao>('/internacoes', {
    metodo: 'POST',
    body: params.entrada,
    token: params.token,
  });
}

export async function listarInternacoesPorPaciente(params: {
  pacienteId: string;
  token: string;
}): Promise<Internacao[]> {
  return requisicao<Internacao[]>(`/internacoes/paciente/${params.pacienteId}`, { token: params.token });
}

export async function listarInternacoesAtivasPorPaciente(params: {
  pacienteId: string;
  token: string;
}): Promise<Internacao[]> {
  return requisicao<Internacao[]>(`/internacoes/paciente/${params.pacienteId}/ativas`, {
    token: params.token,
  });
}

export async function darAltaInternacao(params: {
  id: string;
  entrada: DarAltaEntrada;
  token: string;
}): Promise<Internacao> {
  return requisicao<Internacao>(`/internacoes/${params.id}/alta`, {
    metodo: 'POST',
    body: params.entrada,
    token: params.token,
  });
}
