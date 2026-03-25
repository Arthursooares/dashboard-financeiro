import { useEffect, useState } from "react";
import api from "./api/api";
import SummaryCards from "./components/SummaryCards";
import CategoryChart from "./components/CategoryChart";
import TransactionsTable from "./components/TransactionsTable";
import TransactionForm from "./components/TransactionForm";
import EvolutionChart from "./components/EvolutionChart";

type Transaction = {
  id: string;
  date: string;
  description: string;
  amount_brl: number;
  category: string | null;
  type: "income" | "expense";
};

type Summary = {
  month: string;
  income: number;
  expenses: number;
  balance: number;
};

type CategoryItem = {
  category: string;
  total: number;
};

type EvolutionItem = {
  month: string;
  income: number;
  expenses: number;
  balance: number;
};

function getCurrentMonth() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function formatMonthLabel(value: string) {
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);

  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryItem[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [evolutionData, setEvolutionData] = useState<EvolutionItem[]>([]);

  async function loadDashboardData(month = selectedMonth) {
    const [transactionsRes, summaryRes, categoryRes, evolutionRes] = await Promise.all([
      api.get("/transactions", { params: { month } }),
      api.get("/summary/month", { params: { month } }),
      api.get("/summary/by-category", { params: { month } }),
      api.get("/summary/evolution", { params: { month } }),
    ]);

    setTransactions(transactionsRes.data);
    setSummary(summaryRes.data);
    setCategoryData(categoryRes.data.result);
    setEvolutionData(evolutionRes.data);
  }

  useEffect(() => {
    loadDashboardData(selectedMonth);
  }, [selectedMonth]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "32px 24px 48px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
        }}
      >
        <header
          style={{
            marginBottom: 24,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 13,
              fontWeight: 700,
              color: "#64748b",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Dashboard financeiro
          </p>

          <h1
            style={{
              margin: "10px 0 10px",
              fontSize: 36,
              lineHeight: 1.1,
              color: "#0f172a",
            }}
          >
            Visão geral das finanças
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: 15,
              color: "#64748b",
              maxWidth: 760,
              lineHeight: 1.6,
            }}
          >
            Acompanhe receitas, despesas, saldo, distribuição por categoria e evolução
            financeira mensal em uma visualização única.
          </p>
        </header>

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 18,
            padding: 18,
            marginBottom: 24,
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
          }}
        >
          <label
            htmlFor="month-filter"
            style={{
              display: "block",
              marginBottom: 10,
              fontSize: 13,
              fontWeight: 600,
              color: "#334155",
            }}
          >
            Filtrar por mês
          </label>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 12,
            }}
          >
            <input
              id="month-filter"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid #cbd5e1",
                fontSize: 14,
                color: "#0f172a",
                background: "#fff",
                minWidth: 220,
              }}
            />

            <span
              style={{
                fontSize: 14,
                color: "#64748b",
              }}
            >
              Período selecionado:{" "}
              <strong style={{ color: "#0f172a" }}>{formatMonthLabel(selectedMonth)}</strong>
            </span>
          </div>
        </section>

        <section style={{ marginBottom: 24 }}>
          <TransactionForm onTransactionCreated={loadDashboardData} />
        </section>

        <section style={{ marginBottom: 24 }}>
          {summary && <SummaryCards summary={summary} />}
        </section>

        <section style={{ marginBottom: 24 }}>
          {evolutionData.length > 0 && <EvolutionChart data={evolutionData} />}
        </section>

        <section style={{ marginBottom: 24 }}>
          {categoryData.length > 0 && <CategoryChart data={categoryData} />}
        </section>

        <section>
          <TransactionsTable transactions={transactions} />
        </section>
      </div>
    </div>
  );
}

export default App;