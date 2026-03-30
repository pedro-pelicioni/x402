# x402-stellar-sdk

Developer-friendly SDK for the [x402 payment protocol](https://x402.org) on [Stellar](https://stellar.org). One-liner DX for building and consuming paid APIs with USDC micropayments.

## Why?

The x402 protocol enables HTTP 402 ("Payment Required") for programmatic micropayments. Setting it up on Stellar currently requires wiring together 4+ packages with complex configuration. This SDK wraps everything into a single import with sensible defaults.

```typescript
import { x402 } from 'x402-stellar-sdk'

// 3 lines to consume a paid API
const client = x402.client({ secretKey: 'S...', network: 'testnet' })
const response = await client.fetch('https://xlm402.com/weather/current?city=London')
const data = await response.json()
```

## Install

```bash
npm install x402-stellar-sdk
```

For server-side usage (creating paid APIs), also install Express:

```bash
npm install x402-stellar-sdk express
```

## Quick Start

### 1. Set up a wallet

```typescript
import { x402 } from 'x402-stellar-sdk'

// Generate a wallet and fund it on testnet
const wallet = x402.wallet.generate()
await x402.wallet.fundTestnet(wallet.publicKey)
await x402.wallet.setupUSDC(wallet.secretKey, 'testnet')

// Get testnet USDC from https://faucet.circle.com/
console.log('Public Key:', wallet.publicKey)
console.log('Secret Key:', wallet.secretKey)
```

### 2. Consume a paid API (Client)

```typescript
import { x402 } from 'x402-stellar-sdk'

const client = x402.client({
  secretKey: 'S...',        // Your Stellar secret key
  network: 'testnet',       // 'testnet' or 'mainnet'
  maxPrice: '$1.00',        // Safety limit per request
  onPayment: (info) => {    // Optional: track payments
    console.log(`Paid ${info.amount} for ${info.url}`)
  },
})

// Automatically handles 402 -> payment -> retry
const response = await client.fetch('https://xlm402.com/weather/current?city=London')
const data = await response.json()
```

### 3. Create a paid API (Server)

```typescript
import express from 'express'
import { x402 } from 'x402-stellar-sdk'

const app = express()

// One line to paywall any route
app.use('/api', x402.paywall({
  price: '$0.01',                 // Price in USDC
  payTo: 'G...',                  // Your Stellar address
  network: 'testnet',
  description: 'Premium API',
}))

app.get('/api/data', (req, res) => {
  res.json({ premium: true, data: '...' })
})

app.listen(3000)
```

## API Reference

### `x402.client(options)`

Creates a client that automatically handles x402 payments.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `secretKey` | `string` | *required* | Stellar secret key (S...) |
| `network` | `'testnet' \| 'mainnet'` | `'testnet'` | Stellar network |
| `rpcUrl` | `string` | auto | Soroban RPC URL (required for mainnet) |
| `maxPrice` | `string` | none | Max price per request (e.g., `'$1.00'`) |
| `onPayment` | `function` | none | Callback after each payment |

Returns an object with a `.fetch(url, options?)` method that works like the standard `fetch` API.

### `x402.paywall(options)`

Creates Express middleware that requires x402 payment.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `price` | `string \| number` | *required* | Price in USDC (e.g., `'$0.01'`) |
| `payTo` | `string` | *required* | Stellar address to receive payments (G...) |
| `network` | `'testnet' \| 'mainnet'` | `'testnet'` | Stellar network |
| `facilitatorUrl` | `string` | `https://x402.org/facilitator` | Facilitator URL |
| `description` | `string` | `'Protected resource'` | Resource description |

### `x402.wallet`

Wallet utilities for Stellar account management.

| Method | Description |
|--------|-------------|
| `generate()` | Generate a new Stellar keypair |
| `fundTestnet(publicKey)` | Fund account on testnet via Friendbot |
| `setupUSDC(secretKey, network?)` | Create USDC trustline |
| `balance(publicKey, network?)` | Get XLM and USDC balances |

## How It Works

The SDK implements the [x402 protocol](https://x402.org) flow:

1. **Client requests** a resource from the server
2. **Server responds** with HTTP 402 + payment requirements (price, asset, recipient)
3. **Client signs** a Soroban authorization entry for the USDC transfer
4. **Client retries** the request with the payment signature in the `PAYMENT-SIGNATURE` header
5. **Server verifies** the payment via a facilitator and settles on-chain
6. **Server delivers** the resource with a `PAYMENT-RESPONSE` header

All of this happens automatically in a single `client.fetch()` call.

## Examples

See the [`examples/`](./examples) directory:

- **[`client-basic.ts`](./examples/client-basic.ts)** - Consume a paid API
- **[`server-basic.ts`](./examples/server-basic.ts)** - Create a paid API
- **[`agent-demo.ts`](./examples/agent-demo.ts)** - AI agent with spending tracking
- **[`wallet-setup.ts`](./examples/wallet-setup.ts)** - Generate and fund a wallet
- **[`full-stack/`](./examples/full-stack/)** - Complete client + server demo

Run an example:

```bash
# Set up a wallet first
npx tsx examples/wallet-setup.ts

# Then use it
STELLAR_SECRET_KEY=S... npx tsx examples/client-basic.ts
```

## Testing

```bash
npm test
```

## Built On

- [`@x402/core`](https://github.com/coinbase/x402) - x402 protocol core
- [`@x402/stellar`](https://github.com/coinbase/x402) - Stellar mechanism
- [`@x402/express`](https://github.com/coinbase/x402) - Express middleware
- [`@stellar/stellar-sdk`](https://github.com/stellar/js-stellar-sdk) - Stellar SDK

## Resources

- [x402 Protocol Specification](https://x402.org)
- [x402 on Stellar Documentation](https://developers.stellar.org/docs/build/apps/x402)
- [x402 Quickstart Guide](https://developers.stellar.org/docs/build/apps/x402/quickstart-guide)
- [xlm402.com Test Services](https://xlm402.com)
- [Stellar Developers](https://developers.stellar.org)
- [Circle USDC Testnet Faucet](https://faucet.circle.com)

## License

MIT
