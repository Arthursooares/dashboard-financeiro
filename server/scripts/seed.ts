import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const PORT = Number(process.env.PORT || 3001);
const API_BASE = `http://localhost:${PORT}`;

const expenseCategories = ["alimentacao", "transporte", "lazer", "saude", "contas", "assinaturas", "educacao"];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: T[]): T {
  if (arr.length === 0) {
    throw new Error("pick() recebeu um array vazio");
  }
 return arr[randInt(0, arr.length - 1)]!;
}
function description(type: "income" | "expense") {
  if (type === "income") return pick(["Salário", "Freela", "Reembolso", "Venda"]);
  return pick(["Mercado", "Uber", "Farmácia", "Conta de luz", "Streaming", "Restaurante"]);
}

async function main() {
  const count = Number(process.argv[2] || 50);

  for (let i = 0; i < count; i++) {
    const type: "income" | "expense" = Math.random() < 0.2 ? "income" : "expense";
    const amount = type === "income" ? randInt(800, 6000) : randInt(10, 450);

    const body = {
      description: description(type),
      amount,
      type,
      currency: "BRL",
      category: type === "expense" ? pick(expenseCategories) : "renda",
    };

    const res = await axios.post(`${API_BASE}/transactions`, body, {
      headers: { "Content-Type": "application/json" },
      validateStatus: () => true,
    });

    if (res.status >= 200 && res.status < 300) {
      process.stdout.write("✅");
    } else {
      console.log("\n❌ Seed falhou:", res.status, res.data);
      process.exit(1);
    }
  }

  console.log(`\nSeed concluído: ${count} transações criadas.`);
}

main().catch((e) => {
  console.error("Erro seed:", e?.message || e);
  process.exit(1);
});