import { useEffect, useMemo, useState } from "react";
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

  const formatted = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
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
  const [isLoading, setIsLoading] = useState(false);

  const previousMonth = useMemo(
    () => changeMonth(selectedMonth, -1),
    [selectedMonth]
  );
  const nextMonth = useMemo(
    () => changeMonth(selectedMonth, 1),
    [selectedMonth]
  );
  const disableNextMonth = isFutureMonth(nextMonth);

  async function loadDashboardData(month = selectedMonth) {
    try {
      setIsLoading(true);

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
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData(selectedMonth);
  }, [selectedMonth]);

  return (
    <div className="app-shell">
      <div className="app-container">
        <header className="hero-section">
          <div className="hero-copy">
            <span className="hero-badge">Painel financeiro</span>

            <h1 className="hero-title">Controle financeiro com clareza, ritmo e visão</h1>

            <p className="hero-description">
              Visualize receitas, despesas, saldo e comportamento mensal em uma interface
              moderna, intuitiva e pensada para leitura rápida.
            </p>
          </div>

          <div className="hero-highlight-card">
            <p className="hero-highlight-label">Período em foco</p>
            <strong className="hero-highlight-value">
              {formatMonthLabel(selectedMonth)}
            </strong>
            <span className="hero-highlight-caption">
              Navegue pelos meses para acompanhar a evolução financeira e identificar padrões.
            </span>
          </div>
        </header>

        <section className="toolbar-card">
          <div className="toolbar-copy">
            <span className="toolbar-eyebrow">Filtro de período</span>
            <h2 className="toolbar-title">{formatMonthLabel(selectedMonth)}</h2>
            <p className="toolbar-description">
              Use os controles para avançar ou voltar entre os meses.
            </p>
          </div>

          <div className="toolbar-actions">
            <button
              type="button"
              className="month-nav-button"
              onClick={() => setSelectedMonth(previousMonth)}
              aria-label="Voltar um mês"
            >
              ←
            </button>

            <button
              type="button"
              className="month-nav-button"
              onClick={() => {
                if (!disableNextMonth) {
                  setSelectedMonth(nextMonth);
                }
              }}
              disabled={disableNextMonth}
              aria-label="Avançar um mês"
            >
              →
            </button>

            <button
              type="button"
              className="current-month-button"
              onClick={() => setSelectedMonth(getCurrentMonth())}
            >
              Ir para mês atual
            </button>
          </div>
        </section>

        <section className="content-stack">
          <TransactionForm onTransactionCreated={loadDashboardData} />

          {summary && <SummaryCards summary={summary} />}

          {evolutionData.length > 0 && <EvolutionChart data={evolutionData} />}

          <div className="charts-grid">
            {categoryData.length > 0 && (
              <div className="grid-card-span">
                <CategoryChart data={categoryData} />
              </div>
            )}
          </div>

          <section className="table-section">
            <div className="section-heading">
              <div>
                <span className="section-eyebrow">Histórico</span>
                <h2 className="section-title">Transações recentes</h2>
              </div>

              {isLoading && <span className="section-status">Atualizando…</span>}
            </div>

            <TransactionsTable transactions={transactions} />
          </section>
        </section>
      </div>
    </div>
  );
}

export default App;