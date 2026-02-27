export type StatusExame = 'AGENDADO' | 'CANCELADO' | 'REALIZADO';

export interface DadosExame {
  id: string;
  pacienteId: string;
  tipo: string;
  dataHora: Date;
  local: string;
  status: StatusExame;
  resultado?: string | null;
  criadoEm: Date;
  atualizadoEm: Date;
}

export class Exame {
  private dados: DadosExame;

  private constructor(dados: DadosExame) {
    this.dados = { ...dados };
  }

  static agendar(dados: Omit<DadosExame, 'status' | 'resultado' | 'criadoEm' | 'atualizadoEm'>): Exame {
    const agora = new Date();

    return new Exame({
      ...dados,
      status: 'AGENDADO',
      resultado: null,
      criadoEm: agora,
      atualizadoEm: agora,
    });
  }

  static restaurar(dados: DadosExame): Exame {
    return new Exame(dados);
  }

  cancelar(): void {
    if (this.dados.status !== 'AGENDADO') {
      throw new Error('Apenas exames agendados podem ser cancelados');
    }

    this.dados.status = 'CANCELADO';
    this.dados.atualizadoEm = new Date();
  }

  registrarResultado(resultado: string): void {
    const resultadoNormalizado = resultado.trim();

    if (!resultadoNormalizado) {
      throw new Error('Resultado do exame não pode ser vazio');
    }

    this.dados.status = 'REALIZADO';
    this.dados.resultado = resultadoNormalizado;
    this.dados.atualizadoEm = new Date();
  }

  obterDados(): DadosExame {
    return { ...this.dados };
  }
}

