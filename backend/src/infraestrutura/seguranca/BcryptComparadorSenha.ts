import bcrypt from 'bcrypt';
import type { ComparadorSenha } from '../../application/autenticacao/servicos/ComparadorSenha';

export class BcryptComparadorSenha implements ComparadorSenha {
  async comparar(senhaPlano: string, hash: string): Promise<boolean> {
    return bcrypt.compare(senhaPlano, hash);
  }
}
