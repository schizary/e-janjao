export type StatusInternacao = 'ATIVA' | 'ALTA' | 'TRANSFERIDA';

export interface DadosInternacao {
  id: string;
  pacienteId: string;
  quarto: string;
  leito: string;
  motivo: string;
  dataEntrada: Date;
  dataSaida?: Date | null;
  status: StatusInternacao;
  observacoes?: string | null;
  criadoEm: Date;
  atualizadoEm: Date;
}

export class Internacao {
  private dados: DadosInternacao;

  private constructor(dados: DadosInternacao) {
    this.dados = { ...dados };
  }

  static registrar(dados: Omit<DadosInternacao, 'status' | 'dataSaida' | 'criadoEm' | 'atualizadoEm'>): Internacao {
    const agora = new Date();

    if (!dados.quarto.trim() || !dados.leito.trim()) {
      throw new Error('Quarto e leito são obrigatórios para a internação');
    }

    return new Internacao({
      ...dados,
      quarto: dados.quarto.trim(),
      leito: dados.leito.trim(),
      status: 'ATIVA',
      dataSaida: null,
      criadoEm: agora,
      atualizadoEm: agora,
    });
  }

  static restaurar(dados: DadosInternacao): Internacao {
    return new Internacao(dados);
  }

  registrarAlta(dataSaida: Date, observacoes?: string): void {
    if (this.dados.status !== 'ATIVA') {
      throw new Error('Apenas internações ativas podem receber alta');
    }

    if (dataSaida <= this.dados.dataEntrada) {
      throw new Error('Data de saída deve ser após a data de entrada');
    }

    this.dados.status = 'ALTA';
    this.dados.dataSaida = dataSaida;
    this.dados.observacoes = observacoes ?? this.dados.observacoes ?? null;
    this.dados.atualizadoEm = new Date();
  }

  obterDados(): DadosInternacao {
    return { ...this.dados };
  }
}

