export class Senha {
  private readonly hash: string;

  private constructor(hash: string) {
    this.hash = hash;
  }

  static aPartirDoHash(hash: string): Senha {
    const hashLimpo = hash.trim();

    if (hashLimpo.length === 0) {
      throw new Error('Hash de senha não pode ser vazio');
    }

    return new Senha(hashLimpo);
  }

  obterHash(): string {
    return this.hash;
  }
}

