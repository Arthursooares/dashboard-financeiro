type Transaction = {
  id: string;
  date: string;
  description: string;
  amount_brl: number;
  category: string | null;
  type: "income" | "expense";
};

type TransactionsTableProps = {
  transactions: Transaction[];
};

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
}

function formatCategory(value: string | null) {
  if (!value) return "Sem categoria";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatTypeLabel(type: "income" | "expense") {
  return type === "income" ? "Receita" : "Despesa";
}

function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: 24,
        borderRadius: 20,
        border: "1px solid #e2e8f0",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <h2
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 700,
            color: "#0f172a",
          }}
        >
          Transações
        </h2>
        <p
          style={{
            margin: "6px 0 0",
            fontSize: 14,
            color: "#64748b",
            lineHeight: 1.5,
          }}
        >
          Histórico das movimentações registradas no período selecionado.
        </p>
      </div>

      {transactions.length === 0 ? (
        <div
          style={{
            padding: "28px 20px",
            borderRadius: 16,
            background: "#f8fafc",
            border: "1px dashed #cbd5e1",
            color: "#64748b",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          Nenhuma transação encontrada para o período selecionado.
        </div>
      ) : (
        <div
          style={{
            overflowX: "auto",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#ffffff",
              minWidth: 760,
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f8fafc",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <th
                  style={{
                    textAlign: "left",
                    padding: "14px 16px",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Data
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "14px 16px",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Descrição
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "14px 16px",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Categoria
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "14px 16px",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Tipo
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "14px 16px",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Valor
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction, index) => {
                const isIncome = transaction.type === "income";

                return (
                  <tr
                    key={transaction.id}
                    style={{
                      borderBottom:
                        index === transactions.length - 1
                          ? "none"
                          : "1px solid #eef2f7",
                    }}
                  >
                    <td
                      style={{
                        padding: "16px",
                        fontSize: 14,
                        color: "#475569",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(transaction.date)}
                    </td>

                    <td
                      style={{
                        padding: "16px",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#0f172a",
                      }}
                    >
                      {transaction.description}
                    </td>

                    <td
                      style={{
                        padding: "16px",
                        fontSize: 14,
                        color: "#475569",
                      }}
                    >
                      {formatCategory(transaction.category)}
                    </td>

                    <td style={{ padding: "16px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "6px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          background: isIncome
                            ? "rgba(22, 163, 74, 0.10)"
                            : "rgba(220, 38, 38, 0.10)",
                          color: isIncome ? "#166534" : "#b91c1c",
                        }}
                      >
                        {formatTypeLabel(transaction.type)}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: "16px",
                        fontSize: 14,
                        fontWeight: 700,
                        textAlign: "right",
                        color: isIncome ? "#166534" : "#b91c1c",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {isIncome ? "+" : "-"} {formatBRL(transaction.amount_brl)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TransactionsTable;