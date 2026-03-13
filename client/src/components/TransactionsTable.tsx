type Transaction = {
  id: string;
  created_at: string;
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

function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Transações</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "white",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#eaeaea" }}>
            <th style={{ textAlign: "left", padding: 12 }}>Data</th>
            <th style={{ textAlign: "left", padding: 12 }}>Descrição</th>
            <th style={{ textAlign: "left", padding: 12 }}>Categoria</th>
            <th style={{ textAlign: "left", padding: 12 }}>Tipo</th>
            <th style={{ textAlign: "left", padding: 12 }}>Valor</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: 12 }}>{formatDate(transaction.created_at)}</td>
              <td style={{ padding: 12 }}>{transaction.description}</td>
              <td style={{ padding: 12 }}>{transaction.category ?? "Sem categoria"}</td>
              <td style={{ padding: 12 }}>{transaction.type}</td>
              <td style={{ padding: 12 }}>{formatBRL(transaction.amount_brl)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionsTable;