import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import type { Paciente } from '@/shared/tipos/api';
import { ErroApi } from '@/shared/api/cliente';
import { listarPacientes } from '@/features/pacientes/api';

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

  const podeBuscar = useMemo(() => token != null && token !== '', [token]);

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

  return (
    <div className="container">
      <div className="stack">
        <div className="row row--entre" style={{ alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ marginBottom: 'var(--espaco-2)' }}>Pacientes</h1>
            <p style={{ margin: 0 }}>Consulte, cadastre e visualize informações do paciente.</p>
          </div>

          <Link className="botao botao--primario" to="/pacientes/novo">
            Novo paciente
          </Link>
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
    </div>
  );
}

