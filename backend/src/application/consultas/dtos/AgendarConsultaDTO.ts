export interface AgendarConsultaDTO {
  pacienteId: string;
  medicoId: string;
  inicio: Date;
  fim: Date;
  observacoes?: string | null;
}

