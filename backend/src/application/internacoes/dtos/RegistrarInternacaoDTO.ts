export interface RegistrarInternacaoDTO {
  pacienteId: string;
  quarto: string;
  leito: string;
  motivo: string;
  dataEntrada: Date;
  observacoes?: string | null;
}

