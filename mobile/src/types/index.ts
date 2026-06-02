export interface Usuario {
  id: string;
  nomeCompleto: string;
  email: string;
  perfil: string;
}

export interface Sessao {
  tokenAcesso: string;
  usuario: Usuario;
}

export interface Paciente {
  id: string;
  nomeCompleto: string;
  cpf: string;
  email?: string | null;
  dataNascimento: string;
  telefone?: string | null;
}

export interface Medico {
  id: string;
  nomeCompleto: string;
  crm: string;
  especialidade: string;
}

export interface Consulta {
  id: string;
  pacienteId: string;
  medicoId: string;
  inicio: string;
  fim: string;
  status: 'AGENDADA' | 'CANCELADA' | 'REALIZADA';
  observacoes?: string | null;
  paciente?: Paciente;
  medico?: Medico;
}

export interface Exame {
  id: string;
  pacienteId: string;
  tipo: string;
  dataHora: string;
  local: string;
  status: 'AGENDADO' | 'CANCELADO' | 'REALIZADO';
  resultado?: string | null;
  paciente?: Paciente;
}

export interface PrescricaoItem {
  id?: string;
  medicamento: string;
  dosagem: string;
  frequencia: string;
  duracaoDias?: number | null;
}

export interface Prescricao {
  id: string;
  pacienteId: string;
  medicoId: string;
  observacoesGerais?: string | null;
  paciente?: Paciente;
  medico?: Medico;
  itens: PrescricaoItem[];
}

export interface Internacao {
  id: string;
  pacienteId: string;
  quarto: string;
  leito: string;
  motivo: string;
  dataEntrada: string;
  dataSaida?: string | null;
  status: 'ATIVA' | 'ALTA' | 'TRANSFERIDA';
  observacoes?: string | null;
  paciente?: Paciente;
}
