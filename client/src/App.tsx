import { useEffect, useState } from "react";
import api from "./api/api";
import SummaryCards from "./components/SummaryCards";
import CategoryChart from "./components/CategoryChart";
import TransactionsTable from "./components/TransactionsTable";
import TransactionForm from "./components/TransactionForm";

type Transaction = {
  id: string;
  created_at: string;
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
function getCurrentMonth() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}


function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryItem[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  async function loadDashboardData(month = selectedMonth) {
    const [transactionsRes, summaryRes, categoryRes] = await Promise.all([
      api.get("/transactions", { params: { month } }),
      api.get("/summary/month", { params: { month } }),
      api.get("/summary/by-category", { params: { month } }),
    ]);

    setTransactions(transactionsRes.data);
    setSummary(summaryRes.data);
    setCategoryData(categoryRes.data.result);
  }

  useEffect(() => {
    loadDashboardData(selectedMonth);
  }, [selectedMonth]);

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard Financeiro</h1>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
          Filtrar por mês
        </label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />
      </div>
      <TransactionForm onTransactionCreated={loadDashboardData} />

      {summary && <SummaryCards summary={summary} />}

      {categoryData.length > 0 && <CategoryChart data={categoryData} />}

      <TransactionsTable transactions={transactions} />
    </div>
  );
}

export default App;