import { Exame } from '../entidades/Exame';

export interface ExameRepositorio {
  criar(exame: Exame): Promise<void>;
  atualizar(exame: Exame): Promise<void>;
  buscarPorId(id: string): Promise<Exame | null>;
  listarPorPaciente(pacienteId: string): Promise<Exame[]>;
}

