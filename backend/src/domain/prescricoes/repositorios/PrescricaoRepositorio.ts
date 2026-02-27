import { Prescricao } from '../entidades/Prescricao';

export interface PrescricaoRepositorio {
  criar(prescricao: Prescricao): Promise<void>;
  atualizar(prescricao: Prescricao): Promise<void>;
  buscarPorId(id: string): Promise<Prescricao | null>;
  listarPorPaciente(pacienteId: string): Promise<Prescricao[]>;
}

