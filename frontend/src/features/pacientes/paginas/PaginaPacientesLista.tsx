import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import type { Paciente } from '@/shared/tipos/api';
import { ErroApi } from '@/shared/api/cliente';
import { criarPaciente, listarPacientes, type CriarPacienteEntrada } from '@/features/pacientes/api';

function obterMensagemErro(err: unknown): string {
  if (err instanceof ErroApi) return err.message;
  if (err instanceof Error) return err.message;
  return 'Não foi possível carregar os pacientes.';
}

export function PaginaPacientesLista() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState<CriarPacienteEntrada>({
    nomeCompleto: '',
    cpf: '',
    email: null,
    dataNascimento: '',
    telefone: null,
  });
  const [salvando, setSalvando] = useState(false);
  const [erroModal, setErroModal] = useState<string | null>(null);
  const [errosModal, setErrosModal] = useState<Partial<Record<keyof CriarPacienteEntrada, string>>>({});

  const podeBuscar = useMemo(() => token != null && token !== '', [token]);
  const podeSalvar = useMemo(() => {
    return Boolean(form.nomeCompleto.trim() && form.cpf.trim() && form.dataNascimento && token);
  }, [form, token]);

  async function carregar() {
    if (!token) return;
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarPacientes({ nome, token });
      setPacientes(dados);
    } catch (err) {
      setErro(obterMensagemErro(err));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    void carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function aoTeclar(ev: KeyboardEvent) {
      if (ev.key === 'Escape') setModalAberto(false);
    }
    if (modalAberto) window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [modalAberto]);

  function limparForm() {
    setForm({
      nomeCompleto: '',
      cpf: '',
      email: null,
      dataNascimento: '',
      telefone: null,
    });
    setErroModal(null);
    setErrosModal({});
  }

  async function salvarPaciente(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErroModal(null);
    setErrosModal({});
    if (!token) {
      setErroModal('Sessão inválida. Faça login novamente.');
      return;
    }
    setSalvando(true);
    try {
      const criado = await criarPaciente({
        token,
        entrada: {
          nomeCompleto: form.nomeCompleto,
          cpf: form.cpf,
          email: (String(form.email ?? '').trim() || null) as string | null,
          dataNascimento: form.dataNascimento,
          telefone: (String(form.telefone ?? '').trim() || null) as string | null,
        },
      });
      setModalAberto(false);
      limparForm();
      await carregar();
      navigate(`/pacientes/${criado.id}`);
    } catch (err) {
      if (err instanceof ErroApi && err.detalhes) {
        const mapeado: Partial<Record<keyof CriarPacienteEntrada, string>> = {};
        for (const d of err.detalhes) {
          const campo = d.campo as keyof CriarPacienteEntrada;
          if (campo in form) mapeado[campo] = d.mensagem;
        }
        setErrosModal(mapeado);
      }
      setErroModal(err instanceof Error ? err.message : 'Não foi possível cadastrar o paciente.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="container">
      <div className="stack">
        <div className="row row--entre" style={{ alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ marginBottom: 'var(--espaco-2)' }}>Pacientes</h1>
            <p style={{ margin: 0 }}>Consulte, cadastre e visualize informações do paciente.</p>
          </div>

          <button
            className="botao botao--primario"
            type="button"
            onClick={() => {
              limparForm();
              setModalAberto(true);
            }}
          >
            Novo paciente
          </button>
        </div>

        <div className="card card--padrao">
          <div className="row" style={{ alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="campo" style={{ flex: '1 1 320px' }}>
              <label className="campo__rotulo" htmlFor="nome">
                Buscar por nome
              </label>
              <input
                id="nome"
                placeholder="Digite o nome do paciente"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void carregar();
                }}
              />
            </div>

            <div className="row" style={{ justifyContent: 'flex-end', flex: '0 0 auto' }}>
              <button className="botao" type="button" onClick={() => setNome('')} disabled={carregando}>
                Limpar
              </button>
              <button className="botao botao--primario" type="button" onClick={carregar} disabled={!podeBuscar || carregando}>
                {carregando ? 'Buscando…' : 'Buscar'}
              </button>
            </div>
          </div>

          {erro && (
            <div style={{ marginTop: 'var(--espaco-4)' }}>
              <div
                role="alert"
                className="card"
                style={{
                  padding: 'var(--espaco-3)',
                  borderColor: 'rgba(178, 75, 74, 0.35)',
                  background: 'rgba(178, 75, 74, 0.06)',
                }}
              >
                <strong style={{ color: 'var(--cor-erro)' }}>Erro:</strong> {erro}
              </div>
            </div>
          )}

          <div style={{ marginTop: 'var(--espaco-4)', overflowX: 'auto' }}>
            <table className="tabela">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>E-mail</th>
                  <th>Telefone</th>
                </tr>
              </thead>
              <tbody>
                {!carregando && pacientes.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ color: 'var(--cor-texto-muted)' }}>
                      Nenhum paciente encontrado.
                    </td>
                  </tr>
                ) : (
                  pacientes.map((p) => (
                    <tr
                      key={p.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/pacientes/${p.id}`)}
                      title="Abrir detalhes"
                    >
                      <td>{p.nomeCompleto}</td>
                      <td>{p.cpf}</td>
                      <td>{p.email ?? '—'}</td>
                      <td>{p.telefone ?? '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalAberto && (
        <div className="modal-overlay" onClick={() => setModalAberto(false)} role="presentation">
          <div className="modal-dialog" role="dialog" aria-modal="true" aria-label="Cadastrar novo paciente" onClick={(e) => e.stopPropagation()}>
            <div className="row row--entre modal-dialog__header" style={{ alignItems: 'flex-end' }}>
              <div>
                <h1 style={{ marginBottom: 'var(--espaco-2)' }}>Novo paciente</h1>
                <p style={{ margin: 0 }}>Preencha os dados para cadastrar um novo paciente.</p>
              </div>
              <button className="botao" type="button" onClick={() => setModalAberto(false)}>
                Fechar
              </button>
            </div>

            <div className="card card--padrao modal-dialog__card">
              {erroModal && (
                <div
                  role="alert"
                  className="card"
                  style={{
                    padding: 'var(--espaco-3)',
                    borderColor: 'rgba(178, 75, 74, 0.35)',
                    background: 'rgba(178, 75, 74, 0.06)',
                    marginBottom: 'var(--espaco-4)',
                  }}
                >
                  <strong style={{ color: 'var(--cor-erro)' }}>Erro:</strong> {erroModal}
                </div>
              )}

              <form className="formulario" onSubmit={salvarPaciente} noValidate>
                <div className={`campo${errosModal.nomeCompleto ? ' campo--erro' : ''}`}>
                  <label className="campo__rotulo" htmlFor="modal-nomeCompleto">
                    Nome completo
                  </label>
                  <input
                    id="modal-nomeCompleto"
                    placeholder="Digite o nome completo"
                    value={form.nomeCompleto}
                    onChange={(e) => setForm((f) => ({ ...f, nomeCompleto: e.target.value }))}
                  />
                  {errosModal.nomeCompleto && <div className="campo__erro">{errosModal.nomeCompleto}</div>}
                </div>

                <div className={`campo${errosModal.cpf ? ' campo--erro' : ''}`}>
                  <label className="campo__rotulo" htmlFor="modal-cpf">
                    CPF
                  </label>
                  <input
                    id="modal-cpf"
                    inputMode="numeric"
                    placeholder="Somente números ou com pontuação"
                    value={form.cpf}
                    onChange={(e) => setForm((f) => ({ ...f, cpf: e.target.value }))}
                  />
                  {errosModal.cpf && <div className="campo__erro">{errosModal.cpf}</div>}
                </div>

                <div className={`campo${errosModal.dataNascimento ? ' campo--erro' : ''}`}>
                  <label className="campo__rotulo" htmlFor="modal-dataNascimento">
                    Data de nascimento
                  </label>
                  <input
                    id="modal-dataNascimento"
                    type="date"
                    value={form.dataNascimento}
                    onChange={(e) => setForm((f) => ({ ...f, dataNascimento: e.target.value }))}
                  />
                  {errosModal.dataNascimento && <div className="campo__erro">{errosModal.dataNascimento}</div>}
                </div>

                <div className={`campo${errosModal.email ? ' campo--erro' : ''}`}>
                  <label className="campo__rotulo" htmlFor="modal-email">
                    E-mail (opcional)
                  </label>
                  <input
                    id="modal-email"
                    type="email"
                    placeholder="email@exemplo.com.br"
                    value={String(form.email ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                  {errosModal.email && <div className="campo__erro">{errosModal.email}</div>}
                </div>

                <div className={`campo${errosModal.telefone ? ' campo--erro' : ''}`}>
                  <label className="campo__rotulo" htmlFor="modal-telefone">
                    Telefone (opcional)
                  </label>
                  <input
                    id="modal-telefone"
                    placeholder="(00) 00000-0000"
                    value={String(form.telefone ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))}
                  />
                  {errosModal.telefone && <div className="campo__erro">{errosModal.telefone}</div>}
                </div>

                <div className="row row--entre">
                  <span style={{ color: 'var(--cor-texto-muted)', fontSize: '0.9rem' }}>
                    {salvando ? 'Salvando…' : ' '}
                  </span>
                  <button className="botao botao--primario" type="submit" disabled={!podeSalvar || salvando}>
                    {salvando ? 'Cadastrando…' : 'Cadastrar paciente'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

