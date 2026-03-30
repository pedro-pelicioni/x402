import type { Request, Response, NextFunction } from "express";
import { x402ResourceServer, HTTPFacilitatorClient } from "@x402/core/server";
import type { RoutesConfig } from "@x402/core/server";
import { ExactStellarScheme } from "@x402/stellar/exact/server";
import { paymentMiddleware } from "@x402/express";

import { resolveNetwork } from "./utils.js";
import { DEFAULT_FACILITATOR_URL } from "./constants.js";
import type { X402PaywallOptions } from "./types.js";

/**
 * Creates an Express middleware that paywalls routes with x402 on Stellar.
 *
 * @example
 * ```typescript
 * app.use('/api/premium', createPaywall({
 *   price: '$0.01',
 *   payTo: 'G...',
 *   network: 'testnet',
 * }))
 * ```
 */
export function createPaywall(
  options: X402PaywallOptions,
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  const {
    price,
    payTo,
    network = "testnet",
    facilitatorUrl = DEFAULT_FACILITATOR_URL,
    description,
  } = options;

  if (!payTo || !payTo.startsWith("G")) {
    throw new Error(
      'Invalid payTo address. Must be a Stellar public key starting with "G".',
    );
  }

  const resolvedNetwork = resolveNetwork(network);

  // Create facilitator client
  const facilitatorClient = new HTTPFacilitatorClient({ url: facilitatorUrl });

  // Create server-side scheme
  const serverScheme = new ExactStellarScheme();

  // Create resource server and register Stellar scheme
  const resourceServer = new x402ResourceServer(facilitatorClient);
  resourceServer.register(resolvedNetwork, serverScheme);

  // Build route config
  const routes: RoutesConfig = {
    accepts: {
      scheme: "exact",
      network: resolvedNetwork,
      payTo,
      price,
    },
    description: description ?? "Protected resource",
    mimeType: "application/json",
  };

  // Return the Express middleware
  return paymentMiddleware(routes, resourceServer);
}
