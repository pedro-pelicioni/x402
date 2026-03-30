import { describe, it, expect, vi } from "vitest";
import { generate } from "../src/wallet.js";

describe("wallet.generate", () => {
  it("generates a valid keypair", () => {
    const wallet = generate();
    expect(wallet.publicKey).toMatch(/^G[A-Z0-9]{55}$/);
    expect(wallet.secretKey).toMatch(/^S[A-Z0-9]{55}$/);
  });

  it("generates unique keypairs", () => {
    const w1 = generate();
    const w2 = generate();
    expect(w1.publicKey).not.toBe(w2.publicKey);
    expect(w1.secretKey).not.toBe(w2.secretKey);
  });
});
