import { Paciente } from '../entidades/Paciente';
import { Cpf } from '../valor-objetos/Cpf';

export interface PacienteRepositorio {
  criar(paciente: Paciente): Promise<void>;
  atualizar(paciente: Paciente): Promise<void>;
  buscarPorId(id: string): Promise<Paciente | null>;
  buscarPorCpf(cpf: Cpf): Promise<Paciente | null>;
  listarPorNome(parteNome: string): Promise<Paciente[]>;
}

