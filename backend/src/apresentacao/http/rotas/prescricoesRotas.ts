import { Router } from 'express';
import { PrescricoesController } from '../controllers/prescricoes/PrescricoesController';
import { asyncHandler } from '../middlewares/AsyncHandler';
import { validarCorpo } from '../middlewares/ValidacaoMiddleware';
import { autenticacaoMiddleware } from '../middlewares/AutenticacaoMiddleware';
import { emitirPrescricaoSchema } from '../validacoes/prescricoesSchemas';

export function criarPrescricoesRotas(controller: PrescricoesController): Router {
  const router = Router();

  router.post(
    '/',
    autenticacaoMiddleware,
    validarCorpo(emitirPrescricaoSchema),
    asyncHandler(controller.emitirHandler),
  );
  router.get(
    '/paciente/:pacienteId',
    autenticacaoMiddleware,
    asyncHandler(controller.listarPorPacienteHandler),
  );

  return router;
}
