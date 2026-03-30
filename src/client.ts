import { x402Client, x402HTTPClient } from "@x402/core/client";
import {
  ExactStellarScheme,
  createEd25519Signer,
  STELLAR_WILDCARD_CAIP2,
} from "@x402/stellar";

import { resolveNetwork, exceedsMaxPrice } from "./utils.js";
import type {
  X402ClientOptions,
  X402FetchOptions,
  X402Client,
  PaymentInfo,
} from "./types.js";

/**
 * Creates an x402 client that automatically handles 402 payments on Stellar.
 *
 * @example
 * ```typescript
 * const client = createX402Client({ secretKey: 'S...', network: 'testnet' })
 * const response = await client.fetch('https://api.example.com/data')
 * ```
 */
export function createX402Client(options: X402ClientOptions): X402Client {
  const { secretKey, network = "testnet", rpcUrl, maxPrice, onPayment } = options;

  if (!secretKey || !secretKey.startsWith("S")) {
    throw new Error(
      'Invalid Stellar secret key. Must start with "S". Generate one with x402.wallet.generate().',
    );
  }

  if (network === "mainnet" && !rpcUrl) {
    throw new Error(
      "Mainnet requires an rpcUrl option. See https://developers.stellar.org/docs/data/apis/rpc/providers",
    );
  }

  const resolvedNetwork = resolveNetwork(network);
  const signer = createEd25519Signer(secretKey, resolvedNetwork);

  const rpcConfig = rpcUrl ? { url: rpcUrl } : undefined;
  const scheme = new ExactStellarScheme(signer, rpcConfig);

  const client = new x402Client();
  client.register(STELLAR_WILDCARD_CAIP2, scheme);

  const httpClient = new x402HTTPClient(client);

  return {
    async fetch(url: string, fetchOptions?: X402FetchOptions): Promise<Response> {
      const { maxPrice: perRequestMaxPrice, ...requestInit } = fetchOptions ?? {};
      const effectiveMaxPrice = perRequestMaxPrice ?? maxPrice;

      // Make the initial request
      const response = await globalThis.fetch(url, requestInit);

      // If not 402, return as-is
      if (response.status !== 402) {
        return response;
      }

      // Parse the payment requirements from the 402 response
      const paymentRequired = httpClient.getPaymentRequiredResponse(
        (name: string) => response.headers.get(name),
      );

      // Check maxPrice against all accepted payment options
      if (effectiveMaxPrice && paymentRequired.accepts) {
        for (const req of paymentRequired.accepts) {
          if (
            req.amount &&
            exceedsMaxPrice(req.amount, effectiveMaxPrice)
          ) {
            throw new Error(
              `Payment of ${req.amount} exceeds maxPrice of ${effectiveMaxPrice}. ` +
              `URL: ${url}`,
            );
          }
        }
      }

      // Create the payment payload (signs the Soroban auth entries)
      const paymentPayload = await httpClient.createPaymentPayload(paymentRequired);

      // Call onPayment callback
      if (onPayment && paymentRequired.accepts?.[0]) {
        const accepted = paymentRequired.accepts[0];
        const info: PaymentInfo = {
          url,
          amount: accepted.amount ?? "0",
          asset: accepted.asset ?? "",
          network: accepted.network,
          payTo: accepted.payTo ?? "",
        };
        onPayment(info);
      }

      // Encode payment headers and retry the request
      const paymentHeaders = httpClient.encodePaymentSignatureHeader(paymentPayload);

      const retryHeaders = new Headers(requestInit.headers);
      for (const [key, value] of Object.entries(paymentHeaders)) {
        retryHeaders.set(key, value);
      }

      return globalThis.fetch(url, {
        ...requestInit,
        headers: retryHeaders,
      });
    },
  };
}
