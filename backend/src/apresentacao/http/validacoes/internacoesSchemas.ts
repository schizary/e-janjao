import { z } from 'zod';

export const registrarInternacaoSchema = z.object({
  pacienteId: z.string().uuid('ID do paciente inválido'),
  quarto: z.string().min(1, 'Quarto é obrigatório').trim(),
  leito: z.string().min(1, 'Leito é obrigatório').trim(),
  motivo: z.string().min(1, 'Motivo é obrigatório').trim(),
  dataEntrada: z.coerce.date(),
  observacoes: z.string().optional().nullable().or(z.literal('')),
});

export const darAltaSchema = z.object({
  dataSaida: z.coerce.date(),
  observacoes: z.string().optional().nullable().or(z.literal('')),
});
