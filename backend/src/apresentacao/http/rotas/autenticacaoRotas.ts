import { Router } from 'express';
import { LoginController } from '../controllers/autenticacao/LoginController';
import { asyncHandler } from '../middlewares/AsyncHandler';
import { validarCorpo } from '../middlewares/ValidacaoMiddleware';
import { loginSchema } from '../validacoes/loginSchema';

export function criarAutenticacaoRotas(controller: LoginController): Router {
  const router = Router();

  router.post('/login', validarCorpo(loginSchema), asyncHandler(controller.login));

  return router;
}
