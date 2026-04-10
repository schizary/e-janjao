# 🏥 Sistema de Gestão Hospitalar

Aplicativo móvel desenvolvido para gerenciamento de pacientes, médicos e processos hospitalares, integrado a uma API REST.

---

## 🚀 Tecnologias utilizadas

### 📱 Mobile
- React Native (Expo)
- TypeScript

### ⚙️ Backend
- Node.js
- Express
- Prisma ORM

### 🗄️ Banco de Dados
- MySQL

### ☁️ Cloud
- Estruturado para Azure (execução local nesta fase)

---

## ⚙️ Configuração do ambiente

### 🔐 Variáveis de ambiente

#### 📱 Mobile (`.env`)

Utilize apenas **uma URL ativa por vez**, comentando a outra:

```env
# 📱 Para celular físico (mesma rede)
# EXPO_PUBLIC_API_URL=http://seu_ip_rede:3002/api

# 💻 Para testes locais (navegador ou localhost)
EXPO_PUBLIC_API_URL=http://localhost:3002/api