/**
 * Full-stack demo - Server side.
 *
 * Usage:
 *   STELLAR_PAY_TO=G... npx tsx examples/full-stack/server.ts
 *
 * Then run the client:
 *   STELLAR_SECRET_KEY=S... npx tsx examples/full-stack/client.ts
 */
import express from "express";
import { x402 } from "../../src/index.js";

const payTo = process.env.STELLAR_PAY_TO;
if (!payTo) {
  console.error("Set STELLAR_PAY_TO environment variable");
  process.exit(1);
}

const app = express();

// Different pricing for different routes
app.use(
  "/api/basic",
  x402.paywall({
    price: "$0.001",
    payTo,
    network: "testnet",
    description: "Basic data access",
  }),
);

app.use(
  "/api/premium",
  x402.paywall({
    price: "$0.01",
    payTo,
    network: "testnet",
    description: "Premium data access",
  }),
);

app.get("/api/basic/ping", (_req, res) => {
  res.json({ message: "pong", tier: "basic", timestamp: new Date().toISOString() });
});

app.get("/api/premium/analytics", (_req, res) => {
  res.json({
    tier: "premium",
    visitors: Math.floor(Math.random() * 10000),
    revenue: `$${(Math.random() * 1000).toFixed(2)}`,
    timestamp: new Date().toISOString(),
  });
});

app.listen(4000, () => {
  console.log("Full-stack demo server on http://localhost:4000");
  console.log("  Basic ($0.001):  GET /api/basic/ping");
  console.log("  Premium ($0.01): GET /api/premium/analytics");
});
