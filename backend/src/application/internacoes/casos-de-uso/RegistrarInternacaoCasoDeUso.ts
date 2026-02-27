import { Internacao } from '../../../domain/internacoes/entidades/Internacao';
import { InternacaoRepositorio } from '../../../domain/internacoes/repositorios/InternacaoRepositorio';
import { PacienteRepositorio } from '../../../domain/pacientes/repositorios/PacienteRepositorio';
import { GeradorId } from '../../../shared/tipos/GeradorId';
import { RegistrarInternacaoDTO } from '../dtos/RegistrarInternacaoDTO';

export class RegistrarInternacaoCasoDeUso {
  constructor(
    private readonly internacaoRepositorio: InternacaoRepositorio,
    private readonly pacienteRepositorio: PacienteRepositorio,
    private readonly geradorId: GeradorId,
  ) {}

  async executar(dados: RegistrarInternacaoDTO): Promise<Internacao> {
    const paciente = await this.pacienteRepositorio.buscarPorId(dados.pacienteId);
    if (!paciente) {
      throw new Error('Paciente não encontrado para registro de internação');
    }

    const internacao = Internacao.registrar({
      id: this.geradorId.gerar(),
      pacienteId: dados.pacienteId,
      quarto: dados.quarto,
      leito: dados.leito,
      motivo: dados.motivo,
      dataEntrada: dados.dataEntrada,
      observacoes: dados.observacoes ?? null,
    });

    await this.internacaoRepositorio.criar(internacao);

    return internacao;
  }
}

