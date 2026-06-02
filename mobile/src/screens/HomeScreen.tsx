import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Cartao, Subtitulo, Tela, Titulo, cores } from '../components/ui';

export type Aba = 'inicio' | 'pacientes' | 'medicos' | 'consultas' | 'exames' | 'prescricoes' | 'internacoes';

export function HomeScreen({ abrirAba }: { abrirAba: (aba: Aba) => void }) {
  const { usuario, sair } = useAuth();

  const botoes: Array<{ chave: Aba; titulo: string }> = [
    { chave: 'pacientes', titulo: 'Pacientes' },
    { chave: 'medicos', titulo: 'Médicos' },
    { chave: 'consultas', titulo: 'Consultas' },
    { chave: 'exames', titulo: 'Exames' },
    { chave: 'prescricoes', titulo: 'Prescrições' },
    { chave: 'internacoes', titulo: 'Internações' },
  ];

  return (
    <Tela>
      <Titulo>Olá, {usuario?.nomeCompleto}</Titulo>
      <Subtitulo>Perfil: {usuario?.perfil}</Subtitulo>
      <Subtitulo>Selecione um módulo para começar.</Subtitulo>
      <Cartao>
        <Text style={{ color: cores.texto, fontWeight: '700', fontSize: 16 }}>Módulos</Text>
        <View style={{ gap: 10, marginTop: 6 }}>
          {botoes.map((botao) => (
            <Pressable
              key={botao.chave}
              onPress={() => abrirAba(botao.chave)}
              style={{ backgroundColor: '#ffffff', borderWidth: 1, borderColor: cores.borda, padding: 14, borderRadius: 12 }}
            >
              <Text style={{ color: cores.texto, fontWeight: '600' }}>{botao.titulo}</Text>
            </Pressable>
          ))}
        </View>
      </Cartao>
      <Pressable onPress={sair} style={{ alignItems: 'center', padding: 12 }}>
        <Text style={{ color: cores.primariaEscura, fontWeight: '700' }}>Sair</Text>
      </Pressable>
    </Tela>
  );
}
