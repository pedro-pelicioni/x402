import {
  STELLAR_TESTNET_CAIP2,
  STELLAR_PUBNET_CAIP2,
  STELLAR_WILDCARD_CAIP2,
  USDC_TESTNET_ADDRESS,
  USDC_PUBNET_ADDRESS,
  DEFAULT_TESTNET_RPC_URL,
  DEFAULT_TESTNET_HORIZON_URL,
  DEFAULT_PUBNET_HORIZON_URL,
  DEFAULT_TOKEN_DECIMALS,
} from "@x402/stellar";

import type { StellarNetwork } from "./types.js";

// Re-export upstream constants
export {
  STELLAR_TESTNET_CAIP2,
  STELLAR_PUBNET_CAIP2,
  STELLAR_WILDCARD_CAIP2,
  USDC_TESTNET_ADDRESS,
  USDC_PUBNET_ADDRESS,
  DEFAULT_TOKEN_DECIMALS,
};

// Network CAIP-2 mapping
export const NETWORK_MAP: Record<StellarNetwork, string> = {
  testnet: STELLAR_TESTNET_CAIP2,
  mainnet: STELLAR_PUBNET_CAIP2,
};

// Horizon URLs
export const HORIZON_URLS: Record<StellarNetwork, string> = {
  testnet: DEFAULT_TESTNET_HORIZON_URL,
  mainnet: DEFAULT_PUBNET_HORIZON_URL,
};

// Soroban RPC URLs
export const RPC_URLS: Record<StellarNetwork, string> = {
  testnet: DEFAULT_TESTNET_RPC_URL,
  mainnet: "", // Users must provide their own mainnet RPC URL
};

// USDC contract addresses (SAC)
export const USDC_ADDRESSES: Record<StellarNetwork, string> = {
  testnet: USDC_TESTNET_ADDRESS,
  mainnet: USDC_PUBNET_ADDRESS,
};

// Classic USDC asset issuers (for trustline setup)
export const USDC_ISSUERS: Record<StellarNetwork, string> = {
  testnet: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
  mainnet: "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
};

// Default facilitator URL
export const DEFAULT_FACILITATOR_URL = "https://x402.org/facilitator";

// Friendbot URL for testnet funding
export const FRIENDBOT_URL = "https://friendbot.stellar.org";
