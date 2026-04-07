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

function fieldStyle(): React.CSSProperties {
  return {
    width: "100%",
    padding: "13px 14px",
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    fontSize: 14,
    color: "#0f172a",
    outline: "none",
  };
}

function labelStyle(): React.CSSProperties {
  return {
    display: "block",
    marginBottom: 8,
    fontSize: 13,
    fontWeight: 600,
    color: "#334155",
  };
}

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
        background: "#ffffff",
        padding: 24,
        borderRadius: 20,
        border: "1px solid #e2e8f0",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
        marginBottom: 30,
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <h2
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 700,
            color: "#0f172a",
          }}
        >
          Adicionar transação
        </h2>
        <p
          style={{
            margin: "6px 0 0",
            fontSize: 14,
            color: "#64748b",
            lineHeight: 1.5,
          }}
        >
          Registre novas receitas e despesas para manter o dashboard atualizado.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 16,
          alignItems: "end",
        }}
      >
        <div>
          <label style={labelStyle()}>Descrição</label>
          <input
            type="text"
            list="description-suggestions"
            placeholder="Ex: Mercado, Salário, Uber..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={fieldStyle()}
          />
          <datalist id="description-suggestions">
            {descriptionSuggestions.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </div>

        <div>
          <label style={labelStyle()}>Valor</label>
          <input
            type="number"
            placeholder="Ex: 120.50"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={fieldStyle()}
          />
        </div>

        <div>
          <label style={labelStyle()}>Tipo</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "income" | "expense")}
            style={fieldStyle()}
          >
            <option value="expense">Despesa</option>
            <option value="income">Receita</option>
          </select>
        </div>

        <div>
          <label style={labelStyle()}>Categoria</label>
          <input
            type="text"
            list="category-suggestions"
            placeholder="Ex: alimentacao, renda..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={fieldStyle()}
          />
          <datalist id="category-suggestions">
            {categorySuggestions.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 18px",
              borderRadius: 14,
              border: "none",
              background: loading
                ? "#94a3b8"
                : "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: 14,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading
                ? "none"
                : "0 10px 24px rgba(15, 23, 42, 0.18)",
            }}
          >
            {loading ? "Salvando..." : "Adicionar transação"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TransactionForm;