import { z } from 'zod';

export const criarMedicoSchema = z.object({
  nomeCompleto: z.string().min(1, 'Nome é obrigatório').trim(),
  crm: z.string().min(4, 'CRM inválido').trim(),
  especialidade: z.string().min(1, 'Especialidade é obrigatória').trim(),
});

export const listarMedicosQuerySchema = z.object({
  especialidade: z.string().optional().default(''),
});
