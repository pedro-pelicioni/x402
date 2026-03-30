import { describe, it, expect } from "vitest";
import { x402 } from "../src/index.js";

describe("x402 namespace", () => {
  it("exports client function", () => {
    expect(typeof x402.client).toBe("function");
  });

  it("exports paywall function", () => {
    expect(typeof x402.paywall).toBe("function");
  });

  it("exports wallet utilities", () => {
    expect(typeof x402.wallet.generate).toBe("function");
    expect(typeof x402.wallet.fundTestnet).toBe("function");
    expect(typeof x402.wallet.setupUSDC).toBe("function");
    expect(typeof x402.wallet.balance).toBe("function");
  });
});
