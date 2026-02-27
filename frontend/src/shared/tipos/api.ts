/**
 * Tipos comuns usados nas respostas da API.
 * Nomes em português, alinhados ao backend.
 */

export interface Paciente {
  id: string;
  nomeCompleto: string;
  cpf: string;
  email: string | null;
  dataNascimento: string;
  telefone: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Medico {
  id: string;
  nomeCompleto: string;
  crm: string;
  especialidade: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Usuario {
  id: string;
  nomeCompleto: string;
  email: string;
  perfil: 'ADMINISTRADOR' | 'MEDICO' | 'ATENDENTE';
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Consulta {
  id: string;
  pacienteId: string;
  medicoId: string;
  inicio: string;
  fim: string;
  status: 'AGENDADA' | 'CANCELADA' | 'REALIZADA';
  observacoes: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Exame {
  id: string;
  pacienteId: string;
  tipo: string;
  dataHora: string;
  local: string;
  status: 'AGENDADO' | 'CANCELADO' | 'REALIZADO';
  resultado: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface PrescricaoItem {
  medicamento: string;
  dosagem: string;
  frequencia: string;
  duracaoDias?: number | null;
}

export interface Prescricao {
  id: string;
  pacienteId: string;
  medicoId: string;
  itens: PrescricaoItem[];
  observacoesGerais: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Internacao {
  id: string;
  pacienteId: string;
  quarto: string;
  leito: string;
  motivo: string;
  dataEntrada: string;
  dataSaida: string | null;
  status: 'ATIVA' | 'ALTA' | 'TRANSFERIDA';
  observacoes: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface RespostaLogin {
  tokenAcesso: string;
  usuario: Usuario;
}
