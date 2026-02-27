import { Router } from 'express';
import { PrescricoesController } from '../controllers/prescricoes/PrescricoesController';
import { validarCorpo } from '../middlewares/ValidacaoMiddleware';
import { autenticacaoMiddleware } from '../middlewares/AutenticacaoMiddleware';
import { emitirPrescricaoSchema } from '../validacoes/prescricoesSchemas';

export function criarPrescricoesRotas(controller: PrescricoesController): Router {
  const router = Router();

  router.post(
    '/',
    autenticacaoMiddleware,
    validarCorpo(emitirPrescricaoSchema),
    controller.emitirHandler,
  );
  router.get(
    '/paciente/:pacienteId',
    autenticacaoMiddleware,
    controller.listarPorPacienteHandler,
  );

  return router;
}
