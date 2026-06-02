import { Router } from 'express';
import { InternacoesController } from '../controllers/internacoes/InternacoesController';
import { asyncHandler } from '../middlewares/AsyncHandler';
import { validarCorpo } from '../middlewares/ValidacaoMiddleware';
import { autenticacaoMiddleware } from '../middlewares/AutenticacaoMiddleware';
import {
  registrarInternacaoSchema,
  darAltaSchema,
} from '../validacoes/internacoesSchemas';

export function criarInternacoesRotas(controller: InternacoesController): Router {
  const router = Router();

  router.post(
    '/',
    autenticacaoMiddleware,
    validarCorpo(registrarInternacaoSchema),
    asyncHandler(controller.registrarHandler),
  );
  router.post(
    '/:id/alta',
    autenticacaoMiddleware,
    validarCorpo(darAltaSchema),
    asyncHandler(controller.darAltaHandler),
  );
  router.get(
    '/paciente/:pacienteId/ativas',
    autenticacaoMiddleware,
    asyncHandler(controller.listarAtivasPorPacienteHandler),
  );
  router.get(
    '/paciente/:pacienteId',
    autenticacaoMiddleware,
    asyncHandler(controller.listarPorPacienteHandler),
  );

  return router;
}
