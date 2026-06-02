import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Consulta, Exame, Internacao, Medico, Paciente, Prescricao, PrescricaoItem } from '../types';
import { ListaSecao } from '../components/SectionList';
import { Botao, BotaoOutline, Campo, Cartao, Mensagem, ModalFlutuante, Seletor, Subtitulo, Tela, Titulo } from '../components/ui';
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
  const [carregandoBase, setCarregandoBase] = useState(true);
  const [carregandoLista, setCarregandoLista] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [pacienteId, setPacienteId] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [mensagemModal, setMensagemModal] = useState('');
  const [salvando, setSalvando] = useState(false);

  const opcoesPacientes = pacientes.map((p) => ({ valor: p.id, rotulo: p.nomeCompleto }));
  const opcoesMedicos = medicos.map((m) => ({ valor: m.id, rotulo: `${m.nomeCompleto} • ${m.especialidade}` }));

  const carregarConsultas = async (idPaciente: string) => {
    if (!token || !idPaciente) {
      setDados([]);
      return;
    }
    setCarregandoLista(true);
    try {
      const lista = await api.listarConsultasPorPaciente(token, idPaciente);
      setDados(lista);
    } catch (e) {
      setMensagem(e instanceof Error ? e.message : 'Erro ao carregar consultas.');
    } finally {
      setCarregandoLista(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    let ativo = true;
    (async () => {
      setCarregandoBase(true);
      try {
        const [p, m] = await Promise.all([api.listarPacientes(token), api.listarMedicos(token)]);
        if (!ativo) return;
        setPacientes(p);
        setMedicos(m);
        setPacienteId((prev) => prev || p[0]?.id || '');
        setMedicoId((prev) => prev || m[0]?.id || '');
      } catch (e) {
        if (ativo) setMensagem(e instanceof Error ? e.message : 'Erro ao carregar pacientes e médicos.');
      } finally {
        if (ativo) setCarregandoBase(false);
      }
    })();
    return () => { ativo = false; };
  }, [token]);

  useEffect(() => {
    void carregarConsultas(pacienteId);
  }, [token, pacienteId]);

  function abrirModal() {
    if (!pacientes.length) {
      setMensagem('Cadastre um paciente antes de agendar consultas.');
      return;
    }
    if (!medicos.length) {
      setMensagem('Cadastre um médico antes de agendar consultas.');
      return;
    }
    setObservacoes('');
    setMensagemModal('');
    setMedicoId((prev) => prev || medicos[0]?.id || '');
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
    if (!pacienteId) {
      setMensagemModal('Selecione um paciente.');
      return;
    }
    if (!medicoId) {
      setMensagemModal('Selecione um médico.');
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
      await api.criarConsulta(token, {
        pacienteId,
        medicoId,
        inicio: inicioIso,
        fim: fimIso,
        observacoes: observacoes.trim() || null,
      });
      setModalAberto(false);
      setMensagem('Consulta agendada com sucesso.');
      await carregarConsultas(pacienteId);
    } catch (e) {
      setMensagemModal(e instanceof Error ? e.message : 'Erro ao salvar consulta.');
    } finally {
      setSalvando(false);
    }
  }

  const nomeMedico = (id: string) => medicos.find((m) => m.id === id)?.nomeCompleto ?? id;

  return (
    <Tela>
      <Cabecalho titulo="Consultas" voltar={voltar} onNovo={abrirModal} textoNovo="Nova consulta" />
      {!!mensagem && <Mensagem texto={mensagem} tipo={mensagem.includes('sucesso') ? 'sucesso' : 'erro'} />}
      <Cartao>
        <Seletor
          label="Paciente"
          value={pacienteId}
          onChange={setPacienteId}
          opcoes={opcoesPacientes}
          placeholder="Selecione um paciente"
          disabled={carregandoBase}
        />
        <Subtitulo>
          {carregandoLista ? 'Carregando consultas…' : pacienteId ? 'Consultas do paciente selecionado.' : 'Selecione um paciente para listar.'}
        </Subtitulo>
      </Cartao>
      <ListaSecao
        dados={dados}
        vazio={pacienteId ? 'Nenhuma consulta para este paciente.' : 'Selecione um paciente acima.'}
        mapear={(item) => ({
          titulo: `Dr(a). ${nomeMedico(item.medicoId)}`,
          descricao: `${item.status} • ${new Date(item.inicio).toLocaleString('pt-BR')} – ${new Date(item.fim).toLocaleString('pt-BR')}${item.observacoes ? ` • ${item.observacoes}` : ''}`,
        })}
      />

      <ModalFlutuante visible={modalAberto} titulo="Agendar consulta" onFechar={() => setModalAberto(false)}>
        <Cartao>
          <Seletor
            label="Paciente"
            value={pacienteId}
            onChange={setPacienteId}
            opcoes={opcoesPacientes}
            placeholder="Selecione um paciente"
          />
          <Seletor
            label="Médico"
            value={medicoId}
            onChange={setMedicoId}
            opcoes={opcoesMedicos}
            placeholder="Selecione um médico"
          />
          <Campo label="Início" value={inicio} onChangeText={setInicio} tipo="dataHora" placeholder="dd/mm/aaaa hh:mm" />
          <Campo label="Fim" value={fim} onChangeText={setFim} tipo="dataHora" placeholder="dd/mm/aaaa hh:mm" />
          <Campo label="Observações (opcional)" value={observacoes} onChangeText={setObservacoes} />
          {!!mensagemModal && <Mensagem texto={mensagemModal} tipo="erro" />}
          <Botao texto={salvando ? 'Agendando…' : 'Agendar consulta'} onPress={salvar} />
        </Cartao>
      </ModalFlutuante>
    </Tela>
  );
}

type FiltroStatusExame = '' | Exame['status'];

function itemPrescricaoVazio(): PrescricaoItem {
  return { medicamento: '', dosagem: '', frequencia: '', duracaoDias: null };
}

function formatarItensPrescricao(itens: PrescricaoItem[]): string {
  return itens
    .map((i) => {
      const duracao = i.duracaoDias != null ? ` • ${i.duracaoDias} dia(s)` : '';
      return `${i.medicamento} ${i.dosagem} — ${i.frequencia}${duracao}`;
    })
    .join('; ');
}

export function ExamesScreen({ voltar }: { titulo: string; voltar: () => void }) {
  const { token } = useAuth();
  const [dados, setDados] = useState<Exame[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [carregandoBase, setCarregandoBase] = useState(true);
  const [carregandoLista, setCarregandoLista] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalResultadoAberto, setModalResultadoAberto] = useState(false);
  const [exameResultadoId, setExameResultadoId] = useState('');
  const [pacienteId, setPacienteId] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatusExame>('');
  const [tipo, setTipo] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [local, setLocal] = useState('Laboratório Central');
  const [resultadoTexto, setResultadoTexto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [mensagemModal, setMensagemModal] = useState('');
  const [salvando, setSalvando] = useState(false);

  const opcoesPacientes = pacientes.map((p) => ({ valor: p.id, rotulo: p.nomeCompleto }));
  const opcoesFiltroStatus: Array<{ valor: FiltroStatusExame; rotulo: string }> = [
    { valor: '', rotulo: 'Todos' },
    { valor: 'AGENDADO', rotulo: 'Pendentes (agendados)' },
    { valor: 'REALIZADO', rotulo: 'Realizados' },
    { valor: 'CANCELADO', rotulo: 'Cancelados' },
  ];

  const dadosFiltrados = useMemo(() => {
    if (!filtroStatus) return dados;
    return dados.filter((e) => e.status === filtroStatus);
  }, [dados, filtroStatus]);

  const pendentes = useMemo(() => dados.filter((e) => e.status === 'AGENDADO').length, [dados]);

  const carregarExames = async (idPaciente: string) => {
    if (!token || !idPaciente) {
      setDados([]);
      return;
    }
    setCarregandoLista(true);
    try {
      const lista = await api.listarExamesPorPaciente(token, idPaciente);
      setDados(lista);
    } catch (e) {
      setMensagem(e instanceof Error ? e.message : 'Erro ao carregar exames.');
    } finally {
      setCarregandoLista(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    let ativo = true;
    (async () => {
      setCarregandoBase(true);
      try {
        const p = await api.listarPacientes(token);
        if (!ativo) return;
        setPacientes(p);
        setPacienteId((prev) => prev || p[0]?.id || '');
      } catch (e) {
        if (ativo) setMensagem(e instanceof Error ? e.message : 'Erro ao carregar pacientes.');
      } finally {
        if (ativo) setCarregandoBase(false);
      }
    })();
    return () => { ativo = false; };
  }, [token]);

  useEffect(() => {
    void carregarExames(pacienteId);
  }, [token, pacienteId]);

  function abrirModal() {
    if (!pacientes.length) {
      setMensagem('Cadastre um paciente antes de agendar exames.');
      return;
    }
    setTipo('');
    setDataHora(dataHoraAtualBR());
    setMensagemModal('');
    setModalAberto(true);
  }

  function abrirModalResultado(exameId: string) {
    setExameResultadoId(exameId);
    setResultadoTexto('');
    setMensagemModal('');
    setModalResultadoAberto(true);
  }

  async function salvar() {
    if (!token) {
      setMensagemModal('Sessão expirada. Faça login novamente.');
      return;
    }
    if (!pacienteId) {
      setMensagemModal('Selecione um paciente.');
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
      await api.criarExame(token, {
        pacienteId,
        tipo: tipo.trim(),
        dataHora: dataHoraIso,
        local: local.trim(),
      });
      setModalAberto(false);
      setMensagem('Exame agendado com sucesso.');
      await carregarExames(pacienteId);
    } catch (e) {
      setMensagemModal(e instanceof Error ? e.message : 'Erro ao salvar exame.');
    } finally {
      setSalvando(false);
    }
  }

  async function salvarResultado() {
    if (!token) {
      setMensagemModal('Sessão expirada. Faça login novamente.');
      return;
    }
    if (!resultadoTexto.trim()) {
      setMensagemModal('Informe o resultado do exame.');
      return;
    }
    setSalvando(true);
    setMensagemModal('');
    try {
      await api.registrarResultadoExame(token, exameResultadoId, resultadoTexto.trim());
      setModalResultadoAberto(false);
      setMensagem('Resultado registrado com sucesso.');
      await carregarExames(pacienteId);
    } catch (e) {
      setMensagemModal(e instanceof Error ? e.message : 'Erro ao registrar resultado.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Tela>
      <Cabecalho titulo="Exames" voltar={voltar} onNovo={abrirModal} textoNovo="Novo exame" />
      {!!mensagem && <Mensagem texto={mensagem} tipo={mensagem.includes('sucesso') ? 'sucesso' : 'erro'} />}
      <Cartao>
        <Seletor
          label="Paciente"
          value={pacienteId}
          onChange={setPacienteId}
          opcoes={opcoesPacientes}
          placeholder="Selecione um paciente"
          disabled={carregandoBase}
        />
        <Seletor
          label="Filtrar status"
          value={filtroStatus}
          onChange={(v) => setFiltroStatus(v as FiltroStatusExame)}
          opcoes={opcoesFiltroStatus}
          disabled={!pacienteId}
        />
        <Subtitulo>
          {carregandoLista
            ? 'Carregando exames…'
            : pacienteId
              ? `${pendentes} pendente(s) • ${dados.length} no total`
              : 'Selecione um paciente para listar.'}
        </Subtitulo>
      </Cartao>
      <ListaSecao
        dados={dadosFiltrados}
        chave={(item) => item.id}
        vazio={pacienteId ? 'Nenhum exame para este paciente.' : 'Selecione um paciente acima.'}
        mapear={(item) => ({
          titulo: item.tipo,
          descricao: `${item.status} • ${new Date(item.dataHora).toLocaleString('pt-BR')} • ${item.local}${item.resultado ? ` • ${item.resultado}` : ''}`,
        })}
        acoes={(item) =>
          item.status === 'AGENDADO' ? (
            <BotaoOutline texto="Registrar resultado" onPress={() => abrirModalResultado(item.id)} />
          ) : null
        }
      />

      <ModalFlutuante visible={modalAberto} titulo="Agendar exame" onFechar={() => setModalAberto(false)}>
        <Cartao>
          <Seletor label="Paciente" value={pacienteId} onChange={setPacienteId} opcoes={opcoesPacientes} placeholder="Selecione um paciente" />
          <Campo label="Tipo do exame" value={tipo} onChangeText={setTipo} placeholder="Ex.: Hemograma completo" />
          <Campo label="Data e hora" value={dataHora} onChangeText={setDataHora} tipo="dataHora" placeholder="dd/mm/aaaa hh:mm" />
          <Campo label="Local" value={local} onChangeText={setLocal} />
          {!!mensagemModal && <Mensagem texto={mensagemModal} tipo="erro" />}
          <Botao texto={salvando ? 'Agendando…' : 'Agendar exame'} onPress={salvar} />
        </Cartao>
      </ModalFlutuante>

      <ModalFlutuante visible={modalResultadoAberto} titulo="Registrar resultado" onFechar={() => setModalResultadoAberto(false)}>
        <Cartao>
          <Campo label="Resultado" value={resultadoTexto} onChangeText={setResultadoTexto} placeholder="Descreva o resultado" />
          {!!mensagemModal && <Mensagem texto={mensagemModal} tipo="erro" />}
          <Botao texto={salvando ? 'Salvando…' : 'Confirmar resultado'} onPress={salvarResultado} />
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
  const [carregandoBase, setCarregandoBase] = useState(true);
  const [carregandoLista, setCarregandoLista] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [pacienteId, setPacienteId] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [observacoesGerais, setObservacoesGerais] = useState('');
  const [itens, setItens] = useState<PrescricaoItem[]>([itemPrescricaoVazio()]);
  const [mensagem, setMensagem] = useState('');
  const [mensagemModal, setMensagemModal] = useState('');
  const [salvando, setSalvando] = useState(false);

  const opcoesPacientes = pacientes.map((p) => ({ valor: p.id, rotulo: p.nomeCompleto }));
  const opcoesMedicos = medicos.map((m) => ({ valor: m.id, rotulo: `${m.nomeCompleto} • ${m.especialidade}` }));
  const nomeMedico = (id: string) => medicos.find((m) => m.id === id)?.nomeCompleto ?? id;

  const carregarPrescricoes = async (idPaciente: string) => {
    if (!token || !idPaciente) {
      setDados([]);
      return;
    }
    setCarregandoLista(true);
    try {
      const lista = await api.listarPrescricoesPorPaciente(token, idPaciente);
      setDados(lista);
    } catch (e) {
      setMensagem(e instanceof Error ? e.message : 'Erro ao carregar prescrições.');
    } finally {
      setCarregandoLista(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    let ativo = true;
    (async () => {
      setCarregandoBase(true);
      try {
        const [p, m] = await Promise.all([api.listarPacientes(token), api.listarMedicos(token)]);
        if (!ativo) return;
        setPacientes(p);
        setMedicos(m);
        setPacienteId((prev) => prev || p[0]?.id || '');
        setMedicoId((prev) => prev || m[0]?.id || '');
      } catch (e) {
        if (ativo) setMensagem(e instanceof Error ? e.message : 'Erro ao carregar dados.');
      } finally {
        if (ativo) setCarregandoBase(false);
      }
    })();
    return () => { ativo = false; };
  }, [token]);

  useEffect(() => {
    void carregarPrescricoes(pacienteId);
  }, [token, pacienteId]);

  function atualizarItem(index: number, campo: keyof PrescricaoItem, valor: string) {
    setItens((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        if (campo === 'duracaoDias') {
          const dias = valor.trim() === '' ? null : Number.parseInt(valor, 10);
          return { ...item, duracaoDias: Number.isNaN(dias as number) ? null : dias };
        }
        return { ...item, [campo]: valor };
      }),
    );
  }

  function abrirModal() {
    if (!pacientes.length) {
      setMensagem('Cadastre um paciente antes de emitir prescrições.');
      return;
    }
    if (!medicos.length) {
      setMensagem('Cadastre um médico antes de emitir prescrições.');
      return;
    }
    setObservacoesGerais('');
    setItens([itemPrescricaoVazio()]);
    setMedicoId((prev) => prev || medicos[0]?.id || '');
    setMensagemModal('');
    setModalAberto(true);
  }

  async function salvar() {
    if (!token) {
      setMensagemModal('Sessão expirada. Faça login novamente.');
      return;
    }
    if (!pacienteId) {
      setMensagemModal('Selecione um paciente.');
      return;
    }
    if (!medicoId) {
      setMensagemModal('Selecione um médico.');
      return;
    }
    const itensValidos = itens.every((i) => i.medicamento.trim() && i.dosagem.trim() && i.frequencia.trim());
    if (!itensValidos) {
      setMensagemModal('Preencha medicamento, dosagem e frequência em todos os itens.');
      return;
    }

    setSalvando(true);
    setMensagemModal('');
    try {
      await api.criarPrescricao(token, {
        pacienteId,
        medicoId,
        observacoesGerais: observacoesGerais.trim() || null,
        itens: itens.map((i) => ({
          medicamento: i.medicamento.trim(),
          dosagem: i.dosagem.trim(),
          frequencia: i.frequencia.trim(),
          duracaoDias: i.duracaoDias ?? null,
        })),
      });
      setModalAberto(false);
      setMensagem('Prescrição emitida com sucesso.');
      await carregarPrescricoes(pacienteId);
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
      <Cartao>
        <Seletor
          label="Paciente"
          value={pacienteId}
          onChange={setPacienteId}
          opcoes={opcoesPacientes}
          placeholder="Selecione um paciente"
          disabled={carregandoBase}
        />
        <Subtitulo>
          {carregandoLista ? 'Carregando prescrições…' : pacienteId ? 'Histórico do paciente selecionado.' : 'Selecione um paciente para listar.'}
        </Subtitulo>
      </Cartao>
      <ListaSecao
        dados={dados}
        chave={(item) => item.id}
        vazio={pacienteId ? 'Nenhuma prescrição para este paciente.' : 'Selecione um paciente acima.'}
        mapear={(item) => ({
          titulo: `Dr(a). ${nomeMedico(item.medicoId)}`,
          descricao: `${formatarItensPrescricao(item.itens)}${item.observacoesGerais ? ` • ${item.observacoesGerais}` : ''}`,
        })}
      />

      <ModalFlutuante visible={modalAberto} titulo="Emitir prescrição" onFechar={() => setModalAberto(false)}>
        <Cartao>
          <Seletor label="Paciente" value={pacienteId} onChange={setPacienteId} opcoes={opcoesPacientes} placeholder="Selecione um paciente" />
          <Seletor label="Médico" value={medicoId} onChange={setMedicoId} opcoes={opcoesMedicos} placeholder="Selecione um médico" />
          <Campo label="Observações gerais (opcional)" value={observacoesGerais} onChangeText={setObservacoesGerais} />
          {itens.map((item, index) => (
            <View key={index} style={{ gap: 8, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#d8ece8' }}>
              <Subtitulo>Item {index + 1}</Subtitulo>
              <Campo label="Medicamento" value={item.medicamento} onChangeText={(v) => atualizarItem(index, 'medicamento', v)} />
              <Campo label="Dosagem" value={item.dosagem} onChangeText={(v) => atualizarItem(index, 'dosagem', v)} />
              <Campo label="Frequência" value={item.frequencia} onChangeText={(v) => atualizarItem(index, 'frequencia', v)} />
              <Campo
                label="Duração (dias)"
                value={item.duracaoDias != null ? String(item.duracaoDias) : ''}
                onChangeText={(v) => atualizarItem(index, 'duracaoDias', v)}
                tipo="numero"
                placeholder="Opcional"
              />
              {itens.length > 1 && (
                <BotaoOutline texto="Remover item" onPress={() => setItens((prev) => prev.filter((_, i) => i !== index))} />
              )}
            </View>
          ))}
          <BotaoOutline texto="Adicionar medicamento" onPress={() => setItens((prev) => [...prev, itemPrescricaoVazio()])} />
          {!!mensagemModal && <Mensagem texto={mensagemModal} tipo="erro" />}
          <Botao texto={salvando ? 'Emitindo…' : 'Emitir prescrição'} onPress={salvar} />
        </Cartao>
      </ModalFlutuante>
    </Tela>
  );
}

export function InternacoesScreen({ voltar }: { titulo: string; voltar: () => void }) {
  const { token } = useAuth();
  const [dados, setDados] = useState<Internacao[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [carregandoBase, setCarregandoBase] = useState(true);
  const [carregandoLista, setCarregandoLista] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalAltaAberto, setModalAltaAberto] = useState(false);
  const [internacaoAltaId, setInternacaoAltaId] = useState('');
  const [pacienteId, setPacienteId] = useState('');
  const [quarto, setQuarto] = useState('');
  const [leito, setLeito] = useState('');
  const [motivo, setMotivo] = useState('');
  const [dataEntrada, setDataEntrada] = useState('');
  const [dataSaidaAlta, setDataSaidaAlta] = useState('');
  const [observacoesAlta, setObservacoesAlta] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [mensagemModal, setMensagemModal] = useState('');
  const [salvando, setSalvando] = useState(false);

  const opcoesPacientes = pacientes.map((p) => ({ valor: p.id, rotulo: p.nomeCompleto }));
  const internacoesAtivas = useMemo(() => dados.filter((i) => i.status === 'ATIVA'), [dados]);
  const pacienteInternado = internacoesAtivas.length > 0;

  const carregarInternacoes = async (idPaciente: string) => {
    if (!token || !idPaciente) {
      setDados([]);
      return;
    }
    setCarregandoLista(true);
    try {
      const lista = await api.listarInternacoesPorPaciente(token, idPaciente);
      setDados(lista);
    } catch (e) {
      setMensagem(e instanceof Error ? e.message : 'Erro ao carregar internações.');
    } finally {
      setCarregandoLista(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    let ativo = true;
    (async () => {
      setCarregandoBase(true);
      try {
        const p = await api.listarPacientes(token);
        if (!ativo) return;
        setPacientes(p);
        setPacienteId((prev) => prev || p[0]?.id || '');
      } catch (e) {
        if (ativo) setMensagem(e instanceof Error ? e.message : 'Erro ao carregar pacientes.');
      } finally {
        if (ativo) setCarregandoBase(false);
      }
    })();
    return () => { ativo = false; };
  }, [token]);

  useEffect(() => {
    void carregarInternacoes(pacienteId);
  }, [token, pacienteId]);

  function abrirModal() {
    if (!pacientes.length) {
      setMensagem('Cadastre um paciente antes de registrar internações.');
      return;
    }
    setQuarto('');
    setLeito('');
    setMotivo('');
    setObservacoes('');
    setDataEntrada(dataHoraAtualBR());
    setMensagemModal('');
    setModalAberto(true);
  }

  function abrirModalAlta(internacaoId: string) {
    setInternacaoAltaId(internacaoId);
    setDataSaidaAlta(dataHoraAtualBR());
    setObservacoesAlta('');
    setMensagemModal('');
    setModalAltaAberto(true);
  }

  async function salvar() {
    if (!token) {
      setMensagemModal('Sessão expirada. Faça login novamente.');
      return;
    }
    if (!pacienteId) {
      setMensagemModal('Selecione um paciente.');
      return;
    }
    setSalvando(true);
    setMensagemModal('');

    if (!quarto.trim() || !leito.trim() || !motivo.trim()) {
      setMensagemModal('Informe quarto, leito e motivo.');
      setSalvando(false);
      return;
    }

    const entradaIso = dataHoraBRparaISO(dataEntrada);
    if (!entradaIso) {
      setMensagemModal('Data de entrada inválida. Use dd/mm/aaaa hh:mm.');
      setSalvando(false);
      return;
    }

    try {
      await api.criarInternacao(token, {
        pacienteId,
        quarto: quarto.trim(),
        leito: leito.trim(),
        motivo: motivo.trim(),
        dataEntrada: entradaIso,
        observacoes: observacoes.trim() || null,
      });
      setModalAberto(false);
      setMensagem('Internação registrada com sucesso.');
      await carregarInternacoes(pacienteId);
    } catch (e) {
      setMensagemModal(e instanceof Error ? e.message : 'Erro ao salvar internação.');
    } finally {
      setSalvando(false);
    }
  }

  async function salvarAlta() {
    if (!token) {
      setMensagemModal('Sessão expirada. Faça login novamente.');
      return;
    }
    const saidaIso = dataHoraBRparaISO(dataSaidaAlta);
    if (!saidaIso) {
      setMensagemModal('Data de saída inválida. Use dd/mm/aaaa hh:mm.');
      return;
    }

    setSalvando(true);
    setMensagemModal('');
    try {
      await api.darAltaInternacao(token, internacaoAltaId, {
        dataSaida: saidaIso,
        observacoes: observacoesAlta.trim() || null,
      });
      setModalAltaAberto(false);
      setMensagem('Alta registrada com sucesso.');
      await carregarInternacoes(pacienteId);
    } catch (e) {
      setMensagemModal(e instanceof Error ? e.message : 'Erro ao registrar alta.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Tela>
      <Cabecalho titulo="Internações" voltar={voltar} onNovo={abrirModal} textoNovo="Nova internação" />
      {!!mensagem && <Mensagem texto={mensagem} tipo={mensagem.includes('sucesso') ? 'sucesso' : 'erro'} />}
      <Cartao>
        <Seletor
          label="Paciente"
          value={pacienteId}
          onChange={setPacienteId}
          opcoes={opcoesPacientes}
          placeholder="Selecione um paciente"
          disabled={carregandoBase}
        />
        <Subtitulo>
          {carregandoLista
            ? 'Carregando internações…'
            : !pacienteId
              ? 'Selecione um paciente para listar.'
              : pacienteInternado
                ? `Status: internado (${internacoesAtivas.length} ativa(s))`
                : 'Status: não internado'}
        </Subtitulo>
      </Cartao>
      <ListaSecao
        dados={dados}
        chave={(item) => item.id}
        vazio={pacienteId ? 'Nenhuma internação para este paciente.' : 'Selecione um paciente acima.'}
        mapear={(item) => ({
          titulo: `Quarto ${item.quarto} / Leito ${item.leito}`,
          descricao: `${item.status} • ${item.motivo} • Entrada: ${new Date(item.dataEntrada).toLocaleString('pt-BR')}${item.dataSaida ? ` • Saída: ${new Date(item.dataSaida).toLocaleString('pt-BR')}` : ''}`,
        })}
        acoes={(item) =>
          item.status === 'ATIVA' ? (
            <BotaoOutline texto="Registrar alta" onPress={() => abrirModalAlta(item.id)} />
          ) : null
        }
      />

      <ModalFlutuante visible={modalAberto} titulo="Registrar internação" onFechar={() => setModalAberto(false)}>
        <Cartao>
          <Seletor label="Paciente" value={pacienteId} onChange={setPacienteId} opcoes={opcoesPacientes} placeholder="Selecione um paciente" />
          <Campo label="Quarto" value={quarto} onChangeText={setQuarto} placeholder="Ex.: 201" />
          <Campo label="Leito" value={leito} onChangeText={setLeito} placeholder="Ex.: A" />
          <Campo label="Motivo" value={motivo} onChangeText={setMotivo} placeholder="Motivo da internação" />
          <Campo label="Data de entrada" value={dataEntrada} onChangeText={setDataEntrada} tipo="dataHora" placeholder="dd/mm/aaaa hh:mm" />
          <Campo label="Observações (opcional)" value={observacoes} onChangeText={setObservacoes} />
          {!!mensagemModal && <Mensagem texto={mensagemModal} tipo="erro" />}
          <Botao texto={salvando ? 'Registrando…' : 'Registrar internação'} onPress={salvar} />
        </Cartao>
      </ModalFlutuante>

      <ModalFlutuante visible={modalAltaAberto} titulo="Registrar alta" onFechar={() => setModalAltaAberto(false)}>
        <Cartao>
          <Campo label="Data de saída" value={dataSaidaAlta} onChangeText={setDataSaidaAlta} tipo="dataHora" placeholder="dd/mm/aaaa hh:mm" />
          <Campo label="Observações da alta (opcional)" value={observacoesAlta} onChangeText={setObservacoesAlta} />
          {!!mensagemModal && <Mensagem texto={mensagemModal} tipo="erro" />}
          <Botao texto={salvando ? 'Salvando…' : 'Confirmar alta'} onPress={salvarAlta} />
        </Cartao>
      </ModalFlutuante>
    </Tela>
  );
}
