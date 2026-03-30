/**
 * Wallet setup example - Generate a wallet, fund it on testnet, and set up USDC.
 *
 * Usage:
 *   npx tsx examples/wallet-setup.ts
 */
import { x402 } from "../src/index.js";

async function main() {
  // 1. Generate a new wallet
  console.log("Generating new Stellar wallet...");
  const wallet = x402.wallet.generate();
  console.log(`  Public Key:  ${wallet.publicKey}`);
  console.log(`  Secret Key:  ${wallet.secretKey}`);

  // 2. Fund on testnet
  console.log("\nFunding on testnet via Friendbot...");
  await x402.wallet.fundTestnet(wallet.publicKey);
  console.log("  Funded!");

  // 3. Set up USDC trustline
  console.log("\nSetting up USDC trustline...");
  await x402.wallet.setupUSDC(wallet.secretKey, "testnet");
  console.log("  USDC trustline created!");

  // 4. Check balances
  console.log("\nChecking balances...");
  const bal = await x402.wallet.balance(wallet.publicKey, "testnet");
  console.log(`  XLM:  ${bal.xlm}`);
  console.log(`  USDC: ${bal.usdc}`);

  console.log("\nWallet is ready!");
  console.log("Get testnet USDC from: https://faucet.circle.com/");
  console.log(`\nUse this in your .env:`);
  console.log(`  STELLAR_SECRET_KEY=${wallet.secretKey}`);
  console.log(`  STELLAR_PAY_TO=${wallet.publicKey}`);
}

main().catch(console.error);
