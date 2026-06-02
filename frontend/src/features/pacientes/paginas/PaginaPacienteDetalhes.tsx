import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import type { Paciente, Consulta, Prescricao, Internacao } from '@/shared/tipos/api';
import { ErroApi } from '@/shared/api/cliente';
import { buscarPacientePorId, atualizarContatoPaciente } from '@/features/pacientes/api';
import { listarConsultasPorPaciente } from '@/features/consultas/api';
import { listarPrescricoesPorPaciente } from '@/features/prescricoes/api';
import { listarInternacoesAtivasPorPaciente } from '@/features/internacoes/api';

function obterMensagemErro(err: unknown): string {
  if (err instanceof ErroApi) return err.message;
  if (err instanceof Error) return err.message;
  return 'Não foi possível carregar os dados.';
}

function formatarDataIso(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('pt-BR');
}

function formatarDataHoraIso(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('pt-BR');
}

export function PaginaPacienteDetalhes() {
  const { id } = useParams();
  const { token } = useAuth();

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [paciente, setPaciente] = useState<Paciente | null>(null);

  const [editandoContato, setEditandoContato] = useState(false);
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [salvandoContato, setSalvandoContato] = useState(false);
  const [mensagemContato, setMensagemContato] = useState<string | null>(null);

  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [carregandoConsultas, setCarregandoConsultas] = useState(false);

  const [prescricoes, setPrescricoes] = useState<Prescricao[]>([]);
  const [carregandoPrescricoes, setCarregandoPrescricoes] = useState(false);

  const [internacoes, setInternacoes] = useState<Internacao[]>([]);
  const [carregandoInternacoes, setCarregandoInternacoes] = useState(false);

  const podeCarregar = useMemo(() => Boolean(id && token), [id, token]);

  useEffect(() => {
    async function carregar() {
      if (!id || !token) return;
      setCarregando(true);
      setErro(null);
      try {
        const p = await buscarPacientePorId({ id, token });
        setPaciente(p);
        setEmail(p.email ?? '');
        setTelefone(p.telefone ?? '');
      } catch (err) {
        setErro(obterMensagemErro(err));
      } finally {
        setCarregando(false);
      }
    }

    void carregar();
  }, [id, token]);

  useEffect(() => {
    async function carregarResumoProntuario() {
      if (!id || !token) return;

      setCarregandoConsultas(true);
      setCarregandoPrescricoes(true);
      setCarregandoInternacoes(true);

      try {
        const [c, pr, i] = await Promise.all([
          listarConsultasPorPaciente({ pacienteId: id, token }).catch(() => [] as Consulta[]),
          listarPrescricoesPorPaciente({ pacienteId: id, token }).catch(() => [] as Prescricao[]),
          listarInternacoesAtivasPorPaciente({ pacienteId: id, token }).catch(() => [] as Internacao[]),
        ]);
        setConsultas(c);
        setPrescricoes(pr);
        setInternacoes(i);
      } finally {
        setCarregandoConsultas(false);
        setCarregandoPrescricoes(false);
        setCarregandoInternacoes(false);
      }
    }

    void carregarResumoProntuario();
  }, [id, token]);

  async function salvarContato() {
    if (!id || !token) return;
    setMensagemContato(null);
    setSalvandoContato(true);
    try {
      const atualizado = await atualizarContatoPaciente({
        id,
        token,
        entrada: { email: email.trim() === '' ? null : email.trim(), telefone: telefone.trim() === '' ? null : telefone.trim() },
      });
      setPaciente(atualizado);
      setEditandoContato(false);
      setMensagemContato('Contato atualizado com sucesso.');
    } catch (err) {
      setMensagemContato(obterMensagemErro(err));
    } finally {
      setSalvandoContato(false);
    }
  }

  return (
    <div className="container">
      <div className="stack">
        <div className="row row--entre" style={{ alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ marginBottom: 'var(--espaco-2)' }}>Detalhes do paciente</h1>
            <p style={{ margin: 0 }}>Informações cadastrais e resumo do prontuário.</p>
          </div>
          <Link className="botao" to="/pacientes">
            Voltar
          </Link>
        </div>

        {!podeCarregar ? (
          <div className="card card--padrao">
            <p style={{ margin: 0 }}>Não foi possível identificar o paciente.</p>
          </div>
        ) : carregando ? (
          <div className="card card--padrao">
            <p style={{ margin: 0 }}>Carregando…</p>
          </div>
        ) : erro ? (
          <div
            role="alert"
            className="card card--padrao"
            style={{ borderColor: 'rgba(178, 75, 74, 0.35)', background: 'rgba(178, 75, 74, 0.06)' }}
          >
            <strong style={{ color: 'var(--cor-erro)' }}>Erro:</strong> {erro}
          </div>
        ) : paciente ? (
          <>
            <div className="card card--padrao">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 'var(--espaco-4)',
                }}
              >
                <div>
                  <div className="campo__ajuda">Nome</div>
                  <div style={{ fontWeight: 'var(--peso-semi)', color: 'var(--cor-texto)' }}>{paciente.nomeCompleto}</div>
                </div>
                <div>
                  <div className="campo__ajuda">CPF</div>
                  <div style={{ fontWeight: 'var(--peso-semi)', color: 'var(--cor-texto)' }}>{paciente.cpf}</div>
                </div>
                <div>
                  <div className="campo__ajuda">Data de nascimento</div>
                  <div style={{ fontWeight: 'var(--peso-semi)', color: 'var(--cor-texto)' }}>{formatarDataIso(paciente.dataNascimento)}</div>
                </div>
                <div>
                  <div className="campo__ajuda">Cadastrado em</div>
                  <div style={{ fontWeight: 'var(--peso-semi)', color: 'var(--cor-texto)' }}>{formatarDataHoraIso(paciente.criadoEm)}</div>
                </div>
              </div>
            </div>

            <div className="card card--padrao">
              <div className="row row--entre" style={{ alignItems: 'center' }}>
                <div>
                  <h2 style={{ marginBottom: 'var(--espaco-1)', fontSize: '1.05rem' }}>Contato</h2>
                  <p style={{ margin: 0 }}>E-mail e telefone (edição via API).</p>
                </div>

                {!editandoContato ? (
                  <button className="botao" type="button" onClick={() => { setMensagemContato(null); setEditandoContato(true); }}>
                    Editar contato
                  </button>
                ) : (
                  <div className="row">
                    <button className="botao" type="button" onClick={() => { setEmail(paciente.email ?? ''); setTelefone(paciente.telefone ?? ''); setEditandoContato(false); }} disabled={salvandoContato}>
                      Cancelar
                    </button>
                    <button className="botao botao--primario" type="button" onClick={salvarContato} disabled={salvandoContato}>
                      {salvandoContato ? 'Salvando…' : 'Salvar'}
                    </button>
                  </div>
                )}
              </div>

              {mensagemContato && (
                <div style={{ marginTop: 'var(--espaco-3)', color: mensagemContato.includes('sucesso') ? 'var(--cor-sucesso)' : 'var(--cor-erro)' }}>
                  {mensagemContato}
                </div>
              )}

              <div style={{ marginTop: 'var(--espaco-4)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--espaco-4)' }}>
                <div className={`campo${editandoContato && email.includes('@') === false && email.trim() !== '' ? ' campo--erro' : ''}`}>
                  <label className="campo__rotulo" htmlFor="emailContato">
                    E-mail
                  </label>
                  <input
                    id="emailContato"
                    type="email"
                    disabled={!editandoContato}
                    placeholder="email@exemplo.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="campo">
                  <label className="campo__rotulo" htmlFor="telefoneContato">
                    Telefone
                  </label>
                  <input
                    id="telefoneContato"
                    disabled={!editandoContato}
                    placeholder="(00) 00000-0000"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="card card--padrao">
              <h2 style={{ marginBottom: 'var(--espaco-2)', fontSize: '1.05rem' }}>Resumo do prontuário</h2>
              <p style={{ marginTop: 0 }}>
                Consultas, prescrições e internações ativas (conforme endpoints disponíveis no backend).
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--espaco-4)' }}>
                <div className="card" style={{ padding: 'var(--espaco-4)', borderColor: 'var(--cor-borda-suave)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <strong style={{ color: 'var(--cor-texto)' }}>Consultas</strong>
                    <span style={{ color: 'var(--cor-texto-muted)' }}>
                      {carregandoConsultas ? 'Carregando…' : `${consultas.length}`}
                    </span>
                  </div>
                  <div className="separador" style={{ margin: 'var(--espaco-3) 0' }} />
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--cor-texto-secundario)' }}>
                    {consultas.slice(0, 3).map((c) => (
                      <li key={c.id}>
                        {formatarDataHoraIso(c.inicio)} • {c.status}
                      </li>
                    ))}
                    {!carregandoConsultas && consultas.length === 0 && <li>Nenhuma consulta encontrada.</li>}
                  </ul>
                </div>

                <div className="card" style={{ padding: 'var(--espaco-4)', borderColor: 'var(--cor-borda-suave)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <strong style={{ color: 'var(--cor-texto)' }}>Prescrições</strong>
                    <span style={{ color: 'var(--cor-texto-muted)' }}>
                      {carregandoPrescricoes ? 'Carregando…' : `${prescricoes.length}`}
                    </span>
                  </div>
                  <div className="separador" style={{ margin: 'var(--espaco-3) 0' }} />
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--cor-texto-secundario)' }}>
                    {prescricoes.slice(0, 3).map((p) => (
                      <li key={p.id}>
                        {p.itens.length} item(ns) • {formatarDataHoraIso(p.criadoEm)}
                      </li>
                    ))}
                    {!carregandoPrescricoes && prescricoes.length === 0 && <li>Nenhuma prescrição encontrada.</li>}
                  </ul>
                </div>

                <div className="card" style={{ padding: 'var(--espaco-4)', borderColor: 'var(--cor-borda-suave)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <strong style={{ color: 'var(--cor-texto)' }}>Internações ativas</strong>
                    <span style={{ color: 'var(--cor-texto-muted)' }}>
                      {carregandoInternacoes ? 'Carregando…' : `${internacoes.length}`}
                    </span>
                  </div>
                  <div className="separador" style={{ margin: 'var(--espaco-3) 0' }} />
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--cor-texto-secundario)' }}>
                    {internacoes.slice(0, 3).map((i) => (
                      <li key={i.id}>
                        Quarto {i.quarto} • Leito {i.leito}
                      </li>
                    ))}
                    {!carregandoInternacoes && internacoes.length === 0 && <li>Nenhuma internação ativa.</li>}
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

