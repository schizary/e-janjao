export class Crm {
  private readonly valor: string;

  private constructor(valor: string) {
    this.valor = valor;
  }

  static criar(crm: string): Crm {
    const crmNormalizado = crm.trim().toUpperCase();

    if (!this.validarFormatoBasico(crmNormalizado)) {
      throw new Error('CRM inválido');
    }

    return new Crm(crmNormalizado);
  }

  private static validarFormatoBasico(crm: string): boolean {
    if (crm.length < 4) {
      return false;
    }

    return true;
  }

  obterValor(): string {
    return this.valor;
  }
}

