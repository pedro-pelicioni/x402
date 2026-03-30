import {
  Keypair,
  Horizon,
  TransactionBuilder,
  Networks,
  Operation,
  Asset,
  BASE_FEE,
} from "@stellar/stellar-sdk";

import { HORIZON_URLS, USDC_ISSUERS, FRIENDBOT_URL } from "./constants.js";
import type { StellarNetwork, WalletInfo, BalanceInfo } from "./types.js";

/**
 * Generate a new Stellar keypair.
 */
export function generate(): WalletInfo {
  const kp = Keypair.random();
  return {
    publicKey: kp.publicKey(),
    secretKey: kp.secret(),
  };
}

/**
 * Fund an account on Stellar testnet using Friendbot.
 * Only works on testnet.
 */
export async function fundTestnet(publicKey: string): Promise<void> {
  const url = `${FRIENDBOT_URL}?addr=${encodeURIComponent(publicKey)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Failed to fund testnet account ${publicKey}: ${res.status} ${body}`,
    );
  }
}

/**
 * Set up a USDC trustline for the given account.
 * This is required before the account can hold USDC.
 */
export async function setupUSDC(
  secretKey: string,
  network: StellarNetwork = "testnet",
): Promise<void> {
  const keypair = Keypair.fromSecret(secretKey);
  const horizonUrl = HORIZON_URLS[network];
  const server = new Horizon.Server(horizonUrl);
  const networkPassphrase =
    network === "testnet" ? Networks.TESTNET : Networks.PUBLIC;
  const issuer = USDC_ISSUERS[network];

  const account = await server.loadAccount(keypair.publicKey());
  const usdcAsset = new Asset("USDC", issuer);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(Operation.changeTrust({ asset: usdcAsset }))
    .setTimeout(30)
    .build();

  tx.sign(keypair);
  await server.submitTransaction(tx);
}

/**
 * Get XLM and USDC balances for a Stellar account.
 */
export async function balance(
  publicKey: string,
  network: StellarNetwork = "testnet",
): Promise<BalanceInfo> {
  const horizonUrl = HORIZON_URLS[network];
  const server = new Horizon.Server(horizonUrl);
  const issuer = USDC_ISSUERS[network];

  const account = await server.loadAccount(publicKey);

  let xlm = "0";
  let usdc = "0";

  for (const bal of account.balances) {
    if (bal.asset_type === "native") {
      xlm = bal.balance;
    } else if (
      "asset_code" in bal &&
      bal.asset_code === "USDC" &&
      "asset_issuer" in bal &&
      bal.asset_issuer === issuer
    ) {
      usdc = bal.balance;
    }
  }

  return { xlm, usdc };
}
