import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

function CategoryChart({ data }: CategoryChartProps) {
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
      <div style={{ marginBottom: 18 }}>
        <h2
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 700,
            color: "#0f172a",
          }}
        >
          Gastos por categoria
        </h2>
        <p
          style={{
            margin: "6px 0 0",
            fontSize: 14,
            color: "#64748b",
            lineHeight: 1.5,
          }}
        >
          Distribuição das despesas registradas no período selecionado.
        </p>
      </div>

      <div style={{ width: "100%", height: 360 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 16, left: 8, bottom: 36 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="category"
              tickFormatter={formatCategoryLabel}
              angle={-18}
              textAnchor="end"
              interval={0}
              height={70}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />

            <YAxis
              tickFormatter={(value) => formatBRL(Number(value))}
              tickLine={false}
              axisLine={false}
              width={96}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />

            <Tooltip
              contentStyle={{
                borderRadius: 14,
                border: "1px solid #e5e7eb",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.10)",
                backgroundColor: "#ffffff",
              }}
              formatter={(value) => formatBRL(Number(value))}
              labelFormatter={(label) => `Categoria: ${formatCategoryLabel(String(label))}`}
            />

            <Bar
              dataKey="total"
              fill="#0f172a"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CategoryChart;