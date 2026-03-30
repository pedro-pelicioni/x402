/**
 * AI Agent demo - making multiple paid API calls with spending tracking.
 *
 * Usage:
 *   STELLAR_SECRET_KEY=S... npx tsx examples/agent-demo.ts
 */
import { x402 } from "../src/index.js";

const secretKey = process.env.STELLAR_SECRET_KEY;
if (!secretKey) {
  console.error("Set STELLAR_SECRET_KEY environment variable");
  process.exit(1);
}

// Track spending
let totalSpent = 0;
const payments: Array<{ url: string; amount: string }> = [];

const client = x402.client({
  secretKey,
  network: "testnet",
  maxPrice: "$0.50", // Safety limit per request
  onPayment: (info) => {
    const amountUSDC = parseInt(info.amount) / 1e7;
    totalSpent += amountUSDC;
    payments.push({ url: info.url, amount: info.amount });
    console.log(
      `[Payment] $${amountUSDC.toFixed(4)} for ${info.url} | Total: $${totalSpent.toFixed(4)}`,
    );
  },
});

// Simulate an AI agent making multiple API calls
const endpoints = [
  "https://xlm402.com/weather/current?city=London",
  "https://xlm402.com/weather/current?city=Tokyo",
  "https://xlm402.com/weather/current?city=New+York",
];

console.log("Agent starting data collection...\n");

for (const endpoint of endpoints) {
  try {
    const response = await client.fetch(endpoint);
    if (response.ok) {
      const data = await response.json();
      console.log(`Data received:`, JSON.stringify(data).slice(0, 100), "\n");
    } else {
      console.log(`Request failed: ${response.status}\n`);
    }
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
  }
}

console.log("\n=== Agent Summary ===");
console.log(`Total requests: ${payments.length}`);
console.log(`Total spent: $${totalSpent.toFixed(4)} USDC`);
