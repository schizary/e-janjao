import { Internacao } from '../../../domain/internacoes/entidades/Internacao';
import { InternacaoRepositorio } from '../../../domain/internacoes/repositorios/InternacaoRepositorio';
import { prisma } from '../../prisma/PrismaCliente';

export class InternacaoRepositorioPrisma implements InternacaoRepositorio {
  async criar(internacao: Internacao): Promise<void> {
    const dados = internacao.obterDados();
    await prisma.internacao.create({
      data: {
        id: dados.id,
        pacienteId: dados.pacienteId,
        quarto: dados.quarto,
        leito: dados.leito,
        motivo: dados.motivo,
        dataEntrada: dados.dataEntrada,
        dataSaida: dados.dataSaida ?? null,
        status: dados.status,
        observacoes: dados.observacoes ?? null,
      },
    });
  }

  async atualizar(internacao: Internacao): Promise<void> {
    const dados = internacao.obterDados();
    await prisma.internacao.update({
      where: { id: dados.id },
      data: {
        quarto: dados.quarto,
        leito: dados.leito,
        motivo: dados.motivo,
        dataEntrada: dados.dataEntrada,
        dataSaida: dados.dataSaida ?? null,
        status: dados.status,
        observacoes: dados.observacoes ?? null,
      },
    });
  }

  async buscarPorId(id: string): Promise<Internacao | null> {
    const row = await prisma.internacao.findUnique({ where: { id } });
    return row ? this.mapearParaDominio(row) : null;
  }

  async listarAtivasPorPaciente(pacienteId: string): Promise<Internacao[]> {
    const rows = await prisma.internacao.findMany({
      where: { pacienteId, status: 'ATIVA' },
      orderBy: { dataEntrada: 'desc' },
    });
    return rows.map((row) => this.mapearParaDominio(row));
  }

  async listarPorPaciente(pacienteId: string): Promise<Internacao[]> {
    const rows = await prisma.internacao.findMany({
      where: { pacienteId },
      orderBy: { dataEntrada: 'desc' },
    });
    return rows.map((row) => this.mapearParaDominio(row));
  }

  private mapearParaDominio(row: {
    id: string;
    pacienteId: string;
    quarto: string;
    leito: string;
    motivo: string;
    dataEntrada: Date;
    dataSaida: Date | null;
    status: 'ATIVA' | 'ALTA' | 'TRANSFERIDA';
    observacoes: string | null;
    criadoEm: Date;
    atualizadoEm: Date;
  }): Internacao {
    return Internacao.restaurar({
      id: row.id,
      pacienteId: row.pacienteId,
      quarto: row.quarto,
      leito: row.leito,
      motivo: row.motivo,
      dataEntrada: row.dataEntrada,
      dataSaida: row.dataSaida ?? null,
      status: row.status,
      observacoes: row.observacoes ?? null,
      criadoEm: row.criadoEm,
      atualizadoEm: row.atualizadoEm,
    });
  }
}
