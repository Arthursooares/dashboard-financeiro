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
    <div className="transactions-card">
      <div className="transactions-card__header">
        <div>
          <span className="section-eyebrow">Movimentações</span>
          <h2 className="transactions-card__title">Transações</h2>
        </div>

        <p className="transactions-card__description">
          Histórico das movimentações registradas no período selecionado.
        </p>
      </div>

      {transactions.length === 0 ? (
        <div className="transactions-empty-state">
          Nenhuma transação encontrada para o período selecionado.
        </div>
      ) : (
        <div className="transactions-table-wrap">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Tipo</th>
                <th className="transactions-table__amount-header">Valor</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => {
                const isIncome = transaction.type === "income";

                return (
                  <tr key={transaction.id}>
                    <td className="transactions-table__date">
                      {formatDate(transaction.date)}
                    </td>

                    <td className="transactions-table__description">
                      {transaction.description}
                    </td>

                    <td className="transactions-table__category">
                      {formatCategory(transaction.category)}
                    </td>

                    <td>
                      <span
                        className={`transaction-type-badge ${
                          isIncome
                            ? "transaction-type-badge--income"
                            : "transaction-type-badge--expense"
                        }`}
                      >
                        {formatTypeLabel(transaction.type)}
                      </span>
                    </td>

                    <td
                      className={`transactions-table__amount ${
                        isIncome
                          ? "transactions-table__amount--income"
                          : "transactions-table__amount--expense"
                      }`}
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