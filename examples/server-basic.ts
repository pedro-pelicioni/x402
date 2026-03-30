/**
 * Basic server example - creating a paid API with x402 on Stellar.
 *
 * Usage:
 *   STELLAR_PAY_TO=G... npx tsx examples/server-basic.ts
 */
import express from "express";
import { x402 } from "../src/index.js";

const payTo = process.env.STELLAR_PAY_TO;
if (!payTo) {
  console.error("Set STELLAR_PAY_TO environment variable (your G... address)");
  process.exit(1);
}

const app = express();

// Protect all routes under /api with x402 paywall
app.use(
  "/api",
  x402.paywall({
    price: "$0.01",
    payTo,
    network: "testnet",
    description: "Premium API access",
  }),
);

// Free endpoint
app.get("/", (_req, res) => {
  res.json({ message: "Welcome! /api routes require payment." });
});

// Paid endpoints
app.get("/api/weather", (_req, res) => {
  res.json({
    city: "London",
    temperature: 18,
    conditions: "Partly cloudy",
  });
});

app.get("/api/quote", (_req, res) => {
  res.json({
    quote: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
  console.log("Free: http://localhost:3000/");
  console.log("Paid: http://localhost:3000/api/weather");
  console.log("Paid: http://localhost:3000/api/quote");
});
