import { Paciente } from '../../../domain/pacientes/entidades/Paciente';
import { PacienteRepositorio } from '../../../domain/pacientes/repositorios/PacienteRepositorio';

export class BuscarPacientePorIdCasoDeUso {
  constructor(private readonly pacienteRepositorio: PacienteRepositorio) {}

  async executar(id: string): Promise<Paciente> {
    const paciente = await this.pacienteRepositorio.buscarPorId(id);

    if (!paciente) {
      throw new Error('Paciente não encontrado');
    }

    return paciente;
  }
}

