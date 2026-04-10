import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export const cores = {
  primaria: '#18b7a4',
  primariaEscura: '#0f7f72',
  fundo: '#f5fbfb',
  card: '#ffffff',
  borda: '#d8ece8',
  texto: '#163330',
  secundario: '#5f7f7b',
  sucesso: '#2f9e44',
  erro: '#c92a2a',
};

export const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  container: { padding: 16, gap: 12 },
  titulo: { fontSize: 24, fontWeight: '700', color: cores.texto },
  subtitulo: { fontSize: 14, color: cores.secundario },
  card: { backgroundColor: cores.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: cores.borda, gap: 10 },
  label: { fontSize: 13, fontWeight: '600', color: cores.texto },
  input: { borderWidth: 1, borderColor: cores.borda, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: '#fff', color: cores.texto },
  button: { backgroundColor: cores.primaria, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  row: { flexDirection: 'row', gap: 8 },
  badge: { alignSelf: 'flex-start', backgroundColor: '#e7f7f4', color: cores.primariaEscura, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, overflow: 'hidden' },
});

export function Tela({ children }: { children: React.ReactNode }) {
  return <ScrollView style={estilos.tela} contentContainerStyle={estilos.container}>{children}</ScrollView>;
}

export function Cartao({ children }: { children: React.ReactNode }) {
  return <View style={estilos.card}>{children}</View>;
}

export function Titulo({ children }: { children: React.ReactNode }) {
  return <Text style={estilos.titulo}>{children}</Text>;
}

export function Subtitulo({ children }: { children: React.ReactNode }) {
  return <Text style={estilos.subtitulo}>{children}</Text>;
}

export function Campo({ label, value, onChangeText, placeholder }: { label: string; value: string; onChangeText: (text: string) => void; placeholder?: string }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={estilos.label}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} style={estilos.input} placeholderTextColor="#8ca4a0" />
    </View>
  );
}

export function Botao({ texto, onPress }: { texto: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={estilos.button}>
      <Text style={estilos.buttonText}>{texto}</Text>
    </Pressable>
  );
}

export function ItemLinha({ titulo, descricao }: { titulo: string; descricao?: string }) {
  return (
    <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: cores.borda }}>
      <Text style={{ fontSize: 15, fontWeight: '700', color: cores.texto }}>{titulo}</Text>
      {!!descricao && <Text style={{ fontSize: 13, color: cores.secundario, marginTop: 4 }}>{descricao}</Text>}
    </View>
  );
}

export function Mensagem({ texto, tipo = 'normal' }: { texto: string; tipo?: 'normal' | 'erro' | 'sucesso' }) {
  const color = tipo === 'erro' ? cores.erro : tipo === 'sucesso' ? cores.sucesso : cores.secundario;
  return <Text style={{ color, fontSize: 13 }}>{texto}</Text>;
}
