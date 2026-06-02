import { requisicao } from '@/shared/api/cliente';
import type { Prescricao, PrescricaoItem } from '@/shared/tipos/api';

export type EmitirPrescricaoEntrada = {
  pacienteId: string;
  medicoId: string;
  itens: PrescricaoItem[];
  observacoesGerais?: string | null;
};

export async function emitirPrescricao(params: {
  entrada: EmitirPrescricaoEntrada;
  token: string;
}): Promise<Prescricao> {
  return requisicao<Prescricao>('/prescricoes', {
    metodo: 'POST',
    body: params.entrada,
    token: params.token,
  });
}

export async function listarPrescricoesPorPaciente(params: {
  pacienteId: string;
  token: string;
}): Promise<Prescricao[]> {
  return requisicao<Prescricao[]>(`/prescricoes/paciente/${params.pacienteId}`, { token: params.token });
}
