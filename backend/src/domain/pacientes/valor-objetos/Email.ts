export class Email {
  private readonly valor: string;

  private constructor(valor: string) {
    this.valor = valor;
  }

  static criar(email: string): Email {
    const emailNormalizado = email.trim().toLowerCase();

    if (!this.validarFormatoBasico(emailNormalizado)) {
      throw new Error('E-mail inválido');
    }

    return new Email(emailNormalizado);
  }

  private static validarFormatoBasico(email: string): boolean {
    const regexSimplesEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexSimplesEmail.test(email);
  }

  obterValor(): string {
    return this.valor;
  }
}

