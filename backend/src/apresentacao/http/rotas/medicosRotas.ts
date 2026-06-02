import { Router } from 'express';
import { MedicosController } from '../controllers/medicos/MedicosController';
import { asyncHandler } from '../middlewares/AsyncHandler';
import { validarCorpo, validarQuery } from '../middlewares/ValidacaoMiddleware';
import { autenticacaoMiddleware } from '../middlewares/AutenticacaoMiddleware';
import { criarMedicoSchema, listarMedicosQuerySchema } from '../validacoes/medicosSchemas';

export function criarMedicosRotas(controller: MedicosController): Router {
  const router = Router();

  router.post(
    '/',
    autenticacaoMiddleware,
    validarCorpo(criarMedicoSchema),
    asyncHandler(controller.criar),
  );
  router.get(
    '/',
    autenticacaoMiddleware,
    validarQuery(listarMedicosQuerySchema),
    asyncHandler(controller.listarHandler),
  );

  return router;
}
