export function PaginaInicial() {
  return (
    <div className="container">
      <div className="stack">
        <div>
          <h1 style={{ marginBottom: 'var(--espaco-2)' }}>Painel</h1>
          <p style={{ margin: 0 }}>
            Bem-vindo(a) ao sistema do Hospital Janjão. Selecione um módulo para começar.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--espaco-4)',
          }}
        >
          <a className="card card--padrao card--hover" href="/pacientes" style={{ display: 'block' }}>
            <h2 style={{ marginBottom: 'var(--espaco-2)', fontSize: '1.1rem' }}>Pacientes</h2>
            <p style={{ margin: 0 }}>
              Cadastro, busca e detalhes de pacientes.
            </p>
          </a>
          <a className="card card--padrao card--hover" href="/medicos" style={{ display: 'block' }}>
            <h2 style={{ marginBottom: 'var(--espaco-2)', fontSize: '1.1rem' }}>Médicos</h2>
            <p style={{ margin: 0 }}>
              Lista de médicos, especialidades e cadastro.
            </p>
          </a>
          <a className="card card--padrao card--hover" href="/consultas" style={{ display: 'block' }}>
            <h2 style={{ marginBottom: 'var(--espaco-2)', fontSize: '1.1rem' }}>Consultas</h2>
            <p style={{ margin: 0 }}>
              Agendamento e acompanhamento por paciente.
            </p>
          </a>
          <a className="card card--padrao card--hover" href="/exames" style={{ display: 'block' }}>
            <h2 style={{ marginBottom: 'var(--espaco-2)', fontSize: '1.1rem' }}>Exames</h2>
            <p style={{ margin: 0 }}>
              Agendamento, pendências e registro de resultados.
            </p>
          </a>
          <a className="card card--padrao card--hover" href="/prescricoes" style={{ display: 'block' }}>
            <h2 style={{ marginBottom: 'var(--espaco-2)', fontSize: '1.1rem' }}>Prescrições</h2>
            <p style={{ margin: 0 }}>
              Emissão de receitas e histórico por paciente.
            </p>
          </a>
          <a className="card card--padrao card--hover" href="/internacoes" style={{ display: 'block' }}>
            <h2 style={{ marginBottom: 'var(--espaco-2)', fontSize: '1.1rem' }}>Internações</h2>
            <p style={{ margin: 0 }}>
              Registro de internação, altas e status do paciente.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
