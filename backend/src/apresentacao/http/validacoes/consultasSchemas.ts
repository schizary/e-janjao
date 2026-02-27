import { z } from 'zod';

export const agendarConsultaSchema = z.object({
  pacienteId: z.string().uuid('ID do paciente inválido'),
  medicoId: z.string().uuid('ID do médico inválido'),
  inicio: z.coerce.date(),
  fim: z.coerce.date(),
  observacoes: z.string().optional().nullable().or(z.literal('')),
});

export const cancelarConsultaSchema = z.object({
  motivo: z.string().optional().nullable(),
});
