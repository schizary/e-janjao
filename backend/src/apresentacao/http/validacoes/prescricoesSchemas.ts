import { z } from 'zod';

const itemPrescricaoSchema = z.object({
  medicamento: z.string().min(1, 'Medicamento é obrigatório').trim(),
  dosagem: z.string().min(1, 'Dosagem é obrigatória').trim(),
  frequencia: z.string().min(1, 'Frequência é obrigatória').trim(),
  duracaoDias: z.number().int().positive().optional().nullable(),
});

export const emitirPrescricaoSchema = z.object({
  pacienteId: z.string().uuid('ID do paciente inválido'),
  medicoId: z.string().uuid('ID do médico inválido'),
  itens: z.array(itemPrescricaoSchema).min(1, 'Prescrição deve ter pelo menos um item'),
  observacoesGerais: z.string().optional().nullable().or(z.literal('')),
});
