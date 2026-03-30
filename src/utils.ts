import type { Network } from "@x402/core/types";
import { NETWORK_MAP, DEFAULT_TOKEN_DECIMALS } from "./constants.js";
import type { StellarNetwork } from "./types.js";

/**
 * Maps user-friendly network names to CAIP-2 identifiers.
 * 'testnet' -> 'stellar:testnet', 'mainnet' -> 'stellar:pubnet'
 */
export function resolveNetwork(network: StellarNetwork): Network {
  const caip2 = NETWORK_MAP[network];
  if (!caip2) {
    throw new Error(
      `Invalid network "${network}". Must be "testnet" or "mainnet".`,
    );
  }
  return caip2 as Network;
}

/**
 * Parses a price string/number into a decimal number.
 * Accepts: '$0.01', '0.01', 0.01
 */
export function parsePrice(price: string | number): number {
  if (typeof price === "number") return price;
  const cleaned = price.replace(/^\$/, "").trim();
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed) || parsed < 0) {
    throw new Error(`Invalid price "${price}". Must be a positive number.`);
  }
  return parsed;
}

/**
 * Converts a decimal price to token amount string (7 decimals for USDC).
 * '$0.01' -> '100000'
 */
export function priceToTokenAmount(
  price: string | number,
  decimals: number = DEFAULT_TOKEN_DECIMALS,
): string {
  const decimal = parsePrice(price);
  const amount = BigInt(Math.round(decimal * 10 ** decimals));
  return amount.toString();
}

/**
 * Checks if a payment amount exceeds the maximum price.
 */
export function exceedsMaxPrice(
  amount: string,
  maxPrice: string,
  decimals: number = DEFAULT_TOKEN_DECIMALS,
): boolean {
  const maxAmount = BigInt(priceToTokenAmount(maxPrice, decimals));
  const paymentAmount = BigInt(amount);
  return paymentAmount > maxAmount;
}
