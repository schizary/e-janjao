import jwt from 'jsonwebtoken';
import { EmissorTokenAcesso } from '../../application/autenticacao/servicos/EmissorTokenAcesso';
import { PerfilUsuario } from '../../domain/usuarios/entidades/Usuario';

export class JwtEmissorTokenAcesso implements EmissorTokenAcesso {
  constructor(
    private readonly segredo: string,
    private readonly expiracao: string = '7d',
  ) {}

  async emitir(dados: { usuarioId: string; perfil: PerfilUsuario }): Promise<string> {
    const opcoes: jwt.SignOptions = {
      expiresIn: this.expiracao as jwt.SignOptions['expiresIn'],
    };
    const token = jwt.sign(
      {
        sub: dados.usuarioId,
        perfil: dados.perfil,
      },
      this.segredo,
      opcoes,
    );
    return token;
  }
}
