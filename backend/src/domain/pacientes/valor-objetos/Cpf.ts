export class Cpf {
  private readonly valor: string;

  private constructor(valor: string) {
    this.valor = valor;
  }

  static criar(cpf: string): Cpf {
    const cpfLimpado = cpf.replace(/\D/g, '');

    if (!this.validarFormatoBasico(cpfLimpado)) {
      throw new Error('CPF inválido');
    }

    return new Cpf(cpfLimpado);
  }

  private static validarFormatoBasico(cpf: string): boolean {
    if (cpf.length !== 11) {
      return false;
    }

    const todosDigitosIguais = /^(\d)\1{10}$/.test(cpf);
    if (todosDigitosIguais) {
      return false;
    }

    return true;
  }

  obterValor(): string {
    return this.valor;
  }
}

