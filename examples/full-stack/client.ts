/**
 * Full-stack demo - Client side.
 *
 * First start the server:
 *   STELLAR_PAY_TO=G... npx tsx examples/full-stack/server.ts
 *
 * Then run this client:
 *   STELLAR_SECRET_KEY=S... npx tsx examples/full-stack/client.ts
 */
import { x402 } from "../../src/index.js";

const secretKey = process.env.STELLAR_SECRET_KEY;
if (!secretKey) {
  console.error("Set STELLAR_SECRET_KEY environment variable");
  process.exit(1);
}

const client = x402.client({
  secretKey,
  network: "testnet",
  onPayment: (info) => {
    console.log(`Paid for ${info.url}`);
  },
});

console.log("Calling basic endpoint...");
const basicRes = await client.fetch("http://localhost:4000/api/basic/ping");
console.log("Basic:", await basicRes.json());

console.log("\nCalling premium endpoint...");
const premiumRes = await client.fetch(
  "http://localhost:4000/api/premium/analytics",
);
console.log("Premium:", await premiumRes.json());
