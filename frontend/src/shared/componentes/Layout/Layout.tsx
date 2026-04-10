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
    <div className="app-layout">
      {titulo != null && (
        <header className="app-header">
          <div className="app-header__conteudo">
            <h1 className="app-titulo">{titulo}</h1>
          </div>
        </header>
      )}
      <main className="app-main">{children}</main>
    </div>
  );
}
