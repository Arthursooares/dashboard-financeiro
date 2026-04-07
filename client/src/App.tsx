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

function changeMonth(value: string, offset: number) {
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1 + offset, 1);

  const nextYear = date.getFullYear();
  const nextMonth = String(date.getMonth() + 1).padStart(2, "0");

  return `${nextYear}-${nextMonth}`;
}

function isFutureMonth(value: string) {
  return value > getCurrentMonth();
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryItem[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [evolutionData, setEvolutionData] = useState<EvolutionItem[]>([]);

  // 👉 variáveis que você pediu
  const previousMonth = changeMonth(selectedMonth, -1);
  const nextMonth = changeMonth(selectedMonth, 1);
  const disableNextMonth = isFutureMonth(nextMonth);

  async function loadDashboardData(month = selectedMonth) {
    const [transactionsRes, summaryRes, categoryRes, evolutionRes] =
      await Promise.all([
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
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <header style={{ marginBottom: 24 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 34,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Dashboard Financeiro
          </h1>
        </header>

        {/* FILTRO PREMIUM */}
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 20,
            padding: 20,
            marginBottom: 24,
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                }}
              >
                Período
              </p>

              <h3
                style={{
                  margin: "8px 0 4px",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                {formatMonthLabel(selectedMonth)}
              </h3>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              {/* ← */}
              <button
                onClick={() => setSelectedMonth(previousMonth)}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  cursor: "pointer",
                }}
              >
                ←
              </button>

              {/* → */}
              <button
                onClick={() => {
                  if (!disableNextMonth) {
                    setSelectedMonth(nextMonth);
                  }
                }}
                disabled={disableNextMonth}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  border: "1px solid #cbd5e1",
                  background: disableNextMonth ? "#f1f5f9" : "#ffffff",
                  color: disableNextMonth ? "#94a3b8" : "#0f172a",
                  cursor: disableNextMonth ? "not-allowed" : "pointer",
                }}
              >
                →
              </button>

              {/* botão mês atual */}
              <button
                onClick={() => setSelectedMonth(getCurrentMonth())}
                style={{
                  padding: "12px 16px",
                  borderRadius: 14,
                  border: "1px solid #cbd5e1",
                  background: "#f8fafc",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Mês atual
              </button>
            </div>
          </div>
        </section>

        {/* FORM */}
        <TransactionForm onTransactionCreated={loadDashboardData} />

        {/* SUMMARY */}
        {summary && <SummaryCards summary={summary} />}

        {/* EVOLUTION */}
        {evolutionData.length > 0 && (
          <EvolutionChart data={evolutionData} />
        )}

        {/* CATEGORY */}
        {categoryData.length > 0 && (
          <CategoryChart data={categoryData} />
        )}

        {/* TABLE */}
        <TransactionsTable transactions={transactions} />
      </div>
    </div>
  );
}

export default App;