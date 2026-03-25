import type {
    NameType,
    ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
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

function EvolutionChart({ data }: EvolutionChartProps) {
    const hasData = data.length > 0;

    return (
        <div
            style={{
                background: "#ffffff",
                padding: 24,
                borderRadius: 20,
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                marginBottom: 28,
                border: "1px solid #e5e7eb",
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
                    Evolução financeira
                </h2>
                <p
                    style={{
                        margin: "6px 0 0 0",
                        fontSize: 14,
                        color: "#64748b",
                    }}
                >
                    Visão dos últimos 6 meses com base no mês selecionado.
                </p>
            </div>

            {!hasData ? (
                <div
                    style={{
                        height: 320,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#64748b",
                        fontSize: 14,
                        borderRadius: 16,
                        background: "#f8fafc",
                    }}
                >
                    Nenhum dado disponível para exibir a evolução.
                </div>
            ) : (
                <div style={{ width: "100%", height: 360 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{ top: 10, right: 16, left: 8, bottom: 8 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#e5e7eb"
                            />

                            <XAxis
                                dataKey="month"
                                tickFormatter={formatMonth}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: "#64748b", fontSize: 12 }}
                            />

                            <YAxis
                                tickFormatter={(value) => formatBRL(Number(value))}
                                tickLine={false}
                                axisLine={false}
                                width={100}
                                tick={{ fill: "#64748b", fontSize: 12 }}
                                domain={["auto", "auto"]}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: 14,
                                    border: "1px solid #e5e7eb",
                                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.10)",
                                    backgroundColor: "#ffffff",
                                }}
                                formatter={(value, name) => {
                                    return [formatBRL(Number(value)), name];
                                }}
                                labelFormatter={(label) => {
                                    return `Mês: ${formatMonth(String(label))}`;
                                }}
                            />

                            <Legend
                                verticalAlign="top"
                                align="right"
                                iconType="circle"
                                wrapperStyle={{
                                    paddingBottom: 12,
                                    fontSize: 13,
                                }}
                            />

                            <Line
                                type="linear"
                                dataKey="income"
                                name="Receitas"
                                stroke="#16a34a"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                            />

                            <Line
                                type="linear"
                                dataKey="expenses"
                                name="Despesas"
                                stroke="#dc2626"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                            />

                            <Line
                                type="linear"
                                dataKey="balance"
                                name="Saldo"
                                stroke="#0f172a"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

export default EvolutionChart;