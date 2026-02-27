import { Paciente } from '../../../domain/pacientes/entidades/Paciente';
import { PacienteRepositorio } from '../../../domain/pacientes/repositorios/PacienteRepositorio';
import { Email } from '../../../domain/pacientes/valor-objetos/Email';
import { AtualizarContatoPacienteDTO } from '../dtos/AtualizarContatoPacienteDTO';

export class AtualizarContatoPacienteCasoDeUso {
  constructor(private readonly pacienteRepositorio: PacienteRepositorio) {}

  async executar(dados: AtualizarContatoPacienteDTO): Promise<Paciente> {
    const paciente = await this.pacienteRepositorio.buscarPorId(dados.pacienteId);

    if (!paciente) {
      throw new Error('Paciente não encontrado');
    }

    const email = dados.email ? Email.criar(dados.email) : null;

    paciente.alterarContato(email, dados.telefone ?? null);

    await this.pacienteRepositorio.atualizar(paciente);

    return paciente;
  }
}

