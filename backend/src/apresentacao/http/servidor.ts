import express, { Express } from 'express';
import cors from 'cors';
import { criarRotas, Controllers } from './rotas/index';
import { erroMiddleware } from './middlewares/ErroMiddleware';
import { ambiente } from '../../config/ambiente';

export function criarServidor(controllers: Controllers): Express {
  const app = express();

  app.use(
    cors({
      origin: ambiente.corsOrigins,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api', criarRotas(controllers));

  app.get('/api', (_req, res) => {
    res.json({
      nome: 'Sistema de Gestão Hospitalar - API',
      versao: '1.0.0',
      endpoints: [
        'POST /api/auth/login',
        'GET /api/pacientes',
        'POST /api/pacientes',
        'GET /api/pacientes/:id',
        'PATCH /api/pacientes/:id/contato',
        'GET /api/medicos',
        'POST /api/medicos',
        'POST /api/consultas',
        'POST /api/consultas/:id/cancelar',
        'GET /api/consultas/paciente/:pacienteId',
        'POST /api/exames',
        'PATCH /api/exames/:id/resultado',
        'POST /api/prescricoes',
        'GET /api/prescricoes/paciente/:pacienteId',
        'POST /api/internacoes',
        'POST /api/internacoes/:id/alta',
        'GET /api/internacoes/paciente/:pacienteId/ativas',
      ],
    });
  });

  app.use(erroMiddleware);

  return app;
}
