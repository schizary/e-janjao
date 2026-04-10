# e-janjao

Sistema de gestão hospitalar — API (backend) e interface (frontend).

## Pré-requisitos
- **Node.js**: versão 18 ou superior
- **MySQL**: instância disponível (conforme `prisma/schema.prisma`)

## Variáveis de ambiente (exemplo para o backend)
Crie um arquivo `.env` na pasta `backend` com as variáveis mínimas:

```text
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"
JWT_SECRET="sua_chave_jwt_aqui"
PORTA=3000
NODE_ENV=development
```

## Backend (API)

- Instalar dependências:
```powershell
cd backend
npm install
```

- Gerar Prisma e aplicar migrações:
```powershell
npm run prisma:generate
npm run prisma:migrate
```

- Rodar em modo desenvolvimento (hot-reload):
```powershell
npm run dev
```

- Build e start para produção:
```powershell
npm run build
npm start
```

- Linter:
```powershell
npm run lint
```

## Frontend (UI)

- Instalar dependências e rodar em dev:
```powershell
cd frontend
npm install
npm run dev
```

- Build e preview:
```powershell
npm run build
npm run preview
```

## Executando ambos localmente
- Abra dois terminais: um para o backend (`backend`) e outro para o frontend (`frontend`).
- No backend, garanta que `DATABASE_URL` aponta para um MySQL acessível e que as migrações foram aplicadas.

Se preferir um único comando para rodar ambos em desenvolvimento, pode-se adicionar um `package.json` na raiz com `concurrently`.

## Observações / Troubleshooting
- Se receber erro do Prisma, execute `npm run prisma:generate` novamente.
- Verifique permissões do usuário do banco e se o `DATABASE_URL` está correto.
- Variáveis obrigatórias do backend estão em `backend/src/config/ambiente.ts`.

## Criar usuário manualmente (para conseguir logar)

O login do sistema usa a tabela **`usuarios`** (model `Usuario` do Prisma com `@@map("usuarios")`) e armazena a senha como **hash bcrypt** no campo `senhaHash`.

### 1) Gerar o `senhaHash` (bcrypt)

No terminal, dentro da pasta `backend`:

```powershell
cd backend
node -e "const bcrypt=require('bcrypt'); bcrypt.hash('123456', 10).then(h=>console.log(h))"
```

Copie o hash gerado (começa com `$2b$...`).

### 2) Inserir o usuário no MySQL

No seu cliente MySQL (Workbench/DBeaver/CLI), execute (troque `HASH_AQUI` pelo hash gerado):

```sql
INSERT INTO usuarios (id, nomeCompleto, email, senhaHash, perfil, ativo, criadoEm, atualizadoEm)
VALUES (UUID(), 'Administrador Janjão', 'admin@janjao.com.br', 'HASH_AQUI', 'ADMINISTRADOR', 1, NOW(), NOW());
```

### 3) Logar no frontend

- **E-mail**: `admin@janjao.com.br`
- **Senha**: `123456`
