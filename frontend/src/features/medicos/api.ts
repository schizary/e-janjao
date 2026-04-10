import { requisicao } from '@/shared/api/cliente';
import type { Medico } from '@/shared/tipos/api';

export type CriarMedicoEntrada = {
  nomeCompleto: string;
  crm: string;
  especialidade: string;
};

export async function listarMedicos(params: { especialidade?: string; token: string }): Promise<Medico[]> {
  const especialidade = params.especialidade ?? '';
  const qs = new URLSearchParams({ especialidade });
  return requisicao<Medico[]>(`/medicos?${qs.toString()}`, { token: params.token });
}

export async function criarMedico(params: { entrada: CriarMedicoEntrada; token: string }): Promise<Medico> {
  return requisicao<Medico>('/medicos', {
    metodo: 'POST',
    body: params.entrada,
    token: params.token,
  });
}

