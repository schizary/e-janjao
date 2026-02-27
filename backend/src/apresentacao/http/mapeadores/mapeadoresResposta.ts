import { Paciente } from '../../../domain/pacientes/entidades/Paciente';
import { Medico } from '../../../domain/medicos/entidades/Medico';
import { Usuario } from '../../../domain/usuarios/entidades/Usuario';
import { Consulta } from '../../../domain/consultas/entidades/Consulta';
import { Exame } from '../../../domain/exames/entidades/Exame';
import { Prescricao } from '../../../domain/prescricoes/entidades/Prescricao';
import { Internacao } from '../../../domain/internacoes/entidades/Internacao';

export function pacienteParaJson(p: Paciente): Record<string, unknown> {
  const d = p.obterDados();
  return {
    id: d.id,
    nomeCompleto: d.nomeCompleto,
    cpf: d.cpf.obterValor(),
    email: d.email?.obterValor() ?? null,
    dataNascimento: d.dataNascimento.toISOString(),
    telefone: d.telefone ?? null,
    criadoEm: d.criadoEm.toISOString(),
    atualizadoEm: d.atualizadoEm.toISOString(),
  };
}

export function medicoParaJson(m: Medico): Record<string, unknown> {
  const d = m.obterDados();
  return {
    id: d.id,
    nomeCompleto: d.nomeCompleto,
    crm: d.crm.obterValor(),
    especialidade: d.especialidade,
    criadoEm: d.criadoEm.toISOString(),
    atualizadoEm: d.atualizadoEm.toISOString(),
  };
}

export function usuarioParaJson(u: Usuario): Record<string, unknown> {
  const d = u.obterDados();
  return {
    id: d.id,
    nomeCompleto: d.nomeCompleto,
    email: d.email,
    perfil: d.perfil,
    ativo: d.ativo,
    criadoEm: d.criadoEm.toISOString(),
    atualizadoEm: d.atualizadoEm.toISOString(),
  };
}

export function consultaParaJson(c: Consulta): Record<string, unknown> {
  const d = c.obterDados();
  const h = d.horario;
  return {
    id: d.id,
    pacienteId: d.pacienteId,
    medicoId: d.medicoId,
    inicio: h.obterInicio().toISOString(),
    fim: h.obterFim().toISOString(),
    status: d.status,
    observacoes: d.observacoes ?? null,
    criadoEm: d.criadoEm.toISOString(),
    atualizadoEm: d.atualizadoEm.toISOString(),
  };
}

export function exameParaJson(e: Exame): Record<string, unknown> {
  const d = e.obterDados();
  return {
    id: d.id,
    pacienteId: d.pacienteId,
    tipo: d.tipo,
    dataHora: d.dataHora.toISOString(),
    local: d.local,
    status: d.status,
    resultado: d.resultado ?? null,
    criadoEm: d.criadoEm.toISOString(),
    atualizadoEm: d.atualizadoEm.toISOString(),
  };
}

export function prescricaoParaJson(p: Prescricao): Record<string, unknown> {
  const d = p.obterDados();
  return {
    id: d.id,
    pacienteId: d.pacienteId,
    medicoId: d.medicoId,
    itens: d.itens.map((item) => ({ ...item })),
    observacoesGerais: d.observacoesGerais ?? null,
    criadoEm: d.criadoEm.toISOString(),
    atualizadoEm: d.atualizadoEm.toISOString(),
  };
}

export function internacaoParaJson(i: Internacao): Record<string, unknown> {
  const d = i.obterDados();
  return {
    id: d.id,
    pacienteId: d.pacienteId,
    quarto: d.quarto,
    leito: d.leito,
    motivo: d.motivo,
    dataEntrada: d.dataEntrada.toISOString(),
    dataSaida: d.dataSaida?.toISOString() ?? null,
    status: d.status,
    observacoes: d.observacoes ?? null,
    criadoEm: d.criadoEm.toISOString(),
    atualizadoEm: d.atualizadoEm.toISOString(),
  };
}
