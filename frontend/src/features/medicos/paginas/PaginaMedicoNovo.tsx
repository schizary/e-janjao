import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { ErroApi } from '@/shared/api/cliente';
import { criarMedico, type CriarMedicoEntrada } from '@/features/medicos/api';

type ErrosCampos = Partial<Record<keyof CriarMedicoEntrada, string>>;

function obterMensagemErro(err: unknown): string {
  if (err instanceof ErroApi) return err.message;
  if (err instanceof Error) return err.message;
  return 'Não foi possível cadastrar o médico.';
}

export function PaginaMedicoNovo() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<CriarMedicoEntrada>({
    nomeCompleto: '',
    crm: '',
    especialidade: '',
  });
  const [carregando, setCarregando] = useState(false);
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [erros, setErros] = useState<ErrosCampos>({});

  const podeSalvar = useMemo(() => {
    return Boolean(form.nomeCompleto.trim() && form.crm.trim() && form.especialidade.trim() && token);
  }, [form, token]);

  async function aoSalvar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErroGeral(null);
    setErros({});

    if (!token) {
      setErroGeral('Sessão inválida. Faça login novamente.');
      return;
    }

    setCarregando(true);
    try {
      await criarMedico({ token, entrada: form });
      navigate('/medicos', { replace: true });
    } catch (err) {
      if (err instanceof ErroApi && err.detalhes) {
        const mapeado: ErrosCampos = {};
        for (const d of err.detalhes) {
          const campo = d.campo as keyof CriarMedicoEntrada;
          if (campo in form) mapeado[campo] = d.mensagem;
        }
        setErros(mapeado);
      }
      setErroGeral(obterMensagemErro(err));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="container container--estreito cadastro-modal-bg">
      <div className="cadastro-modal">
        <div className="row row--entre cadastro-modal__header" style={{ alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ marginBottom: 'var(--espaco-2)' }}>Novo médico</h1>
            <p style={{ margin: 0 }}>Preencha os dados para cadastrar um novo médico.</p>
          </div>
          <Link className="botao" to="/medicos">
            Voltar
          </Link>
        </div>

        <div className="card card--padrao cadastro-modal__card">
          {erroGeral && (
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
              <strong style={{ color: 'var(--cor-erro)' }}>Erro:</strong> {erroGeral}
            </div>
          )}

          <form className="formulario" onSubmit={aoSalvar} noValidate>
            <div className={`campo${erros.nomeCompleto ? ' campo--erro' : ''}`}>
              <label className="campo__rotulo" htmlFor="nomeCompleto">
                Nome completo
              </label>
              <input
                id="nomeCompleto"
                placeholder="Digite o nome completo"
                value={form.nomeCompleto}
                onChange={(e) => setForm((f) => ({ ...f, nomeCompleto: e.target.value }))}
              />
              {erros.nomeCompleto && <div className="campo__erro">{erros.nomeCompleto}</div>}
            </div>

            <div className={`campo${erros.crm ? ' campo--erro' : ''}`}>
              <label className="campo__rotulo" htmlFor="crm">
                CRM
              </label>
              <input
                id="crm"
                placeholder="Ex.: 12345"
                value={form.crm}
                onChange={(e) => setForm((f) => ({ ...f, crm: e.target.value }))}
              />
              {erros.crm && <div className="campo__erro">{erros.crm}</div>}
            </div>

            <div className={`campo${erros.especialidade ? ' campo--erro' : ''}`}>
              <label className="campo__rotulo" htmlFor="especialidade">
                Especialidade
              </label>
              <input
                id="especialidade"
                placeholder="Ex.: Pediatria"
                value={form.especialidade}
                onChange={(e) => setForm((f) => ({ ...f, especialidade: e.target.value }))}
              />
              {erros.especialidade && <div className="campo__erro">{erros.especialidade}</div>}
            </div>

            <div className="row row--entre">
              <span style={{ color: 'var(--cor-texto-muted)', fontSize: '0.9rem' }}>
                {carregando ? 'Salvando…' : ' '}
              </span>
              <button className="botao botao--primario" type="submit" disabled={!podeSalvar || carregando}>
                {carregando ? 'Cadastrando…' : 'Cadastrar médico'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

