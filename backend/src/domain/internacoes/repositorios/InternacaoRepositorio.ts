import { Internacao } from '../entidades/Internacao';

export interface InternacaoRepositorio {
  criar(internacao: Internacao): Promise<void>;
  atualizar(internacao: Internacao): Promise<void>;
  buscarPorId(id: string): Promise<Internacao | null>;
  listarAtivasPorPaciente(pacienteId: string): Promise<Internacao[]>;
  listarPorPaciente(pacienteId: string): Promise<Internacao[]>;
}

