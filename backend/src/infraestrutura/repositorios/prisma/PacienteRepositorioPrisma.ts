import { Paciente } from '../../../domain/pacientes/entidades/Paciente';
import { PacienteRepositorio } from '../../../domain/pacientes/repositorios/PacienteRepositorio';
import { Cpf } from '../../../domain/pacientes/valor-objetos/Cpf';
import { Email } from '../../../domain/pacientes/valor-objetos/Email';
import { prisma } from '../../prisma/PrismaCliente';

export class PacienteRepositorioPrisma implements PacienteRepositorio {
  async criar(paciente: Paciente): Promise<void> {
    const dados = paciente.obterDados();
    await prisma.paciente.create({
      data: {
        id: dados.id,
        nomeCompleto: dados.nomeCompleto,
        cpf: dados.cpf.obterValor(),
        email: dados.email?.obterValor() ?? null,
        dataNascimento: dados.dataNascimento,
        telefone: dados.telefone ?? null,
      },
    });
  }

  async atualizar(paciente: Paciente): Promise<void> {
    const dados = paciente.obterDados();
    await prisma.paciente.update({
      where: { id: dados.id },
      data: {
        nomeCompleto: dados.nomeCompleto,
        cpf: dados.cpf.obterValor(),
        email: dados.email?.obterValor() ?? null,
        dataNascimento: dados.dataNascimento,
        telefone: dados.telefone ?? null,
      },
    });
  }

  async buscarPorId(id: string): Promise<Paciente | null> {
    const row = await prisma.paciente.findUnique({ where: { id } });
    return row ? this.mapearParaDominio(row) : null;
  }

  async buscarPorCpf(cpf: Cpf): Promise<Paciente | null> {
    const row = await prisma.paciente.findUnique({
      where: { cpf: cpf.obterValor() },
    });
    return row ? this.mapearParaDominio(row) : null;
  }

  async listarPorNome(parteNome: string): Promise<Paciente[]> {
    const rows = await prisma.paciente.findMany({
      where:
        parteNome.length > 0
          ? { nomeCompleto: { contains: parteNome } }
          : undefined,
      orderBy: { nomeCompleto: 'asc' },
    });
    return rows.map((row) => this.mapearParaDominio(row));
  }

  private mapearParaDominio(row: {
    id: string;
    nomeCompleto: string;
    cpf: string;
    email: string | null;
    dataNascimento: Date;
    telefone: string | null;
    criadoEm: Date;
    atualizadoEm: Date;
  }): Paciente {
    return Paciente.restaurar({
      id: row.id,
      nomeCompleto: row.nomeCompleto,
      cpf: Cpf.criar(row.cpf),
      email: row.email ? Email.criar(row.email) : null,
      dataNascimento: row.dataNascimento,
      telefone: row.telefone ?? null,
      criadoEm: row.criadoEm,
      atualizadoEm: row.atualizadoEm,
    });
  }
}
