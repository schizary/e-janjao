import { Prescricao } from '../../../domain/prescricoes/entidades/Prescricao';
import { PrescricaoRepositorio } from '../../../domain/prescricoes/repositorios/PrescricaoRepositorio';
import { ListarPrescricoesPorPacienteDTO } from '../dtos/ListarPrescricoesPorPacienteDTO';

export class ListarPrescricoesPorPacienteCasoDeUso {
  constructor(private readonly prescricaoRepositorio: PrescricaoRepositorio) {}

  async executar(dados: ListarPrescricoesPorPacienteDTO): Promise<Prescricao[]> {
    return this.prescricaoRepositorio.listarPorPaciente(dados.pacienteId);
  }
}

