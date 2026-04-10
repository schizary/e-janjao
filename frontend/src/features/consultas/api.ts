import { requisicao } from '@/shared/api/cliente';
import type { Consulta } from '@/shared/tipos/api';

export type AgendarConsultaEntrada = {
  pacienteId: string;
  medicoId: string;
  inicio: string; // datetime-local / ISO (z.coerce.date)
  fim: string; // datetime-local / ISO (z.coerce.date)
  observacoes?: string | null;
};

export async function agendarConsulta(params: { entrada: AgendarConsultaEntrada; token: string }): Promise<Consulta> {
  return requisicao<Consulta>('/consultas', {
    metodo: 'POST',
    body: params.entrada,
    token: params.token,
  });
}

export async function cancelarConsulta(params: { id: string; motivo?: string | null; token: string }): Promise<Consulta> {
  return requisicao<Consulta>(`/consultas/${params.id}/cancelar`, {
    metodo: 'POST',
    body: { motivo: params.motivo ?? null },
    token: params.token,
  });
}

export async function listarConsultasPorPaciente(params: { pacienteId: string; token: string }): Promise<Consulta[]> {
  return requisicao<Consulta[]>(`/consultas/paciente/${params.pacienteId}`, { token: params.token });
}

