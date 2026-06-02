import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';
import {
  mascaraCpf,
  mascaraCrm,
  mascaraData,
  mascaraDataHora,
  mascaraNumero,
  mascaraTelefone,
} from '../utils/mascaras';

export type TipoCampo = 'texto' | 'cpf' | 'telefone' | 'data' | 'dataHora' | 'numero' | 'crm';

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
  buttonOutline: { backgroundColor: '#fff', paddingVertical: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: cores.borda },
  buttonOutlineText: { color: cores.texto, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 28, 23, 0.45)',
    justifyContent: 'center',
    padding: 16,
  },
  modalDialog: {
    backgroundColor: '#f4f8f6',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: cores.borda,
    maxHeight: '88%',
    overflow: 'hidden',
    shadowColor: '#0d1c17',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  modalTitulo: { fontSize: 20, fontWeight: '700', color: cores.texto, flex: 1 },
  modalConteudo: { paddingHorizontal: 16, paddingBottom: 16, gap: 10 },
  badge: { alignSelf: 'flex-start', backgroundColor: '#e7f7f4', color: cores.primariaEscura, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, overflow: 'hidden' },
});

export function Tela({ children }: { children: React.ReactNode }) {
  return <ScrollView style={estilos.tela} contentContainerStyle={estilos.container} keyboardShouldPersistTaps="handled">{children}</ScrollView>;
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

function aplicarMascara(texto: string, tipo: TipoCampo): string {
  switch (tipo) {
    case 'cpf':
      return mascaraCpf(texto);
    case 'telefone':
      return mascaraTelefone(texto);
    case 'data':
      return mascaraData(texto);
    case 'dataHora':
      return mascaraDataHora(texto);
    case 'numero':
      return mascaraNumero(texto);
    case 'crm':
      return mascaraCrm(texto);
    default:
      return texto;
  }
}

function tecladoPadrao(tipo: TipoCampo): KeyboardTypeOptions {
  switch (tipo) {
    case 'cpf':
    case 'telefone':
    case 'data':
    case 'dataHora':
    case 'numero':
      return 'number-pad';
    default:
      return 'default';
  }
}

export function Campo({
  label,
  value,
  onChangeText,
  placeholder,
  tipo = 'texto',
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  tipo?: TipoCampo;
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={estilos.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={(texto) => onChangeText(aplicarMascara(texto, tipo))}
        placeholder={placeholder}
        style={estilos.input}
        placeholderTextColor="#8ca4a0"
        keyboardType={tecladoPadrao(tipo)}
        autoCapitalize={tipo === 'crm' ? 'characters' : 'none'}
      />
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

export function BotaoOutline({ texto, onPress }: { texto: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={estilos.buttonOutline}>
      <Text style={estilos.buttonOutlineText}>{texto}</Text>
    </Pressable>
  );
}

export function ModalFlutuante({
  visible,
  titulo,
  onFechar,
  children,
}: {
  visible: boolean;
  titulo: string;
  onFechar: () => void;
  children: React.ReactNode;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onFechar}>
      <KeyboardAvoidingView
        style={estilos.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onFechar} accessibilityLabel="Fechar modal" />
        <View style={estilos.modalDialog}>
          <View style={estilos.modalHeader}>
            <Text style={estilos.modalTitulo}>{titulo}</Text>
            <Pressable onPress={onFechar} hitSlop={8}>
              <Text style={{ color: cores.primariaEscura, fontWeight: '700' }}>Fechar</Text>
            </Pressable>
          </View>
          <ScrollView
            contentContainerStyle={estilos.modalConteudo}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
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
