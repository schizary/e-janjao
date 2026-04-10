import React, { useState } from 'react';
import { Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Botao, Campo, Cartao, Mensagem, Subtitulo, Tela, Titulo } from '../components/ui';
import { api } from '../services/api';

export function LoginScreen() {
  const { entrar, carregar } = useAuth();
  const [email, setEmail] = useState('admin@janjao.com.br');
  const [senha, setSenha] = useState('123456');
  const [erro, setErro] = useState('');

  async function handleLogin() {
    setErro('');
    try {
      await entrar(email, senha);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha no login.');
    }
  }

  return (
    <Tela>
      <Titulo>Sistema de Gestão Hospitalar</Titulo>
      <Subtitulo>Aplicativo móvel integrado à API real do projeto.</Subtitulo>
      <Cartao>
        <Campo label="E-mail" value={email} onChangeText={setEmail} placeholder="admin@janjao.com.br" />
        <Campo label="Senha" value={senha} onChangeText={setSenha} placeholder="123456" />
        {erro ? <Mensagem texto={erro} tipo="erro" /> : <Mensagem texto={`API: ${api.apiUrl}`} />}
        <Botao texto={carregar ? 'Entrando...' : 'Entrar'} onPress={handleLogin} />
        <Text>Credenciais padrão do seed: admin@janjao.com.br / 123456</Text>
      </Cartao>
    </Tela>
  );
}
