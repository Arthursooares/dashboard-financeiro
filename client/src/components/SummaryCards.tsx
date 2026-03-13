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

type SummaryCardsProps = {
  summary: Summary;
};

function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16,
        marginBottom: 30,
      }}
    >
      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        }}
      >
        <h3 style={{ margin: 0, marginBottom: 10 }}>Receitas</h3>
        <p style={{ margin: 0, fontSize: 24, fontWeight: "bold" }}>
          {formatBRL(summary.income)}
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        }}
      >
        <h3 style={{ margin: 0, marginBottom: 10 }}>Despesas</h3>
        <p style={{ margin: 0, fontSize: 24, fontWeight: "bold" }}>
          {formatBRL(summary.expenses)}
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        }}
      >
        <h3 style={{ margin: 0, marginBottom: 10 }}>Saldo</h3>
        <p style={{ margin: 0, fontSize: 24, fontWeight: "bold" }}>
          {formatBRL(summary.balance)}
        </p>
      </div>
    </div>
  );
}

export default SummaryCards;
