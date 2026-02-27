export interface DadosPrescricaoItem {
  medicamento: string;
  dosagem: string;
  frequencia: string;
  duracaoDias?: number | null;
}

export interface DadosPrescricao {
  id: string;
  pacienteId: string;
  medicoId: string;
  itens: DadosPrescricaoItem[];
  observacoesGerais?: string | null;
  criadoEm: Date;
  atualizadoEm: Date;
}

export class Prescricao {
  private dados: DadosPrescricao;

  private constructor(dados: DadosPrescricao) {
    this.dados = {
      ...dados,
      itens: [...dados.itens],
    };
  }

  static criar(dados: Omit<DadosPrescricao, 'criadoEm' | 'atualizadoEm'>): Prescricao {
    const agora = new Date();

    if (!dados.itens || dados.itens.length === 0) {
      throw new Error('Prescrição deve conter pelo menos um item');
    }

    return new Prescricao({
      ...dados,
      itens: dados.itens.map((item) => ({ ...item })),
      criadoEm: agora,
      atualizadoEm: agora,
    });
  }

  static restaurar(dados: DadosPrescricao): Prescricao {
    return new Prescricao(dados);
  }

  obterDados(): DadosPrescricao {
    return {
      ...this.dados,
      itens: this.dados.itens.map((item) => ({ ...item })),
    };
  }
}

