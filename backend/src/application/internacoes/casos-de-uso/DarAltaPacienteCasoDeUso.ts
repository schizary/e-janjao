import { Internacao } from '../../../domain/internacoes/entidades/Internacao';
import { InternacaoRepositorio } from '../../../domain/internacoes/repositorios/InternacaoRepositorio';
import { DarAltaPacienteDTO } from '../dtos/DarAltaPacienteDTO';

export class DarAltaPacienteCasoDeUso {
  constructor(private readonly internacaoRepositorio: InternacaoRepositorio) {}

  async executar(dados: DarAltaPacienteDTO): Promise<Internacao> {
    const internacao = await this.internacaoRepositorio.buscarPorId(dados.internacaoId);

    if (!internacao) {
      throw new Error('Internação não encontrada');
    }

    internacao.registrarAlta(dados.dataSaida, dados.observacoes ?? undefined);

    await this.internacaoRepositorio.atualizar(internacao);

    return internacao;
  }
}

