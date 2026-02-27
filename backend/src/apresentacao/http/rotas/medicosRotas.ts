import { Router } from 'express';
import { MedicosController } from '../controllers/medicos/MedicosController';
import { validarCorpo, validarQuery } from '../middlewares/ValidacaoMiddleware';
import { autenticacaoMiddleware } from '../middlewares/AutenticacaoMiddleware';
import { criarMedicoSchema, listarMedicosQuerySchema } from '../validacoes/medicosSchemas';

export function criarMedicosRotas(controller: MedicosController): Router {
  const router = Router();

  router.post(
    '/',
    autenticacaoMiddleware,
    validarCorpo(criarMedicoSchema),
    controller.criar,
  );
  router.get(
    '/',
    autenticacaoMiddleware,
    validarQuery(listarMedicosQuerySchema),
    controller.listarHandler,
  );

  return router;
}
