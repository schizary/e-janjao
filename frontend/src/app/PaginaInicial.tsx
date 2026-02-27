import { useAuth } from '@/features/auth';

export function PaginaInicial() {
  const { usuario, sair } = useAuth();

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--cor-borda)', paddingBottom: '1rem' }}>
        <h1 style={{ margin: 0, color: 'var(--cor-primaria-escura)' }}>Gestão Hospitalar</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--cor-texto-secundario)' }}>{usuario?.nomeCompleto}</span>
          <button type="button" onClick={sair} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--raio-borda)', border: '1px solid var(--cor-borda)', background: 'var(--cor-fundo-card)', color: 'var(--cor-texto)' }}>
            Sair
          </button>
        </div>
      </header>
      <section>
        <h2 style={{ color: 'var(--cor-texto-secundario)', fontWeight: 500 }}>Início</h2>
        <p>Área logada. Módulos (Pacientes, Médicos, Consultas, etc.) serão implementados na Fase 7.</p>
      </section>
    </div>
  );
}
