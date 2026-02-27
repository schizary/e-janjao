export interface ComparadorSenha {
  comparar(senhaPlano: string, hash: string): Promise<boolean>;
}

