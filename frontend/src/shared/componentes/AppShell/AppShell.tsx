import type { ReactNode } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth';

function linkClass({ isActive }: { isActive: boolean }): string {
  return `topnav__link${isActive ? ' topnav__link--ativo' : ''}`;
}

export function AppShell({ children }: { children?: ReactNode }) {
  const { usuario, sair } = useAuth();

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="app-header__conteudo">
          <div className="topnav">
            <div className="topnav__marca">
              <span className="app-titulo">
                Hospital <span className="app-titulo__destaque">Janjão</span>
              </span>
              <small>Gestão Hospitalar</small>
            </div>

            <nav className="topnav__links" aria-label="Navegação principal">
              <NavLink to="/" end className={linkClass}>
                Início
              </NavLink>
              <NavLink to="/pacientes" className={linkClass}>
                Pacientes
              </NavLink>
              <NavLink to="/medicos" className={linkClass}>
                Médicos
              </NavLink>
              <NavLink to="/consultas" className={linkClass}>
                Consultas
              </NavLink>
            </nav>
          </div>

          <form
            className="topnav__busca"
            role="search"
            aria-label="Busca"
            onSubmit={(e) => e.preventDefault()}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none">
              <path
                d="M10.5 18.5C14.366 18.5 17.5 15.366 17.5 11.5C17.5 7.63401 14.366 4.5 10.5 4.5C6.63401 4.5 3.5 7.63401 3.5 11.5C3.5 15.366 6.63401 18.5 10.5 18.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.5 16.5L21 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input placeholder="Faça sua busca aqui" aria-label="Pesquisar" />
          </form>

          <div className="topnav__usuario">
            <span style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {usuario?.nomeCompleto}
            </span>
            <button type="button" className="botao botao--primario topnav__botao-login" onClick={sair}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="18" height="18">
                <path
                  d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                  fill="currentColor"
                />
                <path
                  d="M4 20C4.5 16.5 7.5 14 12 14C16.5 14 19.5 16.5 20 20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">{children ?? <Outlet />}</main>
    </div>
  );
}

