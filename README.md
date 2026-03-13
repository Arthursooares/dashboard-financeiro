# Dashboard Financeiro

Projeto de um ecossistema de gestão financeira pessoal.

O sistema registra transações financeiras, armazena os dados em um banco PostgreSQL (Supabase) e exibe um dashboard com análise financeira.

## Tecnologias

Backend
- Node.js
- Express
- TypeScript
- Supabase (PostgreSQL)

Frontend
- React
- Vite
- Axios

## Funcionalidades atuais

- Registro de transações financeiras
- Seed de dados para simulação
- Listagem de transações
- Resumo financeiro mensal
- Integração completa frontend ↔ backend

## Estrutura do projeto


dashboard-financeiro
│
├── server
│ ├── index.ts
│ ├── scripts
│ │ └── seed.ts
│ └── package.json
│
├── client
│ ├── src
│ │ ├── api
│ │ ├── App.tsx
│ │ └── main.tsx
│ └── package.json
│
└── README.md


## Como rodar o projeto

### Backend


cd server
npm install
npm run dev


Servidor roda em:


http://localhost:3001


### Frontend


cd client
npm install
npm run dev


Frontend roda em:


http://localhost:5173


## Próximos passos

- Dashboard visual com gráficos
- Gastos por categoria
- Histórico financeiro mensal
- Cadastro de transações pelo frontend
