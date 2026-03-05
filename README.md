# Dashboard Financeiro (Backend)

API de gestão financeira pessoal com Node.js + TypeScript + Express e Supabase (PostgreSQL).
O objetivo é registrar transações (income/expense), normalizar dados (currency, exchange_rate, amount_brl) e servir endpoints analíticos para um dashboard.

## Stack
- Node.js + TypeScript
- Express
- Supabase (PostgreSQL via PostgREST)
- Axios

## Requisitos
- Node 18+ (recomendado)
- Projeto no Supabase com tabela `transactions`

## Setup

### 1) Instalar dependências
```bash
cd server
npm install