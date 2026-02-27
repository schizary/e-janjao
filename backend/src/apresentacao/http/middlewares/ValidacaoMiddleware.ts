import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validarCorpo<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const resultado = schema.safeParse(req.body);
    if (resultado.success) {
      req.body = resultado.data;
      next();
      return;
    }
    const erros = (resultado.error as ZodError).errors.map((e) => ({
      campo: e.path.join('.'),
      mensagem: e.message,
    }));
    res.status(400).json({ erro: 'Dados inválidos', detalhes: erros });
  };
}

export function validarQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const resultado = schema.safeParse(req.query);
    if (resultado.success) {
      req.query = resultado.data as Request['query'];
      next();
      return;
    }
    const erros = (resultado.error as ZodError).errors.map((e) => ({
      campo: e.path.join('.'),
      mensagem: e.message,
    }));
    res.status(400).json({ erro: 'Parâmetros inválidos', detalhes: erros });
  };
}
