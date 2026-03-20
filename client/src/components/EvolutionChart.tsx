import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
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
    const hasMultiplePoints = data.length > 1;

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
            <h2 style={{ marginTop: 0, marginBottom: 8 }}>Evolução financeira</h2>

            {!hasData ? (
                <div
                    style={{
                        height: 320,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#666",
                        fontSize: 14,
                    }}
                >
                    Nenhum dado disponível para exibir a evolução.
                </div>
            ) : (
                <>
                    {!hasMultiplePoints && (
                        <p
                            style={{
                                marginTop: 0,
                                marginBottom: 12,
                                fontSize: 13,
                                color: "#666",
                            }}
                        >
                            Há apenas 1 mês disponível. Adicione mais meses para visualizar a evolução como linha contínua.
                        </p>
                    )}
                    {hasMultiplePoints ? (
                        <Line
                            type="monotone"
                            dataKey="balance"
                            name="Saldo"
                            stroke="#111"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    ) : (
                        <Line
                            type="linear"
                            dataKey="balance"
                            name="Saldo"
                            stroke="#111"
                            strokeWidth={0}
                            dot={{ r: 6 }}
                            activeDot={{ r: 8 }}
                        />
                    )}

                    <div style={{ width: "100%", height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={data}
                                margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickFormatter={formatMonth}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    tickFormatter={(value) => formatBRL(Number(value))}
                                    tickLine={false}
                                    axisLine={false}
                                    width={90}
                                    domain={([dataMin, dataMax]) => {
                                        if (dataMin === dataMax) {
                                            const padding = Math.max(dataMin * 0.1, 1000);
                                            return [dataMin - padding, dataMax + padding];
                                        }

                                        const padding = (dataMax - dataMin) * 0.15;
                                        return [dataMin - padding, dataMax + padding];
                                    }}
                                />
                                <Tooltip
                                    formatter={(value) => formatBRL(Number(value))}
                                    labelFormatter={(label) => `Mês: ${formatMonth(String(label))}`}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="balance"
                                    name="Saldo"
                                    stroke="#111"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    );
}

export default EvolutionChart;