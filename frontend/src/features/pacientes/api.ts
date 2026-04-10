import { requisicao } from '@/shared/api/cliente';
import type { Paciente } from '@/shared/tipos/api';

export type CriarPacienteEntrada = {
  nomeCompleto: string;
  cpf: string;
  email?: string | null;
  dataNascimento: string; // YYYY-MM-DD (aceito pelo z.coerce.date do backend)
  telefone?: string | null;
};

export type AtualizarContatoPacienteEntrada = {
  email?: string | null;
  telefone?: string | null;
};

export async function listarPacientes(params: { nome?: string; token: string }): Promise<Paciente[]> {
  const nome = params.nome ?? '';
  const qs = new URLSearchParams({ nome });
  return requisicao<Paciente[]>(`/pacientes?${qs.toString()}`, { token: params.token });
}

export async function criarPaciente(params: { entrada: CriarPacienteEntrada; token: string }): Promise<Paciente> {
  return requisicao<Paciente>('/pacientes', {
    metodo: 'POST',
    body: params.entrada,
    token: params.token,
  });
}

export async function buscarPacientePorId(params: { id: string; token: string }): Promise<Paciente> {
  return requisicao<Paciente>(`/pacientes/${params.id}`, { token: params.token });
}

export async function atualizarContatoPaciente(params: {
  id: string;
  entrada: AtualizarContatoPacienteEntrada;
  token: string;
}): Promise<Paciente> {
  return requisicao<Paciente>(`/pacientes/${params.id}/contato`, {
    metodo: 'PATCH',
    body: params.entrada,
    token: params.token,
  });
}

