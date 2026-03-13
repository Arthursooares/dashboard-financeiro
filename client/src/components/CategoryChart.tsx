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
    }).format(value);
}

function CategoryChart({ data }: CategoryChartProps) {
    return (
        <div
            style={{
                backgroundColor: "#f5f5f5",
                padding: 20,
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                marginBottom: 30,
            }}
        >
            <h2 style={{ marginTop: 0 }}>Gastos por categoria</h2>

            <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                    <BarChart
                        data={data}
                        margin={{ top: 10, right: 20, left: 10, bottom: 30 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="category"
                            angle={-20}
                            textAnchor="end"
                            interval={0}
                            height={70}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis />
                        <Tooltip formatter={(value) => formatBRL(Number(value))} />
                        <Bar dataKey="total" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default CategoryChart;