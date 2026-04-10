import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/features/auth';
import type { Consulta, Medico, Paciente } from '@/shared/tipos/api';
import { ErroApi } from '@/shared/api/cliente';
import { listarPacientes } from '@/features/pacientes/api';
import { listarMedicos } from '@/features/medicos/api';
import { agendarConsulta, listarConsultasPorPaciente, cancelarConsulta } from '@/features/consultas/api';

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

export function PaginaConsultas() {
  const { token } = useAuth();

  const [carregandoBase, setCarregandoBase] = useState(true);
  const [erroBase, setErroBase] = useState<string | null>(null);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);

  const [pacienteId, setPacienteId] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const [carregandoLista, setCarregandoLista] = useState(false);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [erroLista, setErroLista] = useState<string | null>(null);

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const podeAgendar = useMemo(() => {
    return Boolean(token && pacienteId && medicoId && inicio && fim);
  }, [token, pacienteId, medicoId, inicio, fim]);

  useEffect(() => {
    async function carregarBase() {
      if (!token) return;
      setCarregandoBase(true);
      setErroBase(null);
      try {
        const [p, m] = await Promise.all([
          listarPacientes({ nome: '', token }),
          listarMedicos({ especialidade: '', token }),
        ]);
        setPacientes(p);
        setMedicos(m);
      } catch (err) {
        setErroBase(obterMensagemErro(err));
      } finally {
        setCarregandoBase(false);
      }
    }

    void carregarBase();
  }, [token]);

  async function carregarConsultas() {
    if (!token || !pacienteId) return;
    setCarregandoLista(true);
    setErroLista(null);
    try {
      const dados = await listarConsultasPorPaciente({ pacienteId, token });
      setConsultas(dados);
    } catch (err) {
      setErroLista(obterMensagemErro(err));
    } finally {
      setCarregandoLista(false);
    }
  }

  useEffect(() => {
    void carregarConsultas();
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
      await agendarConsulta({
        token,
        entrada: {
          pacienteId,
          medicoId,
          inicio,
          fim,
          observacoes: observacoes.trim() === '' ? null : observacoes.trim(),
        },
      });
      setMensagem('Consulta agendada com sucesso.');
      setObservacoes('');
      await carregarConsultas();
    } catch (err) {
      setMensagem(obterMensagemErro(err));
    } finally {
      setSalvando(false);
    }
  }

  async function aoCancelar(id: string) {
    if (!token) return;
    setMensagem(null);
    try {
      await cancelarConsulta({ id, token, motivo: null });
      setMensagem('Consulta cancelada com sucesso.');
      await carregarConsultas();
    } catch (err) {
      setMensagem(obterMensagemErro(err));
    }
  }

  return (
    <div className="container">
      <div className="stack">
        <div>
          <h1 style={{ marginBottom: 'var(--espaco-2)' }}>Consultas</h1>
          <p style={{ margin: 0 }}>
            Agende uma consulta e acompanhe as consultas por paciente.
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
          <h2 style={{ marginBottom: 'var(--espaco-2)', fontSize: '1.05rem' }}>Agendar consulta</h2>
          <p style={{ marginTop: 0 }}>Selecione paciente, médico e horário.</p>

          {mensagem && (
            <div style={{ marginBottom: 'var(--espaco-3)', color: mensagem.includes('sucesso') ? 'var(--cor-sucesso)' : 'var(--cor-erro)' }}>
              {mensagem}
            </div>
          )}

          <form className="formulario" onSubmit={aoAgendar} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--espaco-4)' }}>
              <div className="campo">
                <label className="campo__rotulo" htmlFor="pacienteId">
                  Paciente
                </label>
                <select
                  id="pacienteId"
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
                <label className="campo__rotulo" htmlFor="medicoId">
                  Médico
                </label>
                <select
                  id="medicoId"
                  value={medicoId}
                  onChange={(e) => setMedicoId(e.target.value)}
                  disabled={carregandoBase}
                >
                  <option value="">Selecione um médico</option>
                  {medicos.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nomeCompleto} • {m.especialidade}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo">
                <label className="campo__rotulo" htmlFor="inicio">
                  Início
                </label>
                <input
                  id="inicio"
                  type="datetime-local"
                  value={inicio}
                  onChange={(e) => setInicio(e.target.value)}
                />
              </div>

              <div className="campo">
                <label className="campo__rotulo" htmlFor="fim">
                  Fim
                </label>
                <input
                  id="fim"
                  type="datetime-local"
                  value={fim}
                  onChange={(e) => setFim(e.target.value)}
                />
              </div>
            </div>

            <div className="campo">
              <label className="campo__rotulo" htmlFor="observacoes">
                Observações (opcional)
              </label>
              <textarea
                id="observacoes"
                rows={3}
                placeholder="Anotações relevantes para o atendimento"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>

            <div className="row row--entre">
              <span style={{ color: 'var(--cor-texto-muted)', fontSize: '0.9rem' }}>
                {salvando ? 'Salvando…' : carregandoBase ? 'Carregando dados…' : ' '}
              </span>
              <button className="botao botao--primario" type="submit" disabled={!podeAgendar || salvando}>
                {salvando ? 'Agendando…' : 'Agendar consulta'}
              </button>
            </div>
          </form>
        </div>

        <div className="card card--padrao">
          <div className="row row--entre" style={{ alignItems: 'center' }}>
            <div>
              <h2 style={{ marginBottom: 'var(--espaco-1)', fontSize: '1.05rem' }}>Consultas do paciente</h2>
              <p style={{ margin: 0 }}>
                {pacienteId ? 'Mostrando consultas do paciente selecionado.' : 'Selecione um paciente para listar.'}
              </p>
            </div>
            <button className="botao" type="button" onClick={carregarConsultas} disabled={!pacienteId || carregandoLista}>
              {carregandoLista ? 'Atualizando…' : 'Atualizar'}
            </button>
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
                  <th>Início</th>
                  <th>Fim</th>
                  <th>Status</th>
                  <th>Observações</th>
                  <th style={{ width: 1 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {!carregandoLista && pacienteId && consultas.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ color: 'var(--cor-texto-muted)' }}>
                      Nenhuma consulta encontrada para este paciente.
                    </td>
                  </tr>
                ) : !pacienteId ? (
                  <tr>
                    <td colSpan={5} style={{ color: 'var(--cor-texto-muted)' }}>
                      Selecione um paciente acima para listar as consultas.
                    </td>
                  </tr>
                ) : (
                  consultas.map((c) => (
                    <tr key={c.id}>
                      <td>{formatarDataHoraIso(c.inicio)}</td>
                      <td>{formatarDataHoraIso(c.fim)}</td>
                      <td>{c.status}</td>
                      <td>{c.observacoes ?? '—'}</td>
                      <td>
                        <button
                          className="botao botao--perigo"
                          type="button"
                          onClick={() => void aoCancelar(c.id)}
                          disabled={c.status === 'CANCELADA'}
                          title={c.status === 'CANCELADA' ? 'Consulta já cancelada' : 'Cancelar consulta'}
                        >
                          Cancelar
                        </button>
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

