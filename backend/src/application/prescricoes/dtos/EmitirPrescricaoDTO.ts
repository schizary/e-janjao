export interface EmitirPrescricaoItemDTO {
  medicamento: string;
  dosagem: string;
  frequencia: string;
  duracaoDias?: number | null;
}

export interface EmitirPrescricaoDTO {
  pacienteId: string;
  medicoId: string;
  itens: EmitirPrescricaoItemDTO[];
  observacoesGerais?: string | null;
}

