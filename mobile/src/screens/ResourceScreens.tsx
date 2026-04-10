import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Consulta, Exame, Internacao, Medico, Paciente, Prescricao } from '../types';
import { ListaSecao } from '../components/SectionList';
import { Botao, Campo, Cartao, Mensagem, Subtitulo, Tela, Titulo } from '../components/ui';

function Cabecalho({ titulo, voltar }: { titulo: string; voltar: () => void }) {
  return (
    <View style={{ gap: 6 }}>
      <Titulo>{titulo}</Titulo>
      <Subtitulo>Listagem e cadastro rápido pelo app móvel.</Subtitulo>
      <Botao texto="Voltar" onPress={voltar} />
    </View>
  );
}

export function PacientesScreen({ voltar }: { titulo: string; voltar: () => void }) {
  const { token } = useAuth();
  const [dados, setDados] = useState<Paciente[]>([]);
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('2000-01-01');
  const [mensagem, setMensagem] = useState('');

  const carregar = () => token && api.listarPacientes(token).then(setDados).catch((e) => setMensagem(e.message));
  useEffect(carregar, [token]);

  async function salvar() {
    if (!token) return;
    setMensagem('');
    try {
      await api.criarPaciente(token, { nomeCompleto, cpf, email: email || null, telefone: telefone || null, dataNascimento });
      setNomeCompleto(''); setCpf(''); setEmail(''); setTelefone(''); setDataNascimento('2000-01-01');
      setMensagem('Paciente cadastrado com sucesso.');
      carregar();
    } catch (e) {
      setMensagem(e instanceof Error ? e.message : 'Erro ao salvar paciente.');
    }
  }

  return (
    <Tela>
      <Cabecalho titulo="Pacientes" voltar={voltar} />
      <Cartao>
        <Campo label="Nome completo" value={nomeCompleto} onChangeText={setNomeCompleto} />
        <Campo label="CPF" value={cpf} onChangeText={setCpf} />
        <Campo label="E-mail" value={email} onChangeText={setEmail} />
        <Campo label="Telefone" value={telefone} onChangeText={setTelefone} />
        <Campo label="Data de nascimento (AAAA-MM-DD)" value={dataNascimento} onChangeText={setDataNascimento} />
        <Botao texto="Cadastrar paciente" onPress={salvar} />
        {!!mensagem && <Mensagem texto={mensagem} tipo={mensagem.includes('sucesso') ? 'sucesso' : 'normal'} />}
      </Cartao>
      <ListaSecao dados={dados} mapear={(item) => ({ titulo: item.nomeCompleto, descricao: `${item.cpf} • ${item.telefone || 'sem telefone'}` })} />
    </Tela>
  );
}

export function MedicosScreen({ voltar }: { titulo: string; voltar: () => void }) {
  const { token } = useAuth();
  const [dados, setDados] = useState<Medico[]>([]);
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [crm, setCrm] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [mensagem, setMensagem] = useState('');

  const carregar = () => token && api.listarMedicos(token).then(setDados).catch((e) => setMensagem(e.message));
  useEffect(carregar, [token]);

  async function salvar() {
    if (!token) return;
    try {
      await api.criarMedico(token, { nomeCompleto, crm, especialidade });
      setNomeCompleto(''); setCrm(''); setEspecialidade('');
      setMensagem('Médico cadastrado com sucesso.');
      carregar();
    } catch (e) {
      setMensagem(e instanceof Error ? e.message : 'Erro ao salvar médico.');
    }
  }

  return (
    <Tela>
      <Cabecalho titulo="Médicos" voltar={voltar} />
      <Cartao>
        <Campo label="Nome completo" value={nomeCompleto} onChangeText={setNomeCompleto} />
        <Campo label="CRM" value={crm} onChangeText={setCrm} />
        <Campo label="Especialidade" value={especialidade} onChangeText={setEspecialidade} />
        <Botao texto="Cadastrar médico" onPress={salvar} />
        {!!mensagem && <Mensagem texto={mensagem} tipo={mensagem.includes('sucesso') ? 'sucesso' : 'normal'} />}
      </Cartao>
      <ListaSecao dados={dados} mapear={(item) => ({ titulo: item.nomeCompleto, descricao: `${item.crm} • ${item.especialidade}` })} />
    </Tela>
  );
}

export function ConsultasScreen({ voltar }: { titulo: string; voltar: () => void }) {
  const { token } = useAuth();
  const [dados, setDados] = useState<Consulta[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [pacienteId, setPacienteId] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [inicio, setInicio] = useState('2026-06-12T09:00:00.000Z');
  const [fim, setFim] = useState('2026-06-12T10:00:00.000Z');
  const [status, setStatus] = useState<'AGENDADA' | 'CANCELADA' | 'REALIZADA'>('AGENDADA');
  const [observacoes, setObservacoes] = useState('');
  const [mensagem, setMensagem] = useState('');

  const carregar = async () => {
    if (!token) return;
    try {
      const [c, p, m] = await Promise.all([api.listarConsultas(token), api.listarPacientes(token), api.listarMedicos(token)]);
      setDados(c); setPacientes(p); setMedicos(m);
      setPacienteId((prev) => prev || p[0]?.id || '');
      setMedicoId((prev) => prev || m[0]?.id || '');
    } catch (e) {
      setMensagem(e instanceof Error ? e.message : 'Erro ao carregar consultas.');
    }
  };
  useEffect(() => { carregar(); }, [token]);

  async function salvar() {
    if (!token) return;
    try {
      await api.criarConsulta(token, { pacienteId, medicoId, inicio, fim, status, observacoes: observacoes || null });
      setMensagem('Consulta cadastrada com sucesso.');
      carregar();
    } catch (e) {
      setMensagem(e instanceof Error ? e.message : 'Erro ao salvar consulta.');
    }
  }

  return (
    <Tela>
      <Cabecalho titulo="Consultas" voltar={voltar} />
      <Cartao>
        <Campo label="Paciente ID" value={pacienteId} onChangeText={setPacienteId} placeholder={pacientes[0]?.id} />
        <Campo label="Médico ID" value={medicoId} onChangeText={setMedicoId} placeholder={medicos[0]?.id} />
        <Campo label="Início (ISO)" value={inicio} onChangeText={setInicio} />
        <Campo label="Fim (ISO)" value={fim} onChangeText={setFim} />
        <Campo label="Status" value={status} onChangeText={(v) => setStatus((v as 'AGENDADA' | 'CANCELADA' | 'REALIZADA') || 'AGENDADA')} />
        <Campo label="Observações" value={observacoes} onChangeText={setObservacoes} />
        <Botao texto="Cadastrar consulta" onPress={salvar} />
        {!!mensagem && <Mensagem texto={mensagem} tipo="normal" />}
      </Cartao>
      <ListaSecao dados={dados} mapear={(item) => ({ titulo: `${item.paciente?.nomeCompleto || item.pacienteId} com ${item.medico?.nomeCompleto || item.medicoId}`, descricao: `${item.status} • ${new Date(item.inicio).toLocaleString()}` })} />
    </Tela>
  );
}

export function ExamesScreen({ voltar }: { titulo: string; voltar: () => void }) {
  const { token } = useAuth();
  const [dados, setDados] = useState<Exame[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteId, setPacienteId] = useState('');
  const [tipo, setTipo] = useState('');
  const [dataHora, setDataHora] = useState('2026-06-12T14:00:00.000Z');
  const [local, setLocal] = useState('Laboratório Central');
  const [status, setStatus] = useState<'AGENDADO' | 'CANCELADO' | 'REALIZADO'>('AGENDADO');
  const [resultado, setResultado] = useState('');
  const [mensagem, setMensagem] = useState('');

  const carregar = async () => {
    if (!token) return;
    try {
      const [e, p] = await Promise.all([api.listarExames(token), api.listarPacientes(token)]);
      setDados(e); setPacientes(p); setPacienteId((prev) => prev || p[0]?.id || '');
    } catch (err) {
      setMensagem(err instanceof Error ? err.message : 'Erro ao carregar exames.');
    }
  };
  useEffect(() => { carregar(); }, [token]);

  async function salvar() {
    if (!token) return;
    try {
      await api.criarExame(token, { pacienteId, tipo, dataHora, local, status, resultado: resultado || null });
      setMensagem('Exame cadastrado com sucesso.');
      carregar();
    } catch (e) {
      setMensagem(e instanceof Error ? e.message : 'Erro ao salvar exame.');
    }
  }

  return (
    <Tela>
      <Cabecalho titulo="Exames" voltar={voltar} />
      <Cartao>
        <Campo label="Paciente ID" value={pacienteId} onChangeText={setPacienteId} placeholder={pacientes[0]?.id} />
        <Campo label="Tipo" value={tipo} onChangeText={setTipo} />
        <Campo label="Data e hora (ISO)" value={dataHora} onChangeText={setDataHora} />
        <Campo label="Local" value={local} onChangeText={setLocal} />
        <Campo label="Status" value={status} onChangeText={(v) => setStatus((v as 'AGENDADO' | 'CANCELADO' | 'REALIZADO') || 'AGENDADO')} />
        <Campo label="Resultado" value={resultado} onChangeText={setResultado} />
        <Botao texto="Cadastrar exame" onPress={salvar} />
        {!!mensagem && <Mensagem texto={mensagem} />}
      </Cartao>
      <ListaSecao dados={dados} mapear={(item) => ({ titulo: `${item.tipo} • ${item.paciente?.nomeCompleto || item.pacienteId}`, descricao: `${item.status} • ${item.local}` })} />
    </Tela>
  );
}

export function PrescricoesScreen({ voltar }: { titulo: string; voltar: () => void }) {
  const { token } = useAuth();
  const [dados, setDados] = useState<Prescricao[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [pacienteId, setPacienteId] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [observacoesGerais, setObservacoesGerais] = useState('');
  const [medicamento, setMedicamento] = useState('Dipirona');
  const [dosagem, setDosagem] = useState('500mg');
  const [frequencia, setFrequencia] = useState('8/8h');
  const [duracaoDias, setDuracaoDias] = useState('5');
  const [mensagem, setMensagem] = useState('');

  const carregar = async () => {
    if (!token) return;
    try {
      const [r, p, m] = await Promise.all([api.listarPrescricoes(token), api.listarPacientes(token), api.listarMedicos(token)]);
      setDados(r); setPacientes(p); setMedicos(m);
      setPacienteId((prev) => prev || p[0]?.id || '');
      setMedicoId((prev) => prev || m[0]?.id || '');
    } catch (e) {
      setMensagem(e instanceof Error ? e.message : 'Erro ao carregar prescrições.');
    }
  };
  useEffect(() => { carregar(); }, [token]);

  async function salvar() {
    if (!token) return;
    try {
      await api.criarPrescricao(token, {
        pacienteId,
        medicoId,
        observacoesGerais: observacoesGerais || null,
        itens: [{ medicamento, dosagem, frequencia, duracaoDias: Number(duracaoDias) || null }],
      });
      setMensagem('Prescrição cadastrada com sucesso.');
      carregar();
    } catch (e) {
      setMensagem(e instanceof Error ? e.message : 'Erro ao salvar prescrição.');
    }
  }

  return (
    <Tela>
      <Cabecalho titulo="Prescrições" voltar={voltar} />
      <Cartao>
        <Campo label="Paciente ID" value={pacienteId} onChangeText={setPacienteId} placeholder={pacientes[0]?.id} />
        <Campo label="Médico ID" value={medicoId} onChangeText={setMedicoId} placeholder={medicos[0]?.id} />
        <Campo label="Observações gerais" value={observacoesGerais} onChangeText={setObservacoesGerais} />
        <Campo label="Medicamento" value={medicamento} onChangeText={setMedicamento} />
        <Campo label="Dosagem" value={dosagem} onChangeText={setDosagem} />
        <Campo label="Frequência" value={frequencia} onChangeText={setFrequencia} />
        <Campo label="Duração (dias)" value={duracaoDias} onChangeText={setDuracaoDias} />
        <Botao texto="Cadastrar prescrição" onPress={salvar} />
        {!!mensagem && <Mensagem texto={mensagem} />}
      </Cartao>
      <ListaSecao dados={dados} mapear={(item) => ({ titulo: `${item.paciente?.nomeCompleto || item.pacienteId} • ${item.medico?.nomeCompleto || item.medicoId}`, descricao: item.itens.map((it) => `${it.medicamento} ${it.dosagem}`).join(' | ') })} />
    </Tela>
  );
}

export function InternacoesScreen({ voltar }: { titulo: string; voltar: () => void }) {
  const { token } = useAuth();
  const [dados, setDados] = useState<Internacao[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteId, setPacienteId] = useState('');
  const [quarto, setQuarto] = useState('101');
  const [leito, setLeito] = useState('A');
  const [motivo, setMotivo] = useState('Observação');
  const [dataEntrada, setDataEntrada] = useState(new Date().toISOString());
  const [dataSaida, setDataSaida] = useState('');
  const [status, setStatus] = useState<'ATIVA' | 'ALTA' | 'TRANSFERIDA'>('ATIVA');
  const [observacoes, setObservacoes] = useState('');
  const [mensagem, setMensagem] = useState('');

  const carregar = async () => {
    if (!token) return;
    try {
      const [i, p] = await Promise.all([api.listarInternacoes(token), api.listarPacientes(token)]);
      setDados(i); setPacientes(p); setPacienteId((prev) => prev || p[0]?.id || '');
    } catch (e) {
      setMensagem(e instanceof Error ? e.message : 'Erro ao carregar internações.');
    }
  };
  useEffect(() => { carregar(); }, [token]);

  async function salvar() {
    if (!token) return;
    try {
      await api.criarInternacao(token, { pacienteId, quarto, leito, motivo, dataEntrada, dataSaida: dataSaida || null, status, observacoes: observacoes || null });
      setMensagem('Internação cadastrada com sucesso.');
      carregar();
    } catch (e) {
      setMensagem(e instanceof Error ? e.message : 'Erro ao salvar internação.');
    }
  }

  return (
    <Tela>
      <Cabecalho titulo="Internações" voltar={voltar} />
      <Cartao>
        <Campo label="Paciente ID" value={pacienteId} onChangeText={setPacienteId} placeholder={pacientes[0]?.id} />
        <Campo label="Quarto" value={quarto} onChangeText={setQuarto} />
        <Campo label="Leito" value={leito} onChangeText={setLeito} />
        <Campo label="Motivo" value={motivo} onChangeText={setMotivo} />
        <Campo label="Data de entrada (ISO)" value={dataEntrada} onChangeText={setDataEntrada} />
        <Campo label="Data de saída (ISO)" value={dataSaida} onChangeText={setDataSaida} />
        <Campo label="Status" value={status} onChangeText={(v) => setStatus((v as 'ATIVA' | 'ALTA' | 'TRANSFERIDA') || 'ATIVA')} />
        <Campo label="Observações" value={observacoes} onChangeText={setObservacoes} />
        <Botao texto="Cadastrar internação" onPress={salvar} />
        {!!mensagem && <Mensagem texto={mensagem} />}
      </Cartao>
      <ListaSecao dados={dados} mapear={(item) => ({ titulo: `${item.paciente?.nomeCompleto || item.pacienteId} • quarto ${item.quarto}/${item.leito}`, descricao: `${item.status} • ${item.motivo}` })} />
    </Tela>
  );
}
