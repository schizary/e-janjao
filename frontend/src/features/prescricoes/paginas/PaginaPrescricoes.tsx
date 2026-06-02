import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/features/auth';
import type { Medico, Paciente, Prescricao, PrescricaoItem } from '@/shared/tipos/api';
import { ErroApi } from '@/shared/api/cliente';
import { listarPacientes } from '@/features/pacientes/api';
import { listarMedicos } from '@/features/medicos/api';
import { emitirPrescricao, listarPrescricoesPorPaciente } from '@/features/prescricoes/api';

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

function itemVazio(): PrescricaoItem {
  return { medicamento: '', dosagem: '', frequencia: '', duracaoDias: null };
}

function formatarItens(itens: PrescricaoItem[]): string {
  return itens
    .map((i) => {
      const duracao = i.duracaoDias != null ? ` • ${i.duracaoDias} dia(s)` : '';
      return `${i.medicamento} ${i.dosagem} — ${i.frequencia}${duracao}`;
    })
    .join('; ');
}

export function PaginaPrescricoes() {
  const { token } = useAuth();

  const [carregandoBase, setCarregandoBase] = useState(true);
  const [erroBase, setErroBase] = useState<string | null>(null);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);

  const [pacienteId, setPacienteId] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [observacoesGerais, setObservacoesGerais] = useState('');
  const [itens, setItens] = useState<PrescricaoItem[]>([itemVazio()]);

  const [carregandoLista, setCarregandoLista] = useState(false);
  const [prescricoes, setPrescricoes] = useState<Prescricao[]>([]);
  const [erroLista, setErroLista] = useState<string | null>(null);

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const podeEmitir = useMemo(() => {
    const itensValidos = itens.every(
      (i) => i.medicamento.trim() && i.dosagem.trim() && i.frequencia.trim(),
    );
    return Boolean(token && pacienteId && medicoId && itens.length > 0 && itensValidos);
  }, [token, pacienteId, medicoId, itens]);

  const mapaMedicos = useMemo(() => {
    return new Map(medicos.map((m) => [m.id, m.nomeCompleto]));
  }, [medicos]);

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

  async function carregarPrescricoes() {
    if (!token || !pacienteId) return;
    setCarregandoLista(true);
    setErroLista(null);
    try {
      const dados = await listarPrescricoesPorPaciente({ pacienteId, token });
      setPrescricoes(dados);
    } catch (err) {
      setErroLista(obterMensagemErro(err));
    } finally {
      setCarregandoLista(false);
    }
  }

  useEffect(() => {
    void carregarPrescricoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacienteId]);

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

  function adicionarItem() {
    setItens((prev) => [...prev, itemVazio()]);
  }

  function removerItem(index: number) {
    setItens((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  }

  async function aoEmitir(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensagem(null);

    if (!token) {
      setMensagem('Sessão inválida. Faça login novamente.');
      return;
    }

    setSalvando(true);
    try {
      await emitirPrescricao({
        token,
        entrada: {
          pacienteId,
          medicoId,
          observacoesGerais: observacoesGerais.trim() === '' ? null : observacoesGerais.trim(),
          itens: itens.map((i) => ({
            medicamento: i.medicamento.trim(),
            dosagem: i.dosagem.trim(),
            frequencia: i.frequencia.trim(),
            duracaoDias: i.duracaoDias ?? null,
          })),
        },
      });
      setMensagem('Prescrição emitida com sucesso.');
      setObservacoesGerais('');
      setItens([itemVazio()]);
      await carregarPrescricoes();
    } catch (err) {
      setMensagem(obterMensagemErro(err));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="container">
      <div className="stack">
        <div>
          <h1 style={{ marginBottom: 'var(--espaco-2)' }}>Prescrições</h1>
          <p style={{ margin: 0 }}>
            Emita prescrições médicas por paciente e consulte o histórico de medicamentos.
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
          <h2 style={{ marginBottom: 'var(--espaco-2)', fontSize: '1.05rem' }}>Emitir prescrição</h2>
          <p style={{ marginTop: 0 }}>Selecione paciente, médico e adicione os itens da receita.</p>

          {mensagem && (
            <div style={{ marginBottom: 'var(--espaco-3)', color: mensagem.includes('sucesso') ? 'var(--cor-sucesso)' : 'var(--cor-erro)' }}>
              {mensagem}
            </div>
          )}

          <form className="formulario" onSubmit={aoEmitir} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--espaco-4)' }}>
              <div className="campo">
                <label className="campo__rotulo" htmlFor="pacienteIdPrescricao">
                  Paciente
                </label>
                <select
                  id="pacienteIdPrescricao"
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
                <label className="campo__rotulo" htmlFor="medicoIdPrescricao">
                  Médico
                </label>
                <select
                  id="medicoIdPrescricao"
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
            </div>

            <div className="campo">
              <label className="campo__rotulo" htmlFor="observacoesGerais">
                Observações gerais (opcional)
              </label>
              <textarea
                id="observacoesGerais"
                rows={2}
                value={observacoesGerais}
                onChange={(e) => setObservacoesGerais(e.target.value)}
                placeholder="Orientações adicionais ao paciente"
              />
            </div>

            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: 'var(--espaco-2)' }}>Itens da prescrição</h3>
              <div className="stack" style={{ gap: 'var(--espaco-4)' }}>
                {itens.map((item, index) => (
                  <div
                    key={index}
                    className="card"
                    style={{ padding: 'var(--espaco-3)', borderColor: 'var(--cor-borda)' }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--espaco-3)' }}>
                      <div className="campo">
                        <label className="campo__rotulo">Medicamento</label>
                        <input
                          value={item.medicamento}
                          onChange={(e) => atualizarItem(index, 'medicamento', e.target.value)}
                          placeholder="Nome do medicamento"
                        />
                      </div>
                      <div className="campo">
                        <label className="campo__rotulo">Dosagem</label>
                        <input
                          value={item.dosagem}
                          onChange={(e) => atualizarItem(index, 'dosagem', e.target.value)}
                          placeholder="Ex.: 500mg"
                        />
                      </div>
                      <div className="campo">
                        <label className="campo__rotulo">Frequência</label>
                        <input
                          value={item.frequencia}
                          onChange={(e) => atualizarItem(index, 'frequencia', e.target.value)}
                          placeholder="Ex.: 8/8h"
                        />
                      </div>
                      <div className="campo">
                        <label className="campo__rotulo">Duração (dias)</label>
                        <input
                          type="number"
                          min={1}
                          value={item.duracaoDias ?? ''}
                          onChange={(e) => atualizarItem(index, 'duracaoDias', e.target.value)}
                          placeholder="Opcional"
                        />
                      </div>
                    </div>
                    {itens.length > 1 && (
                      <button
                        type="button"
                        className="botao botao--perigo"
                        style={{ marginTop: 'var(--espaco-2)' }}
                        onClick={() => removerItem(index)}
                      >
                        Remover item
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" className="botao" style={{ marginTop: 'var(--espaco-3)' }} onClick={adicionarItem}>
                Adicionar medicamento
              </button>
            </div>

            <div className="row row--entre">
              <span style={{ color: 'var(--cor-texto-muted)', fontSize: '0.9rem' }}>
                {salvando ? 'Salvando…' : carregandoBase ? 'Carregando dados…' : ' '}
              </span>
              <button className="botao botao--primario" type="submit" disabled={!podeEmitir || salvando}>
                {salvando ? 'Emitindo…' : 'Emitir prescrição'}
              </button>
            </div>
          </form>
        </div>

        <div className="card card--padrao">
          <div className="row row--entre" style={{ alignItems: 'center' }}>
            <div>
              <h2 style={{ marginBottom: 'var(--espaco-1)', fontSize: '1.05rem' }}>Prescrições do paciente</h2>
              <p style={{ margin: 0 }}>
                {pacienteId ? 'Histórico de receitas emitidas.' : 'Selecione um paciente no formulário acima para listar.'}
              </p>
            </div>
            <button className="botao" type="button" onClick={carregarPrescricoes} disabled={!pacienteId || carregandoLista}>
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
                  <th>Data</th>
                  <th>Médico</th>
                  <th>Medicamentos</th>
                  <th>Observações</th>
                </tr>
              </thead>
              <tbody>
                {!carregandoLista && pacienteId && prescricoes.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ color: 'var(--cor-texto-muted)' }}>
                      Nenhuma prescrição encontrada para este paciente.
                    </td>
                  </tr>
                ) : !pacienteId ? (
                  <tr>
                    <td colSpan={4} style={{ color: 'var(--cor-texto-muted)' }}>
                      Selecione um paciente para listar as prescrições.
                    </td>
                  </tr>
                ) : (
                  prescricoes.map((pr) => (
                    <tr key={pr.id}>
                      <td>{formatarDataHoraIso(pr.criadoEm)}</td>
                      <td>{mapaMedicos.get(pr.medicoId) ?? pr.medicoId}</td>
                      <td>{formatarItens(pr.itens)}</td>
                      <td>{pr.observacoesGerais ?? '—'}</td>
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
