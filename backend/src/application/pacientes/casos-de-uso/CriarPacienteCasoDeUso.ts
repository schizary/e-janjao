import { Paciente } from '../../../domain/pacientes/entidades/Paciente';
import { PacienteRepositorio } from '../../../domain/pacientes/repositorios/PacienteRepositorio';
import { Cpf } from '../../../domain/pacientes/valor-objetos/Cpf';
import { Email } from '../../../domain/pacientes/valor-objetos/Email';
import { GeradorId } from '../../../shared/tipos/GeradorId';
import { CriarPacienteDTO } from '../dtos/CriarPacienteDTO';

export class CriarPacienteCasoDeUso {
  constructor(
    private readonly pacienteRepositorio: PacienteRepositorio,
    private readonly geradorId: GeradorId,
  ) {}

  async executar(dados: CriarPacienteDTO): Promise<Paciente> {
    const cpf = Cpf.criar(dados.cpf);
    const email = dados.email ? Email.criar(dados.email) : null;

    const pacienteExistente = await this.pacienteRepositorio.buscarPorCpf(cpf);
    if (pacienteExistente) {
      throw new Error('Já existe um paciente cadastrado com este CPF');
    }

    const paciente = Paciente.criar({
      id: this.geradorId.gerar(),
      nomeCompleto: dados.nomeCompleto,
      cpf,
      email,
      dataNascimento: dados.dataNascimento,
      telefone: dados.telefone ?? null,
    });

    await this.pacienteRepositorio.criar(paciente);

    return paciente;
  }
}

