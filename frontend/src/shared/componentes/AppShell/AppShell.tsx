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
              <span className="app-titulo">Hospital Janjão</span>
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

          <div className="topnav__usuario">
            <span style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {usuario?.nomeCompleto}
            </span>
            <button type="button" className="botao botao--secundario" onClick={sair}>
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">{children ?? <Outlet />}</main>
    </div>
  );
}

