import type { PaymentRequired, PaymentPayload, SettleResponse } from "@x402/core/types";

export type StellarNetwork = "testnet" | "mainnet";

export interface X402ClientOptions {
  /** Stellar secret key (starts with S...) */
  secretKey: string;
  /** Network to use. Defaults to 'testnet' */
  network?: StellarNetwork;
  /** Custom Soroban RPC URL. Required for mainnet. */
  rpcUrl?: string;
  /** Maximum price willing to pay per request (e.g., '$1.00'). Rejects payments above this. */
  maxPrice?: string;
  /** Callback fired after each successful payment */
  onPayment?: (info: PaymentInfo) => void;
}

export interface X402FetchOptions extends RequestInit {
  /** Per-request max price override (e.g., '$0.10') */
  maxPrice?: string;
}

export interface X402PaywallOptions {
  /** Price to charge (e.g., '$0.01' or 0.01) */
  price: string | number;
  /** Stellar address to receive payments (G...) */
  payTo: string;
  /** Network. Defaults to 'testnet' */
  network?: StellarNetwork;
  /** Custom facilitator URL. Defaults to x402.org */
  facilitatorUrl?: string;
  /** Description of the resource */
  description?: string;
}

export interface PaymentInfo {
  /** URL that was paid for */
  url: string;
  /** Amount paid (in token units) */
  amount: string;
  /** Asset contract address */
  asset: string;
  /** CAIP-2 network identifier */
  network: string;
  /** Recipient address */
  payTo: string;
}

export interface WalletInfo {
  /** Stellar public key (G...) */
  publicKey: string;
  /** Stellar secret key (S...) */
  secretKey: string;
}

export interface BalanceInfo {
  /** XLM balance */
  xlm: string;
  /** USDC balance */
  usdc: string;
}

export interface X402Client {
  /** Fetch a URL, automatically handling x402 payments */
  fetch(url: string, options?: X402FetchOptions): Promise<Response>;
}

// Re-export upstream types for advanced users
export type { PaymentRequired, PaymentPayload, SettleResponse };
