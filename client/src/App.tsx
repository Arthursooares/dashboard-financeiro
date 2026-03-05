import { useEffect, useState } from "react";
import api from "./api/api";

type Transaction = {
  id: string;
  description: string;
  amount_brl: number;
  type: "income" | "expense";
};

type Summary = {
   month: string;
  income: number;
  expenses: number;
  balance: number;
};

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    api.get("/transactions").then((res) => {
      setTransactions(res.data);
    });

    api.get("/summary/month").then((res) => {
      setSummary(res.data);
    });
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard Financeiro</h1>

      {summary && (
        <div style={{ marginBottom: 30 }}>
          <h2>Resumo do mês</h2>
          <p>Receitas: R$ {formatBRL(summary.income)}</p>
          <p>Despesas: R$ {formatBRL(summary.expenses)}</p>
          <p>Saldo: R$ {formatBRL(summary.balance)}</p>
        </div>
      )}
      

      <h2>Transações</h2>

      {transactions.map((t) => (
        <div key={t.id}>
          {t.description} - {formatBRL(t.amount_brl)}
        </div>
      ))}
    </div>
  );
}

export default App;