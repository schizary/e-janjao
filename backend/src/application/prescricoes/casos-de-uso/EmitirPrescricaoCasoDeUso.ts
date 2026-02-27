import { Prescricao } from '../../../domain/prescricoes/entidades/Prescricao';
import { PrescricaoRepositorio } from '../../../domain/prescricoes/repositorios/PrescricaoRepositorio';
import { MedicoRepositorio } from '../../../domain/medicos/repositorios/MedicoRepositorio';
import { PacienteRepositorio } from '../../../domain/pacientes/repositorios/PacienteRepositorio';
import { GeradorId } from '../../../shared/tipos/GeradorId';
import { EmitirPrescricaoDTO } from '../dtos/EmitirPrescricaoDTO';

export class EmitirPrescricaoCasoDeUso {
  constructor(
    private readonly prescricaoRepositorio: PrescricaoRepositorio,
    private readonly pacienteRepositorio: PacienteRepositorio,
    private readonly medicoRepositorio: MedicoRepositorio,
    private readonly geradorId: GeradorId,
  ) {}

  async executar(dados: EmitirPrescricaoDTO): Promise<Prescricao> {
    const paciente = await this.pacienteRepositorio.buscarPorId(dados.pacienteId);
    if (!paciente) {
      throw new Error('Paciente não encontrado para emissão de prescrição');
    }

    const medico = await this.medicoRepositorio.buscarPorId(dados.medicoId);
    if (!medico) {
      throw new Error('Médico não encontrado para emissão de prescrição');
    }

    const prescricao = Prescricao.criar({
      id: this.geradorId.gerar(),
      pacienteId: dados.pacienteId,
      medicoId: dados.medicoId,
      itens: dados.itens.map((item) => ({ ...item })),
      observacoesGerais: dados.observacoesGerais ?? null,
    });

    await this.prescricaoRepositorio.criar(prescricao);

    return prescricao;
  }
}

