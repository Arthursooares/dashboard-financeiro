type Summary = {
  month: string;
  income: number;
  expenses: number;
  balance: number;
};

type SummaryCardsProps = {
  summary: Summary;
};

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function SummaryCards({ summary }: SummaryCardsProps) {
  const balancePositive = summary.balance >= 0;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr 1fr",
        gap: 18,
        marginBottom: 30,
      }}
    >
      <div
        style={{
          background: balancePositive
            ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
            : "linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)",
          color: "#ffffff",
          padding: 24,
          borderRadius: 20,
          boxShadow: "0 14px 32px rgba(15, 23, 42, 0.16)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                opacity: 0.8,
              }}
            >
              Saldo total
            </p>

            <h3
              style={{
                margin: "10px 0 0",
                fontSize: 32,
                lineHeight: 1.1,
                fontWeight: 700,
              }}
            >
              {formatBRL(summary.balance)}
            </h3>
          </div>

          <div
            style={{
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(255, 255, 255, 0.12)",
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {balancePositive ? "Positivo" : "Atenção"}
          </div>
        </div>

        <p
          style={{
            margin: "16px 0 0",
            fontSize: 14,
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.78)",
            maxWidth: 320,
          }}
        >
          Resultado do período após descontar as despesas das receitas registradas.
        </p>
      </div>

      <div
        style={{
          background: "#ffffff",
          padding: 22,
          borderRadius: 20,
          border: "1px solid #e2e8f0",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "rgba(22, 163, 74, 0.10)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
            fontSize: 20,
          }}
        >
          ↗
        </div>

        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#64748b",
          }}
        >
          Receitas
        </p>

        <h3
          style={{
            margin: "10px 0 8px",
            fontSize: 28,
            lineHeight: 1.1,
            fontWeight: 700,
            color: "#166534",
          }}
        >
          {formatBRL(summary.income)}
        </h3>

        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: "#64748b",
            lineHeight: 1.5,
          }}
        >
          Total de entradas registradas no período selecionado.
        </p>
      </div>

      <div
        style={{
          background: "#ffffff",
          padding: 22,
          borderRadius: 20,
          border: "1px solid #e2e8f0",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "rgba(220, 38, 38, 0.10)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
            fontSize: 20,
          }}
        >
          ↘
        </div>

        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#64748b",
          }}
        >
          Despesas
        </p>

        <h3
          style={{
            margin: "10px 0 8px",
            fontSize: 28,
            lineHeight: 1.1,
            fontWeight: 700,
            color: "#b91c1c",
          }}
        >
          {formatBRL(summary.expenses)}
        </h3>

        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: "#64748b",
            lineHeight: 1.5,
          }}
        >
          Total de saídas registradas no período selecionado.
        </p>
      </div>
    </div>
  );
}

export default SummaryCards;