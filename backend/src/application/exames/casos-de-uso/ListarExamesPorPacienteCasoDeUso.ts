import { Exame } from '../../../domain/exames/entidades/Exame';
import { ExameRepositorio } from '../../../domain/exames/repositorios/ExameRepositorio';
import { ListarExamesPorPacienteDTO } from '../dtos/ListarExamesPorPacienteDTO';

export class ListarExamesPorPacienteCasoDeUso {
  constructor(private readonly exameRepositorio: ExameRepositorio) {}

  async executar(dados: ListarExamesPorPacienteDTO): Promise<Exame[]> {
    return this.exameRepositorio.listarPorPaciente(dados.pacienteId);
  }
}
