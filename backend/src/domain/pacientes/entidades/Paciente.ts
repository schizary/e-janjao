import { Cpf } from '../valor-objetos/Cpf';
import { Email } from '../valor-objetos/Email';

export interface DadosPaciente {
  id: string;
  nomeCompleto: string;
  cpf: Cpf;
  email?: Email | null;
  dataNascimento: Date;
  telefone?: string | null;
  criadoEm: Date;
  atualizadoEm: Date;
}

export class Paciente {
  private dados: DadosPaciente;

  private constructor(dados: DadosPaciente) {
    this.dados = { ...dados };
  }

  static criar(dados: Omit<DadosPaciente, 'criadoEm' | 'atualizadoEm'>): Paciente {
    const agora = new Date();

    if (!dados.nomeCompleto || dados.nomeCompleto.trim().length === 0) {
      throw new Error('Nome do paciente é obrigatório');
    }

    return new Paciente({
      ...dados,
      nomeCompleto: dados.nomeCompleto.trim(),
      criadoEm: agora,
      atualizadoEm: agora,
    });
  }

  static restaurar(dados: DadosPaciente): Paciente {
    return new Paciente(dados);
  }

  alterarContato(email?: Email | null, telefone?: string | null): void {
    this.dados.email = email ?? null;
    this.dados.telefone = telefone ?? null;
    this.dados.atualizadoEm = new Date();
  }

  obterDados(): DadosPaciente {
    return { ...this.dados };
  }
}

