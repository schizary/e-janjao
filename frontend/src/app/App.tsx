import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth, PaginaLogin } from '@/features/auth';
import { PaginaInicial } from '@/app/PaginaInicial';
import { AppShell } from '@/shared/componentes/AppShell';
import { PaginaPacientesLista } from '@/features/pacientes/paginas/PaginaPacientesLista';
import { PaginaPacienteNovo } from '@/features/pacientes/paginas/PaginaPacienteNovo';
import { PaginaPacienteDetalhes } from '@/features/pacientes/paginas/PaginaPacienteDetalhes';
import { PaginaMedicosLista } from '@/features/medicos/paginas/PaginaMedicosLista';
import { PaginaMedicoNovo } from '@/features/medicos/paginas/PaginaMedicoNovo';
import { PaginaConsultas } from '@/features/consultas/paginas/PaginaConsultas';
import { PaginaExames } from '@/features/exames/paginas/PaginaExames';
import { PaginaPrescricoes } from '@/features/prescricoes/paginas/PaginaPrescricoes';
import { PaginaInternacoes } from '@/features/internacoes/paginas/PaginaInternacoes';

function RotaProtegida({ children }: { children: ReactNode }) {
  const { autenticado } = useAuth();
  const location = useLocation();
  if (!autenticado) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PaginaLogin />} />
          <Route
            path="/"
            element={
              <RotaProtegida>
                <AppShell />
              </RotaProtegida>
            }
          >
            <Route index element={<PaginaInicial />} />
            <Route path="pacientes" element={<PaginaPacientesLista />} />
            <Route path="pacientes/novo" element={<PaginaPacienteNovo />} />
            <Route path="pacientes/:id" element={<PaginaPacienteDetalhes />} />
            <Route path="medicos" element={<PaginaMedicosLista />} />
            <Route path="medicos/novo" element={<PaginaMedicoNovo />} />
            <Route path="consultas" element={<PaginaConsultas />} />
            <Route path="exames" element={<PaginaExames />} />
            <Route path="prescricoes" element={<PaginaPrescricoes />} />
            <Route path="internacoes" element={<PaginaInternacoes />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
