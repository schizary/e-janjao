import { Router } from 'express';
import { ConsultasController } from '../controllers/consultas/ConsultasController';
import { validarCorpo } from '../middlewares/ValidacaoMiddleware';
import { autenticacaoMiddleware } from '../middlewares/AutenticacaoMiddleware';
import { agendarConsultaSchema, cancelarConsultaSchema } from '../validacoes/consultasSchemas';

export function criarConsultasRotas(controller: ConsultasController): Router {
  const router = Router();

  router.post(
    '/',
    autenticacaoMiddleware,
    validarCorpo(agendarConsultaSchema),
    controller.agendarHandler,
  );
  router.post(
    '/:id/cancelar',
    autenticacaoMiddleware,
    validarCorpo(cancelarConsultaSchema),
    controller.cancelarHandler,
  );
  router.get(
    '/paciente/:pacienteId',
    autenticacaoMiddleware,
    controller.listarPorPacienteHandler,
  );

  return router;
}
