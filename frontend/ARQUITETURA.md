# Arquitetura do Front-end

Sistema de Gestão Hospitalar — aplicação React + TypeScript, organizada por **funcionalidades** (features) e com código em **português**.

---

## Stack

- **React 19** + **TypeScript**
- **Vite** (build e dev server)
- **React Router DOM** (rotas)
- Estilos: **CSS** com variáveis (tema aquamarine)

---

## Estrutura de pastas

```
frontend/
  public/
  src/
    app/                    # Ponto de entrada da aplicação
      App.tsx               # Rotas globais, AuthProvider, RotaProtegida
      PaginaInicial.tsx      # Dashboard / home após login

    features/               # Módulos por funcionalidade (feature-based)
      auth/                 # Autenticação
        contexto/           # AuthContext, AuthProvider
        paginas/            # PaginaLogin
        index.ts
      pacientes/            # Cadastro e listagem de pacientes
      medicos/              # Cadastro e listagem de médicos
      consultas/            # Agendamento e gestão de consultas
      exames/               # Agendamento e resultados de exames
      prescricoes/          # Emissão e listagem de prescrições
      internacoes/          # Registro de internações e altas
      (cada feature pode ter: paginas/, componentes/, hooks/, api/)

    shared/                 # Código compartilhado entre features
      api/                  # Cliente HTTP (cliente.ts)
      componentes/          # Componentes reutilizáveis (Layout, botões, etc.)
      hooks/                # Hooks genéricos
      tipos/                # Tipos TypeScript (api.ts, etc.)
      utils/                # Funções utilitárias

    styles/                 # Estilos globais e tema
      theme.css             # Variáveis CSS (paleta aquamarine)
      global.css            # Reset e base
```

---

## Convenções

- **Nomes em português**: componentes, variáveis, funções, pastas de features (ex.: `PaginaLogin`, `listaPacientes`, `features/pacientes`).
- **Features**: cada pasta em `features/` é um módulo que pode conter:
  - `paginas/` — páginas (rotas)
  - `componentes/` — componentes usados só naquela feature
  - `hooks/` — hooks da feature
  - `api.ts` ou `servicos/` — chamadas à API relacionadas
  - `index.ts` — barrel export da feature
- **Shared**: só o que é usado em mais de uma feature; o que é específico fica na feature.
- **Imports**: usar alias `@/` para `src/` (ex.: `@/features/auth`, `@/shared/api/cliente`).

---

## Tema (aquamarine)

Arquivo `src/styles/theme.css` define variáveis CSS para:

- **Primária**: tons de aquamarine (`--cor-primaria`, `--cor-primaria-clara`, `--cor-primaria-escura`).
- **Fundos**: `--cor-fundo`, `--cor-fundo-card`, `--cor-fundo-input`.
- **Texto**: `--cor-texto`, `--cor-texto-secundario`, `--cor-texto-muted`.
- **Bordas**: `--cor-borda`, `--cor-borda-focus`.
- **Estados**: `--cor-sucesso`, `--cor-aviso`, `--cor-erro`.
- **Sombras e espaçamento**: `--sombra-card`, `--espacamento-base`, `--raio-borda`.

Uso: `var(--cor-primaria)` nos componentes ou em arquivos CSS das features.

---

## Autenticação

- **AuthContext** (`features/auth/contexto/AuthContext.tsx`): guarda `token` e `usuario`, persiste em `localStorage`, expõe `definirSessao` e `sair`.
- **RotaProtegida**: redireciona para `/login` se o usuário não estiver autenticado.
- **Cliente API** (`shared/api/cliente.ts`): recebe `token` nas opções e envia no header `Authorization: Bearer <token>`.

---

## API

- Base URL: `VITE_API_URL` (`.env`) ou fallback `http://localhost:3000/api`.
- Tipos das entidades em `shared/tipos/api.ts` (Paciente, Medico, Consulta, etc.), alinhados ao backend.
- Função `requisicao<T>(caminho, opcoes)` para GET/POST/PATCH etc., com body JSON e token opcional.

---

## Próximos passos (Fase 7)

1. Implementar **PaginaLogin** (formulário, chamada `POST /auth/login`, `definirSessao`).
2. Implementar listagens e formulários por feature (pacientes, médicos, consultas, exames, prescrições, internações).
3. Reutilizar **Layout** e componentes em `shared/componentes` (botões, inputs, cards) com o tema.
4. Menu de navegação (sidebar ou topo) com links para cada módulo.
