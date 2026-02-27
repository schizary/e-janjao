import { Exame } from '../../../domain/exames/entidades/Exame';
import { ExameRepositorio } from '../../../domain/exames/repositorios/ExameRepositorio';
import { prisma } from '../../prisma/PrismaCliente';

export class ExameRepositorioPrisma implements ExameRepositorio {
  async criar(exame: Exame): Promise<void> {
    const dados = exame.obterDados();
    await prisma.exame.create({
      data: {
        id: dados.id,
        pacienteId: dados.pacienteId,
        tipo: dados.tipo,
        dataHora: dados.dataHora,
        local: dados.local,
        status: dados.status,
        resultado: dados.resultado ?? null,
      },
    });
  }

  async atualizar(exame: Exame): Promise<void> {
    const dados = exame.obterDados();
    await prisma.exame.update({
      where: { id: dados.id },
      data: {
        tipo: dados.tipo,
        dataHora: dados.dataHora,
        local: dados.local,
        status: dados.status,
        resultado: dados.resultado ?? null,
      },
    });
  }

  async buscarPorId(id: string): Promise<Exame | null> {
    const row = await prisma.exame.findUnique({ where: { id } });
    return row ? this.mapearParaDominio(row) : null;
  }

  async listarPorPaciente(pacienteId: string): Promise<Exame[]> {
    const rows = await prisma.exame.findMany({
      where: { pacienteId },
      orderBy: { dataHora: 'desc' },
    });
    return rows.map((row) => this.mapearParaDominio(row));
  }

  private mapearParaDominio(row: {
    id: string;
    pacienteId: string;
    tipo: string;
    dataHora: Date;
    local: string;
    status: 'AGENDADO' | 'CANCELADO' | 'REALIZADO';
    resultado: string | null;
    criadoEm: Date;
    atualizadoEm: Date;
  }): Exame {
    return Exame.restaurar({
      id: row.id,
      pacienteId: row.pacienteId,
      tipo: row.tipo,
      dataHora: row.dataHora,
      local: row.local,
      status: row.status,
      resultado: row.resultado ?? null,
      criadoEm: row.criadoEm,
      atualizadoEm: row.atualizadoEm,
    });
  }
}
