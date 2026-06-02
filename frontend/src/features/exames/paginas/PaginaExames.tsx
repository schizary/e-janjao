import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/features/auth';
import type { Exame, Paciente } from '@/shared/tipos/api';
import { ErroApi } from '@/shared/api/cliente';
import { listarPacientes } from '@/features/pacientes/api';
import { agendarExame, listarExamesPorPaciente, registrarResultadoExame } from '@/features/exames/api';

function obterMensagemErro(err: unknown): string {
  if (err instanceof ErroApi) return err.message;
  if (err instanceof Error) return err.message;
  return 'Não foi possível concluir a operação.';
}

function formatarDataHoraIso(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('pt-BR');
}

type FiltroStatus = '' | Exame['status'];

export function PaginaExames() {
  const { token } = useAuth();

  const [carregandoBase, setCarregandoBase] = useState(true);
  const [erroBase, setErroBase] = useState<string | null>(null);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  const [pacienteId, setPacienteId] = useState('');
  const [tipo, setTipo] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [local, setLocal] = useState('Laboratório Central');

  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('');
  const [carregandoLista, setCarregandoLista] = useState(false);
  const [exames, setExames] = useState<Exame[]>([]);
  const [erroLista, setErroLista] = useState<string | null>(null);

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const [resultadoPorExame, setResultadoPorExame] = useState<Record<string, string>>({});
  const [registrandoId, setRegistrandoId] = useState<string | null>(null);

  const podeAgendar = useMemo(() => {
    return Boolean(token && pacienteId && tipo.trim() && dataHora && local.trim());
  }, [token, pacienteId, tipo, dataHora, local]);

  const examesFiltrados = useMemo(() => {
    if (!filtroStatus) return exames;
    return exames.filter((e) => e.status === filtroStatus);
  }, [exames, filtroStatus]);

  const pendentes = useMemo(() => exames.filter((e) => e.status === 'AGENDADO').length, [exames]);
  const realizados = useMemo(() => exames.filter((e) => e.status === 'REALIZADO').length, [exames]);

  useEffect(() => {
    async function carregarBase() {
      if (!token) return;
      setCarregandoBase(true);
      setErroBase(null);
      try {
        const p = await listarPacientes({ nome: '', token });
        setPacientes(p);
      } catch (err) {
        setErroBase(obterMensagemErro(err));
      } finally {
        setCarregandoBase(false);
      }
    }

    void carregarBase();
  }, [token]);

  async function carregarExames() {
    if (!token || !pacienteId) return;
    setCarregandoLista(true);
    setErroLista(null);
    try {
      const dados = await listarExamesPorPaciente({ pacienteId, token });
      setExames(dados);
    } catch (err) {
      setErroLista(obterMensagemErro(err));
    } finally {
      setCarregandoLista(false);
    }
  }

  useEffect(() => {
    void carregarExames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacienteId]);

  async function aoAgendar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensagem(null);

    if (!token) {
      setMensagem('Sessão inválida. Faça login novamente.');
      return;
    }

    setSalvando(true);
    try {
      await agendarExame({
        token,
        entrada: {
          pacienteId,
          tipo: tipo.trim(),
          dataHora,
          local: local.trim(),
        },
      });
      setMensagem('Exame agendado com sucesso.');
      setTipo('');
      await carregarExames();
    } catch (err) {
      setMensagem(obterMensagemErro(err));
    } finally {
      setSalvando(false);
    }
  }

  async function aoRegistrarResultado(exameId: string) {
    if (!token) return;
    const resultado = resultadoPorExame[exameId]?.trim();
    if (!resultado) {
      setMensagem('Informe o resultado antes de registrar.');
      return;
    }

    setMensagem(null);
    setRegistrandoId(exameId);
    try {
      await registrarResultadoExame({ id: exameId, resultado, token });
      setMensagem('Resultado registrado com sucesso.');
      setResultadoPorExame((prev) => {
        const next = { ...prev };
        delete next[exameId];
        return next;
      });
      await carregarExames();
    } catch (err) {
      setMensagem(obterMensagemErro(err));
    } finally {
      setRegistrandoId(null);
    }
  }

  return (
    <div className="container">
      <div className="stack">
        <div>
          <h1 style={{ marginBottom: 'var(--espaco-2)' }}>Exames</h1>
          <p style={{ margin: 0 }}>
            Agende exames por paciente e acompanhe pendências e resultados.
          </p>
        </div>

        {erroBase && (
          <div
            role="alert"
            className="card card--padrao"
            style={{ borderColor: 'rgba(178, 75, 74, 0.35)', background: 'rgba(178, 75, 74, 0.06)' }}
          >
            <strong style={{ color: 'var(--cor-erro)' }}>Erro:</strong> {erroBase}
          </div>
        )}

        <div className="card card--padrao">
          <h2 style={{ marginBottom: 'var(--espaco-2)', fontSize: '1.05rem' }}>Agendar exame</h2>
          <p style={{ marginTop: 0 }}>Selecione o paciente, tipo, data/hora e local.</p>

          {mensagem && (
            <div style={{ marginBottom: 'var(--espaco-3)', color: mensagem.includes('sucesso') ? 'var(--cor-sucesso)' : 'var(--cor-erro)' }}>
              {mensagem}
            </div>
          )}

          <form className="formulario" onSubmit={aoAgendar} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--espaco-4)' }}>
              <div className="campo">
                <label className="campo__rotulo" htmlFor="pacienteIdExame">
                  Paciente
                </label>
                <select
                  id="pacienteIdExame"
                  value={pacienteId}
                  onChange={(e) => setPacienteId(e.target.value)}
                  disabled={carregandoBase}
                >
                  <option value="">Selecione um paciente</option>
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nomeCompleto}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo">
                <label className="campo__rotulo" htmlFor="tipoExame">
                  Tipo do exame
                </label>
                <input
                  id="tipoExame"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  placeholder="Ex.: Hemograma completo"
                />
              </div>

              <div className="campo">
                <label className="campo__rotulo" htmlFor="dataHoraExame">
                  Data e hora
                </label>
                <input
                  id="dataHoraExame"
                  type="datetime-local"
                  value={dataHora}
                  onChange={(e) => setDataHora(e.target.value)}
                />
              </div>

              <div className="campo">
                <label className="campo__rotulo" htmlFor="localExame">
                  Local
                </label>
                <input
                  id="localExame"
                  value={local}
                  onChange={(e) => setLocal(e.target.value)}
                  placeholder="Laboratório, setor, etc."
                />
              </div>
            </div>

            <div className="row row--entre">
              <span style={{ color: 'var(--cor-texto-muted)', fontSize: '0.9rem' }}>
                {salvando ? 'Salvando…' : carregandoBase ? 'Carregando dados…' : ' '}
              </span>
              <button className="botao botao--primario" type="submit" disabled={!podeAgendar || salvando}>
                {salvando ? 'Agendando…' : 'Agendar exame'}
              </button>
            </div>
          </form>
        </div>

        <div className="card card--padrao">
          <div className="row row--entre" style={{ alignItems: 'center', flexWrap: 'wrap', gap: 'var(--espaco-3)' }}>
            <div>
              <h2 style={{ marginBottom: 'var(--espaco-1)', fontSize: '1.05rem' }}>Exames do paciente</h2>
              <p style={{ margin: 0 }}>
                {pacienteId
                  ? `${pendentes} pendente(s) • ${realizados} realizado(s)`
                  : 'Selecione um paciente no formulário acima para listar.'}
              </p>
            </div>
            <div className="row" style={{ gap: 'var(--espaco-2)', flexWrap: 'wrap' }}>
              <div className="campo" style={{ margin: 0, minWidth: 180 }}>
                <label className="campo__rotulo" htmlFor="filtroStatusExame">
                  Filtrar status
                </label>
                <select
                  id="filtroStatusExame"
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value as FiltroStatus)}
                  disabled={!pacienteId}
                >
                  <option value="">Todos</option>
                  <option value="AGENDADO">Pendentes (agendados)</option>
                  <option value="REALIZADO">Realizados</option>
                  <option value="CANCELADO">Cancelados</option>
                </select>
              </div>
              <button className="botao" type="button" onClick={carregarExames} disabled={!pacienteId || carregandoLista} style={{ alignSelf: 'flex-end' }}>
                {carregandoLista ? 'Atualizando…' : 'Atualizar'}
              </button>
            </div>
          </div>

          {erroLista && (
            <div style={{ marginTop: 'var(--espaco-3)' }}>
              <div
                role="alert"
                className="card"
                style={{
                  padding: 'var(--espaco-3)',
                  borderColor: 'rgba(178, 75, 74, 0.35)',
                  background: 'rgba(178, 75, 74, 0.06)',
                }}
              >
                <strong style={{ color: 'var(--cor-erro)' }}>Erro:</strong> {erroLista}
              </div>
            </div>
          )}

          <div style={{ marginTop: 'var(--espaco-4)', overflowX: 'auto' }}>
            <table className="tabela">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Data/hora</th>
                  <th>Local</th>
                  <th>Status</th>
                  <th>Resultado</th>
                  <th style={{ width: 1 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {!carregandoLista && pacienteId && examesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ color: 'var(--cor-texto-muted)' }}>
                      Nenhum exame encontrado para este paciente{filtroStatus ? ' com o filtro selecionado' : ''}.
                    </td>
                  </tr>
                ) : !pacienteId ? (
                  <tr>
                    <td colSpan={6} style={{ color: 'var(--cor-texto-muted)' }}>
                      Selecione um paciente para listar os exames.
                    </td>
                  </tr>
                ) : (
                  examesFiltrados.map((ex) => (
                    <tr key={ex.id}>
                      <td>{ex.tipo}</td>
                      <td>{formatarDataHoraIso(ex.dataHora)}</td>
                      <td>{ex.local}</td>
                      <td>{ex.status}</td>
                      <td>{ex.resultado ?? '—'}</td>
                      <td>
                        {ex.status === 'AGENDADO' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--espaco-2)', minWidth: 200 }}>
                            <input
                              placeholder="Resultado do exame"
                              value={resultadoPorExame[ex.id] ?? ''}
                              onChange={(e) =>
                                setResultadoPorExame((prev) => ({ ...prev, [ex.id]: e.target.value }))
                              }
                            />
                            <button
                              className="botao botao--primario"
                              type="button"
                              disabled={registrandoId === ex.id}
                              onClick={() => void aoRegistrarResultado(ex.id)}
                            >
                              {registrandoId === ex.id ? 'Salvando…' : 'Registrar resultado'}
                            </button>
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
