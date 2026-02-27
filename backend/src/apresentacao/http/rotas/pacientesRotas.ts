import { Router } from 'express';
import { PacientesController } from '../controllers/pacientes/PacientesController';
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
    controller.criar,
  );
  router.patch(
    '/:id/contato',
    autenticacaoMiddleware,
    validarCorpo(atualizarContatoPacienteSchema),
    controller.atualizarContatoHandler,
  );
  router.get(
    '/',
    autenticacaoMiddleware,
    validarQuery(listarPacientesQuerySchema),
    controller.listarHandler,
  );
  router.get('/:id', autenticacaoMiddleware, controller.buscarPorIdHandler);

  return router;
}
