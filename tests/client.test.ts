import { describe, it, expect, vi } from "vitest";
import { createX402Client } from "../src/client.js";

describe("createX402Client", () => {
  it("throws on invalid secret key", () => {
    expect(() => createX402Client({ secretKey: "invalid" })).toThrow(
      "Invalid Stellar secret key",
    );
  });

  it("throws on empty secret key", () => {
    expect(() => createX402Client({ secretKey: "" })).toThrow(
      "Invalid Stellar secret key",
    );
  });

  it("throws when mainnet is used without rpcUrl", () => {
    // Use a valid testnet key format (starts with S, 56 chars)
    const testKey =
      "SDJEOZ2NMARQBKJWU3MC2XRDVSWV57BZYMTIB4UWQDNOVC77IK72ETCA";
    expect(() =>
      createX402Client({ secretKey: testKey, network: "mainnet" }),
    ).toThrow("Mainnet requires an rpcUrl");
  });

  it("creates a client with valid options", () => {
    const testKey =
      "SDJEOZ2NMARQBKJWU3MC2XRDVSWV57BZYMTIB4UWQDNOVC77IK72ETCA";
    const client = createX402Client({ secretKey: testKey, network: "testnet" });
    expect(client).toBeDefined();
    expect(typeof client.fetch).toBe("function");
  });

  it("creates a client with default network (testnet)", () => {
    const testKey =
      "SDJEOZ2NMARQBKJWU3MC2XRDVSWV57BZYMTIB4UWQDNOVC77IK72ETCA";
    const client = createX402Client({ secretKey: testKey });
    expect(client).toBeDefined();
  });
});
