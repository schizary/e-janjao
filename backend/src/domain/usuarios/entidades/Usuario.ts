import { Senha } from '../valor-objetos/Senha';

export type PerfilUsuario = 'ADMINISTRADOR' | 'MEDICO' | 'ATENDENTE';

export interface DadosUsuario {
  id: string;
  nomeCompleto: string;
  email: string;
  senha: Senha;
  perfil: PerfilUsuario;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}

export class Usuario {
  private dados: DadosUsuario;

  private constructor(dados: DadosUsuario) {
    this.dados = { ...dados };
  }

  static criar(dados: Omit<DadosUsuario, 'ativo' | 'criadoEm' | 'atualizadoEm'>): Usuario {
    const agora = new Date();

    if (!dados.nomeCompleto || dados.nomeCompleto.trim().length === 0) {
      throw new Error('Nome do usuário é obrigatório');
    }

    const emailNormalizado = dados.email.trim().toLowerCase();
    if (!emailNormalizado) {
      throw new Error('E-mail do usuário é obrigatório');
    }

    return new Usuario({
      ...dados,
      nomeCompleto: dados.nomeCompleto.trim(),
      email: emailNormalizado,
      ativo: true,
      criadoEm: agora,
      atualizadoEm: agora,
    });
  }

  static restaurar(dados: DadosUsuario): Usuario {
    return new Usuario(dados);
  }

  desativar(): void {
    this.dados.ativo = false;
    this.dados.atualizadoEm = new Date();
  }

  reativar(): void {
    this.dados.ativo = true;
    this.dados.atualizadoEm = new Date();
  }

  alterarPerfil(novoPerfil: PerfilUsuario): void {
    this.dados.perfil = novoPerfil;
    this.dados.atualizadoEm = new Date();
  }

  obterDados(): DadosUsuario {
    return { ...this.dados };
  }
}

