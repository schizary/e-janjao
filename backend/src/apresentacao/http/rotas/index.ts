import { Router } from 'express';
import { criarPacientesRotas } from './pacientesRotas';
import { criarMedicosRotas } from './medicosRotas';
import { criarConsultasRotas } from './consultasRotas';
import { criarExamesRotas } from './examesRotas';
import { criarPrescricoesRotas } from './prescricoesRotas';
import { criarInternacoesRotas } from './internacoesRotas';
import { criarAutenticacaoRotas } from './autenticacaoRotas';
import { PacientesController } from '../controllers/pacientes/PacientesController';
import { MedicosController } from '../controllers/medicos/MedicosController';
import { ConsultasController } from '../controllers/consultas/ConsultasController';
import { ExamesController } from '../controllers/exames/ExamesController';
import { PrescricoesController } from '../controllers/prescricoes/PrescricoesController';
import { InternacoesController } from '../controllers/internacoes/InternacoesController';
import { LoginController } from '../controllers/autenticacao/LoginController';

export interface Controllers {
  pacientes: PacientesController;
  medicos: MedicosController;
  consultas: ConsultasController;
  exames: ExamesController;
  prescricoes: PrescricoesController;
  internacoes: InternacoesController;
  login: LoginController;
}

export function criarRotas(controllers: Controllers): Router {
  const router = Router();

  router.use('/auth', criarAutenticacaoRotas(controllers.login));
  router.use('/pacientes', criarPacientesRotas(controllers.pacientes));
  router.use('/medicos', criarMedicosRotas(controllers.medicos));
  router.use('/consultas', criarConsultasRotas(controllers.consultas));
  router.use('/exames', criarExamesRotas(controllers.exames));
  router.use('/prescricoes', criarPrescricoesRotas(controllers.prescricoes));
  router.use('/internacoes', criarInternacoesRotas(controllers.internacoes));

  return router;
}
