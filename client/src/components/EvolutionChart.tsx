import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type EvolutionItem = {
  month: string;
  income: number;
  expenses: number;
  balance: number;
};

type EvolutionChartProps = {
  data: EvolutionItem[];
};

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatMonth(value: string) {
  const [year, month] = value.split("-");
  return `${month}/${year.slice(2)}`;
}

function formatLegendLabel(value: string) {
  if (value === "income") return "Receitas";
  if (value === "expenses") return "Despesas";
  if (value === "balance") return "Saldo";
  return value;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="evolution-tooltip">
      <div className="evolution-tooltip__label">
        {label ? formatMonth(label) : ""}
      </div>

      <div className="evolution-tooltip__items">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="evolution-tooltip__item">
            <div className="evolution-tooltip__item-left">
              <span
                className="evolution-tooltip__dot"
                style={{ backgroundColor: entry.color }}
              />
              <span className="evolution-tooltip__name">
                {formatLegendLabel(entry.dataKey)}
              </span>
            </div>

            <strong className="evolution-tooltip__value">
              {formatBRL(Number(entry.value))}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function EvolutionChart({ data }: EvolutionChartProps) {
  const hasData = data.length > 0;

  return (
    <section className="chart-card chart-card--evolution">
      <div className="chart-card__header">
        <div>
          <span className="section-eyebrow">Visão temporal</span>
          <h2 className="chart-card__title">Evolução financeira</h2>
        </div>

        <p className="chart-card__description">
          Compare receitas, despesas e saldo dos últimos meses com base no
          período selecionado.
        </p>
      </div>

      {!hasData ? (
        <div className="chart-empty-state">
          Nenhum dado disponível para exibir a evolução.
        </div>
      ) : (
        <div className="chart-card__canvas">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 12, right: 8, left: -10, bottom: 4 }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="rgba(148, 163, 184, 0.12)"
              />

              <XAxis
                dataKey="month"
                tickFormatter={formatMonth}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />

              <YAxis
                tickFormatter={(value) => formatBRL(Number(value))}
                tickLine={false}
                axisLine={false}
                width={92}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                domain={["auto", "auto"]}
              />

              <Tooltip content={<CustomTooltip />} />

              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                formatter={(value) => (
                  <span className="chart-legend-text">
                    {formatLegendLabel(String(value))}
                  </span>
                )}
                wrapperStyle={{ paddingBottom: 14 }}
              />

              <Line
                type="monotone"
                dataKey="income"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 5,
                  strokeWidth: 0,
                  fill: "#22c55e",
                }}
              />

              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 5,
                  strokeWidth: 0,
                  fill: "#ef4444",
                }}
              />

              <Line
                type="monotone"
                dataKey="balance"
                stroke="#818cf8"
                strokeWidth={3.5}
                dot={{ r: 0 }}
                activeDot={{
                  r: 6,
                  strokeWidth: 0,
                  fill: "#818cf8",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default EvolutionChart;