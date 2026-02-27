import { Paciente } from '../../../domain/pacientes/entidades/Paciente';
import { PacienteRepositorio } from '../../../domain/pacientes/repositorios/PacienteRepositorio';

export class ListarPacientesCasoDeUso {
  constructor(private readonly pacienteRepositorio: PacienteRepositorio) {}

  async executar(parteNome?: string): Promise<Paciente[]> {
    const termo = parteNome?.trim() ?? '';
    return this.pacienteRepositorio.listarPorNome(termo);
  }
}

