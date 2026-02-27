import { Consulta } from '../entidades/Consulta';

export interface ConsultaRepositorio {
  criar(consulta: Consulta): Promise<void>;
  atualizar(consulta: Consulta): Promise<void>;
  buscarPorId(id: string): Promise<Consulta | null>;
  listarPorPaciente(pacienteId: string): Promise<Consulta[]>;
  listarPorMedico(medicoId: string, data?: Date): Promise<Consulta[]>;
}

