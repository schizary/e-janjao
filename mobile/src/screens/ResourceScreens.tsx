import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Consulta, Exame, Internacao, Medico, Paciente, Prescricao } from '../types';
import { ListaSecao } from '../components/SectionList';
import { Botao, BotaoOutline, Campo, Cartao, Mensagem, ModalFlutuante, Subtitulo, Tela, Titulo } from '../components/ui';
import {
  cpfValido,
  dataBRparaISO,
  dataHoraAtualBR,
  dataHoraBRparaISO,
  telefoneValido,
} from '../utils/mascaras';

function Cabecalho({
  titulo,
  voltar,
  onNovo,
  textoNovo,
}: {
  titulo: string;
  voltar: () => void;
  onNovo: () => void;
  textoNovo: string;
}) {
  return (
    <View style={{ gap: 6 }}>
      <Titulo>{titulo}</Titulo>
      <Subtitulo>Consulte os registros ou cadastre um novo item.</Subtitulo>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }}>
          <BotaoOutline texto="Voltar" onPress={voltar} />
        </View>
        <View style={{ flex: 1 }}>
          <Botao texto={textoNovo} onPress={onNovo} />
        </View>
      </View>
    </View>
  );
}

export function PacientesScreen({ voltar }: { titulo: string; voltar: () => void }) {
  const { token } = useAuth();
  const [dados, setDados] = useState<Paciente[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [mensagemModal, setMensagemModal] = useState('');
  const [salvando, setSalvando] = useState(false);

  const carregar = () => {
    if (!token) {
      setMensagem('Sessão expirada. Faça login novamente.');
      return;
    }
    api.listarPacientes(token).then(setDados).catch((e) => setMensagem(e.message));
  };
  useEffect(carregar, [token]);

  function limparForm() {
    setNomeCompleto('');
    setCpf('');
    setEmail('');
    setTelefone('');
    setDataNascimento('');
    setMensagemModal('');
  }

  function abrirModal() {
    limparForm();
    setModalAberto(true);
  }

  async function salvar() {
    if (!token) {
      setMensagemModal('Sessão expirada. Faça login novamente.');
      return;
    }
    setSalvando(true);
    setMensagemModal('');

    if (!nomeCompleto.trim()) {
      setMensagemModal('Informe o nome completo.');
      setSalvando(false);
      return;
    }
    if (!cpfValido(cpf)) {
      setMensagemModal('CPF inválido. Use o formato 000.000.000-00.');
      setSalvando(false);
      return;
    }
    if (!telefoneValido(telefone)) {
      setMensagemModal('Telefone inválido. Use (00) 00000-0000.');
      setSalvando(false);
      return;
    }
    const dataIso = dataBRparaISO(dataNascimento);
    if (!dataIso) {
      setMensagemModal('Data de nascimento inválida. Use dd/mm/aaaa.');
      setSalvando(false);
      return;
    }

    try {
      await api.criarPaciente(token, {
        nomeCompleto: nomeCompleto.trim(),
        cpf,
        email: email.trim() || null,
        telefone: telefone.trim() || null,
        dataNascimento: dataIso,
      });
      setModalAberto(false);
      limparForm();
      setMensagem('Paciente cadastrado com sucesso.');
      carregar();
    } catch (e) {
      setMensagemModal(e instanceof Error ? e.message : 'Erro ao salvar paciente.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Tela>
      <Cabecalho titulo="Pacientes" voltar={voltar} onNovo={abrirModal} textoNovo="Novo paciente" />
      {!!mensagem && <Mensagem texto={mensagem} tipo={mensagem.includes('sucesso') ? 'sucesso' : 'erro'} />}
      <ListaSecao dados={dados} mapear={(item) => ({ titulo: item.nomeCompleto, descricao: `${item.cpf} • ${item.telefone || 'sem telefone'}` })} />

      <ModalFlutuante visible={modalAberto} titulo="Novo paciente" onFechar={() => setModalAberto(false)}>
        <Cartao>
          <Campo label="Nome completo" value={nomeCompleto} onChangeText={setNomeCompleto} />
          <Campo label="CPF" value={cpf} onChangeText={setCpf} tipo="cpf" placeholder="000.000.000-00" />
          <Campo label="E-mail" value={email} onChangeText={setEmail} placeholder="email@exemplo.com.br" />
          <Campo label="Telefone" value={telefone} onChangeText={setTelefone} tipo="telefone" placeholder="(00) 00000-0000" />
          <Campo label="Data de nascimento" value={dataNascimento} onChangeText={setDataNascimento} tipo="data" placeholder="dd/mm/aaaa" />
          {!!mensagemModal && <Mensagem texto={mensagemModal} tipo="erro" />}
          <Botao texto={salvando ? 'Cadastrando…' : 'Cadastrar paciente'} onPress={salvar} />
        </Cartao>
      </ModalFlutuante>
    </Tela>
  );
}

export function MedicosScreen({ voltar }: { titulo: string; voltar: () => void }) {
  const { token } = useAuth();
  const [dados, setDados] = useState<Medico[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [crm, setCrm] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [mensagemModal, setMensagemModal] = useState('');
  const [salvando, setSalvando] = useState(false);

  const carregar = () => {
    if (!token) {
      setMensagem('Sessão expirada. Faça login novamente.');
      return;
    }
    api.listarMedicos(token).then(setDados).catch((e) => setMensagem(e.message));
  };
  useEffect(carregar, [token]);

  function limparForm() {
    setNomeCompleto('');
    setCrm('');
    setEspecialidade('');
    setMensagemModal('');
  }

  function abrirModal() {
    limparForm();
    setModalAberto(true);
  }

  async function salvar() {
    if (!token) {
      setMensagemModal('Sessão expirada. Faça login novamente.');
      return;
    }
    setSalvando(true);
    setMensagemModal('');

    if (!nomeCompleto.trim()) {
      setMensagemModal('Informe o nome completo.');
      setSalvando(false);
      return;
    }
    if (crm.trim().length < 4) {
      setMensagemModal('CRM inválido. Informe pelo menos 4 caracteres.');
      setSalvando(false);
      return;
    }
    if (!especialidade.trim()) {
      setMensagemModal('Informe a especialidade.');
      setSalvando(false);
      return;
    }

    try {
      await api.criarMedico(token, {
        nomeCompleto: nomeCompleto.trim(),
        crm: crm.trim(),
        especialidade: especialidade.trim(),
      });
      setModalAberto(false);
      limparForm();
      setMensagem('Médico cadastrado com sucesso.');
      carregar();
    } catch (e) {
      setMensagemModal(e instanceof Error ? e.message : 'Erro ao salvar médico.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Tela>
      <Cabecalho titulo="Médicos" voltar={voltar} onNovo={abrirModal} textoNovo="Novo médico" />
      {!!mensagem && <Mensagem texto={mensagem} tipo={mensagem.includes('sucesso') ? 'sucesso' : 'erro'} />}
      <ListaSecao dados={dados} mapear={(item) => ({ titulo: item.nomeCompleto, descricao: `${item.crm} • ${item.especialidade}` })} />

      <ModalFlutuante visible={modalAberto} titulo="Novo médico" onFechar={() => setModalAberto(false)}>
        <Cartao>
          <Campo label="Nome completo" value={nomeCompleto} onChangeText={setNomeCompleto} />
          <Campo label="CRM" value={crm} onChangeText={setCrm} tipo="crm" placeholder="123456-SP" />
          <Campo label="Especialidade" value={especialidade} onChangeText={setEspecialidade} />
          {!!mensagemModal && <Mensagem texto={mensagemModal} tipo="erro" />}
          <Botao texto={salvando ? 'Cadastrando…' : 'Cadastrar médico'} onPress={salvar} />
        </Cartao>
      </ModalFlutuante>
    </Tela>
  );
}

export function ConsultasScreen({ voltar }: { titulo: string; voltar: () => void }) {
  const { token } = useAuth();
  const [dados, setDados] = useState<Consulta[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [pacienteId, setPacienteId] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [status, setStatus] = useState<'AGENDADA' | 'CANCELADA' | 'REALIZADA'>('AGENDADA');
  const [observacoes, setObservacoes] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [mensagemModal, setMensagemModal] = useState('');
  const [salvando, setSalvando] = useState(false);

  const carregar = async () => {
    if (!token) {
      setMensagem('Sessão expirada. Faça login novamente.');
      return;
    }
    try {
      const [c, p, m] = await Promise.all([api.listarConsultas(token), api.listarPacientes(token), api.listarMedicos(token)]);
      setDados(c);
      setPacientes(p);
      setMedicos(m);
      setPacienteId((prev) => prev || p[0]?.id || '');
      setMedicoId((prev) => prev || m[0]?.id || '');
    } catch (e) {
      setMensagem(e instanceof Error ? e.message : 'Erro ao carregar consultas.');
    }
  };
  useEffect(() => { carregar(); }, [token]);

  function abrirModal() {
    setObservacoes('');
    setMensagemModal('');
    const agora = dataHoraAtualBR();
    setInicio(agora);
    const [, hora] = agora.split(' ');
    const [hh, mm] = hora.split(':');
    const fimDate = new Date();
    fimDate.setHours(Number(hh) + 1, Number(mm), 0, 0);
    const dd = String(fimDate.getDate()).padStart(2, '0');
    const mes = String(fimDate.getMonth() + 1).padStart(2, '0');
    const yyyy = fimDate.getFullYear();
    const fimH = String(fimDate.getHours()).padStart(2, '0');
    const fimM = String(fimDate.getMinutes()).padStart(2, '0');
    setFim(`${dd}/${mes}/${yyyy} ${fimH}:${fimM}`);
    setModalAberto(true);
  }

  async function salvar() {
    if (!token) {
      setMensagemModal('Sessão expirada. Faça login novamente.');
      return;
    }
    setSalvando(true);
    setMensagemModal('');

    const inicioIso = dataHoraBRparaISO(inicio);
    const fimIso = dataHoraBRparaISO(fim);
    if (!inicioIso) {
      setMensagemModal('Data/hora de início inválida. Use dd/mm/aaaa hh:mm.');
      setSalvando(false);
      return;
    }
    if (!fimIso) {
      setMensagemModal('Data/hora de fim inválida. Use dd/mm/aaaa hh:mm.');
      setSalvando(false);
      return;
    }

    try {
      await api.criarConsulta(token, { pacienteId, medicoId, inicio: inicioIso, fim: fimIso, status, observacoes: observacoes || null });
      setModalAberto(false);
      setMensagem('Consulta cadastrada com sucesso.');
      carregar();
    } catch (e) {
      setMensagemModal(e instanceof Error ? e.message : 'Erro ao salvar consulta.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Tela>
      <Cabecalho titulo="Consultas" voltar={voltar} onNovo={abrirModal} textoNovo="Nova consulta" />
      {!!mensagem && <Mensagem texto={mensagem} tipo={mensagem.includes('sucesso') ? 'sucesso' : 'erro'} />}
      <ListaSecao dados={dados} mapear={(item) => ({ titulo: `${item.paciente?.nomeCompleto || item.pacienteId} com ${item.medico?.nomeCompleto || item.medicoId}`, descricao: `${item.status} • ${new Date(item.inicio).toLocaleString()}` })} />

      <ModalFlutuante visible={modalAberto} titulo="Nova consulta" onFechar={() => setModalAberto(false)}>
        <Cartao>
          <Campo label="Paciente ID" value={pacienteId} onChangeText={setPacienteId} placeholder={pacientes[0]?.id} />
          <Campo label="Médico ID" value={medicoId} onChangeText={setMedicoId} placeholder={medicos[0]?.id} />
          <Campo label="Início" value={inicio} onChangeText={setInicio} tipo="dataHora" placeholder="dd/mm/aaaa hh:mm" />
          <Campo label="Fim" value={fim} onChangeText={setFim} tipo="dataHora" placeholder="dd/mm/aaaa hh:mm" />
          <Campo label="Status" value={status} onChangeText={(v) => setStatus((v as 'AGENDADA' | 'CANCELADA' | 'REALIZADA') || 'AGENDADA')} />
          <Campo label="Observações" value={observacoes} onChangeText={setObservacoes} />
          {!!mensagemModal && <Mensagem texto={mensagemModal} tipo="erro" />}
          <Botao texto={salvando ? 'Cadastrando…' : 'Cadastrar consulta'} onPress={salvar} />
        </Cartao>
      </ModalFlutuante>
    </Tela>
  );
}

export function ExamesScreen({ voltar }: { titulo: string; voltar: () => void }) {
  const { token } = useAuth();
  const [dados, setDados] = useState<Exame[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [pacienteId, setPacienteId] = useState('');
  const [tipo, setTipo] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [local, setLocal] = useState('Laboratório Central');
  const [status, setStatus] = useState<'AGENDADO' | 'CANCELADO' | 'REALIZADO'>('AGENDADO');
  const [resultado, setResultado] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [mensagemModal, setMensagemModal] = useState('');
  const [salvando, setSalvando] = useState(false);

  const carregar = async () => {
    if (!token) {
      setMensagem('Sessão expirada. Faça login novamente.');
      return;
    }
    try {
      const [e, p] = await Promise.all([api.listarExames(token), api.listarPacientes(token)]);
      setDados(e);
      setPacientes(p);
      setPacienteId((prev) => prev || p[0]?.id || '');
    } catch (err) {
      setMensagem(err instanceof Error ? err.message : 'Erro ao carregar exames.');
    }
  };
  useEffect(() => { carregar(); }, [token]);

  function abrirModal() {
    setTipo('');
    setResultado('');
    setDataHora(dataHoraAtualBR());
    setMensagemModal('');
    setModalAberto(true);
  }

  async function salvar() {
    if (!token) {
      setMensagemModal('Sessão expirada. Faça login novamente.');
      return;
    }
    setSalvando(true);
    setMensagemModal('');

    if (!tipo.trim()) {
      setMensagemModal('Informe o tipo do exame.');
      setSalvando(false);
      return;
    }
    const dataHoraIso = dataHoraBRparaISO(dataHora);
    if (!dataHoraIso) {
      setMensagemModal('Data/hora inválida. Use dd/mm/aaaa hh:mm.');
      setSalvando(false);
      return;
    }

    try {
      await api.criarExame(token, { pacienteId, tipo: tipo.trim(), dataHora: dataHoraIso, local: local.trim(), status, resultado: resultado || null });
      setModalAberto(false);
      setMensagem('Exame cadastrado com sucesso.');
      carregar();
    } catch (e) {
      setMensagemModal(e instanceof Error ? e.message : 'Erro ao salvar exame.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Tela>
      <Cabecalho titulo="Exames" voltar={voltar} onNovo={abrirModal} textoNovo="Novo exame" />
      {!!mensagem && <Mensagem texto={mensagem} tipo={mensagem.includes('sucesso') ? 'sucesso' : 'erro'} />}
      <ListaSecao dados={dados} mapear={(item) => ({ titulo: `${item.tipo} • ${item.paciente?.nomeCompleto || item.pacienteId}`, descricao: `${item.status} • ${item.local}` })} />

      <ModalFlutuante visible={modalAberto} titulo="Novo exame" onFechar={() => setModalAberto(false)}>
        <Cartao>
          <Campo label="Paciente ID" value={pacienteId} onChangeText={setPacienteId} placeholder={pacientes[0]?.id} />
          <Campo label="Tipo" value={tipo} onChangeText={setTipo} />
          <Campo label="Data e hora" value={dataHora} onChangeText={setDataHora} tipo="dataHora" placeholder="dd/mm/aaaa hh:mm" />
          <Campo label="Local" value={local} onChangeText={setLocal} />
          <Campo label="Status" value={status} onChangeText={(v) => setStatus((v as 'AGENDADO' | 'CANCELADO' | 'REALIZADO') || 'AGENDADO')} />
          <Campo label="Resultado" value={resultado} onChangeText={setResultado} />
          {!!mensagemModal && <Mensagem texto={mensagemModal} tipo="erro" />}
          <Botao texto={salvando ? 'Cadastrando…' : 'Cadastrar exame'} onPress={salvar} />
        </Cartao>
      </ModalFlutuante>
    </Tela>
  );
}

export function PrescricoesScreen({ voltar }: { titulo: string; voltar: () => void }) {
  const { token } = useAuth();
  const [dados, setDados] = useState<Prescricao[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [pacienteId, setPacienteId] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [observacoesGerais, setObservacoesGerais] = useState('');
  const [medicamento, setMedicamento] = useState('Dipirona');
  const [dosagem, setDosagem] = useState('500mg');
  const [frequencia, setFrequencia] = useState('8/8h');
  const [duracaoDias, setDuracaoDias] = useState('5');
  const [mensagem, setMensagem] = useState('');
  const [mensagemModal, setMensagemModal] = useState('');
  const [salvando, setSalvando] = useState(false);

  const carregar = async () => {
    if (!token) {
      setMensagem('Sessão expirada. Faça login novamente.');
      return;
    }
    try {
      const [r, p, m] = await Promise.all([api.listarPrescricoes(token), api.listarPacientes(token), api.listarMedicos(token)]);
      setDados(r);
      setPacientes(p);
      setMedicos(m);
      setPacienteId((prev) => prev || p[0]?.id || '');
      setMedicoId((prev) => prev || m[0]?.id || '');
    } catch (e) {
      setMensagem(e instanceof Error ? e.message : 'Erro ao carregar prescrições.');
    }
  };
  useEffect(() => { carregar(); }, [token]);

  function abrirModal() {
    setObservacoesGerais('');
    setMensagemModal('');
    setModalAberto(true);
  }

  async function salvar() {
    if (!token) {
      setMensagemModal('Sessão expirada. Faça login novamente.');
      return;
    }
    setSalvando(true);
    setMensagemModal('');
    try {
      await api.criarPrescricao(token, {
        pacienteId,
        medicoId,
        observacoesGerais: observacoesGerais || null,
        itens: [{ medicamento, dosagem, frequencia, duracaoDias: Number(duracaoDias) || null }],
      });
      setModalAberto(false);
      setMensagem('Prescrição cadastrada com sucesso.');
      carregar();
    } catch (e) {
      setMensagemModal(e instanceof Error ? e.message : 'Erro ao salvar prescrição.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Tela>
      <Cabecalho titulo="Prescrições" voltar={voltar} onNovo={abrirModal} textoNovo="Nova prescrição" />
      {!!mensagem && <Mensagem texto={mensagem} tipo={mensagem.includes('sucesso') ? 'sucesso' : 'erro'} />}
      <ListaSecao dados={dados} mapear={(item) => ({ titulo: `${item.paciente?.nomeCompleto || item.pacienteId} • ${item.medico?.nomeCompleto || item.medicoId}`, descricao: item.itens.map((it) => `${it.medicamento} ${it.dosagem}`).join(' | ') })} />

      <ModalFlutuante visible={modalAberto} titulo="Nova prescrição" onFechar={() => setModalAberto(false)}>
        <Cartao>
          <Campo label="Paciente ID" value={pacienteId} onChangeText={setPacienteId} placeholder={pacientes[0]?.id} />
          <Campo label="Médico ID" value={medicoId} onChangeText={setMedicoId} placeholder={medicos[0]?.id} />
          <Campo label="Observações gerais" value={observacoesGerais} onChangeText={setObservacoesGerais} />
          <Campo label="Medicamento" value={medicamento} onChangeText={setMedicamento} />
          <Campo label="Dosagem" value={dosagem} onChangeText={setDosagem} />
          <Campo label="Frequência" value={frequencia} onChangeText={setFrequencia} />
          <Campo label="Duração (dias)" value={duracaoDias} onChangeText={setDuracaoDias} tipo="numero" placeholder="5" />
          {!!mensagemModal && <Mensagem texto={mensagemModal} tipo="erro" />}
          <Botao texto={salvando ? 'Cadastrando…' : 'Cadastrar prescrição'} onPress={salvar} />
        </Cartao>
      </ModalFlutuante>
    </Tela>
  );
}

export function InternacoesScreen({ voltar }: { titulo: string; voltar: () => void }) {
  const { token } = useAuth();
  const [dados, setDados] = useState<Internacao[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [pacienteId, setPacienteId] = useState('');
  const [quarto, setQuarto] = useState('101');
  const [leito, setLeito] = useState('A');
  const [motivo, setMotivo] = useState('Observação');
  const [dataEntrada, setDataEntrada] = useState('');
  const [dataSaida, setDataSaida] = useState('');
  const [status, setStatus] = useState<'ATIVA' | 'ALTA' | 'TRANSFERIDA'>('ATIVA');
  const [observacoes, setObservacoes] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [mensagemModal, setMensagemModal] = useState('');
  const [salvando, setSalvando] = useState(false);

  const carregar = async () => {
    if (!token) {
      setMensagem('Sessão expirada. Faça login novamente.');
      return;
    }
    try {
      const [i, p] = await Promise.all([api.listarInternacoes(token), api.listarPacientes(token)]);
      setDados(i);
      setPacientes(p);
      setPacienteId((prev) => prev || p[0]?.id || '');
    } catch (e) {
      setMensagem(e instanceof Error ? e.message : 'Erro ao carregar internações.');
    }
  };
  useEffect(() => { carregar(); }, [token]);

  function abrirModal() {
    setObservacoes('');
    setDataSaida('');
    setDataEntrada(dataHoraAtualBR());
    setMensagemModal('');
    setModalAberto(true);
  }

  async function salvar() {
    if (!token) {
      setMensagemModal('Sessão expirada. Faça login novamente.');
      return;
    }
    setSalvando(true);
    setMensagemModal('');

    const entradaIso = dataHoraBRparaISO(dataEntrada);
    if (!entradaIso) {
      setMensagemModal('Data de entrada inválida. Use dd/mm/aaaa hh:mm.');
      setSalvando(false);
      return;
    }
    let saidaIso: string | null = null;
    if (dataSaida.trim()) {
      saidaIso = dataHoraBRparaISO(dataSaida);
      if (!saidaIso) {
        setMensagemModal('Data de saída inválida. Use dd/mm/aaaa hh:mm.');
        setSalvando(false);
        return;
      }
    }

    try {
      await api.criarInternacao(token, {
        pacienteId,
        quarto: quarto.trim(),
        leito: leito.trim(),
        motivo: motivo.trim(),
        dataEntrada: entradaIso,
        dataSaida: saidaIso,
        status,
        observacoes: observacoes || null,
      });
      setModalAberto(false);
      setMensagem('Internação cadastrada com sucesso.');
      carregar();
    } catch (e) {
      setMensagemModal(e instanceof Error ? e.message : 'Erro ao salvar internação.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Tela>
      <Cabecalho titulo="Internações" voltar={voltar} onNovo={abrirModal} textoNovo="Nova internação" />
      {!!mensagem && <Mensagem texto={mensagem} tipo={mensagem.includes('sucesso') ? 'sucesso' : 'erro'} />}
      <ListaSecao dados={dados} mapear={(item) => ({ titulo: `${item.paciente?.nomeCompleto || item.pacienteId} • quarto ${item.quarto}/${item.leito}`, descricao: `${item.status} • ${item.motivo}` })} />

      <ModalFlutuante visible={modalAberto} titulo="Nova internação" onFechar={() => setModalAberto(false)}>
        <Cartao>
          <Campo label="Paciente ID" value={pacienteId} onChangeText={setPacienteId} placeholder={pacientes[0]?.id} />
          <Campo label="Quarto" value={quarto} onChangeText={setQuarto} />
          <Campo label="Leito" value={leito} onChangeText={setLeito} />
          <Campo label="Motivo" value={motivo} onChangeText={setMotivo} />
          <Campo label="Data de entrada" value={dataEntrada} onChangeText={setDataEntrada} tipo="dataHora" placeholder="dd/mm/aaaa hh:mm" />
          <Campo label="Data de saída (opcional)" value={dataSaida} onChangeText={setDataSaida} tipo="dataHora" placeholder="dd/mm/aaaa hh:mm" />
          <Campo label="Status" value={status} onChangeText={(v) => setStatus((v as 'ATIVA' | 'ALTA' | 'TRANSFERIDA') || 'ATIVA')} />
          <Campo label="Observações" value={observacoes} onChangeText={setObservacoes} />
          {!!mensagemModal && <Mensagem texto={mensagemModal} tipo="erro" />}
          <Botao texto={salvando ? 'Cadastrando…' : 'Cadastrar internação'} onPress={salvar} />
        </Cartao>
      </ModalFlutuante>
    </Tela>
  );
}
