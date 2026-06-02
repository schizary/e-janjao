import { Router } from 'express';
import { ExamesController } from '../controllers/exames/ExamesController';
import { asyncHandler } from '../middlewares/AsyncHandler';
import { validarCorpo } from '../middlewares/ValidacaoMiddleware';
import { autenticacaoMiddleware } from '../middlewares/AutenticacaoMiddleware';
import { agendarExameSchema, registrarResultadoExameSchema } from '../validacoes/examesSchemas';

export function criarExamesRotas(controller: ExamesController): Router {
  const router = Router();

  router.post(
    '/',
    autenticacaoMiddleware,
    validarCorpo(agendarExameSchema),
    asyncHandler(controller.agendarHandler),
  );
  router.patch(
    '/:id/resultado',
    autenticacaoMiddleware,
    validarCorpo(registrarResultadoExameSchema),
    asyncHandler(controller.registrarResultadoHandler),
  );
  router.get(
    '/paciente/:pacienteId',
    autenticacaoMiddleware,
    asyncHandler(controller.listarPorPacienteHandler),
  );

  return router;
}
