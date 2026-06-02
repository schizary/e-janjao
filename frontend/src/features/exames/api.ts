import { requisicao } from '@/shared/api/cliente';
import type { Exame } from '@/shared/tipos/api';

export type AgendarExameEntrada = {
  pacienteId: string;
  tipo: string;
  dataHora: string;
  local: string;
};

export async function agendarExame(params: { entrada: AgendarExameEntrada; token: string }): Promise<Exame> {
  return requisicao<Exame>('/exames', {
    metodo: 'POST',
    body: params.entrada,
    token: params.token,
  });
}

export async function listarExamesPorPaciente(params: { pacienteId: string; token: string }): Promise<Exame[]> {
  return requisicao<Exame[]>(`/exames/paciente/${params.pacienteId}`, { token: params.token });
}

export async function registrarResultadoExame(params: {
  id: string;
  resultado: string;
  token: string;
}): Promise<Exame> {
  return requisicao<Exame>(`/exames/${params.id}/resultado`, {
    metodo: 'PATCH',
    body: { resultado: params.resultado },
    token: params.token,
  });
}
