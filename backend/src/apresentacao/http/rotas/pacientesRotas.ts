import { Router } from 'express';
import { PacientesController } from '../controllers/pacientes/PacientesController';
import { asyncHandler } from '../middlewares/AsyncHandler';
import { validarCorpo, validarQuery } from '../middlewares/ValidacaoMiddleware';
import { autenticacaoMiddleware } from '../middlewares/AutenticacaoMiddleware';
import {
  criarPacienteSchema,
  atualizarContatoPacienteSchema,
  listarPacientesQuerySchema,
} from '../validacoes/pacientesSchemas';

export function criarPacientesRotas(controller: PacientesController): Router {
  const router = Router();

  router.post(
    '/',
    autenticacaoMiddleware,
    validarCorpo(criarPacienteSchema),
    asyncHandler(controller.criar),
  );
  router.patch(
    '/:id/contato',
    autenticacaoMiddleware,
    validarCorpo(atualizarContatoPacienteSchema),
    asyncHandler(controller.atualizarContatoHandler),
  );
  router.get(
    '/',
    autenticacaoMiddleware,
    validarQuery(listarPacientesQuerySchema),
    asyncHandler(controller.listarHandler),
  );
  router.get('/:id', autenticacaoMiddleware, asyncHandler(controller.buscarPorIdHandler));

  return router;
}
