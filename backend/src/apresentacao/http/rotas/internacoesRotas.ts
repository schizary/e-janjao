import { Router } from 'express';
import { InternacoesController } from '../controllers/internacoes/InternacoesController';
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
    controller.registrarHandler,
  );
  router.post(
    '/:id/alta',
    autenticacaoMiddleware,
    validarCorpo(darAltaSchema),
    controller.darAltaHandler,
  );
  router.get(
    '/paciente/:pacienteId/ativas',
    autenticacaoMiddleware,
    controller.listarAtivasPorPacienteHandler,
  );
  router.get(
    '/paciente/:pacienteId',
    autenticacaoMiddleware,
    controller.listarPorPacienteHandler,
  );

  return router;
}
