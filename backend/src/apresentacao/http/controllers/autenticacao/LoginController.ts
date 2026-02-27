import { Request, Response } from 'express';
import { AutenticarUsuarioCasoDeUso } from '../../../../application/autenticacao/casos-de-uso/AutenticarUsuarioCasoDeUso';
import { usuarioParaJson } from '../../mapeadores/mapeadoresResposta';

export class LoginController {
  constructor(private readonly autenticar: AutenticarUsuarioCasoDeUso) {}

  login = async (req: Request, res: Response): Promise<void> => {
    const body = req.body as { email: string; senha: string };
    const resultado = await this.autenticar.executar({
      email: body.email,
      senha: body.senha,
    });
    res.json({
      tokenAcesso: resultado.tokenAcesso,
      usuario: usuarioParaJson(resultado.usuario),
    });
  };
}
