import { Medico } from '../../../domain/medicos/entidades/Medico';
import { MedicoRepositorio } from '../../../domain/medicos/repositorios/MedicoRepositorio';
import { Crm } from '../../../domain/medicos/valor-objetos/Crm';
import { prisma } from '../../prisma/PrismaCliente';

export class MedicoRepositorioPrisma implements MedicoRepositorio {
  async criar(medico: Medico): Promise<void> {
    const dados = medico.obterDados();
    await prisma.medico.create({
      data: {
        id: dados.id,
        nomeCompleto: dados.nomeCompleto,
        crm: dados.crm.obterValor(),
        especialidade: dados.especialidade,
      },
    });
  }

  async atualizar(medico: Medico): Promise<void> {
    const dados = medico.obterDados();
    await prisma.medico.update({
      where: { id: dados.id },
      data: {
        nomeCompleto: dados.nomeCompleto,
        crm: dados.crm.obterValor(),
        especialidade: dados.especialidade,
      },
    });
  }

  async buscarPorId(id: string): Promise<Medico | null> {
    const row = await prisma.medico.findUnique({ where: { id } });
    return row ? this.mapearParaDominio(row) : null;
  }

  async buscarPorCrm(crm: Crm): Promise<Medico | null> {
    const row = await prisma.medico.findUnique({
      where: { crm: crm.obterValor() },
    });
    return row ? this.mapearParaDominio(row) : null;
  }

  async listarPorEspecialidade(especialidade: string): Promise<Medico[]> {
    const rows = await prisma.medico.findMany({
      where:
        especialidade.length > 0
          ? { especialidade: { contains: especialidade } }
          : undefined,
      orderBy: { nomeCompleto: 'asc' },
    });
    return rows.map((row) => this.mapearParaDominio(row));
  }

  private mapearParaDominio(row: {
    id: string;
    nomeCompleto: string;
    crm: string;
    especialidade: string;
    criadoEm: Date;
    atualizadoEm: Date;
  }): Medico {
    return Medico.restaurar({
      id: row.id,
      nomeCompleto: row.nomeCompleto,
      crm: Crm.criar(row.crm),
      especialidade: row.especialidade,
      criadoEm: row.criadoEm,
      atualizadoEm: row.atualizadoEm,
    });
  }
}
