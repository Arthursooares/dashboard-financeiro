import { useState } from "react";
import api from "../api/api";

const expenseCategories = [
  "alimentacao",
  "transporte",
  "lazer",
  "saude",
  "contas",
  "assinaturas",
  "educacao",
];

const incomeCategories = [
  "renda",
  "freelance",
  "venda",
  "reembolso",
  "investimentos",
];

const expenseDescriptions = [
  "Mercado",
  "Uber",
  "Farmácia",
  "Conta de luz",
  "Streaming",
  "Restaurante",
  "Internet",
  "Aluguel",
];

const incomeDescriptions = [
  "Salário",
  "Freela",
  "Reembolso",
  "Venda",
  "Rendimento",
];
type TransactionFormProps = {
  onTransactionCreated: () => void;
};

function TransactionForm({ onTransactionCreated }: TransactionFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const categorySuggestions =
  type === "expense" ? expenseCategories : incomeCategories;

const descriptionSuggestions =
  type === "expense" ? expenseDescriptions : incomeDescriptions;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!description || !amount || !category) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/transactions", {
        description,
        amount: Number(amount),
        type,
        category,
      });

      setDescription("");
      setAmount("");
      setType("expense");
      setCategory("");

      onTransactionCreated();
    } catch (error) {
      console.error("Erro ao criar transação:", error);
      alert("Erro ao criar transação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        marginBottom: 30,
      }}
    >
      <h2 style={{ marginTop: 0 }}>Adicionar transação</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
        }}
      >
        <input
          type="text"
          list="description-suggestions"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />

        <datalist id="description-suggestions">
          {descriptionSuggestions.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>

        <input
          type="number"
          placeholder="Valor"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        >
          <option value="expense">Despesa</option>
          <option value="income">Receita</option>
        </select>

        <input
          type="text"
          list="category-suggestions"
          placeholder="Categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />

        <datalist id="category-suggestions">
          {categorySuggestions.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>

        <button
          type="submit"
          disabled={loading}
          style={{
            gridColumn: "span 4",
            padding: 12,
            borderRadius: 8,
            border: "none",
            backgroundColor: "#111",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "Salvando..." : "Adicionar transação"}
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;