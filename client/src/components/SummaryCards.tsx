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
    <section className="summary-grid">
      <article
        className={`summary-card summary-card--balance ${
          balancePositive
            ? "summary-card--balance-positive"
            : "summary-card--balance-negative"
        }`}
      >
        <div className="summary-card__top">
          <div>
            <span className="summary-card__eyebrow">Saldo total</span>
            <h3 className="summary-card__value summary-card__value--balance">
              {formatBRL(summary.balance)}
            </h3>
          </div>

          <span className="summary-card__badge">
            {balancePositive ? "Positivo" : "Atenção"}
          </span>
        </div>

        <p className="summary-card__description summary-card__description--balance">
          Resultado do período após descontar as despesas das receitas
          registradas.
        </p>
      </article>

      <article className="summary-card summary-card--surface">
        <div className="summary-card__icon summary-card__icon--income">↗</div>

        <span className="summary-card__eyebrow">Receitas</span>

        <h3 className="summary-card__value summary-card__value--income">
          {formatBRL(summary.income)}
        </h3>

        <p className="summary-card__description">
          Total de entradas registradas no período selecionado.
        </p>
      </article>

      <article className="summary-card summary-card--surface">
        <div className="summary-card__icon summary-card__icon--expense">↘</div>

        <span className="summary-card__eyebrow">Despesas</span>

        <h3 className="summary-card__value summary-card__value--expense">
          {formatBRL(summary.expenses)}
        </h3>

        <p className="summary-card__description">
          Total de saídas registradas no período selecionado.
        </p>
      </article>
    </section>
  );
}

export default SummaryCards;