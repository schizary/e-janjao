import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/features/auth';
import type { Internacao, Paciente } from '@/shared/tipos/api';
import { ErroApi } from '@/shared/api/cliente';
import { listarPacientes } from '@/features/pacientes/api';
import {
  darAltaInternacao,
  listarInternacoesPorPaciente,
  registrarInternacao,
} from '@/features/internacoes/api';

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

export function PaginaInternacoes() {
  const { token } = useAuth();

  const [carregandoBase, setCarregandoBase] = useState(true);
  const [erroBase, setErroBase] = useState<string | null>(null);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  const [pacienteId, setPacienteId] = useState('');
  const [quarto, setQuarto] = useState('');
  const [leito, setLeito] = useState('');
  const [motivo, setMotivo] = useState('');
  const [dataEntrada, setDataEntrada] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const [carregandoLista, setCarregandoLista] = useState(false);
  const [internacoes, setInternacoes] = useState<Internacao[]>([]);
  const [erroLista, setErroLista] = useState<string | null>(null);

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const [dataSaidaPorInternacao, setDataSaidaPorInternacao] = useState<Record<string, string>>({});
  const [obsAltaPorInternacao, setObsAltaPorInternacao] = useState<Record<string, string>>({});
  const [dandoAltaId, setDandoAltaId] = useState<string | null>(null);

  const internacoesAtivas = useMemo(
    () => internacoes.filter((i) => i.status === 'ATIVA'),
    [internacoes],
  );

  const pacienteInternado = internacoesAtivas.length > 0;

  const podeRegistrar = useMemo(() => {
    return Boolean(token && pacienteId && quarto.trim() && leito.trim() && motivo.trim() && dataEntrada);
  }, [token, pacienteId, quarto, leito, motivo, dataEntrada]);

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

  async function carregarInternacoes() {
    if (!token || !pacienteId) return;
    setCarregandoLista(true);
    setErroLista(null);
    try {
      const dados = await listarInternacoesPorPaciente({ pacienteId, token });
      setInternacoes(dados);
    } catch (err) {
      setErroLista(obterMensagemErro(err));
    } finally {
      setCarregandoLista(false);
    }
  }

  useEffect(() => {
    void carregarInternacoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacienteId]);

  async function aoRegistrar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensagem(null);

    if (!token) {
      setMensagem('Sessão inválida. Faça login novamente.');
      return;
    }

    setSalvando(true);
    try {
      await registrarInternacao({
        token,
        entrada: {
          pacienteId,
          quarto: quarto.trim(),
          leito: leito.trim(),
          motivo: motivo.trim(),
          dataEntrada,
          observacoes: observacoes.trim() === '' ? null : observacoes.trim(),
        },
      });
      setMensagem('Internação registrada com sucesso.');
      setQuarto('');
      setLeito('');
      setMotivo('');
      setObservacoes('');
      await carregarInternacoes();
    } catch (err) {
      setMensagem(obterMensagemErro(err));
    } finally {
      setSalvando(false);
    }
  }

  async function aoDarAlta(internacaoId: string) {
    if (!token) return;
    const dataSaida = dataSaidaPorInternacao[internacaoId];
    if (!dataSaida) {
      setMensagem('Informe a data de saída para registrar a alta.');
      return;
    }

    setMensagem(null);
    setDandoAltaId(internacaoId);
    try {
      await darAltaInternacao({
        id: internacaoId,
        token,
        entrada: {
          dataSaida,
          observacoes: obsAltaPorInternacao[internacaoId]?.trim() || null,
        },
      });
      setMensagem('Alta registrada com sucesso.');
      setDataSaidaPorInternacao((prev) => {
        const next = { ...prev };
        delete next[internacaoId];
        return next;
      });
      setObsAltaPorInternacao((prev) => {
        const next = { ...prev };
        delete next[internacaoId];
        return next;
      });
      await carregarInternacoes();
    } catch (err) {
      setMensagem(obterMensagemErro(err));
    } finally {
      setDandoAltaId(null);
    }
  }

  return (
    <div className="container">
      <div className="stack">
        <div>
          <h1 style={{ marginBottom: 'var(--espaco-2)' }}>Internações</h1>
          <p style={{ margin: 0 }}>
            Registre internações, verifique se o paciente está internado e registre altas.
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
          <h2 style={{ marginBottom: 'var(--espaco-2)', fontSize: '1.05rem' }}>Registrar internação</h2>
          <p style={{ marginTop: 0 }}>Selecione o paciente e informe quarto, leito e motivo.</p>

          {mensagem && (
            <div style={{ marginBottom: 'var(--espaco-3)', color: mensagem.includes('sucesso') ? 'var(--cor-sucesso)' : 'var(--cor-erro)' }}>
              {mensagem}
            </div>
          )}

          <form className="formulario" onSubmit={aoRegistrar} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--espaco-4)' }}>
              <div className="campo">
                <label className="campo__rotulo" htmlFor="pacienteIdInternacao">
                  Paciente
                </label>
                <select
                  id="pacienteIdInternacao"
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
                <label className="campo__rotulo" htmlFor="quarto">
                  Quarto
                </label>
                <input id="quarto" value={quarto} onChange={(e) => setQuarto(e.target.value)} placeholder="Ex.: 201" />
              </div>

              <div className="campo">
                <label className="campo__rotulo" htmlFor="leito">
                  Leito
                </label>
                <input id="leito" value={leito} onChange={(e) => setLeito(e.target.value)} placeholder="Ex.: A" />
              </div>

              <div className="campo">
                <label className="campo__rotulo" htmlFor="dataEntrada">
                  Data de entrada
                </label>
                <input
                  id="dataEntrada"
                  type="datetime-local"
                  value={dataEntrada}
                  onChange={(e) => setDataEntrada(e.target.value)}
                />
              </div>
            </div>

            <div className="campo">
              <label className="campo__rotulo" htmlFor="motivo">
                Motivo
              </label>
              <textarea
                id="motivo"
                rows={2}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Motivo da internação"
              />
            </div>

            <div className="campo">
              <label className="campo__rotulo" htmlFor="observacoesInternacao">
                Observações (opcional)
              </label>
              <textarea
                id="observacoesInternacao"
                rows={2}
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>

            <div className="row row--entre">
              <span style={{ color: 'var(--cor-texto-muted)', fontSize: '0.9rem' }}>
                {salvando ? 'Salvando…' : carregandoBase ? 'Carregando dados…' : ' '}
              </span>
              <button className="botao botao--primario" type="submit" disabled={!podeRegistrar || salvando}>
                {salvando ? 'Registrando…' : 'Registrar internação'}
              </button>
            </div>
          </form>
        </div>

        <div className="card card--padrao">
          <div className="row row--entre" style={{ alignItems: 'center' }}>
            <div>
              <h2 style={{ marginBottom: 'var(--espaco-1)', fontSize: '1.05rem' }}>Internações do paciente</h2>
              <p style={{ margin: 0 }}>
                {!pacienteId
                  ? 'Selecione um paciente no formulário acima para listar.'
                  : pacienteInternado
                    ? `Paciente internado — ${internacoesAtivas.length} internação(ões) ativa(s).`
                    : 'Paciente não possui internação ativa no momento.'}
              </p>
            </div>
            <button className="botao" type="button" onClick={carregarInternacoes} disabled={!pacienteId || carregandoLista}>
              {carregandoLista ? 'Atualizando…' : 'Atualizar'}
            </button>
          </div>

          {pacienteId && (
            <div
              style={{
                marginTop: 'var(--espaco-3)',
                padding: 'var(--espaco-3)',
                borderRadius: 8,
                background: pacienteInternado ? 'rgba(47, 158, 68, 0.08)' : 'rgba(92, 112, 128, 0.08)',
                border: `1px solid ${pacienteInternado ? 'rgba(47, 158, 68, 0.35)' : 'rgba(92, 112, 128, 0.25)'}`,
              }}
            >
              <strong style={{ color: pacienteInternado ? 'var(--cor-sucesso)' : 'var(--cor-texto-muted)' }}>
                {pacienteInternado ? 'Status: internado' : 'Status: não internado'}
              </strong>
            </div>
          )}

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
                  <th>Quarto / Leito</th>
                  <th>Motivo</th>
                  <th>Entrada</th>
                  <th>Saída</th>
                  <th>Status</th>
                  <th style={{ width: 1 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {!carregandoLista && pacienteId && internacoes.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ color: 'var(--cor-texto-muted)' }}>
                      Nenhuma internação encontrada para este paciente.
                    </td>
                  </tr>
                ) : !pacienteId ? (
                  <tr>
                    <td colSpan={6} style={{ color: 'var(--cor-texto-muted)' }}>
                      Selecione um paciente para listar as internações.
                    </td>
                  </tr>
                ) : (
                  internacoes.map((i) => (
                    <tr key={i.id}>
                      <td>
                        {i.quarto} / {i.leito}
                      </td>
                      <td>{i.motivo}</td>
                      <td>{formatarDataHoraIso(i.dataEntrada)}</td>
                      <td>{i.dataSaida ? formatarDataHoraIso(i.dataSaida) : '—'}</td>
                      <td>{i.status}</td>
                      <td>
                        {i.status === 'ATIVA' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--espaco-2)', minWidth: 200 }}>
                            <input
                              type="datetime-local"
                              aria-label="Data de saída"
                              value={dataSaidaPorInternacao[i.id] ?? ''}
                              onChange={(e) =>
                                setDataSaidaPorInternacao((prev) => ({ ...prev, [i.id]: e.target.value }))
                              }
                            />
                            <input
                              placeholder="Observações da alta (opcional)"
                              value={obsAltaPorInternacao[i.id] ?? ''}
                              onChange={(e) =>
                                setObsAltaPorInternacao((prev) => ({ ...prev, [i.id]: e.target.value }))
                              }
                            />
                            <button
                              className="botao botao--primario"
                              type="button"
                              disabled={dandoAltaId === i.id}
                              onClick={() => void aoDarAlta(i.id)}
                            >
                              {dandoAltaId === i.id ? 'Salvando…' : 'Registrar alta'}
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
