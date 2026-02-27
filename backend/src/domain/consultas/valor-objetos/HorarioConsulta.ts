export class HorarioConsulta {
  private readonly inicio: Date;
  private readonly fim: Date;

  private constructor(inicio: Date, fim: Date) {
    this.inicio = inicio;
    this.fim = fim;
  }

  static criar(inicio: Date, fim: Date): HorarioConsulta {
    if (fim <= inicio) {
      throw new Error('Horário de fim da consulta deve ser após o início');
    }

    return new HorarioConsulta(inicio, fim);
  }

  obterInicio(): Date {
    return this.inicio;
  }

  obterFim(): Date {
    return this.fim;
  }
}

