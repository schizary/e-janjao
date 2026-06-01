import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/features/auth';
import type { Medico } from '@/shared/tipos/api';
import { ErroApi } from '@/shared/api/cliente';
import { criarMedico, listarMedicos, type CriarMedicoEntrada } from '@/features/medicos/api';

function obterMensagemErro(err: unknown): string {
  if (err instanceof ErroApi) return err.message;
  if (err instanceof Error) return err.message;
  return 'Não foi possível carregar os médicos.';
}

export function PaginaMedicosLista() {
  const { token } = useAuth();

  const [especialidade, setEspecialidade] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState<CriarMedicoEntrada>({
    nomeCompleto: '',
    crm: '',
    especialidade: '',
  });
  const [salvando, setSalvando] = useState(false);
  const [erroModal, setErroModal] = useState<string | null>(null);
  const [errosModal, setErrosModal] = useState<Partial<Record<keyof CriarMedicoEntrada, string>>>({});

  const podeBuscar = useMemo(() => token != null && token !== '', [token]);
  const podeSalvar = useMemo(() => {
    return Boolean(form.nomeCompleto.trim() && form.crm.trim() && form.especialidade.trim() && token);
  }, [form, token]);

  async function carregar() {
    if (!token) return;
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarMedicos({ especialidade, token });
      setMedicos(dados);
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
      crm: '',
      especialidade: '',
    });
    setErroModal(null);
    setErrosModal({});
  }

  async function salvarMedico(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErroModal(null);
    setErrosModal({});
    if (!token) {
      setErroModal('Sessão inválida. Faça login novamente.');
      return;
    }
    setSalvando(true);
    try {
      await criarMedico({ token, entrada: form });
      setModalAberto(false);
      limparForm();
      await carregar();
    } catch (err) {
      if (err instanceof ErroApi && err.detalhes) {
        const mapeado: Partial<Record<keyof CriarMedicoEntrada, string>> = {};
        for (const d of err.detalhes) {
          const campo = d.campo as keyof CriarMedicoEntrada;
          if (campo in form) mapeado[campo] = d.mensagem;
        }
        setErrosModal(mapeado);
      }
      setErroModal(err instanceof Error ? err.message : 'Não foi possível cadastrar o médico.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="container">
      <div className="stack">
        <div className="row row--entre" style={{ alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ marginBottom: 'var(--espaco-2)' }}>Médicos</h1>
            <p style={{ margin: 0 }}>Consulte e cadastre médicos e especialidades.</p>
          </div>

          <button
            className="botao botao--primario"
            type="button"
            onClick={() => {
              limparForm();
              setModalAberto(true);
            }}
          >
            Novo médico
          </button>
        </div>

        <div className="card card--padrao">
          <div className="row" style={{ alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="campo" style={{ flex: '1 1 320px' }}>
              <label className="campo__rotulo" htmlFor="especialidade">
                Filtrar por especialidade
              </label>
              <input
                id="especialidade"
                placeholder="Ex.: Cardiologia, Ortopedia…"
                value={especialidade}
                onChange={(e) => setEspecialidade(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void carregar();
                }}
              />
            </div>

            <div className="row" style={{ justifyContent: 'flex-end', flex: '0 0 auto' }}>
              <button className="botao" type="button" onClick={() => setEspecialidade('')} disabled={carregando}>
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
                  <th>CRM</th>
                  <th>Especialidade</th>
                </tr>
              </thead>
              <tbody>
                {!carregando && medicos.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ color: 'var(--cor-texto-muted)' }}>
                      Nenhum médico encontrado.
                    </td>
                  </tr>
                ) : (
                  medicos.map((m) => (
                    <tr key={m.id}>
                      <td>{m.nomeCompleto}</td>
                      <td>{m.crm}</td>
                      <td>{m.especialidade}</td>
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
          <div className="modal-dialog" role="dialog" aria-modal="true" aria-label="Cadastrar novo médico" onClick={(e) => e.stopPropagation()}>
            <div className="row row--entre modal-dialog__header" style={{ alignItems: 'flex-end' }}>
              <div>
                <h1 style={{ marginBottom: 'var(--espaco-2)' }}>Novo médico</h1>
                <p style={{ margin: 0 }}>Preencha os dados para cadastrar um novo médico.</p>
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

              <form className="formulario" onSubmit={salvarMedico} noValidate>
                <div className={`campo${errosModal.nomeCompleto ? ' campo--erro' : ''}`}>
                  <label className="campo__rotulo" htmlFor="modal-medico-nomeCompleto">
                    Nome completo
                  </label>
                  <input
                    id="modal-medico-nomeCompleto"
                    placeholder="Digite o nome completo"
                    value={form.nomeCompleto}
                    onChange={(e) => setForm((f) => ({ ...f, nomeCompleto: e.target.value }))}
                  />
                  {errosModal.nomeCompleto && <div className="campo__erro">{errosModal.nomeCompleto}</div>}
                </div>

                <div className={`campo${errosModal.crm ? ' campo--erro' : ''}`}>
                  <label className="campo__rotulo" htmlFor="modal-medico-crm">
                    CRM
                  </label>
                  <input
                    id="modal-medico-crm"
                    placeholder="Ex.: 12345"
                    value={form.crm}
                    onChange={(e) => setForm((f) => ({ ...f, crm: e.target.value }))}
                  />
                  {errosModal.crm && <div className="campo__erro">{errosModal.crm}</div>}
                </div>

                <div className={`campo${errosModal.especialidade ? ' campo--erro' : ''}`}>
                  <label className="campo__rotulo" htmlFor="modal-medico-especialidade">
                    Especialidade
                  </label>
                  <input
                    id="modal-medico-especialidade"
                    placeholder="Ex.: Pediatria"
                    value={form.especialidade}
                    onChange={(e) => setForm((f) => ({ ...f, especialidade: e.target.value }))}
                  />
                  {errosModal.especialidade && <div className="campo__erro">{errosModal.especialidade}</div>}
                </div>

                <div className="row row--entre">
                  <span style={{ color: 'var(--cor-texto-muted)', fontSize: '0.9rem' }}>
                    {salvando ? 'Salvando…' : ' '}
                  </span>
                  <button className="botao botao--primario" type="submit" disabled={!podeSalvar || salvando}>
                    {salvando ? 'Cadastrando…' : 'Cadastrar médico'}
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

