export interface CriarPacienteDTO {
  nomeCompleto: string;
  cpf: string;
  email?: string | null;
  dataNascimento: Date;
  telefone?: string | null;
}

