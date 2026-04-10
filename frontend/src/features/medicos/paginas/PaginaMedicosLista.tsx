import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import type { Medico } from '@/shared/tipos/api';
import { ErroApi } from '@/shared/api/cliente';
import { listarMedicos } from '@/features/medicos/api';

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

  const podeBuscar = useMemo(() => token != null && token !== '', [token]);

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

  return (
    <div className="container">
      <div className="stack">
        <div className="row row--entre" style={{ alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ marginBottom: 'var(--espaco-2)' }}>Médicos</h1>
            <p style={{ margin: 0 }}>Consulte e cadastre médicos e especialidades.</p>
          </div>

          <Link className="botao botao--primario" to="/medicos/novo">
            Novo médico
          </Link>
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
    </div>
  );
}

