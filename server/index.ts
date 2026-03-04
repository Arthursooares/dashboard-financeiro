import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import https from "https";
import dns from "dns";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Preferir IPv4 ajuda em redes problemáticas
dns.setDefaultResultOrder?.("ipv4first");

// ---------- ENV ----------
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const PORT = Number(process.env.PORT || 3001);

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error("SUPABASE_URL ou SUPABASE_SERVICE_KEY não definidos no .env");
}

const DNS_FALLBACK = (process.env.DNS_FALLBACK || "1") === "1";
const DNS_SERVERS = (process.env.DNS_SERVERS || "1.1.1.1,1.0.0.1,8.8.8.8,8.8.4.4")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// TLS seguro (NÃO desligar SSL)
const agent = new https.Agent({ rejectUnauthorized: true });

// ---------- helpers ----------
function cleanUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const key in obj) {
    const v = obj[key];
    if (v !== undefined && v !== "undefined") cleaned[key] = v;
  }
  return cleaned;
}

function toNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function yyyyMmFromDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function monthRange(yyyyMm: string) {
  const [yStr, mStr] = yyyyMm.split("-");
  const y = Number(yStr);
  const m = Number(mStr);
  const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(y, m, 1, 0, 0, 0));
  return { start: start.toISOString(), end: end.toISOString() };
}

async function axiosWithDnsFallback<T = any>(config: AxiosRequestConfig): Promise<T> {
  try {
    const res = await axios({
      ...config,
      httpsAgent: agent,
      timeout: 15000,
      validateStatus: () => true,
    });
    return res as any;
  } catch (err: any) {
    const msg = String(err?.message || "");
    const isDns = msg.includes("ENOTFOUND") || msg.includes("EAI_AGAIN") || msg.includes("getaddrinfo");
    if (!DNS_FALLBACK || !isDns) throw err;

    dns.setServers(DNS_SERVERS);
    const res2 = await axios({
      ...config,
      httpsAgent: agent,
      timeout: 15000,
      validateStatus: () => true,
    });
    return res2 as any;
  }
}

// Wrapper para chamar PostgREST do Supabase
async function supabaseRequest(method: "get" | "post" | "patch" | "delete", path: string, data?: any) {
  const url = `${SUPABASE_URL}${path}`;
  const response: any = await axiosWithDnsFallback({
    method,
    url,
    data,
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
  });
  return response;
}

// ---------- routes ----------

app.get("/health", (_req, res) => res.json({ ok: true }));

// POST /transactions
app.post("/transactions", async (req, res) => {
  console.log("-----------------------------------------");
  console.log("📩 POST /transactions");

  try {
    const rawBody: Record<string, unknown> =
      req.body && typeof req.body === "object" ? (req.body as Record<string, unknown>) : {};

    const body = cleanUndefined(rawBody);

    const currency =
      typeof body["currency"] === "string" && body["currency"] ? (body["currency"] as string) : "BRL";
    if (!body["currency"]) body["currency"] = currency;

    const amount = toNumber(body["amount"]);
    const amountBrl = toNumber(body["amount_brl"]);

    if (amountBrl === null) {
      if (currency === "BRL" && amount !== null) {
        body["amount_brl"] = amount;
      } else {
        return res.status(400).json({
          error: "Para currency diferente de BRL, envie amount_brl (ou implemente exchange_rate).",
        });
      }
    }

    console.log("📦 BODY FINAL:", body);

    const sb = await supabaseRequest("post", "/rest/v1/transactions", body);
    if (sb.status >= 200 && sb.status < 300) {
      console.log("✅ DADO SALVO NO SUPABASE");
      return res.status(201).json(sb.data?.[0] ?? sb.data);
    }

    console.log("❌ ERRO SUPABASE:", sb.status, sb.data);
    return res.status(sb.status).json({ error: sb.data });
  } catch (err: any) {
    const msg = err?.response?.data || err?.message || "Erro desconhecido";
    console.error("❌ ERRO NO BACKEND:", msg);
    return res.status(500).json({ error: msg });
  }
});

// GET /transactions?month=2026-03&type=expense&limit=50&offset=0
app.get("/transactions", async (req, res) => {
  try {
    const month = typeof req.query.month === "string" ? req.query.month : undefined;
    const type = typeof req.query.type === "string" ? req.query.type : undefined;
    const limit = typeof req.query.limit === "string" ? Number(req.query.limit) : 50;
    const offset = typeof req.query.offset === "string" ? Number(req.query.offset) : 0;

    let url = `${SUPABASE_URL}/rest/v1/transactions?select=*`;

    if (month) {
      const { start, end } = monthRange(month);
      url += `&created_at=gte.${encodeURIComponent(start)}&created_at=lt.${encodeURIComponent(end)}`;
    }
    if (type) {
      url += `&type=eq.${encodeURIComponent(type)}`;
    }

    url += `&order=created_at.desc&limit=${encodeURIComponent(String(limit))}&offset=${encodeURIComponent(
      String(offset)
    )}`;

    const sb: any = await axiosWithDnsFallback({
      method: "get",
      url,
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    });

    if (sb.status >= 200 && sb.status < 300) return res.json(sb.data);
    return res.status(sb.status).json({ error: sb.data });
  } catch (err: any) {
    const msg = err?.response?.data || err?.message || "Erro desconhecido";
    return res.status(500).json({ error: msg });
  }
});

// GET /summary/month?month=2026-03
app.get("/summary/month", async (req, res) => {
  try {
    const month =
      typeof req.query.month === "string" && req.query.month ? req.query.month : yyyyMmFromDate(new Date());
    const { start, end } = monthRange(month);

    const url =
      `${SUPABASE_URL}/rest/v1/transactions?select=amount_brl,type` +
      `&created_at=gte.${encodeURIComponent(start)}&created_at=lt.${encodeURIComponent(end)}`;

    const sb: any = await axiosWithDnsFallback({
      method: "get",
      url,
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    });

    if (!(sb.status >= 200 && sb.status < 300)) return res.status(sb.status).json({ error: sb.data });

    let income = 0;
    let expenses = 0;

    for (const row of sb.data as Array<any>) {
      const v = toNumber(row.amount_brl) ?? 0;
      if (row.type === "income") income += v;
      else if (row.type === "expense") expenses += v;
    }

    return res.json({ month, income, expenses, balance: income - expenses });
  } catch (err: any) {
    const msg = err?.response?.data || err?.message || "Erro desconhecido";
    return res.status(500).json({ error: msg });
  }
});

// GET /summary/by-category?month=2026-03
// Agora usando "category" (porque sua tabela NÃO tem category_id)
app.get("/summary/by-category", async (req, res) => {
  try {
    const month =
      typeof req.query.month === "string" && req.query.month ? req.query.month : yyyyMmFromDate(new Date());
    const { start, end } = monthRange(month);

    const url =
      `${SUPABASE_URL}/rest/v1/transactions?select=amount_brl,category,type` +
      `&created_at=gte.${encodeURIComponent(start)}&created_at=lt.${encodeURIComponent(end)}` +
      `&type=eq.expense`;

    const sb: any = await axiosWithDnsFallback({
      method: "get",
      url,
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    });

    if (!(sb.status >= 200 && sb.status < 300)) return res.status(sb.status).json({ error: sb.data });

    const byCategory: Record<string, number> = {};

    for (const row of sb.data as Array<any>) {
      const cat = row.category ?? "uncategorized";
      const v = toNumber(row.amount_brl) ?? 0;
      byCategory[String(cat)] = (byCategory[String(cat)] || 0) + v;
    }

    const result = Object.entries(byCategory)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);

    return res.json({ month, result });
  } catch (err: any) {
    const msg = err?.response?.data || err?.message || "Erro desconhecido";
    return res.status(500).json({ error: msg });
  }
});

app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));