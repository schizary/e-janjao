import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ambiente } from '../../../config/ambiente';

export interface PayloadToken {
  sub: string;
  perfil: string;
}

declare global {
  namespace Express {
    interface Request {
      usuarioId?: string;
      perfil?: string;
    }
  }
}

export function autenticacaoMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const cabecalho = req.headers.authorization;

  if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
    res.status(401).json({ erro: 'Token de acesso não informado' });
    return;
  }

  const token = cabecalho.slice(7);

  try {
    const payload = jwt.verify(token, ambiente.jwtSecret) as PayloadToken;
    req.usuarioId = payload.sub;
    req.perfil = payload.perfil;
    next();
  } catch {
    res.status(401).json({ erro: 'Token de acesso inválido ou expirado' });
  }
}
