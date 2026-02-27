import { Usuario } from '../../../domain/usuarios/entidades/Usuario';
import { UsuarioRepositorio } from '../../../domain/usuarios/repositorios/UsuarioRepositorio';
import { Senha } from '../../../domain/usuarios/valor-objetos/Senha';
import { prisma } from '../../prisma/PrismaCliente';

export class UsuarioRepositorioPrisma implements UsuarioRepositorio {
  async criar(usuario: Usuario): Promise<void> {
    const dados = usuario.obterDados();
    await prisma.usuario.create({
      data: {
        id: dados.id,
        nomeCompleto: dados.nomeCompleto,
        email: dados.email,
        senhaHash: dados.senha.obterHash(),
        perfil: dados.perfil,
        ativo: dados.ativo,
      },
    });
  }

  async atualizar(usuario: Usuario): Promise<void> {
    const dados = usuario.obterDados();
    await prisma.usuario.update({
      where: { id: dados.id },
      data: {
        nomeCompleto: dados.nomeCompleto,
        email: dados.email,
        senhaHash: dados.senha.obterHash(),
        perfil: dados.perfil,
        ativo: dados.ativo,
      },
    });
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    const row = await prisma.usuario.findUnique({ where: { id } });
    return row ? this.mapearParaDominio(row) : null;
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const emailNorm = email.trim().toLowerCase();
    const row = await prisma.usuario.findUnique({
      where: { email: emailNorm },
    });
    return row ? this.mapearParaDominio(row) : null;
  }

  private mapearParaDominio(row: {
    id: string;
    nomeCompleto: string;
    email: string;
    senhaHash: string;
    perfil: 'ADMINISTRADOR' | 'MEDICO' | 'ATENDENTE';
    ativo: boolean;
    criadoEm: Date;
    atualizadoEm: Date;
  }): Usuario {
    return Usuario.restaurar({
      id: row.id,
      nomeCompleto: row.nomeCompleto,
      email: row.email,
      senha: Senha.aPartirDoHash(row.senhaHash),
      perfil: row.perfil,
      ativo: row.ativo,
      criadoEm: row.criadoEm,
      atualizadoEm: row.atualizadoEm,
    });
  }
}
