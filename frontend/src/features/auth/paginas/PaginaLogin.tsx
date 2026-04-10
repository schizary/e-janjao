import { useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { requisicao, ErroApi } from '@/shared/api/cliente';
import type { RespostaLogin } from '@/shared/tipos/api';
import { useAuth } from '@/features/auth';

type LoginForm = {
  email: string;
  senha: string;
};

function obterMensagemErro(err: unknown): string {
  if (err instanceof ErroApi) return err.message;
  if (err instanceof Error) return err.message;
  return 'Não foi possível realizar o login. Tente novamente.';
}

export function PaginaLogin() {
  const { autenticado, definirSessao } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState<LoginForm>({ email: '', senha: '' });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const destinoAposLogin = useMemo(() => {
    const state = location.state as { from?: { pathname?: string } } | null;
    return state?.from?.pathname ?? '/';
  }, [location.state]);

  if (autenticado) {
    return <Navigate to={destinoAposLogin} replace />;
  }

  async function aoEnviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);

    const email = form.email.trim();
    const senha = form.senha;

    if (!email || !senha) {
      setErro('Informe seu e-mail e sua senha.');
      return;
    }

    setCarregando(true);
    try {
      const resposta = await requisicao<RespostaLogin>('/auth/login', {
        metodo: 'POST',
        body: { email, senha },
      });
      definirSessao(resposta.tokenAcesso, resposta.usuario);
      navigate(destinoAposLogin, { replace: true });
    } catch (err) {
      setErro(obterMensagemErro(err));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="container container--estreito">
      <div className="card card--padrao">
        <div className="stack" style={{ gap: 'var(--espaco-3)' }}>
          <div>
            <h1 style={{ marginBottom: 'var(--espaco-2)' }}>Acesso ao Sistema</h1>
            <p style={{ margin: 0 }}>
              Hospital Janjão • Gestão Hospitalar
            </p>
          </div>

          {erro && (
            <div
              role="alert"
              className="card"
              style={{
                padding: 'var(--espaco-3)',
                borderColor: 'rgba(178, 75, 74, 0.35)',
                background: 'rgba(178, 75, 74, 0.06)',
                color: 'var(--cor-texto)',
              }}
            >
              <strong style={{ color: 'var(--cor-erro)' }}>Erro:</strong> {erro}
            </div>
          )}

          <form className="formulario" onSubmit={aoEnviar} noValidate>
            <div className="campo">
              <label className="campo__rotulo" htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="seu.email@janjao.com.br"
                value={form.email}
                onChange={(ev) => setForm((f) => ({ ...f, email: ev.target.value }))}
              />
            </div>

            <div className="campo">
              <label className="campo__rotulo" htmlFor="senha">
                Senha
              </label>
              <input
                id="senha"
                name="senha"
                type="password"
                autoComplete="current-password"
                placeholder="Digite sua senha"
                value={form.senha}
                onChange={(ev) => setForm((f) => ({ ...f, senha: ev.target.value }))}
              />
              <div className="campo__ajuda">Sua senha é a mesma cadastrada no sistema do hospital.</div>
            </div>

            <div className="row row--entre" style={{ marginTop: 'var(--espaco-2)' }}>
              <span style={{ color: 'var(--cor-texto-muted)', fontSize: '0.9rem' }}>
                {carregando ? 'Autenticando…' : ' '}
              </span>
              <button
                className="botao botao--primario"
                type="submit"
                disabled={carregando}
              >
                {carregando ? 'Entrando…' : 'Entrar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
