/**
 * Basic client example - consuming a paid API with x402 on Stellar.
 *
 * Usage:
 *   STELLAR_SECRET_KEY=S... npx tsx examples/client-basic.ts
 */
import { x402 } from "../src/index.js";

const secretKey = process.env.STELLAR_SECRET_KEY;
if (!secretKey) {
  console.error("Set STELLAR_SECRET_KEY environment variable");
  process.exit(1);
}

const client = x402.client({
  secretKey,
  network: "testnet",
  maxPrice: "$1.00",
  onPayment: (info) => {
    console.log(`Paid ${info.amount} for ${info.url}`);
  },
});

// Fetch a paid endpoint (xlm402.com test services)
const response = await client.fetch(
  "https://xlm402.com/weather/current?city=London",
);
const data = await response.json();
console.log("Weather data:", data);
