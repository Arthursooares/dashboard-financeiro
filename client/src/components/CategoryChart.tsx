import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type CategoryItem = {
  category: string;
  total: number;
};

type CategoryChartProps = {
  data: CategoryItem[];
};

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCategoryLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function truncateLabel(value: string, max = 14) {
  const formatted = formatCategoryLabel(value);
  return formatted.length > max ? `${formatted.slice(0, max)}…` : formatted;
}

function CategoryTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    value: number;
    color: string;
  }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="category-tooltip">
      <div className="category-tooltip__label">
        {label ? formatCategoryLabel(label) : ""}
      </div>
      <strong className="category-tooltip__value">
        {formatBRL(Number(payload[0].value))}
      </strong>
    </div>
  );
}

function CategoryChart({ data }: CategoryChartProps) {
  const sortedData = [...data].sort((a, b) => b.total - a.total);

  const barColors = [
    "#818cf8",
    "#6366f1",
    "#4f46e5",
    "#7c3aed",
    "#8b5cf6",
    "#22c55e",
    "#06b6d4",
  ];

  return (
    <section className="chart-card chart-card--category">
      <div className="chart-card__header">
        <div>
          <span className="section-eyebrow">Distribuição</span>
          <h2 className="chart-card__title">Gastos por categoria</h2>
        </div>

        <p className="chart-card__description">
          Veja quais categorias concentraram mais despesas no período
          selecionado.
        </p>
      </div>

      <div className="chart-card__canvas chart-card__canvas--category">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 8, right: 12, left: 8, bottom: 8 }}
            barCategoryGap={12}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              horizontal={true}
              vertical={false}
              stroke="rgba(148, 163, 184, 0.12)"
            />

            <XAxis
              type="number"
              tickFormatter={(value) => formatBRL(Number(value))}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />

            <YAxis
              type="category"
              dataKey="category"
              tickFormatter={truncateLabel}
              tickLine={false}
              axisLine={false}
              width={110}
              tick={{ fill: "#cbd5f5", fontSize: 12 }}
            />

            <Tooltip content={<CategoryTooltip />} cursor={{ fill: "rgba(99, 102, 241, 0.08)" }} />

            <Bar dataKey="total" radius={[0, 12, 12, 0]}>
              {sortedData.map((item, index) => (
                <Cell
                  key={`${item.category}-${index}`}
                  fill={barColors[index % barColors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default CategoryChart;