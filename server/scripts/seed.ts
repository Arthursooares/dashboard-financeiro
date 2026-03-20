import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const PORT = Number(process.env.PORT || 3001);
const API_BASE = `http://localhost:${PORT}`;

type TransactionType = "income" | "expense";

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function maybe(chance: number) {
  return Math.random() < chance;
}

function toDateString(year: number, monthIndex: number, day: number) {
  const month = String(monthIndex + 1).padStart(2, "0");
  const safeDay = String(day).padStart(2, "0");
  return `${year}-${month}-${safeDay}`;
}

async function createTransaction(body: {
  description: string;
  amount: number;
  type: TransactionType;
  currency: "BRL";
  category: string;
  date: string;
}) {
  const res = await axios.post(`${API_BASE}/transactions`, body, {
    headers: { "Content-Type": "application/json" },
    validateStatus: () => true,
  });

  if (res.status < 200 || res.status >= 300) {
    console.log("\n❌ Seed falhou:", res.status, res.data);
    process.exit(1);
  }

  process.stdout.write("✅");
}

function getLastMonths(total: number) {
  const now = new Date();
  const months: Array<{ year: number; monthIndex: number }> = [];

  for (let i = total - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      year: d.getFullYear(),
      monthIndex: d.getMonth(),
    });
  }

  return months;
}

async function seedMonth(year: number, monthIndex: number) {
  const monthNumber = monthIndex + 1;

  const salary = randInt(4200, 5600);
  const rent = randInt(1300, 1700);

  await createTransaction({
    description: "Salário",
    amount: salary,
    type: "income",
    currency: "BRL",
    category: "renda",
    date: toDateString(year, monthIndex, 5),
  });

  if (maybe(0.7)) {
    await createTransaction({
      description: "Freela",
      amount: randInt(500, 1800),
      type: "income",
      currency: "BRL",
      category: "renda",
      date: toDateString(year, monthIndex, randInt(12, 24)),
    });
  }

  if (maybe(0.25)) {
    await createTransaction({
      description: "Reembolso",
      amount: randInt(80, 350),
      type: "income",
      currency: "BRL",
      category: "renda",
      date: toDateString(year, monthIndex, randInt(8, 26)),
    });
  }

  await createTransaction({
    description: "Aluguel",
    amount: rent,
    type: "expense",
    currency: "BRL",
    category: "contas",
    date: toDateString(year, monthIndex, 10),
  });

  await createTransaction({
    description: "Conta de luz",
    amount: randInt(90, 180),
    type: "expense",
    currency: "BRL",
    category: "contas",
    date: toDateString(year, monthIndex, randInt(11, 14)),
  });

  await createTransaction({
    description: "Internet",
    amount: randInt(80, 130),
    type: "expense",
    currency: "BRL",
    category: "contas",
    date: toDateString(year, monthIndex, randInt(12, 16)),
  });

  await createTransaction({
    description: "Streaming",
    amount: randInt(25, 70),
    type: "expense",
    currency: "BRL",
    category: "assinaturas",
    date: toDateString(year, monthIndex, randInt(6, 18)),
  });

  const marketCount = randInt(3, 5);
  for (let i = 0; i < marketCount; i++) {
    await createTransaction({
      description: "Mercado",
      amount: randInt(90, 320),
      type: "expense",
      currency: "BRL",
      category: "alimentacao",
      date: toDateString(year, monthIndex, randInt(2, 28)),
    });
  }

  const transportCount = randInt(4, 8);
  for (let i = 0; i < transportCount; i++) {
    await createTransaction({
      description: maybe(0.5) ? "Uber" : "Transporte",
      amount: randInt(12, 60),
      type: "expense",
      currency: "BRL",
      category: "transporte",
      date: toDateString(year, monthIndex, randInt(1, 28)),
    });
  }

  const foodOutCount = randInt(2, 5);
  for (let i = 0; i < foodOutCount; i++) {
    await createTransaction({
      description: maybe(0.5) ? "Restaurante" : "Lanche",
      amount: randInt(20, 95),
      type: "expense",
      currency: "BRL",
      category: "alimentacao",
      date: toDateString(year, monthIndex, randInt(1, 28)),
    });
  }

  const leisureCount = randInt(1, 3);
  for (let i = 0; i < leisureCount; i++) {
    await createTransaction({
      description: maybe(0.5) ? "Cinema" : "Lazer",
      amount: randInt(30, 180),
      type: "expense",
      currency: "BRL",
      category: "lazer",
      date: toDateString(year, monthIndex, randInt(3, 27)),
    });
  }

  if (maybe(0.5)) {
    await createTransaction({
      description: maybe(0.5) ? "Farmácia" : "Consulta",
      amount: randInt(25, 220),
      type: "expense",
      currency: "BRL",
      category: "saude",
      date: toDateString(year, monthIndex, randInt(4, 26)),
    });
  }

  if (maybe(0.3)) {
    await createTransaction({
      description: "Curso",
      amount: randInt(60, 250),
      type: "expense",
      currency: "BRL",
      category: "educacao",
      date: toDateString(year, monthIndex, randInt(5, 20)),
    });
  }

  console.log(`\n📅 Mês ${String(monthNumber).padStart(2, "0")}/${year} concluído`);
}

async function main() {
  const totalMonths = Number(process.argv[2] || 6);
  const months = getLastMonths(totalMonths);

  console.log(`🌱 Gerando seed realista para ${totalMonths} meses...\n`);

  for (const month of months) {
    await seedMonth(month.year, month.monthIndex);
  }

  console.log("\n✅ Seed concluído com sucesso.");
}

main().catch((e) => {
  console.error("Erro seed:", e?.message || e);
  process.exit(1);
});