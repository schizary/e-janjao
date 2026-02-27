import { z } from 'zod';

export const agendarExameSchema = z.object({
  pacienteId: z.string().uuid('ID do paciente inválido'),
  tipo: z.string().min(1, 'Tipo do exame é obrigatório').trim(),
  dataHora: z.coerce.date(),
  local: z.string().min(1, 'Local é obrigatório').trim(),
});

export const registrarResultadoExameSchema = z.object({
  resultado: z.string().min(1, 'Resultado não pode ser vazio').trim(),
});
