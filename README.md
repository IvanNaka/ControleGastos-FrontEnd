# Controle de Gastos - Frontend

Sistema web para gerenciamento de receitas e despesas pessoais com autenticação Azure AD.
Back End Hospedado em: controlegastosapi-chapc5fgg5g6acah.brazilsouth-01.azurewebsites.net
Front End Hospedado em: https://main.d2zasgf9hme6sh.amplifyapp.com/

## Sobre o Projeto

O **Controle de Gastos** é uma aplicação web moderna desenvolvida em React + TypeScript que permite aos usuários gerenciar suas finanças pessoais de forma simples e eficiente. O sistema oferece funcionalidades completas de CRUD para pessoas, categorias e transações, além de relatórios detalhados com filtros personalizados.

### Principais Funcionalidades

- **Autenticação Azure AD** - Login seguro via Microsoft Identity Platform
- **Gestão de Pessoas** - Cadastre e gerencie pessoas com informações de nome, CPF e data de nascimento
- **Categorias Personalizadas** - Crie categorias para receitas e despesas
- **Registro de Transações** - Registre receitas e despesas com categorização
- **Relatórios Filtráveis** - Visualize transações com filtros por pessoa e categoria
- **Rotas Protegidas** - Acesso controlado às funcionalidades principais
- **Bearer Token Automático** - Interceptor HTTP que adiciona token JWT automaticamente

## Arquitetura

### Stack Tecnológico

- **React 19.2.0** - Biblioteca JavaScript para construção de interfaces
- **TypeScript 5.7.3** - Superset JavaScript com tipagem estática
- **Vite 6.0.3** - Build tool moderna e rápida
- **React Router DOM 7.11.0** - Roteamento client-side
- **React Bootstrap 2.10.10** - Componentes UI responsivos
- **Axios 1.7.9** - Cliente HTTP para requisições à API
- **Azure MSAL** - Microsoft Authentication Library para Azure AD
- **React Toastify 11.0.2** - Notificações toast elegantes

### Estrutura do Projeto

```
controle-gastos-front/
├── src/
│   ├── assets/          # Recursos estáticos (imagens, ícones)
│   ├── components/      # Componentes React
│   │   ├── CadastroCategoria/    # Cadastro de categorias
│   │   ├── CadastroPessoa/       # Cadastro de pessoas
│   │   ├── CadastroTransacao/    # Cadastro de transações
│   │   ├── RelatorioTransacoes/  # Relatório com filtros
│   │   └── ProtectedRoute.tsx    # HOC para proteção de rotas
│   ├── config/          # Configurações da aplicação
│   │   └── authConfig.ts         # Configuração Azure AD
│   ├── pages/           # Páginas da aplicação
│   │   ├── LandingPage.tsx       # Página de login
│   │   └── HomePage.tsx          # Página principal
│   ├── services/        # Serviços e integrações
│   │   ├── api.tsx               # Configuração Axios + Interceptors
│   │   ├── CategoriasService.tsx
│   │   ├── PessoasService.tsx
│   │   └── TransacoesService.tsx
│   ├── types/           # Definições TypeScript
│   │   ├── Categoria.tsx
│   │   ├── Pessoa.tsx
│   │   └── Transacao.tsx
│   ├── utils/           # Utilitários
│   │   └── cookies.ts            # Funções para gerenciar cookies
│   ├── App.tsx          # Componente raiz
│   ├── App.css          # Estilos globais
│   └── main.tsx         # Entry point
├── public/              # Arquivos públicos
├── .env                 # Variáveis de ambiente (não commitado)
├── vite.config.ts       # Configuração Vite
├── tsconfig.json        # Configuração TypeScript
└── package.json         # Dependências e scripts
```

## Autenticação e Autorização

### Azure AD Integration

O sistema utiliza o **Microsoft Authentication Library (MSAL)** para integração com Azure AD:

1. **Login Popup** - Usuário faz login via popup do Microsoft
2. **Token JWT** - Sistema obtém access token
3. **Registro de Usuário** - POST para `/Usuarios` com dados do Azure AD
4. **Bearer Token Automático** - Interceptor Axios adiciona token em todas as requisições

### Interceptor HTTP

O arquivo `services/api.tsx` contém interceptors que:

**Request Interceptor:**
- Obtém o access token do Azure AD silenciosamente
- Adiciona `Authorization: Bearer {token}` em todas as requisições
- Permite que a API backend valide a autenticação

**Response Interceptor:**
- Trata erros 401 (não autorizado)
- Pode redirecionar para login quando token expira

### Rotas Protegidas

O componente `ProtectedRoute` verifica:
- Conta Azure AD ativa (`useMsal`)
- Cookie `usuarioId` válido
- Redireciona para `/` se não autenticado

## Componentes Principais

### LandingPage
Página inicial com botão de login Azure AD. Após autenticação bem-sucedida, registra o usuário na API e redireciona para `/home`.

### HomePage
Página principal com navegação por tabs:
- Cadastro de Pessoas
- Cadastro de Categorias
- Cadastro de Transações
- Relatório de Transações

### CadastroPessoa
Formulário para cadastrar pessoas com validações:
- Nome (obrigatório)
- CPF (formato brasileiro)
- Data de Nascimento

### CadastroCategoria
Formulário para categorias com:
- Nome da categoria
- Finalidade (Receita ou Despesa)

### CadastroTransacao
Formulário complexo com:
- Seleção de pessoa
- Tipo de transação (Receita/Despesa)
- Categoria (filtrada por tipo)
- Descrição
- Valor
- Validação: menores de 18 anos não podem cadastrar receitas

### RelatorioTransacoes
Tabela de transações com:
- Filtros por pessoa e categoria
- Colunas: Pessoa, Categoria, Tipo, Descrição, Valor, Data
- Botão de exclusão por transação

## Serviços

### CategoriasService
- `getCategorias()` - Lista todas as categorias
- `createCategoria(categoria)` - Cria nova categoria

### PessoasService
- `getPessoas()` - Lista todas as pessoas
- `createPessoa(pessoa)` - Cria nova pessoa

### TransacoesService
- `getTransacoes()` - Lista todas as transações
- `createTransacao(transacao)` - Cria nova transação
- `deleteTransacao(id)` - Remove transação


## Estilização

- **Bootstrap 5** via React Bootstrap para componentes UI
- **CSS customizado** em `App.css` para temas escuros e personalizações
- **Responsivo** - Layout adaptável para diferentes dispositivos

## Integração com Backend

### Base URL
Por padrão: `https://localhost:7086/api`

### Endpoints Esperados

```
POST   /Usuarios              # Registro de usuário após login Azure AD
GET    /Pessoas               # Lista pessoas do usuário
POST   /Pessoas               # Cria pessoa
DELETE /Pessoas/{id}          # Remove pessoa
GET    /Categorias            # Lista categorias do usuário
POST   /Categorias            # Cria categoria
DELETE /Categorias/{id}       # Remove categoria
GET    /Transacoes            # Lista transações do usuário
POST   /Transacoes            # Cria transação
DELETE /Transacoes/{id}       # Remove transação
```

### Headers
Todas as requisições incluem automaticamente:
```
Authorization: Bearer {access_token}
```
