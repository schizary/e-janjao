function obterVariavel(nome: string): string {
  const valor = process.env[nome];
  if (valor === undefined || valor === '') {
    throw new Error(`Variável de ambiente obrigatória não definida: ${nome}`);
  }
  return valor;
}

function obterVariavelOpcional(nome: string, padrao: string): string {
  return process.env[nome] ?? padrao;
}

function obterListaCsv(nome: string, padrao: string[]): string[] {
  const valor = process.env[nome];
  if (!valor || valor.trim() === '') return padrao;
  return valor
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

export const ambiente = {
  get nodeEnv(): string {
    return obterVariavelOpcional('NODE_ENV', 'development');
  },

  get porta(): number {
    const p = obterVariavelOpcional('PORTA', '3000');
    const n = parseInt(p, 10);
    if (Number.isNaN(n) || n < 1 || n > 65535) {
      throw new Error(`PORTA inválida: ${p}`);
    }
    return n;
  },

  get databaseUrl(): string {
    return obterVariavel('DATABASE_URL');
  },

  get jwtSecret(): string {
    return obterVariavel('JWT_SECRET');
  },

  get jwtExpiracao(): string {
    return obterVariavelOpcional('JWT_EXPIRACAO', '7d');
  },

  get corsOrigins(): string[] {
    // Em desenvolvimento, o Vite costuma rodar em 5173/5174…
    return obterListaCsv('CORS_ORIGINS', [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
    ]);
  },
} as const;
