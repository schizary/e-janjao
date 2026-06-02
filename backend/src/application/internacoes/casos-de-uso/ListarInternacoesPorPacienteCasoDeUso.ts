import { Internacao } from '../../../domain/internacoes/entidades/Internacao';
import { InternacaoRepositorio } from '../../../domain/internacoes/repositorios/InternacaoRepositorio';
import { ListarInternacoesPorPacienteDTO } from '../dtos/ListarInternacoesPorPacienteDTO';

export class ListarInternacoesPorPacienteCasoDeUso {
  constructor(private readonly internacaoRepositorio: InternacaoRepositorio) {}

  async executar(dados: ListarInternacoesPorPacienteDTO): Promise<Internacao[]> {
    return this.internacaoRepositorio.listarPorPaciente(dados.pacienteId);
  }
}
