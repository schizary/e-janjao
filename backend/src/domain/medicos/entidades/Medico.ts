import { Crm } from '../valor-objetos/Crm';

export interface DadosMedico {
  id: string;
  nomeCompleto: string;
  crm: Crm;
  especialidade: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export class Medico {
  private dados: DadosMedico;

  private constructor(dados: DadosMedico) {
    this.dados = { ...dados };
  }

  static criar(dados: Omit<DadosMedico, 'criadoEm' | 'atualizadoEm'>): Medico {
    const agora = new Date();

    if (!dados.nomeCompleto || dados.nomeCompleto.trim().length === 0) {
      throw new Error('Nome do médico é obrigatório');
    }

    if (!dados.especialidade || dados.especialidade.trim().length === 0) {
      throw new Error('Especialidade do médico é obrigatória');
    }

    return new Medico({
      ...dados,
      nomeCompleto: dados.nomeCompleto.trim(),
      especialidade: dados.especialidade.trim(),
      criadoEm: agora,
      atualizadoEm: agora,
    });
  }

  static restaurar(dados: DadosMedico): Medico {
    return new Medico(dados);
  }

  alterarEspecialidade(novaEspecialidade: string): void {
    const especialidadeNormalizada = novaEspecialidade.trim();

    if (!especialidadeNormalizada) {
      throw new Error('Especialidade do médico é obrigatória');
    }

    this.dados.especialidade = especialidadeNormalizada;
    this.dados.atualizadoEm = new Date();
  }

  obterDados(): DadosMedico {
    return { ...this.dados };
  }
}

