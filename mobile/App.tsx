import React, { useMemo, useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen, Aba } from './src/screens/HomeScreen';
import { ConsultasScreen, ExamesScreen, InternacoesScreen, MedicosScreen, PacientesScreen, PrescricoesScreen } from './src/screens/ResourceScreens';
import { cores } from './src/components/ui';

function NavegacaoInterna() {
  const { usuario } = useAuth();
  const [abaAtual, setAbaAtual] = useState<Aba>('inicio');

  const tela = useMemo(() => {
    switch (abaAtual) {
      case 'pacientes':
        return <PacientesScreen titulo="Pacientes" voltar={() => setAbaAtual('inicio')} />;
      case 'medicos':
        return <MedicosScreen titulo="Médicos" voltar={() => setAbaAtual('inicio')} />;
      case 'consultas':
        return <ConsultasScreen titulo="Consultas" voltar={() => setAbaAtual('inicio')} />;
      case 'exames':
        return <ExamesScreen titulo="Exames" voltar={() => setAbaAtual('inicio')} />;
      case 'prescricoes':
        return <PrescricoesScreen titulo="Prescrições" voltar={() => setAbaAtual('inicio')} />;
      case 'internacoes':
        return <InternacoesScreen titulo="Internações" voltar={() => setAbaAtual('inicio')} />;
      default:
        return <HomeScreen abrirAba={setAbaAtual} />;
    }
  }, [abaAtual]);

  if (!usuario) {
    return <LoginScreen />;
  }

  return tela;
}

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: cores.fundo }}>
        <StatusBar barStyle="dark-content" backgroundColor={cores.fundo} />
        <NavegacaoInterna />
      </SafeAreaView>
    </AuthProvider>
  );
}
