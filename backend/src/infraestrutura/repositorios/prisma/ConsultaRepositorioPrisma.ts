import { Consulta } from '../../../domain/consultas/entidades/Consulta';
import { ConsultaRepositorio } from '../../../domain/consultas/repositorios/ConsultaRepositorio';
import { HorarioConsulta } from '../../../domain/consultas/valor-objetos/HorarioConsulta';
import { prisma } from '../../prisma/PrismaCliente';

export class ConsultaRepositorioPrisma implements ConsultaRepositorio {
  async criar(consulta: Consulta): Promise<void> {
    const dados = consulta.obterDados();
    const horario = dados.horario;
    await prisma.consulta.create({
      data: {
        id: dados.id,
        pacienteId: dados.pacienteId,
        medicoId: dados.medicoId,
        inicio: horario.obterInicio(),
        fim: horario.obterFim(),
        status: dados.status,
        observacoes: dados.observacoes ?? null,
      },
    });
  }

  async atualizar(consulta: Consulta): Promise<void> {
    const dados = consulta.obterDados();
    const horario = dados.horario;
    await prisma.consulta.update({
      where: { id: dados.id },
      data: {
        inicio: horario.obterInicio(),
        fim: horario.obterFim(),
        status: dados.status,
        observacoes: dados.observacoes ?? null,
      },
    });
  }

  async buscarPorId(id: string): Promise<Consulta | null> {
    const row = await prisma.consulta.findUnique({ where: { id } });
    return row ? this.mapearParaDominio(row) : null;
  }

  async listarPorPaciente(pacienteId: string): Promise<Consulta[]> {
    const rows = await prisma.consulta.findMany({
      where: { pacienteId },
      orderBy: { inicio: 'desc' },
    });
    return rows.map((row) => this.mapearParaDominio(row));
  }

  async listarPorMedico(medicoId: string, data?: Date): Promise<Consulta[]> {
    const where: { medicoId: string; inicio?: { gte?: Date; lt?: Date } } = {
      medicoId,
    };
    if (data) {
      const inicioDia = new Date(data);
      inicioDia.setHours(0, 0, 0, 0);
      const fimDia = new Date(data);
      fimDia.setHours(23, 59, 59, 999);
      where.inicio = { gte: inicioDia, lt: fimDia };
    }
    const rows = await prisma.consulta.findMany({
      where,
      orderBy: { inicio: 'asc' },
    });
    return rows.map((row) => this.mapearParaDominio(row));
  }

  private mapearParaDominio(row: {
    id: string;
    pacienteId: string;
    medicoId: string;
    inicio: Date;
    fim: Date;
    status: 'AGENDADA' | 'CANCELADA' | 'REALIZADA';
    observacoes: string | null;
    criadoEm: Date;
    atualizadoEm: Date;
  }): Consulta {
    return Consulta.restaurar({
      id: row.id,
      pacienteId: row.pacienteId,
      medicoId: row.medicoId,
      horario: HorarioConsulta.criar(row.inicio, row.fim),
      status: row.status,
      observacoes: row.observacoes ?? null,
      criadoEm: row.criadoEm,
      atualizadoEm: row.atualizadoEm,
    });
  }
}
