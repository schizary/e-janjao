import { Exame } from '../../../domain/exames/entidades/Exame';
import { ExameRepositorio } from '../../../domain/exames/repositorios/ExameRepositorio';
import { PacienteRepositorio } from '../../../domain/pacientes/repositorios/PacienteRepositorio';
import { GeradorId } from '../../../shared/tipos/GeradorId';
import { AgendarExameDTO } from '../dtos/AgendarExameDTO';

export class AgendarExameCasoDeUso {
  constructor(
    private readonly exameRepositorio: ExameRepositorio,
    private readonly pacienteRepositorio: PacienteRepositorio,
    private readonly geradorId: GeradorId,
  ) {}

  async executar(dados: AgendarExameDTO): Promise<Exame> {
    const paciente = await this.pacienteRepositorio.buscarPorId(dados.pacienteId);
    if (!paciente) {
      throw new Error('Paciente não encontrado para agendamento de exame');
    }

    const exame = Exame.agendar({
      id: this.geradorId.gerar(),
      pacienteId: dados.pacienteId,
      tipo: dados.tipo,
      dataHora: dados.dataHora,
      local: dados.local,
    });

    await this.exameRepositorio.criar(exame);

    return exame;
  }
}

