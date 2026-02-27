import { HorarioConsulta } from '../valor-objetos/HorarioConsulta';

export type StatusConsulta = 'AGENDADA' | 'CANCELADA' | 'REALIZADA';

export interface DadosConsulta {
  id: string;
  pacienteId: string;
  medicoId: string;
  horario: HorarioConsulta;
  status: StatusConsulta;
  observacoes?: string | null;
  criadoEm: Date;
  atualizadoEm: Date;
}

export class Consulta {
  private dados: DadosConsulta;

  private constructor(dados: DadosConsulta) {
    this.dados = { ...dados };
  }

  static agendar(dados: Omit<DadosConsulta, 'status' | 'criadoEm' | 'atualizadoEm'>): Consulta {
    const agora = new Date();

    return new Consulta({
      ...dados,
      status: 'AGENDADA',
      criadoEm: agora,
      atualizadoEm: agora,
    });
  }

  static restaurar(dados: DadosConsulta): Consulta {
    return new Consulta(dados);
  }

  cancelar(motivo?: string): void {
    if (this.dados.status !== 'AGENDADA') {
      throw new Error('Apenas consultas agendadas podem ser canceladas');
    }

    this.dados.status = 'CANCELADA';
    this.dados.observacoes = motivo ?? this.dados.observacoes ?? null;
    this.dados.atualizadoEm = new Date();
  }

  marcarComoRealizada(): void {
    if (this.dados.status !== 'AGENDADA') {
      throw new Error('Apenas consultas agendadas podem ser marcadas como realizadas');
    }

    this.dados.status = 'REALIZADA';
    this.dados.atualizadoEm = new Date();
  }

  obterDados(): DadosConsulta {
    return { ...this.dados };
  }
}

