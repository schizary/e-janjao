import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { ErroApi } from '@/shared/api/cliente';
import { criarPaciente, type CriarPacienteEntrada } from '@/features/pacientes/api';

type ErrosCampos = Partial<Record<keyof CriarPacienteEntrada, string>>;

function normalizarOpcional(valor: string): string | null | undefined {
  const v = valor.trim();
  return v === '' ? null : v;
}

function obterMensagemErro(err: unknown): string {
  if (err instanceof ErroApi) return err.message;
  if (err instanceof Error) return err.message;
  return 'Não foi possível cadastrar o paciente.';
}

export function PaginaPacienteNovo() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<CriarPacienteEntrada>({
    nomeCompleto: '',
    cpf: '',
    email: null,
    dataNascimento: '',
    telefone: null,
  });
  const [carregando, setCarregando] = useState(false);
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [erros, setErros] = useState<ErrosCampos>({});

  const podeSalvar = useMemo(() => {
    return Boolean(form.nomeCompleto.trim() && form.cpf.trim() && form.dataNascimento && token);
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
      const criado = await criarPaciente({
        token,
        entrada: {
          nomeCompleto: form.nomeCompleto,
          cpf: form.cpf,
          email: normalizarOpcional(String(form.email ?? '')) as string | null,
          dataNascimento: form.dataNascimento,
          telefone: normalizarOpcional(String(form.telefone ?? '')) as string | null,
        },
      });
      navigate(`/pacientes/${criado.id}`, { replace: true });
    } catch (err) {
      if (err instanceof ErroApi && err.detalhes) {
        const mapeado: ErrosCampos = {};
        for (const d of err.detalhes) {
          const campo = d.campo as keyof CriarPacienteEntrada;
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
            <h1 style={{ marginBottom: 'var(--espaco-2)' }}>Novo paciente</h1>
            <p style={{ margin: 0 }}>Preencha os dados para cadastrar um novo paciente.</p>
          </div>
          <Link className="botao" to="/pacientes">
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

            <div className={`campo${erros.cpf ? ' campo--erro' : ''}`}>
              <label className="campo__rotulo" htmlFor="cpf">
                CPF
              </label>
              <input
                id="cpf"
                inputMode="numeric"
                placeholder="Somente números ou com pontuação"
                value={form.cpf}
                onChange={(e) => setForm((f) => ({ ...f, cpf: e.target.value }))}
              />
              {erros.cpf && <div className="campo__erro">{erros.cpf}</div>}
            </div>

            <div className={`campo${erros.dataNascimento ? ' campo--erro' : ''}`}>
              <label className="campo__rotulo" htmlFor="dataNascimento">
                Data de nascimento
              </label>
              <input
                id="dataNascimento"
                type="date"
                value={form.dataNascimento}
                onChange={(e) => setForm((f) => ({ ...f, dataNascimento: e.target.value }))}
              />
              {erros.dataNascimento && <div className="campo__erro">{erros.dataNascimento}</div>}
            </div>

            <div className={`campo${erros.email ? ' campo--erro' : ''}`}>
              <label className="campo__rotulo" htmlFor="email">
                E-mail (opcional)
              </label>
              <input
                id="email"
                type="email"
                placeholder="email@exemplo.com.br"
                value={String(form.email ?? '')}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
              {erros.email && <div className="campo__erro">{erros.email}</div>}
            </div>

            <div className={`campo${erros.telefone ? ' campo--erro' : ''}`}>
              <label className="campo__rotulo" htmlFor="telefone">
                Telefone (opcional)
              </label>
              <input
                id="telefone"
                placeholder="(00) 00000-0000"
                value={String(form.telefone ?? '')}
                onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))}
              />
              {erros.telefone && <div className="campo__erro">{erros.telefone}</div>}
            </div>

            <div className="row row--entre">
              <span style={{ color: 'var(--cor-texto-muted)', fontSize: '0.9rem' }}>
                {carregando ? 'Salvando…' : ' '}
              </span>
              <button className="botao botao--primario" type="submit" disabled={!podeSalvar || carregando}>
                {carregando ? 'Cadastrando…' : 'Cadastrar paciente'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

