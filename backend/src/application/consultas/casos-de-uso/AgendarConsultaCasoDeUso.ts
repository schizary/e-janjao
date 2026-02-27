import { Consulta } from '../../../domain/consultas/entidades/Consulta';
import { ConsultaRepositorio } from '../../../domain/consultas/repositorios/ConsultaRepositorio';
import { HorarioConsulta } from '../../../domain/consultas/valor-objetos/HorarioConsulta';
import { MedicoRepositorio } from '../../../domain/medicos/repositorios/MedicoRepositorio';
import { PacienteRepositorio } from '../../../domain/pacientes/repositorios/PacienteRepositorio';
import { GeradorId } from '../../../shared/tipos/GeradorId';
import { AgendarConsultaDTO } from '../dtos/AgendarConsultaDTO';

export class AgendarConsultaCasoDeUso {
  constructor(
    private readonly consultaRepositorio: ConsultaRepositorio,
    private readonly pacienteRepositorio: PacienteRepositorio,
    private readonly medicoRepositorio: MedicoRepositorio,
    private readonly geradorId: GeradorId,
  ) {}

  async executar(dados: AgendarConsultaDTO): Promise<Consulta> {
    const paciente = await this.pacienteRepositorio.buscarPorId(dados.pacienteId);
    if (!paciente) {
      throw new Error('Paciente não encontrado para agendamento de consulta');
    }

    const medico = await this.medicoRepositorio.buscarPorId(dados.medicoId);
    if (!medico) {
      throw new Error('Médico não encontrado para agendamento de consulta');
    }

    const horario = HorarioConsulta.criar(dados.inicio, dados.fim);

    const consulta = Consulta.agendar({
      id: this.geradorId.gerar(),
      pacienteId: dados.pacienteId,
      medicoId: dados.medicoId,
      horario,
      observacoes: dados.observacoes ?? null,
    });

    await this.consultaRepositorio.criar(consulta);

    return consulta;
  }
}

