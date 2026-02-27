import { Request, Response, NextFunction } from 'express';
import { ErroAplicacao } from '../../../shared/erros/ErroAplicacao';

export function erroMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ErroAplicacao) {
    res.status(err.codigoHttp).json({ erro: err.message });
    return;
  }

  if (err instanceof Error) {
    const mensagem = err.message;
    const codigo =
      mensagem === 'Credenciais inválidas' ? 401 :
      mensagem.includes('não encontrado') ? 404 :
      mensagem.includes('inválid') || mensagem.includes('obrigatório') ? 400 : 500;
    res.status(codigo).json({ erro: mensagem });
    return;
  }

  res.status(500).json({ erro: 'Erro interno do servidor' });
}
