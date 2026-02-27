import {
  DadosPrescricaoItem,
  Prescricao,
} from '../../../domain/prescricoes/entidades/Prescricao';
import { PrescricaoRepositorio } from '../../../domain/prescricoes/repositorios/PrescricaoRepositorio';
import { prisma } from '../../prisma/PrismaCliente';

export class PrescricaoRepositorioPrisma implements PrescricaoRepositorio {
  async criar(prescricao: Prescricao): Promise<void> {
    const dados = prescricao.obterDados();
    await prisma.prescricao.create({
      data: {
        id: dados.id,
        pacienteId: dados.pacienteId,
        medicoId: dados.medicoId,
        observacoesGerais: dados.observacoesGerais ?? null,
        itens: {
          create: dados.itens.map((item: DadosPrescricaoItem) => ({
            medicamento: item.medicamento,
            dosagem: item.dosagem,
            frequencia: item.frequencia,
            duracaoDias: item.duracaoDias ?? null,
          })),
        },
      },
    });
  }

  async atualizar(prescricao: Prescricao): Promise<void> {
    const dados = prescricao.obterDados();
    await prisma.prescricaoItem.deleteMany({
      where: { prescricaoId: dados.id },
    });
    await prisma.prescricao.update({
      where: { id: dados.id },
      data: {
        observacoesGerais: dados.observacoesGerais ?? null,
        itens: {
          create: dados.itens.map((item: DadosPrescricaoItem) => ({
            medicamento: item.medicamento,
            dosagem: item.dosagem,
            frequencia: item.frequencia,
            duracaoDias: item.duracaoDias ?? null,
          })),
        },
      },
    });
  }

  async buscarPorId(id: string): Promise<Prescricao | null> {
    const row = await prisma.prescricao.findUnique({
      where: { id },
      include: { itens: true },
    });
    return row ? this.mapearParaDominio(row) : null;
  }

  async listarPorPaciente(pacienteId: string): Promise<Prescricao[]> {
    const rows = await prisma.prescricao.findMany({
      where: { pacienteId },
      include: { itens: true },
      orderBy: { criadoEm: 'desc' },
    });
    return rows.map((row) => this.mapearParaDominio(row));
  }

  private mapearParaDominio(row: {
    id: string;
    pacienteId: string;
    medicoId: string;
    observacoesGerais: string | null;
    criadoEm: Date;
    atualizadoEm: Date;
    itens: Array<{
      medicamento: string;
      dosagem: string;
      frequencia: string;
      duracaoDias: number | null;
    }>;
  }): Prescricao {
    return Prescricao.restaurar({
      id: row.id,
      pacienteId: row.pacienteId,
      medicoId: row.medicoId,
      itens: row.itens.map((item) => ({
        medicamento: item.medicamento,
        dosagem: item.dosagem,
        frequencia: item.frequencia,
        duracaoDias: item.duracaoDias ?? null,
      })),
      observacoesGerais: row.observacoesGerais ?? null,
      criadoEm: row.criadoEm,
      atualizadoEm: row.atualizadoEm,
    });
  }
}
