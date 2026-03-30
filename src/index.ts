import { createX402Client } from "./client.js";
import { createPaywall } from "./server.js";
import * as wallet from "./wallet.js";

/**
 * x402-stellar-sdk - Developer-friendly SDK for x402 payments on Stellar.
 *
 * @example
 * ```typescript
 * import { x402 } from 'x402-stellar-sdk'
 *
 * // Client: consume paid APIs
 * const client = x402.client({ secretKey: 'S...', network: 'testnet' })
 * const response = await client.fetch('https://api.example.com/data')
 *
 * // Server: create paid APIs
 * app.use('/api', x402.paywall({ price: '$0.01', payTo: 'G...', network: 'testnet' }))
 *
 * // Wallet utilities
 * const w = x402.wallet.generate()
 * await x402.wallet.fundTestnet(w.publicKey)
 * ```
 */
export const x402 = {
  /** Create an x402 client for consuming paid APIs */
  client: createX402Client,
  /** Create an Express middleware for paywalling routes */
  paywall: createPaywall,
  /** Stellar wallet utilities */
  wallet: {
    /** Generate a new Stellar keypair */
    generate: wallet.generate,
    /** Fund an account on testnet via Friendbot */
    fundTestnet: wallet.fundTestnet,
    /** Set up a USDC trustline */
    setupUSDC: wallet.setupUSDC,
    /** Get XLM and USDC balances */
    balance: wallet.balance,
  },
};

// Named exports for tree-shaking
export { createX402Client } from "./client.js";
export { createPaywall } from "./server.js";
export { generate, fundTestnet, setupUSDC, balance } from "./wallet.js";

// Types
export type {
  StellarNetwork,
  X402ClientOptions,
  X402FetchOptions,
  X402PaywallOptions,
  X402Client,
  PaymentInfo,
  WalletInfo,
  BalanceInfo,
  PaymentRequired,
  PaymentPayload,
  SettleResponse,
} from "./types.js";

// Constants
export {
  STELLAR_TESTNET_CAIP2,
  STELLAR_PUBNET_CAIP2,
  USDC_TESTNET_ADDRESS,
  USDC_PUBNET_ADDRESS,
  DEFAULT_FACILITATOR_URL,
  NETWORK_MAP,
  HORIZON_URLS,
  USDC_ADDRESSES,
  USDC_ISSUERS,
} from "./constants.js";

// Utilities
export { resolveNetwork, parsePrice, priceToTokenAmount, exceedsMaxPrice } from "./utils.js";
