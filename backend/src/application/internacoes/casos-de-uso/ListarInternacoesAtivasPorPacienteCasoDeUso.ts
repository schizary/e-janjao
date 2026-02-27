import { Internacao } from '../../../domain/internacoes/entidades/Internacao';
import { InternacaoRepositorio } from '../../../domain/internacoes/repositorios/InternacaoRepositorio';
import { ListarInternacoesAtivasPorPacienteDTO } from '../dtos/ListarInternacoesAtivasPorPacienteDTO';

export class ListarInternacoesAtivasPorPacienteCasoDeUso {
  constructor(private readonly internacaoRepositorio: InternacaoRepositorio) {}

  async executar(dados: ListarInternacoesAtivasPorPacienteDTO): Promise<Internacao[]> {
    return this.internacaoRepositorio.listarAtivasPorPaciente(dados.pacienteId);
  }
}

