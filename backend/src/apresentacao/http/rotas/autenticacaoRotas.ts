import { Router } from 'express';
import { LoginController } from '../controllers/autenticacao/LoginController';
import { validarCorpo } from '../middlewares/ValidacaoMiddleware';
import { loginSchema } from '../validacoes/loginSchema';

export function criarAutenticacaoRotas(controller: LoginController): Router {
  const router = Router();

  router.post('/login', validarCorpo(loginSchema), controller.login);

  return router;
}
