import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth, PaginaLogin } from '@/features/auth';
import { PaginaInicial } from '@/app/PaginaInicial';

function RotaProtegida({ children }: { children: ReactNode }) {
  const { autenticado } = useAuth();
  if (!autenticado) {
    return <Navigate to="/login" replace />;
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
                <PaginaInicial />
              </RotaProtegida>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
