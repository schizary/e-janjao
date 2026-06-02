# e-janjao

Projeto completo do **Sistema de Gestão Hospitalar** com:
- **backend** em Node.js + Express + TypeScript + Prisma + MySQL
- **mobile** em Expo + React Native + TypeScript
- **CI** com GitHub Actions

## Estrutura

```text
.github/workflows/ci.yml
backend/
mobile/
```

## 1) Backend

### Pré-requisitos
- Node.js 18+
- MySQL 8+

### Configuração
Crie `backend/.env` com base em `backend/.env.example`.

Exemplo:

```env
DATABASE_URL="mysql://root:sua_senha@localhost:3306/ejanjao"
JWT_SECRET="troque_essa_chave"
JWT_EXPIRACAO="7d"
PORTA="3000"
NODE_ENV="development"
```

### Instalação
```bash
cd backend
npm install
npx prisma generate
npm run dev
```

### Usuário inicial
Após rodar o seed:
- e-mail: `admin@janjao.com.br`
- senha: `123456`

A API ficará disponível em `http://localhost:3002/api`.

## 2) Mobile

Crie `mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:3002/api
```

> No emulador Android do computador você também pode usar `http://localhost:3002/api`.

### Instalação
```bash
cd mobile
npm install
npm start
```

## Fluxo do sistema
1. O app mobile faz login em `POST /auth/login`.
2. O backend valida o usuário e devolve um token JWT.
3. O app usa esse token para listar e cadastrar pacientes, médicos, consultas, exames, prescrições e internações.

## Recursos implementados
- Login real com JWT
- CRUD completo para pacientes
- CRUD completo para médicos
- CRUD completo para consultas
- CRUD completo para exames
- CRUD completo para prescrições e itens
- CRUD completo para internações
- Seed com dados iniciais
- Workflow de CI

- o admin é admin@janjao.com.br a senha é 123456

