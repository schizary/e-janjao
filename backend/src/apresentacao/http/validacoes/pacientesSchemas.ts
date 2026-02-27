import { z } from 'zod';

export const criarPacienteSchema = z.object({
  nomeCompleto: z.string().min(1, 'Nome é obrigatório').trim(),
  cpf: z.string().min(11, 'CPF inválido').max(14),
  email: z.string().email().optional().nullable().or(z.literal('')),
  dataNascimento: z.coerce.date(),
  telefone: z.string().optional().nullable().or(z.literal('')),
});

export const atualizarContatoPacienteSchema = z.object({
  email: z.string().email().optional().nullable().or(z.literal('')),
  telefone: z.string().optional().nullable().or(z.literal('')),
});

export const listarPacientesQuerySchema = z.object({
  nome: z.string().optional().default(''),
});
