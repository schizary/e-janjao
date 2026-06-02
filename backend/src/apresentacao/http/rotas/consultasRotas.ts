import { Router } from 'express';
import { ConsultasController } from '../controllers/consultas/ConsultasController';
import { asyncHandler } from '../middlewares/AsyncHandler';
import { validarCorpo } from '../middlewares/ValidacaoMiddleware';
import { autenticacaoMiddleware } from '../middlewares/AutenticacaoMiddleware';
import { agendarConsultaSchema, cancelarConsultaSchema } from '../validacoes/consultasSchemas';

export function criarConsultasRotas(controller: ConsultasController): Router {
  const router = Router();

  router.post(
    '/',
    autenticacaoMiddleware,
    validarCorpo(agendarConsultaSchema),
    asyncHandler(controller.agendarHandler),
  );
  router.post(
    '/:id/cancelar',
    autenticacaoMiddleware,
    validarCorpo(cancelarConsultaSchema),
    asyncHandler(controller.cancelarHandler),
  );
  router.get(
    '/paciente/:pacienteId',
    autenticacaoMiddleware,
    asyncHandler(controller.listarPorPacienteHandler),
  );

  return router;
}
