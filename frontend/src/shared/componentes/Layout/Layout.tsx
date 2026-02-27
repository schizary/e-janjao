import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  titulo?: string;
}

/**
 * Layout base das páginas internas (barra superior + conteúdo).
 * Pode ser estendido com menu lateral na Fase 7.
 */
export function Layout({ children, titulo }: LayoutProps) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {titulo != null && (
        <header style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--cor-borda)', background: 'var(--cor-fundo-card)' }}>
          <h1 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--cor-primaria-escura)' }}>{titulo}</h1>
        </header>
      )}
      <main style={{ flex: 1, padding: '1.5rem 2rem' }}>{children}</main>
    </div>
  );
}
